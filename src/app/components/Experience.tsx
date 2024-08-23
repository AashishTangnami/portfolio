'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';


export default function Experience(){
  // The following content is dummy data
  const jobs = [
    {
      company: 'Terakoya Academia Inc',
      position: 'Software Engineer',
      range: 'May 2021 - May 2022',
      url : "",
      responsibilities: [
        'Write modern, performant, maintainable code for a diverse array of client and internal projects',
        'Work with a variety of different languages, platforms, frameworks, and content management systems such as JavaScript, TypeScript, Gatsby, React, Craft, WordPress, Prismic, and Netlify',
        'Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis'
      ]
    },
    {
      company: 'Terakoya Academia Inc',
      position: 'Software Engineer Intern',
      period: 'Feburary - April 2021',
      url : "",
      responsibilities: [
        'Worked with a team of three designers to build a marketing website and e-commerce platform for blistabloc, an ambitious startup originating from Northeastern',
        'Helped solidify a brand direction for blistabloc that spans both packaging and web',
        'Interfaced with clients on a weekly basis, providing technological expertise'
      ]
    },
    {
      company: 'Aamzon',
      position: 'Software Engineer Intern',
      period: 'Feburary - April 2021',
      url : "https://www.amzon.com",
      responsibilities: [
        'Worked with a team of three designers to build a marketing website and e-commerce platform for blistabloc, an ambitious startup originating from Northeastern',
        'Helped solidify a brand direction for blistabloc that spans both packaging and web',
        'Interfaced with clients on a weekly basis, providing technological expertise'
      ]
    },
    {
      company: 'Google',
      position: 'Software Engineer Intern',
      period: 'Feburary - April 2021',
      url : "",
      responsibilities: [
        'Worked with a team of three designers to build a marketing website and e-commerce platform for blistabloc, an ambitious startup originating from Northeastern',
        'Helped solidify a brand direction for blistabloc that spans both packaging and web',
        'Interfaced with clients on a weekly basis, providing technological expertise'
      ]
    },
  ];
  
  const [activeTabId, setActiveTabId] = useState(0);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };
  return (
    //min-h-screen flex flex-col items-center justify-center p-8 bg-white max-w-4xl mx-auto
    <section id="experience" className="bg-primary text-black min-h-screen border-b-2 justify-center mx-auto py-24">
      <h2 className="text-3xl font-bold text-center mt-10 mb-8">Where I’ve Worked</h2>

      <div className="flex flex-col md:flex-row">
        <div className="bg-slate-200 w-full min-h-screen text-md md:w-1/3 flex md:flex-col overflow-x-auto md:overflow-x-visible py-10">
          {jobs.map((job, index) => (
            <button
              key={index}
              className={`${
                activeTabId === index
                  ? 'text-green-500 border-green-500'
                  : 'text-gray-500 border-gray-300'
              } py-2 px-4 border-l-4 md:border-l-0 focus:outline-none`}
              onClick={() => setActiveTabId(index)}
            >
              {job.company}
            </button>
          ))}
        </div>

        <div className="w-full md:w-2/3 p-4">
          {jobs.map((job, index) => (
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
                  {job.position}{' '}
                  <span className="text-green-500">
                    @ <a href={job.url} target="_blank" rel="noopener noreferrer">{job.company}</a>
                  </span>
                </h3>
                <p className="text-gray-500">{job.range}</p>
                <ul className="list-disc list-inside mb-4">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="mb-2">
                      {resp}
                    </li>
                  ))}
                </ul>
                
              </div>
            </motion.div>)
          ))}
        </div>
      </div>
    </section>
  );
};
