'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Blog Posts', href: '/admin/blog' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Experience', href: '/admin/experience' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t">
            <Link
              href="/"
              className="block px-4 py-2 text-left text-blue-600 hover:bg-gray-100 rounded-md mb-2"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
