/**
 * Script to check database connection and tables
 * 
 * Usage:
 * node src/scripts/check-database.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Test database connection
    try {
      const databaseUrl = process.env.DATABASE_URL;
      console.log('Database URL:', databaseUrl ? `${databaseUrl.split('@')[0].split(':')[0]}:****@${databaseUrl.split('@')[1]}` : 'Not set');

      // Check if tables exist
      console.log('\nChecking database tables...');
      
      // Check User table
      const userCount = await prisma.user.count();
      console.log(`✅ User table exists with ${userCount} records`);
      
      // Check BlogPost table
      const blogPostCount = await prisma.blogPost.count();
      console.log(`✅ BlogPost table exists with ${blogPostCount} records`);
      
      // Check Tag table
      const tagCount = await prisma.tag.count();
      console.log(`✅ Tag table exists with ${tagCount} records`);
      
      // Check Category table
      const categoryCount = await prisma.category.count();
      console.log(`✅ Category table exists with ${categoryCount} records`);
      
      // Check Project table
      const projectCount = await prisma.project.count();
      console.log(`✅ Project table exists with ${projectCount} records`);
      
      // Check Experience table
      const experienceCount = await prisma.experience.count();
      console.log(`✅ Experience table exists with ${experienceCount} records`);
      
      // Check Session table
      const sessionCount = await prisma.session.count();
      console.log(`✅ Session table exists with ${sessionCount} records`);
      
      console.log('\nDatabase connection and tables check completed successfully!');
      
      // If no blog posts, suggest running the seed script
      if (blogPostCount === 0) {
        console.log('\n⚠️ No blog posts found in the database.');
        console.log('Run the following command to seed some sample blog posts:');
        console.log('npm run seed:blog');
      }
      
      // If no projects, suggest creating some
      if (projectCount === 0) {
        console.log('\n⚠️ No projects found in the database.');
        console.log('Create projects through the admin interface at:');
        console.log('/admin/projects/new');
      }
      
      // If no experience entries, suggest creating some
      if (experienceCount === 0) {
        console.log('\n⚠️ No experience entries found in the database.');
        console.log('Create experience entries through the admin interface at:');
        console.log('/admin/experience/new');
      }
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      console.log('\nPossible solutions:');
      console.log('1. Make sure your database is running (check Docker containers)');
      console.log('2. Verify your DATABASE_URL in the .env file');
      console.log('3. Run migrations if needed: npx prisma migrate dev');
      return;
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
