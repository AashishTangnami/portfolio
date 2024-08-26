import { Button } from "./ui/Button";
// src/components/Wrapper.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FloatingDockDemo } from "./floating-nav";
import { FaArrowDown } from "react-icons/fa";
import Footer from "./Footer";

const Contact = () => {
//   const { subtitle, title, paragraphs, link } = contactSection;
  return (
    <>
    <section id="contact" className="min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-black">
    <h2 className="text-4xl font-bold mb-6 text-center">Get In Touch</h2>
    <p className="text-lg text-center mb-8 max-w-xl">
      I’m always open to discussing new opportunities in Data Science and Machine Learning roles. 
      Whether you have a question, a project, want to hire me, or just want to say hi, feel free to reach out.
      I’m always open to discussing new opportunities in Data Science and Machine Learning roles. 
      Whether you have a question, a project, want to hire me, or just want to say hi, feel free to reach out.
    </p>
    <motion.div
      className="flex flex-col items-center justify-center text-center py-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-xl font-bold text-textPrimary mb-4"
        whileHover={{ scale: 1.1 }}
      >
        Hire Me
      </motion.div>

      <motion.div
        className="text-green-500 flex flex-col items-center justify-center"
        animate={{ y: [0, 15, 0] }} // Bouncing animation
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <FaArrowDown size={30} />
        <span className="text-sm mt-2">Contact Me</span>
      </motion.div>
    </motion.div>
    <FloatingDockDemo/>
    
    {/* <div className="block md:hidden">
      <motion.a
        href="mailto:your-email@example.com"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-lg focus:outline-none"
      >
        Contact Me
      </motion.a>
    </div> */}
  </section>
  <Footer/>
  </>
  );
};

export default Contact;