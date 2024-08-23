import { Button } from "./ui/Button";
// src/components/Wrapper.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FloatingDockDemo } from "./floating-nav";

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
    <div>Hire Me</div>
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
  </>
  );
};

export default Contact;