// 'use client';

// import { motion } from 'framer-motion';
// import React from 'react';

// const words = [
//   'Data Science', 'Machine Learning', 'AI', 'Python', 
//   'TensorFlow', 'Keras', 'PyTorch', 'Scikit-learn',
//   'React', 'TailwindCSS', 'Next.js', 'JavaScript', 
//   'API', 'MLOps', 'SQL', 'Visualization', 
//   'NLP', 'Computer Vision', 'Deep Learning', 'Neural Networks',
//   'Algorithms', 'Big Data', 'Statistics'
// ];

// // Helper function to generate random values within a range
// const randomValue = (min: number, max: number) => Math.random() * (max - min) + min;


// const getRandomPosition = () => ({
//     x: randomValue(-1000, 1000),
//     y: randomValue(-1000, 1000),
//     z: randomValue(-1000, 1000),
//   });

  

// export default function WordBag() {
//   return (
//     <div className="z-0 relative min-h-screen bg-white">
//     <div className="relative w-full h-full">
//     {words.map((word, index) => (
//         <motion.span
//           key={index}
//           initial={getRandomPosition()}
//           animate={{
//             x: [randomValue(-1000, 1000), randomValue(-1000, 1000)],
//             y: [randomValue(-1000, 1000), randomValue(-1000, 1000)],
//             z: [randomValue(-1000, 1000), randomValue(-1000, 1000)],
//             scale: [1, 1.5, 1],
//             rotate: [0, randomValue(-360, 360)],
//           }}
//           transition={{
//             duration: randomValue(10, 100),
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute text-black-400 opacity-50 text-lg lg:text-2xl"
//           style={{
//             transform: `translateZ(${randomValue(-200, 200)}px)`,
//           }}
//         >
//           {word}
//         </motion.span>
//       ))}
//     </div>
//     </div>
//   );
// }

'use client';

import { motion } from 'framer-motion';
import React from 'react';

const words = [
  'Data Science', 'Machine Learning', 'AI', 'Python', 
  'TensorFlow', 'Keras', 'PyTorch', 'Scikit-learn',
  'React', 'TailwindCSS', 'Next.js', 'JavaScript', 
  'API', 'MLOps', 'SQL', 'Visualization', 
  'NLP', 'Computer Vision', 'Deep Learning', 'Neural Networks',
  'Algorithms', 'Big Data', 'Statistics'
];


const wordCategories = [
    { label: 'Programming Languages', words: ['Python', 'JavaScript'], rating: 8 },
    { label: 'Frameworks', words: ['React', 'Next.js', 'TailwindCSS'], rating: 7 },
    { label: 'Machine Learning', words: ['TensorFlow', 'Keras', 'PyTorch', 'Scikit-learn'], rating: 9 },
    { label: 'AI & Data Science', words: ['AI', 'Data Science', 'Neural Networks', 'Algorithms'], rating: 9 },
    { label: 'Tools', words: ['SQL', 'MLOps', 'Big Data'], rating: 6 }
  ];
// Helper function to generate random values within a range
const randomValue = (min: number, max: number) => Math.random() * (max - min) + min;

const maxBarHeight = 250;

export default function WordBag() {
  return (
    // Experimental code 

    
    // <div className="relative flex justify-around items-end h-[80vh] bg-gray-50 p-10 overflow-hidden">
    //   {wordCategories.map((category, index) => (
    //     <div key={index} className="flex flex-col items-center relative w-16">
    //       <div 
    //         className="bg-blue-500 w-full rounded-t-md relative overflow-hidden"
    //         style={{ height: `${randomValue(200, 500)}px` }} // Random height for each bar
    //       >
    //         {category.words.map((word, idx) => (
    //           <motion.span
    //             key={idx}
    //             className="absolute bottom-0 left-0 right-0 text-white text-xs mb-1"
    //             initial={{ y: '100%' }}
    //             animate={{ y: '-100%' }}
    //             transition={{
    //               duration: randomValue(5, 10), // Varying duration for animation
    //               repeat: Infinity,
    //               ease: "linear",
    //               delay: idx * 0.5, // Staggered animation for words
    //             }}
    //           >
    //             {word}
    //           </motion.span>
    //         ))}
    //       </div>
    //       <span className="mt-2 text-sm">{category.label}</span>
    //     </div>
    //   ))}
    // </div>
    <div className="relative flex justify-around items-end h-[80vh] bg-gray-50 py-20 overflow-hidden">
    {wordCategories.map((category, index) => (
      <div key={index} className="flex flex-col items-center relative w-16">
        <div 
          className="bg-blue-500 w-full rounded-t-md relative overflow-hidden"
          style={{ height: `${(category.rating / 10) * maxBarHeight}px` }} // Height proportional to rating
        >
          {category.words.map((word, idx) => (
            <motion.span
              key={idx}
              className="absolute bottom-0 left-0 right-0 text-white text-xs mb-1"
              initial={{ y: '100' , rotate:90 }}
              animate={{ y: '-100%' }}
              transition={{
                duration: randomValue(5, 10), // Varying duration for animation
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.5, // Staggered animation for words
                repeatDelay: 1
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <span className="mt-2 text-sm">{category.label}</span>
      </div>
    ))}
  </div>
  );
}
