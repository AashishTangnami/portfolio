'use server';

import { authenticateUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export type LoginState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate inputs
    if (!email || !password) {
      return {
        error: 'Email and password are required',
      };
    }

    // Authenticate user directly
    const result = await authenticateUser(email, password);

    // Handle authentication failure
    if (!result.success) {
      return {
        error: result.message || 'Authentication failed',
      };
    }

    // Successful login - redirect to admin dashboard
    redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'An unexpected error occurred',
    };
  }
}
