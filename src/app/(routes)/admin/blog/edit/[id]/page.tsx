'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/blog/ImageUpload';
import TagsList from '@/components/blog/TagsList';
import { useAuth } from '@/hooks/useAuth';
import { slugify } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    image: string;
  };
  tags: string[];
  publishedAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    authorName: '',
    authorImage: '',
    tags: '',
    published: true
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use the auth hook to handle authentication
  const { loading: authLoading, authenticated } = useAuth();

  // Fetch the blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/id/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        setPost(data.post);

        // Initialize form data
        setFormData({
          title: data.post.title,
          excerpt: data.post.excerpt || '',
          content: data.post.content,
          coverImage: data.post.coverImage || '',
          authorName: data.post.author?.name || '',
          authorImage: data.post.author?.image || '',
          tags: data.post.tags?.join(', ') || '',
          published: data.post.published !== false
        });

        setSelectedTags(data.post.tags || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog post. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated && id) {
      fetchPost();
    }
  }, [id, authenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'tags') {
      // Convert comma-separated tags to array
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
      setSelectedTags(tagsArray);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (imageUrl: string, field: 'coverImage' | 'authorImage'): void => {
    setFormData(prev => ({ ...prev, [field]: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate slug from title
      const slug = slugify(formData.title);

      // Prepare the data for submission
      const blogPostData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage || '/blog/placeholder.jpg',
        author: {
          name: formData.authorName || 'Anonymous',
          image: formData.authorImage || '/placeholder-avatar.jpg'
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        published: formData.published
      };

      // Submit the data to the API
      const response = await fetch(`/api/blog/id/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogPostData)
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      // Show success message
      setSuccess('Blog post updated successfully!');

      // Redirect to the blog management page after a delay
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (authLoading || !authenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout title="Edit Blog Post">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Blog post not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog Post">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Edit Blog Post</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {formData.title && (
                <p className="mt-1 text-sm text-gray-500">
                  Slug: {slugify(formData.title)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <input
                type="text"
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                initialImage={formData.coverImage}
                onImageUpload={(imageUrl) => handleImageUpload(imageUrl, 'coverImage')}
                className="col-span-1"
              />

              <div className="col-span-1 space-y-6">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Your Name"
                  />
                </div>

                <ImageUpload
                  initialImage={formData.authorImage}
                  onImageUpload={(imageUrl) => handleImageUpload(imageUrl, 'authorImage')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Next.js, React, Web Development"
              />

              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <TagsList tags={selectedTags} className="mt-2" />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
