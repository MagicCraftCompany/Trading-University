import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/pricing',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/webhook',
  '/api/checkout',
];

// Routes that require subscription
const subscriptionRoutes = [
  '/courses',
  '/chatroom',
];

const isPublic = (path: string) =>
  publicRoutes.some(route => path.startsWith(route)) ||
  path.includes('/_next/') ||
  path.includes('/static/');

const requiresSubscription = (path: string) =>
  subscriptionRoutes.some(route => path.startsWith(route));

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public routes
  if (isPublic(path)) {
    return NextResponse.next();
  }

  try {
    // Get token from cookie or header
    const token = request.cookies.get('token')?.value ||
      request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      throw new Error('No token found');
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);

    // Check if route requires subscription
    if (requiresSubscription(path)) {
      const subscriptionStatus = payload.subscriptionStatus as string;
      
      if (subscriptionStatus !== 'ACTIVE') {
        // Redirect to pricing page if not subscribed
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);
    requestHeaders.set('x-subscription-status', payload.subscriptionStatus as string);

    return NextResponse.next({
      headers: requestHeaders,
    });
  } catch (error) {
    // Redirect to login for authentication errors
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 