import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Return the token and user info (but not the password)
    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
