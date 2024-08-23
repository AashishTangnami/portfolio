"use client";

import React, { useState, useEffect } from 'react';
import About from '@/app/components/About';
import Experience from '@/app/components/Experience';
import Contact from '@/app/components/Contact';
import Project from '@/app/components/Project';
import Intro from '@/app/components/Intro';
import Blog from './components/Blog';

export default function Home() {

  // State to manage the toggle of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  }
  const handleClickOutside = (e: MouseEvent) => {
    if ((e.target as Element).closest('.menu-container') === null && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);
  
  const handleScroll = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = ''; // Allow scrolling
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
    <main>
    <nav className="fixed top-0 left-0 z-50 w-full bg-white p-8">
    <div className="container mx-auto flex justify-between items-center">
    {/* <!-- Logo --> */}
    <div className="text-black text-xl font-bold">
      <a href="#">Logo</a>
    </div>
    
    {/* <!-- Navigation Links (Hidden on mobile) --> */}
    <div className="hidden md:flex gap-10 ">
      <a href="#about" className="text-black nav-link word-link">About</a>
      <a href="#experience" className="text-black nav-link word-link">Experience</a>
      <a href="#projects" className="text-black nav-link word-link">Projects</a>
      <a href="#contact" className="text-black nav-link word-link">Contact</a>
    </div>
    
    {/* <!-- Hamburger Icon (Visible on mobile) --> */}
    <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-primary focus:outline-none"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ): (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )
            }
            
          </button>
        </div>
      </div>
  
  {/* <!-- Mobile Menu (Initially Hidden) --> */}
  {isMenuOpen && (
    <>
        <div className="min-h-screen md:hidden flex flex-col items-center space-y-2 mt-4">
          <a href="#about" className="block py-2 text-black nav-link word-link ">About</a>
          <a href="#experience" className="block py-2 text-black nav-link word-link">Experience</a>
          <a href="#projects" className="block py-2 text-black nav-link word-link">Projects</a>
          <a href="#contact" className="block py-2 text-black nav-link word-link">Contact</a>
        </div>
      </>
      )}
    </nav>


  <Intro/>
  <About/>
  <Experience/>
  <Project/>
  <Blog/>
  <Contact/>
  
  </main>
  </> 
  );
}


