/**
 * Secure authentication utility for the admin interface
 * Uses JWT tokens and bcrypt for password hashing
 * Fully database-based authentication with Prisma
 * No hardcoded credentials - all users must be created in the database
 * Uses Next.js App Router patterns with server-side session management
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development_only';
const COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY = '7d'; // 7 days

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Create JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Sign JWT
    try {
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .setJti(randomUUID())
        .sign(new TextEncoder().encode(JWT_SECRET));

      // Create session in database
      await createSession(user.id, token);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return { success: false, message: 'Error creating authentication token' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'An error occurred during authentication' };
  }
}

/**
 * Create a session in the database
 */
async function createSession(userId: string, token: string) {
  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create session in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Verify a session token
 */
export async function verifySession(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    // Verify token
    await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || new Date() > session.expiresAt) {
      // Session expired or not found - just delete from database, don't clear cookie here
      await deleteSession(false);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Delete the current session
 * @param clearCookie - Whether to clear the cookie (only set to true in server actions or route handlers)
 */
export async function deleteSession(clearCookie = false) {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    // Delete session from database
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  // Only clear cookie if explicitly requested (in server actions or route handlers)
  if (clearCookie) {
    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'lax',
      path: '/',
    });
  }
}

/**
 * Logout the current user
 * This should only be called from a server action or route handler
 * @deprecated Use the logoutAction from admin/actions.ts instead
 */
export async function logout() {
  await deleteSession(true); // Clear cookie in this server action
  redirect('/admin/login');
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const session = await verifySession();
  return !!session;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
  const session = await verifySession();
  return session?.role === 'admin';
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  return await verifySession();
}

/**
 * Require authentication
 * Redirects to login page if not authenticated
 */
export async function requireAuth() {
  const session = await verifySession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

/**
 * Require admin role
 * Redirects to login page if not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await verifySession();
  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }
  return session;
}

/**
 * Hash a password using bcrypt
 * @param password - The password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
