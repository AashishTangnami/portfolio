'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    technologies: string[];
    featured: boolean;
    order: number;
  };
  mode: 'create' | 'edit';
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    demoUrl: initialData?.demoUrl || '',
    githubUrl: initialData?.githubUrl || '',
    technologies: initialData?.technologies?.join(', ') || '',
    featured: initialData?.featured || false,
    order: initialData?.order || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse technologies from comma-separated string to array
      const technologies = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(Boolean);

      // Prepare the data for submission
      const projectData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        technologies,
        featured: formData.featured,
        order: formData.order,
      };

      // Submit the data to the API
      const url = mode === 'create'
        ? '/api/projects'
        : `/api/projects/${initialData?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} project`);
      }

      await response.json(); // We don't need the response data

      // Show success message
      setSuccess(`Project ${mode === 'create' ? 'created' : 'updated'} successfully!`);

      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(`Failed to ${mode} project. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
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
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
            Demo URL
          </label>
          <input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
            GitHub URL
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
          Technologies *
        </label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          required
          placeholder="React, TypeScript, Tailwind CSS, etc. (comma-separated)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleNumberChange}
            min={0}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
        </div>

        <div className="flex items-center h-full pt-6">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Featured project (appears on homepage)
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'create' ? 'Creating...' : 'Updating...'
            : mode === 'create' ? 'Create Project' : 'Update Project'
          }
        </button>
      </div>
    </form>
  );
}
