/**
 * Script to create a custom user in the database
 * 
 * Usage:
 * node src/scripts/create-custom-user.js <email> <password> <name> <role>
 * 
 * Example:
 * node src/scripts/create-custom-user.js myemail@example.com mypassword "My Name" admin
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createCustomUser() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
      console.error('Usage: node src/scripts/create-custom-user.js <email> <password> <name> [role]');
      console.error('Example: node src/scripts/create-custom-user.js myemail@example.com mypassword "My Name" admin');
      process.exit(1);
    }
    
    const email = args[0];
    const password = args[1];
    const name = args[2];
    const role = args[3] || 'admin'; // Default to admin if not specified
    
    console.log('Checking if user already exists...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    
    if (existingUser) {
      console.log('User with this email already exists with ID:', existingUser.id);
      console.log('Please use a different email or update the existing user.');
      return;
    }
    
    // Create user
    console.log('Creating new user...');
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role
      }
    });
    
    console.log('User created successfully with ID:', newUser.id);
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomUser();
