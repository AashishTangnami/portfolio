/**
 * Script to seed an admin user in the database
 *
 * Usage:
 * node src/scripts/seed-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdminUser() {
  try {
    console.log('Checking if admin user already exists...');

    // Define admin credentials
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminEmail
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists with ID:', existingAdmin.id);
      return;
    }

    // Create admin user
    console.log('Creating admin user...');

    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create the user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Admin User',
        role: 'admin'
      }
    });

    console.log('Admin user created successfully with ID:', adminUser.id);
    console.log('Login credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUser();
