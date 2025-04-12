import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const authRoutes = [
  '/courses',
  '/profile',
  '/account',
  '/dashboard',
];

// Routes that specifically require an active subscription
const subscriptionRoutes = [
  '/courses',
];

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/login',
  '/custom-checkout',
  '/login-success',
  '/api/auth',
];

// Extract token from cookie
const getToken = (request: NextRequest): string | null => {
  const cookie = request.cookies.get('token');
  return cookie?.value || null;
};

// Verify JWT token
const verifyToken = async (token: string): Promise<any> => {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only'
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Check if a path requires subscription
const requiresSubscription = (path: string): boolean => {
  return subscriptionRoutes.some(route => path.startsWith(route));
};

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes and API routes (except auth)
  if (
    publicRoutes.some(route => pathname.startsWith(route)) ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = getToken(request);
  
  // If no token and route requires auth, redirect to login
  if (!token && authRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // If token exists, verify it
  if (token) {
    const payload = await verifyToken(token);
    
    // If token is invalid, redirect to login
    if (!payload) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Check subscription status for protected routes
    if (requiresSubscription(pathname)) {
      const { subscriptionStatus } = payload;
      
      // If subscription is not active, redirect to custom-checkout page
      if (subscriptionStatus !== 'ACTIVE') {
        const url = new URL('/custom-checkout', request.url);
        url.searchParams.set('subscription_expired', 'true');
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes that don't require auth
     * 2. /_next (static files)
     * 3. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    '/((?!_next/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}; 