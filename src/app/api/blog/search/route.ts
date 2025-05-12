import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/blog-service';

export async function GET(request: Request) {
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Search for blog posts
    const posts = await searchPosts(query);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in GET /api/blog/search:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}
