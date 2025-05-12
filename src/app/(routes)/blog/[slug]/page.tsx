'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import Navigation from '@/components/Navigation';
import TagsList from '@/components/blog/TagsList';

import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError('Error loading blog post. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <div className="flex gap-4">
            <Link href="/blog" className="text-blue-500 hover:underline">
              Return to blog
            </Link>
            <Link href="/" className="text-blue-500 hover:underline">
              Go to Home
            </Link>
          </div>
        </div>

      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-24 sm:px-6">
        <article>
          {/* Navigation links */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to blog
            </Link>

            <Link
              href="/"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Home
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={post.author.image || '/placeholder-avatar.jpg'}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              </div>
            </div>

            <TagsList
              tags={post.tags}
              className="mb-6"
            />
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="relative h-80 w-full mb-10 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to all posts
                </Link>

                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Home
                </Link>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Share:</span>
                <div className="flex space-x-2">
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-gray-400 hover:text-blue-500"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-gray-400 hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

    </>
  );
}
