'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle checkout session verification
  useEffect(() => {
    const verifyCheckoutSession = async () => {
      const { session_id, redirect_to } = router.query;
      
      if (session_id && typeof session_id === 'string') {
        setIsLoading(true);
        
        try {
          // Call the verify-session endpoint
          const response = await fetch(`/api/auth/verify-session?session_id=${session_id}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Store token
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(data.user));
            
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Send the credential to our backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }
      
      // Store token and user data
      if (data.token && data.user) {
        console.log('Successfully authenticated with Google');
        console.log('User data structure:', data.user);
        
        // Make sure we have minimum required user fields
        const userData = {
          ...data.user,
          // Ensure these fields exist
          id: data.user.id || '',
          email: data.user.email || '',
          name: data.user.name || '',
          image: data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || data.user.email)}`
        };
        
        // Store token in localStorage and cookies
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Store user info with guaranteed fields
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Saved user data to localStorage');
        
        // Check if the user has an active subscription
        const hasActiveSubscription = data.user.subscription?.status === 'ACTIVE';
        
        if (!hasActiveSubscription) {
          // Redirect to pricing page if no active subscription
          console.log('No active subscription, redirecting to pricing');
          router.push('/pricing?message=subscription_required');
        } else {
          // Redirect to courses page if subscribed
          console.log('Active subscription found, redirecting to courses');
          router.push('/courses');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access requires an active subscription
          </p>
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
                href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`)}&response_type=code&scope=email%20profile&access_type=offline`}
                className="flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Sign in with Google
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