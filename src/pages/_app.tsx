import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Layout from "@/components/Layouts/Layout";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    try {
      // Decode JWT token from localStorage if exists
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Parse JWT payload
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('[App] Current token payload:', payload);
          
          // Make sure cookie is set
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          
          // Version check
          const authVersion = '1.0.1'; // Increment this when changing auth structure
          const currentVersion = localStorage.getItem('authVersion');
          
          if (currentVersion !== authVersion) {
            console.log('[App] Auth version changed, clearing old data');
            // Update version
            localStorage.setItem('authVersion', authVersion);
          }
        } catch (e) {
          console.error('[App] Invalid token, clearing auth data', e);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          
          // Redirect to login if not on a public page
          const publicPaths = ['/', '/login', '/register', '/pricing'];
          if (!publicPaths.includes(router.pathname) && !router.pathname.startsWith('/api/')) {
            router.push('/login');
          }
        }
      }
    } catch (e) {
      console.error('[App] Error in auth check:', e);
    }
  }, [router]);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
