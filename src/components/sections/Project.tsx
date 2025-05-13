"use client";

import React, { useEffect, useState } from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ProjectData } from '@/types';
import { IconBrandGithub } from '@tabler/icons-react';
import { fetchWithCache } from '@/lib/fetcher';

export default function Project() {
  const GRID_LIMIT = 6; // Default for larger screens
  const MOBILE_GRID_LIMIT = 4; // Limit for mobile screens
  const [showMore, setShowMore] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [gridLimit, setGridLimit] = useState(GRID_LIMIT); // Default GRID_LIMIT based on screen size



  useEffect(() => {
    // Use our optimized fetcher with built-in caching
    const fetchProjects = async () => {
      try {
        // Fetch from real API endpoint with caching
        const data = await fetchWithCache('/api/projects');

        // Extract the 'projects' array from the data object
        if (data && Array.isArray(data.projects)) {
          // Map the database projects to the expected format
          const formattedProjects = data.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            techStack: project.technologies || [],
            githubLink: project.githubUrl || project.githubLink || '',
            externalLink: project.demoUrl || project.externalLink || '',
            backgroundImage: project.imageUrl || project.backgroundImage || ''
          }));

          setProjectData(formattedProjects);
        } else {
          console.warn('Projects data is not in the expected format');
          setProjectData([]);
        }
      } catch (error) {
        console.error('Error loading projects from API:', error);

        try {
          // Fallback to JSON data if API fails
          const fallbackData = await fetchWithCache('/api/json/project.json');

          if (fallbackData && Array.isArray(fallbackData.projects)) {
            console.log('Using fallback JSON data for projects');
            setProjectData(fallbackData.projects);
          } else {
            console.warn('Fallback projects data is not in the expected format');
            setProjectData([]);
          }
        } catch (fallbackError) {
          console.error('Error loading fallback JSON:', fallbackError);
          setProjectData([]);
        }
      }
    };

    fetchProjects();
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

  // Get projects to show based on showMore state
  const projectsToShow = showMore ? projectData : projectData.slice(0, gridLimit);

  return (
    <section id="projects" className="min-h-screen bg-primary dark:bg-gray-900 flex flex-col items-center px-8 py-24 border-b-2 border-gray-200 dark:border-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center items-center">Projects<br></br></h2>
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 pb-20 text-center">Some of my recent projects</h3>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-2">
        {projectsToShow.map((project, i) => (
          <motion.div
            key={project.id}
            className="relative bg-slate-200 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.005, delay: i * 0.005 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-4 min-h-72">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{project.title}</h3>
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
                <p className="bg-slate-200 dark:bg-gray-700 p-2 rounded-md text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
              </div>

            </div>
			<div className="my-auto px-4 py-4">
                <ul className="flex flex-wrap space-x-2 mt-auto">
                  {project.techStack.map((tech: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 font-medium">{tech}</li>
                  ))}
                </ul>
              </div>
          </motion.div>
        ))}
      </div>

      {projectData.length > gridLimit && (
        <motion.button
          onClick={() => setShowMore(!showMore)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 mb-8 py-2 px-4 bg-green-400 dark:bg-green-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-green-500 dark:hover:bg-green-700 transition"
        >
          Show {showMore ? 'Less' : 'More'}
        </motion.button>
      )}
    </section>
  );
}

