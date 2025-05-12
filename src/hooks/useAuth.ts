'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/(routes)/admin/actions';

/**
 * Custom hook to handle authentication in client components
 * @param redirectTo - Path to redirect to if not authenticated (default: /admin/login)
 * @returns Object with authentication state
 */
export function useAuth(redirectTo = '/admin/login') {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        // Use the API endpoint to check authentication instead of server-side function
        const response = await fetch('/api/auth/me');
        const isAuth = response.ok;
        const data = isAuth ? await response.json() : null;

        console.log(`Authentication check (attempt ${retryCount + 1}):`, isAuth);

        setAuthenticated(isAuth);
        setUser(data?.user || null);

        if (!isAuth) {
          // Only redirect if we've tried a few times and still not authenticated
          if (retryCount >= 2) {
            console.log('User not authenticated after multiple attempts, redirecting to', redirectTo);
            router.push(redirectTo);
          } else {
            // Increment retry count for next attempt
            setRetryCount(prev => prev + 1);
            return false;
          }
        }

        setLoading(false);
        return isAuth;
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoading(false);
        return false;
      }
    };

    // Check immediately
    checkAuth().then(isAuth => {
      // Set up retry mechanism with exponential backoff
      if (!isAuth && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 500; // 500ms, 1000ms, 2000ms
        console.log(`Will retry authentication check in ${delay}ms`);

        const timer = setTimeout(() => {
          checkAuth();
        }, delay);

        return () => clearTimeout(timer);
      }
    });
  }, [router, redirectTo, retryCount]);

  // Also set up a listener for storage events to detect login/logout in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token') {
        const isAuth = !!event.newValue;
        console.log('Auth token changed in another tab:', isAuth);
        setAuthenticated(isAuth);

        if (!isAuth && authenticated) {
          // User logged out in another tab
          router.push(redirectTo);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, redirectTo, authenticated]);

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutAction();
      // The server action will handle the redirect
    } catch (error) {
      console.error('Error logging out:', error);
      setLoading(false);
    }
  };

  return {
    loading,
    authenticated,
    user,
    isAdmin: user?.role === 'admin',
    logout
  };
}
