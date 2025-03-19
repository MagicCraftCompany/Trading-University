import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Define pricing plans
const PLANS = {
  monthly: {
    name: 'Pro Crypto Trading Course - Monthly',
    description: 'Full access to premium crypto trading courses, live signals, and expert analysis',
    unit_amount: 4900, // $49.00
    interval: 'month',
  },
  yearly: {
    name: 'Pro Crypto Trading Course - Yearly',
    description: 'Full access to premium crypto trading courses, live signals, and expert analysis (Annual billing)',
    unit_amount: 49900, // $499.00 (save ~15%)
    interval: 'year',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Support both GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get plan from query or body
    const planType = (req.method === 'GET' ? req.query.plan : req.body.plan) as string || 'monthly';
    
    // Validate plan
    if (!['monthly', 'yearly'].includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }
    
    const plan = PLANS[planType as keyof typeof PLANS];
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
              images: ['https://your-domain.com/course-preview.jpg'], // Add your course preview image
            },
            unit_amount: plan.unit_amount,
            recurring: {
              interval: plan.interval as 'month' | 'year' | 'week' | 'day',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/login?session_id={CHECKOUT_SESSION_ID}&checkout_complete=true&redirect_to=courses`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      allow_promotion_codes: true, // Enable promo codes
      billing_address_collection: 'required',
    });

    // For GET requests, redirect to the checkout URL
    if (req.method === 'GET') {
      return res.redirect(session.url || '/pricing');
    }
    
    // For POST requests, return the URL
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // For GET requests, redirect to pricing page on error
    if (req.method === 'GET') {
      return res.redirect('/pricing?error=checkout_failed');
    }
    
    res.status(500).json({ message: 'Error creating checkout session' });
  }
} 