import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let buf;
  try {
    buf = await buffer(req);
  } catch (error) {
    console.error('Error parsing buffer:', error);
    return res.status(400).json({ error: 'Webhook Error: Invalid request body' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.error('No Stripe signature found');
    return res.status(400).json({ error: 'Webhook Error: No signature' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log(`Webhook received: ${event.type}`);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer email
        const customerEmail = session.customer_details?.email;
        if (!customerEmail) {
          console.error('No customer email found in session:', session.id);
          break;
        }

        console.log(`Processing completed checkout for email: ${customerEmail}`);
        
        // Get subscription ID
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) {
          console.error('No subscription ID found in session:', session.id);
          break;
        }
        
        // Get subscription details including current period end
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        
        // Find user by email and update subscription
        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
          include: { subscription: true }
        });

        if (!user) {
          console.error(`User with email ${customerEmail} not found`);
          break;
        }

        console.log(`Found user ${user.id} (${user.email}) for subscription update. Current subscription status: ${user.subscription?.status || 'NONE'}`);

        // Update Stripe customer ID if not already set
        if (!user.stripeCustomerId && session.customer) {
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: session.customer as string }
          });
          console.log(`Updated Stripe customer ID for user ${user.id}: ${session.customer}`);
        }

        // Create or update subscription
        if (user.subscription) {
          console.log(`Updating existing subscription for user ${user.id} (${user.email})`);
          const updatedSubscription = await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: 'ACTIVE' as SubscriptionStatus,
              stripeSubscriptionId: subscriptionId,
              currentPeriodStart: new Date(),
              currentPeriodEnd: currentPeriodEnd,
              cancelAtPeriodEnd: false,
            }
          });
          console.log(`Subscription updated successfully to status: ${updatedSubscription.status}`);
        } else {
          console.log(`Creating new subscription for user ${user.id} (${user.email})`);
          const newSubscription = await prisma.subscription.create({
            data: {
              userId: user.id,
              status: 'ACTIVE' as SubscriptionStatus,
              stripeSubscriptionId: subscriptionId,
              currentPeriodStart: new Date(),
              currentPeriodEnd: currentPeriodEnd,
              cancelAtPeriodEnd: false,
            }
          });
          console.log(`New subscription created with status: ${newSubscription.status}`);
        }
        
        console.log(`Successfully updated subscription for user ${user.id} (${user.email}). Subscription is now ACTIVE.`);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;
        
        // Find subscription in our database
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId },
          include: { user: true }
        });
        
        if (!dbSubscription) {
          console.log(`No subscription found with Stripe ID: ${stripeSubscriptionId}`);
          break;
        }
        
        console.log(`Updating subscription for user: ${dbSubscription.user.email}`);
        
        // Update subscription details
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED' as SubscriptionStatus,
          }
        });
        
        console.log(`Subscription updated for user: ${dbSubscription.user.email}`);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;
        
        // Find subscription in our database
        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId },
          include: { user: true }
        });
        
        if (!dbSubscription) {
          console.log(`No subscription found with Stripe ID: ${stripeSubscriptionId}`);
          break;
        }
        
        console.log(`Cancelling subscription for user: ${dbSubscription.user.email}`);
        
        // Update subscription to expired
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: {
            status: 'EXPIRED' as SubscriptionStatus,
          }
        });
        
        console.log(`Subscription cancelled for user: ${dbSubscription.user.email}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
} 