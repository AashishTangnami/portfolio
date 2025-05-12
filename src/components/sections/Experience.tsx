'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExperienceData } from '@/types';


export default function Experience(){

  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);

  const [activeTabId, setActiveTabId] = useState(0);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  useEffect(() => {
    // Use a cached version of the data if possible
    const cachedData = sessionStorage.getItem('experienceData');

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setExperienceData(parsedData);
        return; // Skip the fetch if we have cached data
      } catch (e) {
        console.error('Error parsing cached experience data:', e);
        // Continue with fetch if parsing fails
      }
    }

    fetch('/api/experience')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      if (data && Array.isArray(data.experiences)) {
        // Map the database experiences to the expected format
        const formattedExperiences = data.experiences.map((exp: any) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          period: exp.current
            ? `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present`
            : `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
          url: exp.url || '',
          responsibilities: exp.responsibilities || []
        }));
        setExperienceData(formattedExperiences);
        // Cache the data for future use
        sessionStorage.setItem('experienceData', JSON.stringify(formattedExperiences));
      } else {
        console.warn('Experience data is not in the expected format');
        setExperienceData([]);
      }
    }).catch(error => console.error('Error loading experience data:', error));
  }, []);

  return (
    //min-h-screen flex flex-col items-center justify-center p-8 bg-white max-w-4xl mx-auto
    <section id="experience" className="bg-primary dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen border-b-2 border-gray-200 dark:border-gray-800 justify-center mx-auto py-24">
      <h2 className="text-3xl font-bold text-center mt-10 mb-8">Where I’ve Worked</h2>

      <div className="flex flex-col md:flex-row">
        <div className="bg-slate-200 dark:bg-gray-800 border-l-2 border-gray-300 dark:border-gray-700 w-full text-md md:w-1/3 flex md:flex-col overflow-x-auto md:overflow-x-visible">
          {experienceData.map((jobs, idx) => (

            <button
              key={idx}
              className={`${
                activeTabId === idx
                  ? 'text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
              } py-2 px-4 border-l-4 md:border-l-0 focus:outline-none`}
              onClick={() => setActiveTabId(idx)}
            >
              {jobs.company}
            </button>
          ))}
        </div>

        <div className="w-full md:w-2/3 p-4">
          {experienceData.map((jobs, index) => (
            activeTabId === index && (
            <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            >
              <div>
                <h3 className="text-2xl font-semibold">
                  {jobs.position}{' '}
                  <span className="text-blue-500 dark:text-blue-400">
                    @ <a href={jobs.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{jobs.company}</a>
                  </span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{jobs.period}</p>
                <ul className="list-disc list-inside mb-4">

                  {jobs.responsibilities.map((tech, i) => {
                  return (
                    <li key={i} className="mb-2 text-gray-700 dark:text-gray-300">{tech}</li>
                  );
                })}
                </ul>

              </div>
            </motion.div>)
          ))}
        </div>
      </div>
    </section>
  );
};
