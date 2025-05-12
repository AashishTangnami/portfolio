import { BlogPost } from '@/types';
import { prisma } from './prisma';
import { slugify } from './utils';

// New types for database-based blog posts
export interface BlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: string;
  tags?: string[];
  categories?: string[];
}

export interface BlogPostUpdateInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  categories?: string[];
}

// Sample blog posts data (for fallback when database is not available)
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
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
    author: {
      name: 'Aashish Tangnami',
      image: '/aashish_tangnami.jpg'
    },
    tags: ['Next.js', 'React', 'Web Development'],
    publishedAt: '2023-05-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Mastering TypeScript with React',
    slug: 'mastering-typescript-with-react',
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
    author: {
      name: 'Aashish Tangnami',
      image: '/aashish_tangnami.jpg'
    },
    tags: ['TypeScript', 'React', 'JavaScript'],
    publishedAt: '2023-06-22T14:30:00Z'
  }
];

/**
 * Convert a Prisma BlogPost to our application BlogPost type
 */
function convertPrismaBlogPost(post: any): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || '',
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
    author: {
      // Use author relation if available, fall back to authorName/authorImage fields
      name: post.author?.name || post.authorName || 'Unknown Author',
      image: post.authorImage || '/placeholder-avatar.jpg'
    },
    tags: post.tags?.map((tag: any) => tag.name) || []
  };
}

/**
 * Get all blog posts
 * @returns Array of blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true,
        categories: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return posts.map(convertPrismaBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts from database:', error);
    // Fallback to sample data if database is not available
    return [...blogPosts].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

/**
 * Get a blog post by slug
 * @param slug - The slug of the blog post
 * @returns The blog post or null if not found
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true,
        categories: true,
      },
    });

    if (!post) return null;

    return convertPrismaBlogPost(post);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug} from database:`, error);
    // Fallback to sample data if database is not available
    return blogPosts.find(post => post.slug === slug) || null;
  }
}

/**
 * Create a new blog post
 * @param data - The blog post data (old format)
 * @returns The created blog post
 */
export async function createPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  try {
    const { tags, author, ...postData } = data;

    // Get the first admin user as the author if no authorId is provided
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      throw new Error('No admin user found to assign as author');
    }

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        // Store the legacy author info for backward compatibility
        authorName: author.name,
        authorImage: author.image,
        // Connect to the author user
        author: {
          connect: { id: adminUser.id }
        },
        tags: tags ? {
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag, slug: slugify(tag) },
          })),
        } : undefined,
      },
      include: {
        author: true,
        tags: true,
        categories: true,
      },
    });

    return convertPrismaBlogPost(post);
  } catch (error) {
    console.error('Error creating blog post in database:', error);
    // Fallback to in-memory storage if database is not available
    const newPost: BlogPost = {
      id: (blogPosts.length + 1).toString(),
      ...data,
    };

    blogPosts.push(newPost);
    return newPost;
  }
}

/**
 * Create a new blog post with the new database schema
 * @param data - The blog post data with authorId
 * @returns The created blog post
 */
export async function createBlogPost(data: BlogPostInput): Promise<BlogPost> {
  try {
    // Generate slug from title
    const slug = slugify(data.title);

    // Process tags
    const tagConnections = data.tags ? {
      connectOrCreate: data.tags.map(tagName => ({
        where: { name: tagName },
        create: {
          name: tagName,
          slug: slugify(tagName)
        }
      }))
    } : undefined;

    // Process categories
    const categoryConnections = data.categories ? {
      connectOrCreate: data.categories.map(categoryName => ({
        where: { name: categoryName },
        create: {
          name: categoryName,
          slug: slugify(categoryName)
        }
      }))
    } : undefined;

    // Get author info for legacy fields
    const author = await prisma.user.findUnique({
      where: { id: data.authorId }
    });

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        // Connect to the author
        author: {
          connect: { id: data.authorId }
        },
        // Store legacy author info
        authorName: author?.name || 'Unknown',
        authorImage: null,
        tags: tagConnections,
        categories: categoryConnections
      },
      include: {
        author: true,
        tags: true,
        categories: true
      }
    });

    return convertPrismaBlogPost(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Update a blog post
 * @param id - The ID of the blog post to update
 * @param data - The updated blog post data
 * @returns The updated blog post
 */
export async function updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const { tags, author, ...postData } = data;

    const post = await prisma.blogPost.update({
      where: {
        id,
      },
      data: {
        ...postData,
        authorName: author?.name,
        authorImage: author?.image,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag, slug: slugify(tag) },
          })),
        } : undefined,
      },
      include: {
        author: true,
        tags: true,
        categories: true,
      },
    });

    return convertPrismaBlogPost(post);
  } catch (error) {
    console.error(`Error updating blog post with ID ${id} in database:`, error);
    // Fallback to in-memory storage if database is not available
    const index = blogPosts.findIndex(post => post.id === id);
    if (index === -1) return null;

    blogPosts[index] = { ...blogPosts[index], ...data };
    return blogPosts[index];
  }
}

/**
 * Update a blog post with the new database schema
 * @param id - The ID of the blog post to update
 * @param data - The updated blog post data
 * @returns The updated blog post
 */
export async function updateBlogPost(id: string, data: BlogPostUpdateInput): Promise<BlogPost | null> {
  try {
    // Generate slug if title is provided
    const slug = data.title ? slugify(data.title) : undefined;

    // Process tags if provided
    const tagConnections = data.tags ? {
      set: [], // Clear existing connections
      connectOrCreate: data.tags.map(tagName => ({
        where: { name: tagName },
        create: {
          name: tagName,
          slug: slugify(tagName)
        }
      }))
    } : undefined;

    // Process categories if provided
    const categoryConnections = data.categories ? {
      set: [], // Clear existing connections
      connectOrCreate: data.categories.map(categoryName => ({
        where: { name: categoryName },
        create: {
          name: categoryName,
          slug: slugify(categoryName)
        }
      }))
    } : undefined;

    // Update the blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        updatedAt: new Date(),
        tags: tagConnections,
        categories: categoryConnections
      },
      include: {
        author: true,
        tags: true,
        categories: true
      }
    });

    return convertPrismaBlogPost(post);
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a blog post
 * @param id - The ID of the blog post to delete
 * @returns True if the post was deleted, false otherwise
 */
export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({
      where: {
        id,
      },
    });

    return true;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id} from database:`, error);
    // Fallback to in-memory storage if database is not available
    const index = blogPosts.findIndex(post => post.id === id);
    if (index === -1) return false;

    blogPosts.splice(index, 1);
    return true;
  }
}

/**
 * Search for blog posts
 * @param query - The search query
 * @returns Array of matching blog posts
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        author: true,
        tags: true,
        categories: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return posts.map(convertPrismaBlogPost);
  } catch (error) {
    console.error(`Error searching blog posts with query "${query}" in database:`, error);
    // Fallback to in-memory storage if database is not available
    const lowercaseQuery = query.toLowerCase();
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

/**
 * Get all users who can be authors (admin users)
 * @returns Array of users
 */
export async function getAuthors() {
  try {
    const authors = await prisma.user.findMany({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}
