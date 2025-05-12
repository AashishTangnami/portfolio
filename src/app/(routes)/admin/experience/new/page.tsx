'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { useAuth } from '@/hooks/useAuth';

export default function NewExperiencePage() {
  // Use the auth hook to handle authentication
  const { loading, authenticated } = useAuth();

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (loading || !authenticated) {
    return null;
  }

  return (
    <AdminLayout title="Add New Experience">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Add New Experience</h2>
          <ExperienceForm mode="create" />
        </div>
      </div>
    </AdminLayout>
  );
}
