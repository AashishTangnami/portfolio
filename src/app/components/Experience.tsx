'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExperienceData } from '../utils/type';


export default function Experience(){

  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);

  const [activeTabId, setActiveTabId] = useState(0);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  useEffect(() => {

    fetch('api/json/experience.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      if (data && Array.isArray(data.experience)) {
        setExperienceData(data.experience);
      } else {
        console.warn('Experience data is not in the expected format',);
        setExperienceData([]);
      }
    }).catch(error => console.error('Error loading JSON:', error));
  }, []);

  return (
    //min-h-screen flex flex-col items-center justify-center p-8 bg-white max-w-4xl mx-auto
    <section id="experience" className="bg-primary text-black min-h-screen border-b-2 justify-center mx-auto py-24">
      <h2 className="text-3xl font-bold text-center mt-10 mb-8">Where I’ve Worked</h2>

      <div className="flex flex-col md:flex-row">
        <div className="bg-slate-200 border-l-2 w-full text-md md:w-1/3 flex md:flex-col overflow-x-auto md:overflow-x-visible">
          {experienceData.map((jobs, idx) => (
            
            <button
              key={idx}
              className={`${
                activeTabId === idx
                  ? 'text-green-500 border-green-500'
                  : 'text-gray-500 border-gray-300'
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
            transition={{ duration: 0.005 }}
            >
              <div>
                <h3 className="text-2xl font-semibold">
                  {jobs.position}{' '}
                  <span className="text-green-500">
                    @ <a href={jobs.url} target="_blank" rel="noopener noreferrer">{jobs.company}</a>
                  </span>
                </h3>
                <p className="text-gray-500">{jobs.period}</p>
                <ul className="list-disc list-inside mb-4">
                 
                  {jobs.responsibilities.map((tech, i) => {
                  return (
                    <li key={i} className="mb-2">{tech}</li>
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
