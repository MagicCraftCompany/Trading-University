import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get session_id from query
    const { session_id } = req.query;
    console.log(`[verify-session] Processing session_id: ${session_id}`);

    if (!session_id || typeof session_id !== 'string') {
      console.log('[verify-session] Missing or invalid session_id');
      return res.status(400).json({ success: false, message: 'Missing or invalid session_id' });
    }
    
    // Retrieve the Stripe checkout session
    console.log('[verify-session] Retrieving Stripe checkout session');
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(`[verify-session] Checkout session status: ${session.status}`);
    
    if (session.status !== 'complete') {
      return res.status(400).json({ success: false, message: 'Checkout session is not complete' });
    }

    // Get customer email from session
    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      console.log('[verify-session] No customer email found in session');
      return res.status(400).json({ success: false, message: 'No customer email found in session' });
    }

    // Get subscription information
    if (!session.subscription) {
      console.log('[verify-session] No subscription found in session');
      return res.status(400).json({ success: false, message: 'No subscription found in this session' });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    console.log(`[verify-session] Subscription status: ${subscription.status}`);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { subscription: true }
    });

    if (!user) {
      console.log(`[verify-session] User not found with email: ${customerEmail}`);
      return res.status(404).json({ success: false, message: 'User not found' });
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

    // Return user data with updated subscription
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      user: {
        ...userWithoutPassword,
        subscription: updatedSubscription,
        hasActiveSubscription: true,
      },
      token: newToken,
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ success: false, message: 'Error verifying checkout session' });
  }
} 