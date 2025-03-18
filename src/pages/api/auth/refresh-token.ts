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
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token to get user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: string; 
      email: string; 
      subscriptionStatus: string;
    };
    
    console.log(`[refresh-token] Token decoded for user: ${decoded.email}`);
    console.log(`[refresh-token] Current token subscription status: ${decoded.subscriptionStatus}`);

    // Get current subscription status from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine actual subscription status from database
    const dbSubscriptionStatus = user.subscription?.status || 'FREE';
    console.log(`[refresh-token] Database subscription status: ${dbSubscriptionStatus}`);
    
    // Check if the token needs to be updated
    if (decoded.subscriptionStatus !== dbSubscriptionStatus) {
      console.log(`[refresh-token] Updating token subscription status from ${decoded.subscriptionStatus} to ${dbSubscriptionStatus}`);
      
      // Create new token with updated status
      const newToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          subscriptionStatus: dbSubscriptionStatus,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({ 
        message: 'Token refreshed',
        token: newToken,
        subscriptionStatus: dbSubscriptionStatus
      });
    }
    
    // Token is already up to date
    return res.status(200).json({ 
      message: 'Token is current',
      token: token,
      subscriptionStatus: decoded.subscriptionStatus
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
} 