import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Types
export interface UserInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

/**
 * Get all users
 * @returns Array of users
 */
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get a user by ID
 * @param id - The ID of the user
 * @returns The user or null if not found
 */
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get a user by email
 * @param email - The email of the user
 * @returns The user or null if not found
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
}

/**
 * Create a new user
 * @param data - The user data
 * @returns The created user
 */
export async function createUser(data: UserInput) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role || 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update a user
 * @param id - The ID of the user to update
 * @param data - The updated user data
 * @returns The updated user
 */
export async function updateUser(id: string, data: UserUpdateInput) {
  try {
    // Hash the password if provided
    const passwordHash = data.password 
      ? await bcrypt.hash(data.password, 10) 
      : undefined;
    
    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return user;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a user
 * @param id - The ID of the user to delete
 * @returns The deleted user
 */
export async function deleteUser(id: string) {
  try {
    // Check if this is the last admin user
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    });
    
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });
    
    // Prevent deleting the last admin
    if (adminCount <= 1 && userToDelete?.role === 'admin') {
      throw new Error('Cannot delete the last admin user');
    }
    
    // Delete the user
    const user = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    return user;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Verify a user's password
 * @param email - The user's email
 * @param password - The password to verify
 * @returns Whether the password is valid
 */
export async function verifyPassword(email: string, password: string) {
  try {
    // Get the user with the password hash
    const user = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true }
    });
    
    if (!user) {
      return false;
    }
    
    // Verify the password
    return bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.error(`Error verifying password for user with email ${email}:`, error);
    throw error;
  }
}
