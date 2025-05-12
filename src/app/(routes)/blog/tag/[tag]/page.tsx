'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/blog/SearchBar';
import TagsList from '@/components/blog/TagsList';

import { formatDate } from '@/lib/utils';

export default function TagPage() {
  const params = useParams();
  const tag = params.tag as string;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all posts
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();

        // Filter posts by tag
        const filteredPosts = data.posts.filter((post: BlogPost) =>
          post.tags?.some(t => t.toLowerCase() === tag.toLowerCase()) || false
        );

        setPosts(filteredPosts);

        // Extract all unique tags
        const tags = new Set<string>();
        data.posts.forEach((post: BlogPost) => {
          post.tags?.forEach(t => tags.add(t));
        });

        setAllTags(Array.from(tags));
      } catch (err) {
        setError('Error loading blog posts. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (tag) {
      fetchPosts();
    }
  }, [tag]);

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
                Posts tagged with "{tag}"
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Browse all blog posts in this category
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <SearchBar className="md:max-w-xs" />
            <div className="md:ml-4 flex gap-4">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ← Back to all posts
              </Link>
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Go to Home
              </Link>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Browse by tag</h2>
              <TagsList tags={allTags} activeTag={tag} />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No blog posts found with tag "{tag}".</p>
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

    </>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
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
        <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map(tag => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase()}`}
              className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tag}
            </Link>
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
