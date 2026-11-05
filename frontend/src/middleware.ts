import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected path prefixes
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/wallet',
  '/community',
  '/goals',
  '/savings',
  '/trips',
  '/settings',
  '/chat',
];

// Auth-only public routes (redirect to dashboard if already authenticated)
const AUTH_ROUTES = ['/login', '/signup', '/otp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('one_access_token')?.value;
  const refreshToken = request.cookies.get('one_refresh_token')?.value;
  const hasAuthToken = Boolean(accessToken || refreshToken);

  // Validate token payload expiry if it's a JWT
  let isTokenExpired = false;
  if (accessToken && accessToken.startsWith('eyJ')) {
    try {
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          isTokenExpired = true;
        }
      }
    } catch {
      isTokenExpired = true;
    }
  }

  const isAuthenticated = hasAuthToken && !isTokenExpired;

  // 1. Check Protected Routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (isTokenExpired) {
        response.cookies.delete('one_access_token');
      }
      return response;
    }
  }

  // 2. Check Auth routes when user is already logged in
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/wallet/:path*',
    '/community/:path*',
    '/goals/:path*',
    '/savings/:path*',
    '/trips/:path*',
    '/settings/:path*',
    '/chat/:path*',
    '/login',
    '/signup',
    '/otp',
  ],
};
