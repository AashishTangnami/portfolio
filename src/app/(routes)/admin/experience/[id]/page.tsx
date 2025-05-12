'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { useAuth } from '@/hooks/useAuth';

interface Experience {
  id: string;
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
}

export default function EditExperiencePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);

  // Use the auth hook to handle authentication
  const { loading: authLoading, authenticated } = useAuth();

  // Fetch the experience data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/experience/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch experience entry');
        }
        const data = await response.json();
        setExperience(data.experience);
      } catch (err) {
        console.error(err);
        setError('Failed to load experience entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated && id) {
      fetchExperience();
    }
  }, [id, authenticated]);

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (authLoading || !authenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <AdminLayout title="Edit Experience">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!experience) {
    return (
      <AdminLayout title="Edit Experience">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Experience entry not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Experience">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Edit Experience</h2>
          <ExperienceForm initialData={experience} mode="edit" />
        </div>
      </div>
    </AdminLayout>
  );
}
