import React from "react";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Intro() {
  const words = [
    {
      text: "Data",
    },
    {
      text: "& Engineering",
    },
    {
      text: "Machine",
    },
    {
      text: "& Learning",
    },
    {
      text: "Software &",
    },
    {
      text: "Data Scinence",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
    return (
    <div className="bg-textPrimary text-black flex flex-col items-center justify-center min-h-[75vh] text-base sm:text-xl md:text-2xl lg:text-3xl py-20 sm:pt-8 md:pt-8 lg:pt-16 bg-grid-white/[0.02] relative overflow-hidden border-cyan-100 rounded-md antialiased">
    <div className="absolute inset-0 z-0 opacity-60"></div>
    <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto text-center">
    {/* bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold  text-black">
        Data Scientist <br />
        & <br />
        Software Engineer
      </h1>
      <p className="mt-4 text-xl max-w-lg mx-auto text-black ">
        Welcome to my portfolio! I am a dedicated professional in the fields of data science and software engineering, 
        committed to delivering high-quality solutions and driving innovation.
      </p>
      <TypewriterEffect words={words} />
    </div>
  </div>
 
    )
  }
// -------------------------
