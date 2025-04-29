import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const [planName, setPlanName] = useState<string>('Trading Academy Membership');
  const [showSpinner, setShowSpinner] = useState(true);
  
  useEffect(() => {
    // Clear any authentication tokens to ensure user needs to log in
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // Notify components about authentication change
    window.dispatchEvent(new Event('authChange'));
    
    // Get plan information from query parameters if available
    if (router.isReady) {
      if (router.query.plan_name) {
        setPlanName(router.query.plan_name as string);
      }
      
      // Hide spinner after a brief delay
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Payment Successful | Trading Academy</title>
        <meta name="description" content="Your payment was successful" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full rounded-xl p-8 border border-white/[0.2] shadow-2xl text-center">
          {showSpinner ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#CB9006] mb-4"></div>
              <p className="text-white text-lg">Processing your payment...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto bg-[#CB9006]/20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#CB9006]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Payment Successful!
              </h2>
              
              <p className="text-lg text-gray-300 mb-6">
                Thank you for your purchase! Your registration is complete.
              </p>
              
              <div className="p-4 rounded-lg mb-6 bg-white/10 border border-white/20">
                <h3 className="font-medium text-[#CB9006] mb-2">Order Details</h3>
                <p className="text-white mb-1">
                  <span className="text-gray-400">Product:</span> {planName}
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Status:</span> <span className="text-green-400">Confirmed</span>
                </p>
              </div>
              
              <div className="p-4 rounded-lg mb-6 bg-[#061213] border border-[#CB9006]/20">
                <h3 className="font-medium text-white mb-2">Next Steps</h3>
                <p className="text-gray-300 text-sm">
                  Please log in to your account to access all your courses and materials.
                </p>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/login"
                  className="block w-full py-3 px-4 rounded-md text-center font-bold text-white bg-[#CB9006] hover:bg-[#B07D05] transition-colors"
                >
                  Login to Your Account
                </Link>
                
                <Link 
                  href="/"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 