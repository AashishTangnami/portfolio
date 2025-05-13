'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import SearchBar from '@/components/blog/SearchBar';

import { formatDate } from '@/lib/utils';
import logger from '@/lib/logger';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        logger.debug(`Searching for blog posts with query: ${query}`);
        const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        logger.debug(`Found ${data.posts?.length || 0} search results`);
        setPosts(data.posts);
      } catch (err) {
        setError('Error loading search results. Please try again later.');
        logger.error('Error fetching search results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {query ? `Search results for "${query}"` : 'Search blog posts'}
          </h1>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
              ← Back to blog
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Go to Home
            </Link>
          </div>
        </div>
        <SearchBar className="max-w-xl" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10">
          {query ? (
            <p className="text-gray-500">No blog posts found matching &quot;{query}&quot;.</p>
          ) : (
            <p className="text-gray-500">Enter a search term to find blog posts.</p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Found {posts.length} result{posts.length !== 1 ? 's' : ''}</p>
          <div className="space-y-16">
            {posts.map((post) => (
              <SearchResultCard key={post.id} post={post} query={query} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function SearchResultCard({ post, query }: { post: BlogPost; query: string }) {
  // Highlight the search query in the excerpt
  const highlightedExcerpt = getHighlightedText(post.excerpt, query);

  return (
    <article className="border-b border-gray-100 dark:border-gray-800 pb-10">
      <div className="mb-4">
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <Link href={`/blog/${post.slug}`} className="group">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-3">
            {post.title}
          </h2>
        </Link>
        <div className="text-gray-600 dark:text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: highlightedExcerpt }} />

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-shrink-0 relative h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image
            src={post.author.image || '/placeholder-avatar.jpg'}
            alt={post.author.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.author.name}</span>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/blog/${post.slug}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}

// Helper function to highlight search query in text
function getHighlightedText(text: string, query: string): string {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return parts.map((part) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-yellow-200 dark:bg-yellow-600 text-gray-800 dark:text-gray-100 px-1 rounded">${part}</mark>`
      : part
  ).join('');
}
