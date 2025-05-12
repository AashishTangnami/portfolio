/**
 * Utility script to generate a bcrypt hash for a password
 *
 * Usage:
 * node src/scripts/generate-password-hash.js yourpassword
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv[2];

  if (!password) {
    console.error('Please provide a password as an argument');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Password hash:');
    console.log(hash);
    console.log('\nThis hash can be used for creating a user in the database.');
    console.log('To create a user, use the create-custom-user.js script:');
    console.log('node src/scripts/create-custom-user.js user@example.com yourpassword "User Name" admin');
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
}

generateHash();
