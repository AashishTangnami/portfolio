import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { generateCsrfToken } from '@/lib/csrf';
import { isValidEmail } from '@/lib/security';
import { applyRateLimit } from '@/lib/rate-limit';

// Mark this route as dynamic since it sets cookies
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Apply rate limiting to prevent brute force attacks
    const rateLimitResponse = applyRateLimit(request, 'auth');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Authenticate user (this will set the cookie in the authenticateUser function)
    const result = await authenticateUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || 'Authentication failed'
        },
        { status: 401 }
      );
    }

    // Generate CSRF token for additional security
    const csrfToken = generateCsrfToken();

    // Create response with the token and user info
    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
      csrfToken // Include CSRF token in response
    });

    // Set CSRF token cookie
    response.cookies.set('csrf_token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600 // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
