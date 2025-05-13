import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import LogoutButton from './components/LogoutButton';

// Mark this page as dynamic since it uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // This will redirect to login if not authenticated
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">


        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Blog Posts Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Blog Posts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your blog posts, create new ones, or edit existing content.
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/admin/blog"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manage Posts
                  </Link>
                  <Link
                    href="/admin/blog/new"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Post
                  </Link>
                </div>
              </div>
            </div>

            {/* Projects Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your portfolio projects, add new ones, or update existing projects.
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/admin/projects"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manage Projects
                  </Link>
                  <Link
                    href="/admin/projects/new"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your work experience, add new entries, or update existing ones.
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/admin/experience"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manage Experience
                  </Link>
                  <Link
                    href="/admin/experience/new"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Experience
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
