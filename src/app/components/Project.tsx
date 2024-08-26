"use client";

import React, { useEffect, useState } from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ProjectData } from '../utils/type';
import { IconBrandGithub } from '@tabler/icons-react';

export default function Project() {
  const GRID_LIMIT = 6; // Default for larger screens
  const MOBILE_GRID_LIMIT = 4; // Limit for mobile screens
  const [showMore, setShowMore] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [gridLimit, setGridLimit] = useState(GRID_LIMIT); // Default GRID_LIMIT based on screen size

  
  
  useEffect(() => {
    // JSON data is dummy data
    fetch('api/json/project.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Extract the 'projects' array from the data object
        if (data && Array.isArray(data.projects)) {
          setProjectData(data.projects);
        } else {
          console.warn('Projects data is not in the expected format');
          // Optionally set an empty array or handle the error appropriately
          setProjectData([]);
        }
      })
      .catch(error => console.error('Error loading JSON:', error));
  }, []);
  
  useEffect(() => {
    // Function to update grid limit based on window size
    const updateGridLimit = () => {
      if (window.innerWidth <= 640) { // Adjust for mobile screen size
        setGridLimit(MOBILE_GRID_LIMIT);
      } else {
        setGridLimit(GRID_LIMIT);
      }
    };

    // Call the function on initial render
    updateGridLimit();

    // Add event listener to update grid limit on resize
    window.addEventListener('resize', updateGridLimit);

    // Clean up the event listener
    return () => window.removeEventListener('resize', updateGridLimit);
  }, []);

  const projectsToShow = showMore ? projectData : projectData.slice(0, gridLimit);

  return (
    <section id="projects" className="min-h-screen bg-primary flex flex-col items-center test-white px-8 py-24 border-b-2">
      <h2 className="text-3xl font-bold text-textPrimary text-center items-center">Projects<br></br></h2>
      <h3 className="text-2xl font-bold text-textPrimary pb-20">Some of my recent projects</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-2">
        {projectsToShow.map((project, i) => (
          <motion.div
            key={project.id}
            className="relative bg-slate-200 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.005, delay: i * 0.005 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-textPrimary mb-2">{project.title}</h3>
                <div className="flex space-x-5">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <IconBrandGithub className="text-gray-600 dark:text-gray-500 w-6 h-6 hover:text-green-400" />
                    </a>
                  )}
                  {project.externalLink && (
                    <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                      <FaFolderOpen className="text-gray-600 dark:text-gray-500 w-6 h-6 hover:text-green-400" />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <p className="min-h-[200px] bg-slate-200 p-2 rounded-md">
                  {project.description}
                </p>
              </div>
              <div className="mt-4">
                <ul className="flex flex-wrap space-x-2 mt-auto">
                  {project.techStack.map((tech: string, i: number) => (
                    <li key={i} className="text-xs text-textPrimary font-medium">{tech}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projectData.length > gridLimit && (
        <motion.button
          onClick={() => setShowMore(!showMore)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 mb-8 py-2 px-4 bg-green-500 text-textPrimary rounded-lg hover:bg-green-700 transition"
        >
          Show {showMore ? 'Less' : 'More'}
        </motion.button>
      )}
    </section>
  );
}
