"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

// Dynamically import FaFilePdf icon to reduce initial bundle size
const FaFilePdf = dynamic(() => import('react-icons/fa').then(mod => mod.FaFilePdf), { ssr: false });

// Animation variants
const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Animation for the back arrow
const arrowVariants = {
  animate: {
    x: ["0%", "-10%", "0%"], // Moves back and forth
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
};
const fileVariants = {
  animate: {
    y: ["0%", "10%", "0%"], // Moves up and down
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop", // Change the repeatType value to one of the valid options: "loop", "reverse", "mirror"
      ease: "easeInOut",
    },
  },
};
export default function ResumePage() {
  const resumeUrl = "/resume.pdf"; // Replace with the actual path to your resume PDF

  return (
    <section id="resume" className="flex flex-col justify-center bg-primary text-black p-4 sm:p-8 min-h-screen">
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full sm:w-auto py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center space-x-2"
        >
          <Link href="/" className="flex items-center space-x-2">
            <motion.div variants={arrowVariants} animate="animate">
              <IoArrowBack className="text-xl" />
            </motion.div>
            <span>Go Back</span>
          </Link>
        </motion.div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="Aashish_Tangnami-(CV).pdf" // Customize the download filename
          className="w-full sm:w-auto py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
        >
        <motion.div variants={fileVariants} animate="animate">
            <FaFilePdf className="mr-2" />
          </motion.div>
          Download PDF
         
        </a>
      </div>

      {/* Resume Preview */}
      <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Resume Preview</h1>
        <div className="w-full h-[calc(100vh-8rem)] border border-gray-200 overflow-hidden"> {/* Adjust height as needed */}
          <PDFViewer url={resumeUrl} />
        </div>
      </div>
    </section>
  );
}

// Integrated PDFViewer component
function PDFViewer({ url }: { url: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading PDF viewer...</div>;
  }

  return (
    <embed
      src={url}
      type="application/pdf"
      width="100%"
      height="100%"
      className="border-none"
    />
  );
}
