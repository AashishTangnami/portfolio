'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/auth';

const COOKIE_NAME = 'auth_token';

/**
 * Logout action for the admin interface
 * This is a server action that can be called from client components
 */
export async function logoutAction() {
  // Delete session from database
  await deleteSession(true);

  // Redirect to login page
  redirect('/admin/login');
}
