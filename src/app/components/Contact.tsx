import { Button } from "./ui/Button";
// src/components/Wrapper.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingDockDemo } from "./floating-nav";
import { IconMessageChatbot, IconArrowUpCircle } from "@tabler/icons-react";
import Footer from "./Footer";

const Contact = () => {
  return (
    <>
    <section id="contact" className="min-h-screen flex flex-col items-center justify-center p-8 bg-primary text-black">
    <h2 className="text-4xl font-bold mb-6 text-center">Get In Touch</h2>
    <p className="text-lg text-center mb-8 max-w-xl">
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
        className="text-xl font-bold text-textPrimary mb-4 hidden"
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
        <IconMessageChatbot size={30} />
        <span className="text-sm mt-2">Hi!</span>
      </motion.div>
    </motion.div>
    <FloatingDockDemo/>
  </section>
  <Footer/>
  </>
  );
};

export default Contact;