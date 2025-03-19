'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  // Handle checkout session verification
  useEffect(() => {
    const verifyCheckoutSession = async () => {
      const { session_id, redirect_to, checkout_complete } = router.query;
      
      // If this is a post-checkout redirect, set the cookie and show a special message
      if (session_id) {
        // Set cookie to remember that user has previously visited/subscribed
        document.cookie = '_hasPreviouslyVisited=true; path=/; max-age=31536000; SameSite=Lax'; // 1 year expiry
        
        if (checkout_complete === 'true') {
          setPendingMessage('Thank you for subscribing! Please sign in with Google to complete your account setup.');
          // Dispatch an event to notify the header to update
          window.dispatchEvent(new Event('authChange'));
          return;
        }
      }
      
      if (session_id && typeof session_id === 'string') {
        setIsLoading(true);
        
        try {
          // Call the verify-session endpoint
          const response = await fetch(`/api/auth/verify-session?session_id=${session_id}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Check if we need to authenticate with Google first
            if (data.redirectToGoogleAuth) {
              setPendingMessage(data.message || 'Please sign in with Google to access your subscription');
              setIsLoading(false);
              return;
            }
            
            // Store token
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Notify components about authentication change
            window.dispatchEvent(new Event('authChange'));
            
            // Redirect to appropriate page
            if (redirect_to && typeof redirect_to === 'string') {
              router.push(`/${redirect_to}`);
            } else {
              router.push('/courses');
            }
          } else {
            setError(data.message || 'Failed to verify checkout session');
          }
        } catch (error) {
          console.error('Failed to verify checkout session:', error);
          setError('Error processing your subscription. Please try logging in.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (router.isReady) {
      verifyCheckoutSession();
    }
  }, [router.isReady, router.query, router]);

  // Build state parameter for Google auth
  const getGoogleAuthUrl = () => {
    // Create a state object with relevant parameters
    const stateObj = {
      session_id: router.query.session_id || '',
      checkout_complete: router.query.checkout_complete === 'true'
    };
    
    // Encode state as URL-safe string
    const state = encodeURIComponent(JSON.stringify(stateObj));
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    }&redirect_uri=${
      encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`)
    }&response_type=code&scope=email%20profile&access_type=offline&state=${state}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {pendingMessage ? (
            <p className="mt-2 text-center text-sm text-green-600">
              {pendingMessage}
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-gray-600">
              Access requires an active subscription
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-6">
          <div className="mt-6">
            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <a 
                href={getGoogleAuthUrl()}
                className={`flex justify-center items-center gap-2 px-4 py-3 rounded-md transition-colors ${
                  router.query.checkout_complete === 'true' 
                    ? 'bg-[#e39c44] text-white hover:bg-[#d38933] text-lg font-semibold shadow-md' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                {router.query.checkout_complete === 'true' 
                  ? 'Complete Account Setup with Google' 
                  : 'Sign in with Google'}
              </a>
            ) : (
              <p className="text-sm text-gray-500 text-center">Google login is currently unavailable</p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            No account yet? <Link href="/pricing" className="font-medium text-indigo-600 hover:text-indigo-500">Subscribe to get access</Link>
          </p>
        </div>
      </div>
    </div>
  )
}