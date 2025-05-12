"use client";

import React from 'react';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import Project from '@/components/sections/Project';
import Intro from '@/components/sections/Intro';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <>
      <main className="bg-primary dark:bg-gray-900">
        <Navigation />
        <Intro />
        <About />
        <Experience />
        <Project />
        <Contact />
      </main>
    </>
  );
}
