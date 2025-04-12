import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/db/prisma';
import { SubscriptionStatus } from '@prisma/client';

// This endpoint is intended to be called by a cron job
// to periodically check for expired subscriptions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests with correct authorization
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  // Simple API key verification (in a real app, use a more secure method)
  const { apiKey } = req.query;
  if (apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // Get current date
    const now = new Date();
    
    // Find all active subscriptions that have expired
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE' as SubscriptionStatus,
        currentPeriodEnd: {
          lt: now
        }
      },
      include: {
        user: true
      }
    });
    
    console.log(`Found ${expiredSubscriptions.length} expired subscriptions to update`);
    
    // Update all expired subscriptions
    for (const subscription of expiredSubscriptions) {
      await prisma.subscription.update({
        where: {
          id: subscription.id
        },
        data: {
          status: 'EXPIRED' as SubscriptionStatus
        }
      });
      
      console.log(`Updated subscription for user: ${subscription.user.email} to EXPIRED`);
      
      // Here you could also trigger an email notification
      // to notify the user their subscription has expired
    }
    
    return res.status(200).json({ 
      success: true, 
      message: `Updated ${expiredSubscriptions.length} expired subscriptions` 
    });
  } catch (error) {
    console.error('Error checking subscriptions:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error checking subscriptions'
    });
  }
} 