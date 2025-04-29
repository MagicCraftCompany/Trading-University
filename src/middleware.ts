import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define types for JWT payload
interface Subscription {
  currentPeriodEnd: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

interface JWTPayload {
  sub?: string;
  email?: string;
  subscription?: Subscription;
  [key: string]: any;
}

// Routes that require authentication
const protectedRoutes = [
  '/courses',
  '/profile',
  '/account',
  '/dashboard',
];

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/login',
  '/custom-checkout',
  '/payment-confirmation',
  '/api/auth',
];

// Extract token from cookie
const getToken = (request: NextRequest): string | null => {
  const cookie = request.cookies.get('token');
  return cookie?.value || null;
};

// Verify JWT token and check subscription status
const verifyToken = async (token: string): Promise<{ isExpired: boolean; payload: JWTPayload } | null> => {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only'
    );
    const { payload } = await jwtVerify(token, secret);
    
    // Check if subscription is expired
    const jwtPayload = payload as JWTPayload;
    if (jwtPayload.subscription) {
      const subscriptionEnd = new Date(jwtPayload.subscription.currentPeriodEnd);
      if (subscriptionEnd < new Date()) {
        console.log('Subscription expired');
        return { isExpired: true, payload: jwtPayload };
      }
    }
    
    return { isExpired: false, payload: jwtPayload };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Check if the path matches any of the protected routes
const isProtectedRoute = (path: string): boolean => {
  // Remove query params and hash from path if present
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // For debugging
  console.log(`Checking if path is protected: ${path} (clean: ${cleanPath})`);
  
  // Check specifically for courses routes
  if (cleanPath === '/courses' || cleanPath.startsWith('/courses/')) {
    console.log(`Protected course route detected: ${cleanPath}`);
    return true;
  }
  
  // Check other protected routes
  for (const route of protectedRoutes) {
    if (cleanPath === route || cleanPath.startsWith(`${route}/`)) {
      console.log(`Protected route detected: ${cleanPath}`);
      return true;
    }
  }
  
  return false;
};

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware processing: ${pathname}`);
  
  // Skip middleware for static assets, favicon, etc.
  if (
    pathname.startsWith('/_next/') || 
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    console.log(`Skipping middleware for static asset: ${pathname}`);
    return NextResponse.next();
  }
  
  // Skip middleware for public routes and API routes (except auth)
  if (
    publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))
  ) {
    console.log(`Skipping middleware for public route: ${pathname}`);
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (isProtectedRoute(pathname)) {
    console.log(`Protected route access attempt: ${pathname}`);
    
    // Get token from cookie
    const token = getToken(request);
    
    if (!token) {
      console.log(`No auth token found for protected route: ${pathname}, redirecting to login`);
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // If token exists, verify it and check subscription
    const result = await verifyToken(token);
    
    // If token is invalid, redirect to login
    if (!result) {
      console.log(`Invalid token for protected route: ${pathname}, redirecting to login`);
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // If subscription is expired, redirect to custom-checkout
    if (result.isExpired) {
      console.log(`Subscription expired, redirecting to custom-checkout`);
      const response = NextResponse.redirect(new URL('/custom-checkout', request.url));
      
      // Clear the authentication cookie
      response.cookies.delete('token');
      
      // Add subscription_expired parameter
      const url = new URL('/custom-checkout', request.url);
      url.searchParams.set('subscription_expired', 'true');
      
      return NextResponse.redirect(url);
    }
    
    console.log(`Valid token and active subscription found for protected route: ${pathname}, proceeding`);
  }
  
  // Special case: If trying to access login-success, redirect to courses
  if (pathname === '/login-success') {
    return NextResponse.redirect(new URL('/courses', request.url));
  }
  
  return NextResponse.next();
}

// Remove the matcher to ensure all routes are processed
// export const config = {
//   matcher: [...]
// }; 