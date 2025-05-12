/**
 * Script to seed initial blog posts in the database
 *
 * Usage:
 * node src/scripts/seed-blog-posts.js
 */

const { PrismaClient } = require('@prisma/client');

// Define the slugify function directly in this script to avoid import issues
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Sample blog posts data
const blogPosts = [
  {
    title: 'Getting Started with Next.js',
    excerpt: 'Learn the basics of Next.js and how to build your first application.',
    content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering, static site generation, and more.

## Why Next.js?

Next.js provides a great developer experience with features like:

- Server-side rendering
- Static site generation
- API routes
- File-based routing
- Built-in CSS and Sass support
- Fast refresh
- TypeScript support

## Creating a Next.js App

To create a Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Running the Development Server

To start the development server, run:

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 to see your application.
    `,
    coverImage: '/blog/nextjs-cover.jpg',
    tags: ['Next.js', 'React', 'Web Development']
  },
  {
    title: 'Mastering TypeScript with React',
    excerpt: 'Improve your React applications with TypeScript for better type safety and developer experience.',
    content: `
# Mastering TypeScript with React

TypeScript is a powerful tool for React development that provides static type checking.

## Benefits of TypeScript in React

- Catch errors during development
- Better IDE support with autocompletion
- Self-documenting code
- Safer refactoring

## Setting Up TypeScript in a React Project

To create a new React project with TypeScript:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Basic TypeScript Types in React

\`\`\`tsx
// Typing props
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
\`\`\`
    `,
    coverImage: '/blog/typescript-react-cover.jpg',
    tags: ['TypeScript', 'React', 'JavaScript']
  }
];

async function seedBlogPosts() {
  try {
    console.log('Connecting to database...');

    // Check if we have an admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.error('No admin user found. Please run the seed-admin-user.js script first.');
      process.exit(1);
    }

    console.log(`Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Check if we already have blog posts
    const existingPostsCount = await prisma.blogPost.count();
    console.log(`Found ${existingPostsCount} existing blog posts`);

    if (existingPostsCount > 0) {
      console.log('Blog posts already exist. Do you want to add more sample posts? (y/n)');
      // In a real script, we would prompt the user, but for simplicity, we'll just proceed
      console.log('Proceeding with adding more sample posts...');
    }

    // Create blog posts
    for (const postData of blogPosts) {
      const slug = slugify(postData.title);

      // Check if a post with this slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      });

      if (existingPost) {
        console.log(`Post with slug "${slug}" already exists, skipping...`);
        continue;
      }

      // Create tags
      const tagConnections = postData.tags ? {
        connectOrCreate: postData.tags.map(tagName => ({
          where: { name: tagName },
          create: {
            name: tagName,
            slug: slugify(tagName)
          }
        }))
      } : undefined;

      // Create the blog post
      const post = await prisma.blogPost.create({
        data: {
          title: postData.title,
          slug,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          // Connect to the author
          author: {
            connect: { id: adminUser.id }
          },
          // Store legacy author info
          authorName: adminUser.name,
          authorImage: null,
          tags: tagConnections
        },
        include: {
          author: true,
          tags: true
        }
      });

      console.log(`Created blog post: "${post.title}" (${post.slug})`);
    }

    console.log('Blog posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBlogPosts();
