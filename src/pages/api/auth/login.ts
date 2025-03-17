import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true
      }
    }) as (User & {
      password: string;
      subscription: {
        id: string;
        userId: string;
        status: 'FREE' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
        currentPeriodStart: Date;
        currentPeriodEnd: Date | null;
      } | null
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check subscription status
    const hasActiveSubscription = user.subscription?.status === 'ACTIVE' &&
      user.subscription.currentPeriodEnd &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Prevent login for non-subscribed users
    if (!hasActiveSubscription) {
      return res.status(403).json({ 
        message: 'Subscription required',
        requiresSubscription: true,
        userId: user.id
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        updatedAt: new Date()
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscriptionStatus: user.subscription?.status || 'FREE',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      user: {
        ...userWithoutPassword,
        hasActiveSubscription,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
} 