import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { token } = router.query;

    if (!token) {
      setError('No authentication token received');
      return;
    }

    try {
      // Store the token in localStorage
      localStorage.setItem('token', token as string);

      // Also store in cookies for middleware access
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // Try to parse token to get user info
      const tokenParts = (token as string).split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check subscription status
        if (payload.subscriptionStatus === 'ACTIVE') {
          // Redirect to courses if subscription is active
          router.replace('/courses');
        } else {
          // Redirect to custom-checkout if no active subscription
          router.replace('/custom-checkout?subscription_expired=true');
        }
      } else {
        // Fallback if token isn't parseable
        router.replace('/custom-checkout?subscription_expired=true');
      }
    } catch (err) {
      console.error('Error handling auth callback:', err);
      setError('Authentication failed');
    }
  }, [router.isReady, router.query, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authenticating...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A64E]"></div>
        </div>
      </div>
    </div>
  );
} 