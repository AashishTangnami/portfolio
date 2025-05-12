import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/admin',
  '/admin/blog',
  '/admin/projects',
  '/admin/experience',
  '/api/blog/upload',
  '/api/projects',
  '/api/experience',
];

// Paths that are explicitly public
const PUBLIC_PATHS = [
  '/admin/login',
  '/api/auth/login',
  '/api/auth/logout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the path is explicitly public
  const isPublicPath = PUBLIC_PATHS.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If the path is not protected or is explicitly public, allow access
  if (!isProtectedPath || isPublicPath) {
    return NextResponse.next();
  }

  // Get the token from the request cookies or headers
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('Authorization')?.split(' ')[1] ||
                request.headers.get('X-Auth-Token');

  // If there's no token, redirect to login
  if (!token) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token using environment variable
    const JWT_SECRET = process.env.JWT_SECRET || '';

    // Ensure JWT_SECRET is set
    if (!JWT_SECRET) {
      console.error('ERROR: JWT_SECRET is not set in environment variables');
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }

    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Middleware verifying token with JWT_SECRET');
    }

    // Verify the token
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    // Token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    console.error('Token verification failed:', error);
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/blog/:path*',
    '/api/projects/:path*',
    '/api/experience/:path*',
  ],
};
