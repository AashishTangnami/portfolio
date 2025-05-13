import { NextResponse } from 'next/server';
import { createUser, getAllUsers } from '@/lib/user-service';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create the user
    const user = await createUser({
      email,
      password,
      name,
      role: role || 'admin' // Default to admin if not specified
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);

    // Check for duplicate email error
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002' &&
      'meta' in error &&
      error.meta &&
      typeof error.meta === 'object' &&
      'target' in error.meta &&
      Array.isArray(error.meta.target) &&
      error.meta.target.includes('email')
    ) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
