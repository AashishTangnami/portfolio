"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, Variants } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

// Dynamically import FaFilePdf icon
const FaFilePdf = dynamic(() => import('react-icons/fa').then(mod => mod.FaFilePdf), { ssr: false });

// Animation variants
const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const arrowVariants: Variants = {
  animate: {
    x: ["0%", "-10%", "0%"],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const fileVariants: Variants = {
  animate: {
    y: ["0%", "10%", "0%"],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function ResumePage() {
  const [isMobile, setIsMobile] = useState(false);
  const resumeUrl = "/";
  // const resumeUrl = "/resume.pdf";

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="resume" className="flex flex-col justify-start bg-primary text-black p-4 sm:p-8 min-h-screen">
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full sm:w-auto"
        >
          <Link href="/#" className="flex items-center justify-center space-x-2 py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-gray-700 transition">
            <motion.div variants={arrowVariants} animate="animate">
              <IoArrowBack className="text-xl" />
            </motion.div>
            <span>Go Back</span>
          </Link>
        </motion.div>

        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full sm:w-auto"
        >
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="Aashish_Tangnami-(CV).pdf"
            className="flex items-center justify-center space-x-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700 transition w-full"
          >
            <motion.div variants={fileVariants} animate="animate">
              <FaFilePdf />
            </motion.div>
            <span>Download PDF</span>
          </a>
        </motion.div>
      </div>

      {/* Resume Preview */}
      <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Resume Preview</h1>
        
        {isMobile ? (
          // Mobile view - Direct download suggestion
          <div className="w-full p-6 bg-gray-100 rounded-lg text-center">
            <p className="mb-4">For the best viewing experience on mobile devices, please download the PDF using the button above.</p>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className="inline-block"
            >
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span>Open PDF in New Tab</span>
              </a>
            </motion.div>
          </div>
        ) : (
          // Desktop view - Embedded PDF
          <div className="w-full h-[calc(100vh-12rem)] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
            <object
              data={resumeUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="w-full h-full flex items-center justify-center">
                <p>
                  Unable to display PDF. Please{' '}
                  <a 
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    download
                  </a>{' '}
                  or view in a new tab.
                </p>
              </div>
            </object>
          </div>
        )}
      </div>
    </section>
  );
}