import React from "react";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Intro() {
  const words = [
    {
      text: "Hi!",
    },
    {
      text: "I'm",
    },
    {
      text: "Aashish",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
    return (
    <div className="bg-textPrimary text-black flex flex-col items-center justify-center min-h-[75vh] text-base sm:text-xl md:text-2xl lg:text-3xl py-20 sm:pt-8 md:pt-8 lg:pt-16 bg-grid-white/[0.02] relative overflow-hidden border-cyan-100 rounded-md antialiased">
    <div className="absolute inset-0 z-0 opacity-60"></div>
    <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto text-wrap">
    <TypewriterEffect words={words} />
      <h3 className="text-xl sm:text-3xl md:text-3xl lg:text-5xl font-bold  text-black">
        Data Scientist & <br />
        Software Engineer
      </h3>
      <p className="mt-4 text-xl max-w-lg mx-auto text-black text-wrap">
        Welcome to my portfolio! I am a dedicated professional in the fields of AI and software engineering, 
        committed to delivering high-quality solutions and driving innovation. I specialize in <b>Data Science.</b>
      </p>
      
    </div>
  </div>
 
    )
  }
// -------------------------
