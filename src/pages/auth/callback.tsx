import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { token, error } = router.query;

    if (error) {
      console.error('Authentication error:', error);
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token as string);

      // Fetch user data
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on subscription status
            if (data.user.subscription?.status === 'ACTIVE') {
              router.push('/courses');
            } else {
              router.push('/pricing');
            }
          } else {
            throw new Error('User data not found');
          }
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          router.push('/login?error=FailedToFetchUserData');
        });
    } else {
      router.push('/login');
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 