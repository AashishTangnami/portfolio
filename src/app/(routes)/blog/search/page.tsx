'use client';

import React, { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      }>
        <SearchPageContent />
      </Suspense>
    </>
  );
}
