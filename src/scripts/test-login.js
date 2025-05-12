/**
 * Script to test the login functionality directly
 *
 * Usage:
 * node src/scripts/test-login.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development_only';
const TOKEN_EXPIRY = '7d'; // 7 days

async function testLogin() {
  try {
    console.log('Testing database connection...');

    // Test database connection
    try {
      const databaseUrl = process.env.DATABASE_URL;
      console.log('Database URL:', databaseUrl ? `${databaseUrl.split('@')[0].split(':')[0]}:****@${databaseUrl.split('@')[1]}` : 'Not set');

      // Try to query the database
      const userCount = await prisma.user.count();
      console.log('Database connection successful!');
      console.log(`Found ${userCount} users in the database`);

      // Check if Session model exists
      console.log('Checking Session model...');
      if (!prisma.session) {
        console.error('Session model is not defined in Prisma client!');
        console.log('Make sure your Prisma schema includes the Session model and you have run prisma generate');
        return;
      }

      const sessionCount = await prisma.session.count();
      console.log(`Found ${sessionCount} sessions in the database`);

    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return;
    }

    console.log('\nTesting login functionality...');

    // Define admin credentials
    const email = 'admin@example.com';
    const password = 'admin123';

    console.log(`Attempting to login with email: ${email}`);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found
    if (!user) {
      console.log('User not found with email:', email);
      return;
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role });

    // Compare password with stored hash
    console.log('Comparing password with hash...');
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      console.log('Password does not match');
      return;
    }

    console.log('Password matches');

    // Create JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Sign JWT
    console.log('Signing JWT with secret length:', JWT_SECRET.length);
    console.log('JWT Secret (first 10 chars):', JWT_SECRET.substring(0, 10) + '...');

    try {
      // Sign with jsonwebtoken for testing
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
        jwtid: crypto.randomUUID(),
      });

      console.log('JWT signed successfully');
      console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

      // Create session in database
      console.log('Creating session in database...');

      // Calculate expiration date (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      console.log('Session created successfully with ID:', session.id);
      console.log('Login test completed successfully!');

    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
    }

  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
