import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CustomCheckoutForm from '@/components/CustomCheckoutForm';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { StripeElementsOptions } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Debug Stripe key loading
console.log('Stripe key available:', !!stripeKey);

// Load stripe outside of component to avoid recreating it on each render
let stripePromise: ReturnType<typeof loadStripe> | null = null;

if (stripeKey) {
  stripePromise = loadStripe(stripeKey);
} else {
  console.error('Stripe publishable key is not available. Check your environment variables.');
}

const CustomCheckoutPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const isRenewal = router.query.subscription_expired === 'true';
  const pageTitle = isRenewal ? 'Renew Your Subscription' : 'Enrollment Checkout';

  // Ensure Stripe is loaded properly
  useEffect(() => {
    if (!stripePromise) {
      setErrorMessage('Payment processing is currently unavailable. Please try again later.');
    }
  }, []);

  // Basic options to ensure things work
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: 29900,
    currency: 'usd',
    appearance: {
      theme: 'night',
      labels: 'floating',
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitle} | Trading Academy</title>
        <meta name="description" content="Complete your enrollment to access premium trading courses and resources" />
      </Head>
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-900 text-white rounded-lg max-w-6xl w-full">
            {errorMessage}
          </div>
        )}
        
        <div className="w-full max-w-6xl">
          {stripePromise ? (
            <Elements stripe={stripePromise} options={options}>
              <CustomCheckoutForm 
                price={299}
                productName="One month of Enrollment"
                studentCount={41180}
              />
            </Elements>
          ) : (
            <div className="bg-gray-900 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Payment System Unavailable</h2>
              <p>Our payment system is temporarily unavailable. Please check back later or contact support.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomCheckoutPage; 