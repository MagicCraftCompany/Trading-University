import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  userId: string;
  email: string;
  subscriptionStatus?: string;
}

// Define types to match the actual database schema
interface UserWithSubscription {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  password?: string;
  subscription?: {
    id: string;
    userId: string;
    status: 'FREE' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    currentPeriodStart: Date;
    currentPeriodEnd: Date | null;
  } | null;
  [key: string]: any; // Allow other properties
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the auth token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    // Verify the token
    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    
    // Check if user ID exists in the token
    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token payload' });
    }

    // Get user from database with type assertion
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: { subscription: true },
    }) as unknown as UserWithSubscription;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check subscription status
    const hasActiveSubscription = user.subscription?.status === 'ACTIVE' &&
      user.subscription.currentPeriodEnd &&
      new Date(user.subscription.currentPeriodEnd) > new Date();

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: {
        ...userWithoutPassword,
        hasActiveSubscription,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 