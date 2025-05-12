'use client';

import React from 'react';
import Link from 'next/link';

interface TagsListProps {
  tags?: string[];
  className?: string;
  linkClassName?: string;
  activeTag?: string;
}

export default function TagsList({
  tags = [],
  className = '',
  linkClassName = '',
  activeTag = ''
}: TagsListProps) {
  // Ensure tags is always an array
  const tagsArray = Array.isArray(tags) ? tags : [];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tagsArray.map(tag => {
        const isActive = activeTag.toLowerCase() === tag.toLowerCase();
        const baseClasses = "px-3 py-1 rounded-full text-sm transition-colors duration-200";
        const activeClasses = isActive
          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium"
          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500";

        return (
          <Link
            key={tag}
            href={`/blog/tag/${tag.toLowerCase()}`}
            className={`${baseClasses} ${activeClasses} ${linkClassName}`}
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
