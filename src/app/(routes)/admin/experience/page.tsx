'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  order: number;
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the auth hook to handle authentication
  const { loading: authLoading, authenticated } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experience');
        if (!response.ok) {
          throw new Error('Failed to fetch experience entries');
        }
        const data = await response.json();
        setExperiences(data.experiences);
      } catch (err) {
        setError('Error loading experience entries. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated) {
      fetchExperiences();
    }
  }, [authenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience entry');
      }

      // Remove the deleted experience from the state
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete experience entry. Please try again.');
    }
  };

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (authLoading || !authenticated) {
    return null;
  }

  return (
    <AdminLayout title="Manage Experience">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          View, edit, and delete your work experience
        </p>
        <Link
          href="/admin/experience/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Experience
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No experience entries found.</p>
          <Link
            href="/admin/experience/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add your first experience entry
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experiences.map((experience) => (
                <tr key={experience.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{experience.company}</div>
                    {experience.location && (
                      <div className="text-sm text-gray-500">{experience.location}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{experience.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(experience.startDate, 'MMM yyyy')} - {experience.current ? 'Present' : (experience.endDate ? formatDate(experience.endDate, 'MMM yyyy') : 'N/A')}
                    </div>
                    {experience.current && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/experience/${experience.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(experience.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
