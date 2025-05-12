/**
 * Script to check if the admin user exists in the database
 * and verify the password hash
 *
 * Usage:
 * node src/scripts/check-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('Checking for admin user in the database...');

    // Define admin credentials
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: {
        email: adminEmail
      }
    });

    if (!adminUser) {
      console.log('Admin user does not exist in the database.');
      console.log('Run the seed script to create the admin user:');
      console.log('npm run seed');
      return;
    }

    console.log('Admin user found:');
    console.log('ID:', adminUser.id);
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('Created at:', adminUser.createdAt);

    // Test password verification
    console.log('\nTesting password verification...');
    const passwordMatch = await bcrypt.compare(adminPassword, adminUser.passwordHash);
    
    if (passwordMatch) {
      console.log('Password verification successful!');
      console.log('The password "admin123" matches the stored hash.');
    } else {
      console.log('Password verification failed!');
      console.log('The password "admin123" does not match the stored hash.');
      console.log('Hash in database:', adminUser.passwordHash);
    }

    // Check for sessions
    console.log('\nChecking for active sessions...');
    const sessions = await prisma.session.findMany({
      where: {
        userId: adminUser.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    if (sessions.length === 0) {
      console.log('No active sessions found for this user.');
    } else {
      console.log(`Found ${sessions.length} sessions:`);
      sessions.forEach((session, index) => {
        console.log(`\nSession ${index + 1}:`);
        console.log('ID:', session.id);
        console.log('Created:', session.createdAt);
        console.log('Expires:', session.expiresAt);
        console.log('Token (first 20 chars):', session.token.substring(0, 20) + '...');
      });
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
