import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Google callback received:', req.query);
    const { code } = req.query;

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
    
    // Find or create user
    let user: any = await prisma.user.findUnique({
      where: { email: googleUser.email },
      include: { subscription: true },
    });

    if (!user) {
      console.log('Creating new user for:', googleUser.email);
      // Create new user with minimal fields
      try {
        // Use type assertion to bypass TypeScript checks
        user = await (prisma as any).user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            image: googleUser.picture,
            password: '', // Required field in schema
            authProvider: 'GOOGLE', // String literal for enum
            subscription: {
              create: {
                status: 'FREE', // String literal for enum
                currentPeriodStart: new Date(),
              }
            }
          },
          include: { subscription: true },
        });
        console.log('User created successfully');
      } catch (error) {
        console.error('Error creating user:', error);
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?error=FailedToCreateUser&message=${encodeURIComponent((error as Error).message)}`);
      }
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