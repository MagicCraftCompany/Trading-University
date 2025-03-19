import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Google callback received:', req.query);
    const { code, state } = req.query;
    
    // Parse the state parameter if it exists (we can use this to pass session_id)
    let sessionId = '';
    if (state && typeof state === 'string') {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        sessionId = stateData.session_id || '';
      } catch (e) {
        console.error('Failed to parse state parameter:', e);
      }
    }

    if (!code) {
      console.error('No code provided in callback');
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=NoCodeProvided`);
    }

    console.log('Exchanging code for token...');
    console.log('Redirect URI:', `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`);
    
    // Exchange the code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code as string,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      console.error('Token exchange error details:', tokenData);
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=TokenExchangeFailed&details=${encodeURIComponent(JSON.stringify(tokenData))}`);
    }

    console.log('Token exchange successful, fetching user info...');
    
    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('User info error:', googleUser);
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=UserInfoFailed`);
    }

    console.log('User info retrieved:', googleUser.email);
    
    // Check for pending subscription from cookie
    let pendingSubscription = null;
    if (req.headers.cookie) {
      const cookies = parse(req.headers.cookie);
      if (cookies.pendingSubscription) {
        try {
          pendingSubscription = JSON.parse(decodeURIComponent(cookies.pendingSubscription));
          console.log('Found pending subscription:', pendingSubscription.email);
        } catch (e) {
          console.error('Error parsing pending subscription:', e);
        }
      }
    }
    
    // Email mismatch check for pending subscription
    let emailMismatch = false;
    if (pendingSubscription && pendingSubscription.email !== googleUser.email) {
      console.log(`Email mismatch! Subscription email: ${pendingSubscription.email}, Google email: ${googleUser.email}`);
      emailMismatch = true;
    }

    // Find or create user
    let user: any = await prisma.user.findUnique({
      where: { email: googleUser.email },
      include: { subscription: true },
    });

    if (!user) {
      console.log('Creating new user for:', googleUser.email);
      // Create new user with minimal fields
      try {
        // Determine if we should create with subscription from pending data
        let subscriptionData = {
          create: {
            status: 'FREE', // Default status
            currentPeriodStart: new Date(),
          }
        };

        // If we have a pending subscription and emails match, use that data
        if (pendingSubscription && !emailMismatch) {
          subscriptionData = {
            create: {
              status: 'ACTIVE' as SubscriptionStatus,
              stripeSubscriptionId: pendingSubscription.stripeSubscriptionId,
              currentPeriodStart: new Date(pendingSubscription.currentPeriodStart),
              currentPeriodEnd: new Date(pendingSubscription.currentPeriodEnd),
              cancelAtPeriodEnd: false,
            } as any // Use type assertion to bypass TypeScript checks
          };
        }

        // Use type assertion to bypass TypeScript checks
        user = await (prisma as any).user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            image: googleUser.picture,
            authProvider: 'GOOGLE', // String literal for enum
            stripeCustomerId: !emailMismatch && pendingSubscription ? pendingSubscription.stripeCustomerId : null,
            subscription: subscriptionData
          },
          include: { subscription: true },
        });
        console.log('User created successfully');
      } catch (error) {
        console.error('Error creating user:', error);
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=FailedToCreateUser&message=${encodeURIComponent((error as Error).message)}`);
      }
    } else if (pendingSubscription && !emailMismatch && (!user.subscription || user.subscription.status !== 'ACTIVE')) {
      // User exists but doesn't have an active subscription yet
      console.log('User exists. Updating with pending subscription data');
      
      // Update stripe customer ID if needed
      if (pendingSubscription.stripeCustomerId && !user.stripeCustomerId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: pendingSubscription.stripeCustomerId }
        });
      }
      
      // Create or update subscription
      if (user.subscription) {
        user.subscription = await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            status: 'ACTIVE' as SubscriptionStatus,
            stripeSubscriptionId: pendingSubscription.stripeSubscriptionId,
            currentPeriodStart: new Date(pendingSubscription.currentPeriodStart),
            currentPeriodEnd: new Date(pendingSubscription.currentPeriodEnd),
            cancelAtPeriodEnd: false,
          } as any // Use type assertion to bypass type checking
        });
      } else {
        user.subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            status: 'ACTIVE' as SubscriptionStatus,
            stripeSubscriptionId: pendingSubscription.stripeSubscriptionId,
            currentPeriodStart: new Date(pendingSubscription.currentPeriodStart),
            currentPeriodEnd: new Date(pendingSubscription.currentPeriodEnd),
            cancelAtPeriodEnd: false,
          } as any // Use type assertion to bypass type checking
        });
      }
      console.log('Subscription updated with pending data');
    } else {
      console.log('Existing user found');
    }

    // Check subscription status
    const hasActiveSubscription = user.subscription?.status === 'ACTIVE' &&
      user.subscription.currentPeriodEnd &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Generate JWT token - we'll include subscription status but not block login
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscriptionStatus: hasActiveSubscription ? 'ACTIVE' : (user.subscription?.status || 'FREE'),
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated, redirecting to callback page');
    
    // Clear the pending subscription cookie
    res.setHeader('Set-Cookie', 'pendingSubscription=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
    
    // Handle email mismatch scenario
    if (emailMismatch) {
      return res.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?message=email_mismatch&subscriptionEmail=${encodeURIComponent(pendingSubscription.email)}&googleEmail=${encodeURIComponent(googleUser.email)}&token=${token}`
      );
    }
    
    // If we have a session ID from checkout, process it now that the user is authenticated
    if (sessionId) {
      console.log(`Found session ID in state: ${sessionId}, verifying checkout after Google auth`);
      
      // Set cookie with token to ensure middleware allows the verify-session request
      res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
      
      // Redirect to verify session endpoint
      return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify-session?session_id=${sessionId}&redirect_to=courses`);
    }
    
    // Redirect based on subscription status
    if (!hasActiveSubscription) {
      // Set token in cookie first
      res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
      
      // Then redirect to pricing page
      return res.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?message=subscription_required&token=${token}`
      );
    }
    
    // Redirect to frontend with token for subscribers
    res.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback?token=${token}`
    );
  } catch (error) {
    console.error('Google callback error:', error);
    return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=GoogleAuthFailed&message=${encodeURIComponent((error as Error).message)}`);
  }
} 