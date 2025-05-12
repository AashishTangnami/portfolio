/**
 * Script to update the admin user in the database
 *
 * Usage:
 * node src/scripts/update-admin-user.js [email] [password] [name]
 *
 * Example:
 * node src/scripts/update-admin-user.js admin@example.com securepassword "Admin User"
 *
 * If no arguments are provided, the script will prompt for input
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

// Create readline interface for prompting user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function updateAdminUser() {
  try {
    // Get credentials from command line arguments or prompt for them
    let email, password, name;

    if (process.argv.length >= 5) {
      // Get from command line arguments
      email = process.argv[2];
      password = process.argv[3];
      name = process.argv[4];
    } else {
      // Prompt for credentials
      console.log('No command line arguments provided. Please enter the admin credentials:');
      email = await prompt('Email: ');
      password = await prompt('Password: ');
      name = await prompt('Name: ');
    }

    // Validate inputs
    if (!email || !password || !name) {
      console.error('Error: Email, password, and name are required');
      rl.close();
      return;
    }

    console.log('Looking for existing admin user...');

    // Find the admin user by role
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });

    if (!adminUser) {
      console.log('No admin user found. Creating a new one...');

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create a new admin user
      const newAdmin = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'admin'
        }
      });

      console.log('New admin user created with ID:', newAdmin.id);
      console.log(`Email: ${email}`);
      console.log('Password: [HIDDEN]');

      rl.close();
      return;
    }

    console.log('Found admin user with ID:', adminUser.id);
    console.log('Current email:', adminUser.email);

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update the admin user
    await prisma.user.update({
      where: {
        id: adminUser.id
      },
      data: {
        email,
        passwordHash,
        name
      }
    });

    console.log('Admin user updated successfully!');
    console.log('New credentials:');
    console.log(`Email: ${email}`);
    console.log('Password: [HIDDEN]');

  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminUser();
