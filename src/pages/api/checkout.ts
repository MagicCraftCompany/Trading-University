import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '@/db/prisma';

// Initialize Stripe with proper error handling
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Validate Stripe is properly configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set. Please check your environment variables.');
}

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
  onetime: {
    name: 'One Month of Enrollment',
    description: 'Full access to premium crypto trading courses and expert analysis for one month',
    unit_amount: 29900, // $299.00
    interval: null,
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Support both GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Handle direct payment from custom form
    if (req.method === 'POST' && req.body.paymentMethodId) {
      const {
        paymentMethodId,
        email,
        fullName,
        address,
        country,
        isGift,
        applyDiscount,
        paymentType
      } = req.body;

      // Check if we have a valid email
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Get the plan details
      const planType = 'onetime';
      const plan = PLANS[planType as keyof typeof PLANS];
      
      // Use the full amount (no discounts)
      const finalAmount = plan.unit_amount;

      try {
        // Extract zip code from address string
        let addressLine1 = address;
        let postalCode = '';
        
        if (address && address.includes(',')) {
          const parts = address.split(',');
          // Last part is likely the postal code
          postalCode = parts.pop()?.trim() || '';
          // Rejoin the remaining parts for the address line
          addressLine1 = parts.join(',').trim();
        }
        
        // Create a customer for this transaction
        const customer = await stripe.customers.create({
          email,
          name: fullName,
          address: {
            line1: addressLine1 || address, // Use the full address if splitting failed
            country: country,
            postal_code: postalCode,
          },
          payment_method: paymentMethodId,
        });

        // For one-time payments (we're just supporting one-time payments for now)
        // Create a payment intent for direct charge
        const paymentIntent = await stripe.paymentIntents.create({
          amount: finalAmount,
          currency: 'usd',
          customer: customer.id,
          payment_method: paymentMethodId,
          description: plan.description,
          confirm: true,
          receipt_email: email,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          },
          metadata: {
            name: fullName,
          },
        });

        // If payment requires authentication, return client secret
        if (paymentIntent.status === 'requires_action') {
          return res.status(200).json({
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-confirmation?payment_intent=${paymentIntent.id}&plan_name=${encodeURIComponent(plan.name)}`,
          });
        }
        
        // If payment succeeds immediately
        else if (paymentIntent.status === 'succeeded') {
          try {
            console.log('Payment succeeded with ID:', paymentIntent.id);
            console.log('Skipping database operations for now...');
            
         
          } catch (dbError) {
            console.error('Database error:', dbError);
            // We'll still return success to the client, but log the DB error
          }

          // Return success URL for redirect
          return res.status(200).json({
            success: true,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-confirmation?payment_intent=${paymentIntent.id}&plan_name=${encodeURIComponent(plan.name)}`,
          });
        } 
        // If payment failed
        else {
          return res.status(400).json({
            message: `Payment failed with status: ${paymentIntent.status}. Please try again.`,
          });
        }
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError);
        return res.status(400).json({
          message: stripeError.message || 'Payment processing failed. Please check your payment details and try again.'
        });
      }
    }
    
    // Original checkout session code for standard Stripe Checkout
    else {
      // Get plan from query or body
      const planType = (req.method === 'GET' ? req.query.plan : req.body.plan) as string || 'monthly';
      
      // Validate plan
      if (!['monthly', 'yearly', 'onetime'].includes(planType)) {
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
              ...(plan.interval && {
                recurring: {
                  interval: plan.interval as 'month' | 'year' | 'week' | 'day',
                },
              }),
            },
            quantity: 1,
          },
        ],
        mode: plan.interval ? 'subscription' : 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}&plan_name=${encodeURIComponent(plan.name)}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/custom-checkout`,
        allow_promotion_codes: true, // Enable promo codes
        billing_address_collection: 'required',
      });

      // For GET requests, redirect to the checkout URL
      if (req.method === 'GET') {
        return res.redirect(session.url || '/custom-checkout');
      }
      
      // For POST requests, return the URL
      res.status(200).json({ url: session.url });
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // For GET requests, redirect to custom-checkout page on error
    if (req.method === 'GET') {
      return res.redirect('/custom-checkout?error=checkout_failed');
    }
    
    res.status(500).json({ message: 'Error creating checkout session' });
  }
} 