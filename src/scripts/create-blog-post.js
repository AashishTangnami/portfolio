/**
 * Script to create a single blog post in the database
 *
 * Usage:
 * node src/scripts/create-blog-post.js
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

async function createBlogPost() {
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

    // Create a blog post
    const title = "Building a Portfolio with Next.js and Tailwind CSS";
    const slug = slugify(title);

    // Check if a post with this slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existingPost) {
      console.log(`Post with slug "${slug}" already exists, skipping...`);
      process.exit(0);
    }

    // Create tags
    const tags = ['Next.js', 'Tailwind CSS', 'Portfolio', 'Web Development'];
    const tagConnections = {
      connectOrCreate: tags.map(tagName => ({
        where: { name: tagName },
        create: {
          name: tagName,
          slug: slugify(tagName)
        }
      }))
    };

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: "Learn how to build a professional portfolio website using Next.js and Tailwind CSS.",
        content: `
# Building a Portfolio with Next.js and Tailwind CSS

A portfolio website is essential for showcasing your work and skills to potential employers or clients. In this post, we'll explore how to build a professional portfolio using Next.js and Tailwind CSS.

## Why Next.js?

Next.js is a React framework that provides features like server-side rendering, static site generation, and API routes. These features make it perfect for building a portfolio website that is fast, SEO-friendly, and easy to maintain.

## Why Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.

## Getting Started

To create a new Next.js app with Tailwind CSS, you can use the following command:

\`\`\`bash
npx create-next-app@latest my-portfolio --typescript --tailwind
\`\`\`

## Building the Portfolio

Here are the key components you'll need for your portfolio:

1. **Header/Navigation**: A clean navigation bar with links to different sections
2. **Hero Section**: An introduction to who you are and what you do
3. **Projects Section**: Showcase your best work with descriptions and links
4. **Experience Section**: List your work experience and skills
5. **Contact Section**: Provide ways for visitors to get in touch with you

## Deployment

Once your portfolio is ready, you can deploy it to Vercel with a single command:

\`\`\`bash
npx vercel
\`\`\`

## Conclusion

Building a portfolio with Next.js and Tailwind CSS is a great way to showcase your skills and projects. The combination of these technologies allows you to create a fast, responsive, and visually appealing website.
        `,
        coverImage: '/blog/portfolio-cover.jpg',
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
    console.log('Blog post created successfully!');
  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBlogPost();
