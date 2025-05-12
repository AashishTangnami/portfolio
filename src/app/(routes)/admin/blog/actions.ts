'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function deleteBlogPost(id: string) {
  // Verify user is admin
  await requireAdmin();

  try {
    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    // Revalidate the blog posts page
    revalidatePath('/admin/blog');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}

export async function createBlogPost(formData: FormData) {
  // Verify user is admin
  const user = await requireAdmin();

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;
    const coverImage = formData.get('coverImage') as string;
    const published = formData.get('published') === 'true';

    // Validate required fields
    if (!title || !content || !slug) {
      return { success: false, error: 'Title, content, and slug are required' };
    }

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || '',
        slug,
        coverImage: coverImage || '',
        published,
        author: {
          connect: { id: user.id },
        },
      },
    });

    // Revalidate the blog posts page
    revalidatePath('/admin/blog');
    
    // Redirect to the blog post edit page
    redirect(`/admin/blog/${post.id}`);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error: 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  // Verify user is admin
  await requireAdmin();

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const slug = formData.get('slug') as string;
    const coverImage = formData.get('coverImage') as string;
    const published = formData.get('published') === 'true';

    // Validate required fields
    if (!title || !content || !slug) {
      return { success: false, error: 'Title, content, and slug are required' };
    }

    // Update the blog post
    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || '',
        slug,
        coverImage: coverImage || '',
        published,
      },
    });

    // Revalidate the blog posts page and the individual post page
    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${slug}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { success: false, error: 'Failed to update blog post' };
  }
}
