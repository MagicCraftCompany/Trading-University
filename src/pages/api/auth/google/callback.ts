import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;

  console.log('Google callback API called:', { code: !!code, state });

  // Ensure we have a code from Google
  if (!code) {
    return res.redirect('/login?error=NoCodeProvided');
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error exchanging code for tokens:', tokenData);
      return res.redirect('/login?error=GoogleAuthFailed');
    }

    // Use the access token to get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUserInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Error getting user info from Google:', googleUserInfo);
      return res.redirect('/login?error=GoogleAuthFailed');
    }

    console.log('Google user info:', { email: googleUserInfo.email, name: googleUserInfo.name });
    
    // Check if this Google account email exists in our database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: googleUserInfo.email,
      },
    });

    // Check if user exists
    if (!existingUser) {
      console.log('Google auth failed: No user found with email:', googleUserInfo.email);
      return res.redirect('/login?error=NoAccountFound');
    }

    // Update the existing user
    const user = await prisma.user.update({
      where: {
        email: googleUserInfo.email,
      },
      data: {
        name: googleUserInfo.name || existingUser.name,
        image: googleUserInfo.picture || existingUser.image,
        googleId: googleUserInfo.id,
        lastLoginAt: new Date(),
      },
    });

    // Create JWT token with user information
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        provider: 'GOOGLE'
      },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
      { expiresIn: '7d' }
    );

    // Log successful authentication
    console.log('Google auth successful, user saved to database:', user.email);

    // Redirect to login page with success parameters
      return res.redirect(
      `/login?success=true&token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || 'User')}`
    );
  } catch (error) {
    console.error('Error in Google callback:', error);
    return res.redirect('/login?error=AuthenticationFailed');
  }
} 