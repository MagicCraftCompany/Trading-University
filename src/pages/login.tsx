'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle checkout session verification and Google auth callback
  useEffect(() => {
    if (!router.isReady) return;

    // Handle Google auth callback
    const { success, token, email, name } = router.query;
    
    if (success === 'true' && token && email && name) {
      // Get subscription status from JWT token
      try {
        const tokenParts = (token as string).split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const subscriptionStatus = payload.subscriptionStatus || 'FREE';
          
          // Store the token
          localStorage.setItem('token', token as string);
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          
          // Store user info with subscription status
          const user = {
            id: 'google-user',
            name: name as string,
            email: email as string,
            subscription: {
              status: subscriptionStatus,
              currentPeriodEnd: null // This will be fetched from the API
            }
          };
          localStorage.setItem('user', JSON.stringify(user));
          
          // Notify components about authentication change
          window.dispatchEvent(new Event('authChange'));
          
          // Redirect to login success page
          router.push('/login-success');
          return;
        }
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        // Fall back to the original code if there's an error
        localStorage.setItem('token', token as string);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Store user info
        const user = {
          id: 'google-user',
          name: name as string,
          email: email as string
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Notify components about authentication change
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to login success page
        router.push('/login-success');
        return;
      }
    }
    
    // Handle login errors
    if (router.query.error) {
      if (router.query.error === 'NoAccountFound') {
        setError('No account found with this Google email. Please register through the enrollment process first.');
      } else if (router.query.error === 'GoogleAuthFailed') {
        setError('Google authentication failed. Please try again or use email/password login.');
      } else {
        setError('Authentication failed. Please try again.');
      }
      return;
    }
    
    const verifyCheckoutSession = async () => {
      const { session_id, redirect_to, checkout_complete } = router.query;
      
      // If this is a post-checkout redirect, set the cookie and show a special message
      if (session_id) {
        // Set cookie to remember that user has previously visited/subscribed
        document.cookie = '_hasPreviouslyVisited=true; path=/; max-age=31536000; SameSite=Lax'; // 1 year expiry
        
        if (checkout_complete === 'true') {
          setPendingMessage('Thank you for subscribing! Please sign in to complete your account setup.');
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
              setPendingMessage(data.message || 'Please sign in to access your subscription');
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
            
            // Redirect to login success page
            router.push('/login-success');
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
    
    verifyCheckoutSession();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Call the actual login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', response.status, errorText);
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Parse the JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        setError('Server response error. Please try again.');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // Store token
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Notify components about authentication change
        window.dispatchEvent(new Event('authChange'));
        
        // Show brief success message before redirecting
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to login success page
        setTimeout(() => {
          router.push('/login-success');
        }, 1000);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Trading Academy | Login</title>
        <meta name="description" content="Login to access Trading Academy" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-black relative rounded-xl p-8 border border-white/[0.2] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Login to Trading Academy
            </p>
            
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            {pendingMessage && (
              <div className="mb-6 bg-[#614803]/30 border border-[#CB9006]/50 text-[#CB9006] px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{pendingMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent transition-all duration-200"
                  placeholder="Email Address"
                />
              </div>

              <div className="w-full">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                />
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-[#CB9006] hover:text-[#B07D05] text-sm transition-colors">
                  Forgot your password?
                </Link>
              </div>

              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 rounded-lg text-base font-medium text-white bg-[#CB9006] hover:bg-[#B07D05] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB9006] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="w-full">
                  <Link 
                    href="/custom-checkout"
                    className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                  >
                    I don't have an account
                  </Link>
                </div>
               
                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                  <div className="w-full">
                    <a 
                      href={getGoogleAuthUrl()}
                      className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="mr-2">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Sign in with Google
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}