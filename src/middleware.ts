import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only public routes - everything else requires authentication
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/api/checkout",
  "/api/webhook",
  "/login",
  "/sign-up",
];

// Protected routes that require authentication
const protectedPaths = [
  "/courses",
  "/profile",
  "/dashboard",
  "/chatroom",
  "/api/chat"
];

function isPublic(path: string) {
  return publicPaths.some(x => path.startsWith(x)) ||
    path.includes("/_next/") ||
    path.includes("/static/");
}

function isProtected(path: string) {
  return protectedPaths.some(x => path.startsWith(x));
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const path = request.nextUrl.pathname;

  // Check if this is a protected route
  if (isProtected(path)) {
    try {
      await auth.protect();
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow public routes
  if (isPublic(path)) {
    return NextResponse.next();
  }

  // For any other routes, require authentication
  try {
    await auth.protect();
    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/"
  ]
}; 