/**
 * Utility script to test password verification with bcrypt
 * This script now connects to the database to verify a user's password
 *
 * Usage:
 * node src/scripts/test-password.js user@example.com yourpassword
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPassword() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Please provide both email and password as arguments');
    console.error('Usage: node src/scripts/test-password.js user@example.com yourpassword');
    process.exit(1);
  }

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`User with email ${email} not found in the database`);
      process.exit(1);
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    console.log('Password verification result:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User found:', !!user);
    console.log('Match:', isMatch);

    if (isMatch) {
      console.log('\nSuccess! The password matches the stored hash for this user.');
    } else {
      console.log('\nFailed! The password does not match the stored hash for this user.');
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
