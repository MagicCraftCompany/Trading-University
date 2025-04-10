import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LoginSuccessPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  
  useEffect(() => {
    // Get user info from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

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
          
          <p className="text-lg text-gray-700 mb-6">
            Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}! You have successfully logged in to Trading Academy.
          </p>
          
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
            
           
          </div>
        </div>
      </div>
    </>
  );
} 