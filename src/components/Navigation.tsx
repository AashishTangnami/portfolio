'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  // State to manage the toggle of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Memoize the isMobile function to prevent unnecessary recalculations
  const isMobile = useCallback(() => window.innerWidth <= 768, []);

  // Function to toggle the menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Memoize handleClickOutside function
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  // Memoize handleScroll function
  const handleScroll = useCallback(() => {
    // Close mobile menu on scroll
    if (isMenuOpen && isMobile()) {
      setIsMenuOpen(false);
    }

    // Add shadow to navbar when scrolled
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('scroll', handleScroll);

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('click', handleClickOutside);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, handleClickOutside, handleScroll]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Navigation links
  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#experience", label: "Experience" },
    { href: "/#projects", label: "Projects" },
    { href: "/#contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
    // { href: "/resume", label: "Resume" }, // Commented out resume page
  ];

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <nav className={`fixed top-0 left-0 z-50 w-full bg-white dark:bg-gray-900 transition-all duration-300 ${
      isScrolled ? 'shadow-md py-4' : 'py-6'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="text-gray-800 dark:text-gray-100 text-xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/"><span>{'< '}</span>A.T<span>{' >'}</span></Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`text-gray-800 dark:text-gray-200 nav-link word-link transition-colors ${
                isActive(link.href) ? 'text-blue-500 dark:text-blue-400' : ''
              } ${link.href === '/resume' ? 'border-l-2 border-gray-300 dark:border-gray-700 pl-6' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-gray-200 focus:outline-none"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ): (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col items-center space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`block py-2 text-gray-800 dark:text-gray-200 text-lg ${
                    isActive(link.href) ? 'text-blue-500 dark:text-blue-400' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
