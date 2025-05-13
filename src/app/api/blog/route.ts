import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/blog-service';
import { slugify } from '@/lib/utils';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const posts = await getAllPosts();
    logger.debug(`Retrieved ${posts.length} blog posts from database`);

    return NextResponse.json({ posts });
  } catch (error) {
    logger.error('Error in GET /api/blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

    // Set publishedAt to current date if not provided
    if (!body.publishedAt) {
      body.publishedAt = new Date().toISOString();
    }

    // Create the blog post
    const post = await createPost(body);
    logger.debug('Blog post created successfully');

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
