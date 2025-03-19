import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get session_id and redirect_to from query
    const { session_id, redirect_to } = req.query;
    const shouldRedirect = Boolean(redirect_to && typeof redirect_to === 'string');
    
    console.log(`[verify-session] Processing session_id: ${session_id}, redirect_to: ${redirect_to}`);

    if (!session_id || typeof session_id !== 'string') {
      console.log('[verify-session] Missing or invalid session_id');
      if (shouldRedirect) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=InvalidSessionId`);
      }
      return res.status(400).json({ success: false, message: 'Missing or invalid session_id' });
    }
    
    // Retrieve the Stripe checkout session
    console.log('[verify-session] Retrieving Stripe checkout session');
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(`[verify-session] Checkout session status: ${session.status}`);
    
    if (session.status !== 'complete') {
      if (shouldRedirect) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=CheckoutNotComplete`);
      }
      return res.status(400).json({ success: false, message: 'Checkout session is not complete' });
    }

    // Get customer email from session
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      console.log('[verify-session] No customer email found in session');
      if (shouldRedirect) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=NoEmailInCheckout`);
      }
      return res.status(400).json({ success: false, message: 'No customer email found in session' });
    }

    // Get subscription information
    if (!session.subscription) {
      console.log('[verify-session] No subscription found in session');
      if (shouldRedirect) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=NoSubscriptionFound`);
      }
      return res.status(400).json({ success: false, message: 'No subscription found in this session' });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    console.log(`[verify-session] Subscription status: ${subscription.status}`);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    
    // Try to find existing user by email
    let user = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { subscription: true }
    });

    // Track if this is a new user
    const isNewUser = !user;
    
    // New flow: If no user exists, we'll store the session information for later
    // We don't create a user here - we'll wait for Google authentication
    if (!user) {
      console.log(`[verify-session] No user found with email: ${customerEmail}. Storing session for later use.`);
      
      // Store subscription details in session cookie
      // This will be used when the user authenticates with Google
      const pendingSubscription = {
        email: customerEmail,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: currentPeriodEnd,
        status: subscription.status,
      };
      
      // Set a cookie with pending subscription information
      res.setHeader('Set-Cookie', `pendingSubscription=${encodeURIComponent(JSON.stringify(pendingSubscription))}; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax`);
      
      if (shouldRedirect) {
        // Set _hasPreviouslyVisited cookie
        res.setHeader('Set-Cookie', `_hasPreviouslyVisited=true; Path=/; Max-Age=31536000; SameSite=Lax`);
        // Redirect to login page for Google auth
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?checkout_complete=true`);
      }
      
      // For API calls, return JSON
      return res.status(200).json({
        success: true,
        message: 'Please sign in with Google to access your subscription',
        redirectToGoogleAuth: true,
        pendingSubscription: true
      });
    }

    console.log(`[verify-session] Found user: ${user.email} with subscription status: ${user.subscription?.status || 'NONE'}`);

    // Update Stripe customer ID if not already set
    if (!user.stripeCustomerId && session.customer) {
      console.log(`[verify-session] Updating Stripe customer ID: ${session.customer}`);
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: session.customer as string }
      });
    }

    // Create or update subscription
    let updatedSubscription;
    if (user.subscription) {
      console.log(`[verify-session] Updating existing subscription for user: ${user.email}`);
      updatedSubscription = await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          status: 'ACTIVE' as SubscriptionStatus,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      });
    } else {
      console.log(`[verify-session] Creating new subscription for user: ${user.email}`);
      updatedSubscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'ACTIVE' as SubscriptionStatus,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      });
    }

    console.log(`[verify-session] Subscription updated to status: ${updatedSubscription.status}`);

    // Generate new JWT with updated subscription status
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscriptionStatus: 'ACTIVE',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[verify-session] Generated new JWT token with subscriptionStatus: ACTIVE`);

    // Set cookies and perform redirection if needed
    res.setHeader('Set-Cookie', [
      `token=${newToken}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
      `_hasPreviouslyVisited=true; Path=/; Max-Age=31536000; SameSite=Lax`
    ]);

    // Handle redirect if requested
    if (shouldRedirect) {
      console.log(`[verify-session] Redirecting to: /${redirect_to}`);
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${redirect_to}`);
    }
    
    // Default to returning JSON for API calls
    return res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      user: {
        ...user,
        subscription: updatedSubscription,
        hasActiveSubscription: true,
      },
      token: newToken,
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    
    // Handle redirect if requested
    if (req.query.redirect_to && typeof req.query.redirect_to === 'string') {
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=VerificationFailed`);
    }
    
    res.status(500).json({ success: false, message: 'Error verifying checkout session' });
  }
} 