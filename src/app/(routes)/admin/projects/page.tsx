'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
  order: number;
  publishedAt: string;
}

export default function ProjectsAdminPage() {
  const [projects, setProjets] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the auth hook to handle authentication
  const { loading: authLoading, authenticated } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjets(data.projects);
      } catch (err) {
        setError('Error loading projects. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authenticated) {
      fetchProjects();
    }
  }, [authenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Remove the deleted project from the state
      setProjets(projects.filter(project => project.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete project. Please try again.');
    }
  };

  // If loading or not authenticated, show nothing (will redirect in useAuth hook)
  if (authLoading || !authenticated) {
    return null;
  }

  return (
    <AdminLayout title="Manage Projects">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          View, edit, and delete your portfolio projects
        </p>
        <Link
          href="/admin/projects/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Project
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
      ) : projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No projects found.</p>
          <Link
            href="/admin/projects/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technologies
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${project.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {project.featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(project.id)}
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
