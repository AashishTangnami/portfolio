import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET a single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error in GET /api/blog/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT (update) a blog post
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    const user = await verifySession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content,
        coverImage: body.coverImage || '',
        published: body.published !== false,
        updatedAt: new Date(),
        // Update tags if provided
        tags: body.tags || [],
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Error in PUT /api/blog/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE a blog post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    const user = await verifySession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/blog/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
