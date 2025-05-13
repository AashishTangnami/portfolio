/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize a string to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  // Replace potentially dangerous characters with HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate an email address
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a URL
 * @param url URL to validate
 * @returns Boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    // Use URL constructor for validation
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true, message: 'Password is strong' };
}

/**
 * Sanitize an object by sanitizing all string properties
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };

  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeString(result[key]) as any;
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObject(result[key]) as any;
    }
  }

  return result;
}

/**
 * Generate a secure random string
 * @param length Length of the string to generate
 * @returns Random string
 */
export function generateRandomString(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use crypto API if available
  if (typeof window !== 'undefined' && window.crypto) {
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(randomValues[i] % characters.length);
    }
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  return result;
}

/**
 * Validate and sanitize form input
 * @param input Form input to validate and sanitize
 * @param schema Validation schema
 * @returns Validated and sanitized input
 */
export function validateAndSanitizeInput<T extends Record<string, any>>(
  input: T,
  schema: Record<keyof T, {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'url';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
  }>
): { valid: boolean; data: T; errors: Record<keyof T, string> } {
  const result: T = { ...input };
  const errors: Record<string, string> = {};
  let valid = true;

  for (const key in schema) {
    const value = input[key];
    const rules = schema[key];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[key] = `${key} is required`;
      valid = false;
      continue;
    }

    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Validate type
    if (rules.type) {
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors[key] = `${key} must be a string`;
            valid = false;
          } else {
            result[key] = sanitizeString(value) as any;
          }
          break;
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors[key] = `${key} must be a number`;
            valid = false;
          } else {
            result[key] = Number(value) as any;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors[key] = `${key} must be a boolean`;
            valid = false;
          }
          break;
        case 'email':
          if (!isValidEmail(String(value))) {
            errors[key] = `${key} must be a valid email address`;
            valid = false;
          } else {
            result[key] = sanitizeString(String(value)) as any;
          }
          break;
        case 'url':
          if (!isValidUrl(String(value))) {
            errors[key] = `${key} must be a valid URL`;
            valid = false;
          } else {
            result[key] = sanitizeString(String(value)) as any;
          }
          break;
      }
    }

    // Validate string length
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors[key] = `${key} must be at least ${rules.minLength} characters long`;
        valid = false;
      }

      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors[key] = `${key} must be at most ${rules.maxLength} characters long`;
        valid = false;
      }
    }

    // Validate number range
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);

      if (rules.min !== undefined && numValue < rules.min) {
        errors[key] = `${key} must be at least ${rules.min}`;
        valid = false;
      }

      if (rules.max !== undefined && numValue > rules.max) {
        errors[key] = `${key} must be at most ${rules.max}`;
        valid = false;
      }
    }

    // Validate pattern
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      errors[key] = `${key} has an invalid format`;
      valid = false;
    }
  }

  return { valid, data: result, errors: errors as Record<keyof T, string> };
}
