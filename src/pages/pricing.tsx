import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const PricingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Function to check and refresh subscription status in token
    const refreshSubscriptionStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        // Make API call to refresh token with current subscription status
        const response = await fetch('/api/auth/refresh-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            // Update token in localStorage and cookies
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            
            // If subscription is active, redirect to courses
            if (data.subscriptionStatus === 'ACTIVE') {
              router.push('/courses');
            }
          }
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };
    
    // Check for JWT token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        
        // If user already has an active subscription, redirect to courses
        if (userData.subscription?.status === 'ACTIVE') {
          router.push('/courses');
        } else if (router.query.message === 'subscription_required') {
          // If redirected here due to subscription required message, refresh token
          refreshSubscriptionStatus();
        }
      }
    }
    
    // If token is in query parameter from Google OAuth, save it
    if (router.query.token) {
      localStorage.setItem('token', router.query.token as string);
      document.cookie = `token=${router.query.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      setIsAuthenticated(true);
      
      // Remove token from URL to avoid sharing it
      const { token, ...queryWithoutToken } = router.query;
      router.replace({
        pathname: router.pathname,
        query: queryWithoutToken
      }, undefined, { shallow: true });
    }
  }, [router.query.token]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
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
                {isAuthenticated 
                  ? 'Your account requires an active subscription to access premium content.' 
                  : 'You need to subscribe to access the platform.'}
              </div>
            )}
            
            {user?.subscription?.status === 'EXPIRED' && (
              <div className="mt-4 p-3 bg-orange-100 text-orange-800 rounded-md mb-6">
                Your subscription has expired. Please renew to continue accessing premium content.
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