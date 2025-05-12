'use client';

import Link from 'next/link';
import { IconBrandGithub, IconBrandLinkedin, IconBrandGmail } from '@tabler/icons-react';

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-gray-900 py-8 px-4 text-black dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and description */}
          <div>
            <div className="text-xl font-bold mb-4">
              <Link href="/">
                <span>{'< '}</span>A.T<span>{' >'}</span>
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Data professional specializing in AI and software engineering, committed to delivering high-quality solutions.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="mailto:tangnamiaashish@gmail.com" aria-label="Email" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <IconBrandGmail className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/aashishtangnami/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <IconBrandLinkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/AashishTangnami" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <IconBrandGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center">
          <small className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Aashish Tangnami. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}