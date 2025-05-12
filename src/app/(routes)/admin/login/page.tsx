'use client';

import React from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, LoginState } from './actions';

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  );
}

export default function AdminLoginPage() {
  // Initialize form state
  const initialState: LoginState = {};
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Log in to access the admin dashboard
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
