'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { BlogPost } from '@/types';
import SearchBar from '@/components/blog/SearchBar';
import TagsList from '@/components/blog/TagsList';

import { formatDate } from '@/lib/utils';
import logger from '@/lib/logger';

export default function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        logger.debug('Fetching blog posts...');
        const response = await fetch('/api/blog');

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        logger.debug('Blog posts fetched successfully');

        if (data.posts && Array.isArray(data.posts)) {
          logger.debug(`Found ${data.posts.length} blog posts`);
          setPosts(data.posts);
        } else {
          logger.warn('No posts array in response or posts is not an array');
          setPosts([]);
        }
      } catch (err) {
        setError('Error loading blog posts. Please try again later.');
        logger.error('Error fetching blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              The latest blog posts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Thoughts, ideas, and insights on web development and technology.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              Back to Home
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
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-slate-200 dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <time dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {post.coverImage && (
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative h-48 md:h-full w-full rounded-md overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className={`${post.coverImage ? 'md:w-3/4' : 'w-full'}`}>
          <Link href={`/blog/${post.slug}`} className="group">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <div className="flex-shrink-0 relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.image || '/placeholder-avatar.jpg'}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{post.author.name}</span>
            </div>

            <div className="flex items-center space-x-4">
              <TagsList
                tags={post.tags}
                linkClassName="text-xs"
              />

              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
