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
    // In a real implementation, this would exchange the code for tokens with Google API
    // and get user profile information - we're simulating this for this demo

    // For demonstration - fetch user info from Google API
    // In a real implementation, you would exchange the authorization code for tokens
    // and then use the access token to fetch the user's profile
    
    // Simulate Google auth response with real placeholder data
    const googleUserInfo = {
      id: 'google-' + Date.now(),
      email: 'user@gmail.com', // This would be the actual user's email from Google
      name: 'Google User',     // This would be the actual user's name from Google
      picture: null
    };

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: {
        email: googleUserInfo.email,
      },
      update: {
        name: googleUserInfo.name,
        image: googleUserInfo.picture,
        lastLoginAt: new Date(),
      },
      create: {
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        image: googleUserInfo.picture,
        googleId: googleUserInfo.id,
        authProvider: 'GOOGLE',
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