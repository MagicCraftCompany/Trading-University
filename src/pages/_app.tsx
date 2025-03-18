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
          
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            console.log('[App] Token expired, clearing...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
            return;
          }
          
          // Make sure cookie is set
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          
          // Version check
          const authVersion = '1.0.1'; // Increment this when changing auth structure
          const currentVersion = localStorage.getItem('authVersion');
          
          if (currentVersion !== authVersion) {
            console.log('[App] Auth version changed, updating version');
            // Update version
            localStorage.setItem('authVersion', authVersion);
          }

          // Get user data from token
          if (payload.userId && payload.email) {
            const userData = {
              id: payload.userId,
              email: payload.email,
              name: payload.name || payload.email.split('@')[0],
              subscription: { status: payload.subscriptionStatus }
            };
            console.log('[App] Reconstructing user data from token:', userData);
            localStorage.setItem('user', JSON.stringify(userData));
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
      } else {
        // Check if we have a cookie token but no localStorage token
        const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('token='));
        if (cookieToken) {
          const token = cookieToken.split('=')[1];
          if (token) {
            console.log('[App] Found token in cookie but not in localStorage, restoring...');
            localStorage.setItem('token', token);
            try {
              // Get user data from token
              const payload = JSON.parse(atob(token.split('.')[1]));
              if (payload.userId && payload.email) {
                const userData = {
                  id: payload.userId,
                  email: payload.email,
                  name: payload.name || payload.email.split('@')[0],
                  subscription: { status: payload.subscriptionStatus }
                };
                console.log('[App] Reconstructing user data from token:', userData);
                localStorage.setItem('user', JSON.stringify(userData));
              }
            } catch (e) {
              console.error('[App] Error parsing cookie token', e);
            }
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
