'use client';

import { useEffect, useState } from 'react';
import { randomBytes } from 'crypto';

/**
 * CSRF protection utilities
 * Implements Double Submit Cookie pattern for CSRF protection
 */

// Constants
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a secure random token for CSRF protection
 */
export function generateCsrfToken(): string {
  // Use crypto.randomBytes in Node.js environment
  if (typeof window === 'undefined') {
    return randomBytes(32).toString('hex');
  }
  
  // Use Web Crypto API in browser environment
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token in a cookie
 */
export function setCsrfCookie(token: string): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${CSRF_COOKIE_NAME}=${token}; path=/; SameSite=Strict; ${
    window.location.protocol === 'https:' ? 'Secure;' : ''
  } max-age=3600`;
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

/**
 * React hook to manage CSRF token
 * @returns Object with CSRF token and headers for fetch requests
 */
export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if we already have a CSRF token in cookie
    let token = getCsrfCookie();
    
    // If not, generate a new one and set it
    if (!token) {
      token = generateCsrfToken();
      setCsrfCookie(token);
    }
    
    setCsrfToken(token);
  }, []);
  
  // Return token and headers for fetch requests
  return {
    csrfToken,
    csrfHeaders: csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {},
    
    // Helper function to add CSRF token to fetch options
    withCsrf: (options: RequestInit = {}): RequestInit => {
      if (!csrfToken) return options;
      
      return {
        ...options,
        headers: {
          ...(options.headers || {}),
          [CSRF_HEADER_NAME]: csrfToken,
        },
      };
    },
  };
}

/**
 * Validate CSRF token from request against cookie
 * @param request Request object
 * @returns Boolean indicating if CSRF token is valid
 */
export function validateCsrfToken(request: Request, cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  
  // Extract CSRF token from cookie
  const cookieTokenMatch = cookieHeader.match(
    new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`)
  );
  const cookieToken = cookieTokenMatch ? cookieTokenMatch[1] : null;
  
  // Extract CSRF token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  // Both tokens must exist and match
  return !!cookieToken && !!headerToken && cookieToken === headerToken;
}
