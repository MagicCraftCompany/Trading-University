import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const PricingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Subscription Required | James Crypto Guru</title>
        <meta name="description" content="Subscribe to access premium crypto trading courses and resources" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Required</h1>
            <p className="text-lg text-gray-600 mb-8">
              A subscription is required to access our premium content and features.
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {router.query.message === 'subscription_required' && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md mb-6">
                You need an active subscription to access the platform.
              </div>
            )}
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md font-semibold transition-colors bg-[#e39c44] hover:bg-[#d38933] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By subscribing, you'll get full access to all our premium courses, live trading signals, and expert market analysis.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage; 