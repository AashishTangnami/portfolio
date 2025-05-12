import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

/**
 * API endpoint to check the current user's authentication status
 * Returns the user object if authenticated, or 401 if not
 */
export async function GET() {
  try {
    const user = await verifySession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking authentication' },
      { status: 500 }
    );
  }
}
