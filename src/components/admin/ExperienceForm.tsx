'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExperienceFormProps {
  initialData?: {
    id?: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    responsibilities: string[];
    url?: string;
    technologies: string[];
    order: number;
  };
  mode: 'create' | 'edit';
}

export default function ExperienceForm({ initialData, mode }: ExperienceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    current: initialData?.current || false,
    description: initialData?.description || '',
    responsibilities: initialData?.responsibilities?.join('\n') || '',
    url: initialData?.url || '',
    technologies: initialData?.technologies?.join(', ') || '',
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
      // Parse responsibilities from newline-separated string to array
      const responsibilities = formData.responsibilities
        .split('\n')
        .map(resp => resp.trim())
        .filter(Boolean);

      // Parse technologies from comma-separated string to array
      const technologies = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(Boolean);

      // Prepare the data for submission
      const experienceData = {
        company: formData.company,
        position: formData.position,
        location: formData.location || undefined,
        startDate: formData.startDate,
        endDate: formData.current ? null : formData.endDate || undefined,
        current: formData.current,
        description: formData.description,
        responsibilities,
        url: formData.url || undefined,
        technologies,
        order: formData.order,
      };

      // Submit the data to the API
      const url = mode === 'create'
        ? '/api/experience'
        : `/api/experience/${initialData?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} experience entry`);
      }

      await response.json(); // We don't need the response data

      // Show success message
      setSuccess(`Experience entry ${mode === 'create' ? 'created' : 'updated'} successfully!`);

      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/experience');
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(`Failed to ${mode} experience entry. Please try again.`);
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
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
          Position *
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date {!formData.current && '*'}
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.current}
            required={!formData.current}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
          />
          <div className="mt-2">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="current" className="ml-2 text-sm text-gray-700">
              I currently work here
            </label>
          </div>
        </div>
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
        <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
          Responsibilities *
        </label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Enter each responsibility on a new line"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Company URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/experience')}
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
            : mode === 'create' ? 'Create Experience' : 'Update Experience'
          }
        </button>
      </div>
    </form>
  );
}
