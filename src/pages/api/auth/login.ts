import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma client
const prisma = new PrismaClient();

type LoginResponse = {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    subscription: {
      status: string;
      currentPeriodEnd: Date | null;
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  console.log('Login API called with body:', req.body);
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('Missing credentials:', { email, password: !!password });
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        subscription: true
      }
    });

    // If user not found or no password (Google-only user)
    if (!user || !user.password) {
      console.log('User not found or no password:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Get subscription status
    const subscriptionStatus = user.subscription?.status || 'FREE';
    const currentPeriodEnd = user.subscription?.currentPeriodEnd || null;

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        subscriptionStatus 
      },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
      { expiresIn: '7d' }
    );

    // Return user info (exclude password)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      image: user.image,
      subscription: {
        status: subscriptionStatus,
        currentPeriodEnd: currentPeriodEnd
      }
    };

    console.log('Login successful for user:', email);
    
    return res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
} 