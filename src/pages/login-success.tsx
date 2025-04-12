import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginSuccessPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    status: string;
    expiresAt: string | null;
  } | null>(null);
  
  useEffect(() => {
    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
        
        // Check for subscription info
        if (user.subscription) {
          setSubscriptionInfo({
            status: user.subscription.status || 'FREE',
            expiresAt: user.subscription.currentPeriodEnd || null
          });
        } else {
          setSubscriptionInfo({
            status: 'FREE',
            expiresAt: null
          });
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  // Format date for display
  const formatExpirationDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Head>
        <title>Login Successful | Trading Academy</title>
        <meta name="description" content="Successfully logged in to Trading Academy" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Login Successful!
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}! You have successfully logged in to Trading Academy.
          </p>
          
          {subscriptionInfo && (
            <div className={`p-4 rounded-lg mb-6 ${
              subscriptionInfo.status === 'ACTIVE' ? 'bg-green-50 text-green-800' : 
              subscriptionInfo.status === 'EXPIRED' ? 'bg-orange-50 text-orange-800' : 
              'bg-gray-50 text-gray-800'
            }`}>
              <h3 className="font-medium">Subscription Status: {subscriptionInfo.status}</h3>
              {subscriptionInfo.status === 'ACTIVE' && subscriptionInfo.expiresAt && (
                <p className="text-sm mt-1">
                  Your monthly subscription is active until {formatExpirationDate(subscriptionInfo.expiresAt)}.
                </p>
              )}
              {subscriptionInfo.status === 'EXPIRED' && (
                <p className="text-sm mt-1">
                  Your subscription has expired. Please renew to continue accessing premium content.
                </p>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-8">
            You now have access to all the features and content.
          </p>

          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
            
            {subscriptionInfo?.status === 'EXPIRED' && (
              <Link 
                href="/custom-checkout?subscription_expired=true"
                className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Renew Subscription
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 