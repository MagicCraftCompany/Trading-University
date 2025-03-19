import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/pricing',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/auth/verify-session',
  '/api/auth/refresh-token',
  '/auth/callback', // Frontend callback route
  '/api/webhook',
  '/api/checkout',
  '/favicon.ico',
  '/_next',
  '/static',
  '/about',
  '/contact',
];

// Routes that require subscription
const subscriptionRoutes = [
  '/courses',
  '/chatroom',
];

// Check if a path matches any of the public routes
const isPublic = (path: string): boolean => {
  // Check for exact matches first
  if (publicRoutes.some(route => route === path)) {
    return true;
  }
  
  // Then check for partial matches
  return publicRoutes.some(route => 
    (route !== '/' && path.startsWith(route)) || // Avoid matching everything with '/'
    path.includes('/_next/') || 
    path.includes('/static/')
  );
};

// Check if a path requires subscription
const requiresSubscription = (path: string): boolean => {
  return subscriptionRoutes.some(route => path.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log(`[Middleware] Processing request for path: ${path}`);
  
  // Check if the route is public
  if (isPublic(path)) {
    console.log(`[Middleware] Public route detected: ${path}`);
    return NextResponse.next();
  }

  console.log(`[Middleware] Protected route detected: ${path}`);
  
  try {
    // Get token from cookies or authorization header
    const token = request.cookies.get('token')?.value ||
      request.headers.get('authorization')?.split(' ')[1];

    // Check if user has previously visited/subscribed
    const hasPreviouslyVisited = request.cookies.get('_hasPreviouslyVisited')?.value === 'true';

    if (!token) {
      console.log('[Middleware] No token found, determining redirect target');
      
      // If user has previously visited/subscribed, redirect to login
      // Otherwise, redirect to pricing page for first-time users
      if (hasPreviouslyVisited) {
        console.log('[Middleware] Previously subscribed user, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      } else {
        console.log('[Middleware] New user, redirecting to pricing');
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    }

    console.log('[Middleware] Token found, verifying...');
    
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    console.log('[Middleware] Token payload:', JSON.stringify(payload));

    // Check if route requires subscription
    if (requiresSubscription(path)) {
      console.log(`[Middleware] Subscription required for: ${path}`);
      const subscriptionStatus = payload.subscriptionStatus as string;
      console.log(`[Middleware] User subscription status: ${subscriptionStatus}`);
      
      if (subscriptionStatus !== 'ACTIVE') {
        console.log('[Middleware] Not subscribed, redirecting to pricing');
        return NextResponse.redirect(new URL('/pricing?message=subscription_required', request.url));
      }
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);
    requestHeaders.set('x-subscription-status', payload.subscriptionStatus as string);

    console.log('[Middleware] Request authenticated, proceeding');
    return NextResponse.next({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error('[Middleware] Authentication error:', error);
    
    // Check if user has previously visited/subscribed
    const hasPreviouslyVisited = request.cookies.get('_hasPreviouslyVisited')?.value === 'true';
    
    // If user has previously visited/subscribed, redirect to login
    // Otherwise, redirect to pricing page for first-time users
    if (hasPreviouslyVisited) {
      console.log('[Middleware] Previously subscribed user with auth error, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log('[Middleware] New user with auth error, redirecting to pricing');
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 