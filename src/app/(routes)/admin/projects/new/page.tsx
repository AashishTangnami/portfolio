'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectForm from '@/components/admin/ProjectForm';
import { useAuth } from '@/hooks/useAuth';

export default function NewProjectPage() {
  // Use the auth hook to handle authentication
  const { loading, authenticated } = useAuth();

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (loading || !authenticated) {
    return null;
  }

  return (
    <AdminLayout title="Create New Project">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <ProjectForm mode="create" />
        </div>
      </div>
    </AdminLayout>
  );
}
