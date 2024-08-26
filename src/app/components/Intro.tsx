import React from "react";
import { TypewriterEffect } from "@/app/components/ui/typewriter-effect";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import Link from "next/link";

export default function Intro() {
  const words = [
    {
      text: "Hi!",
    },
    {
      text: "I'm",
    },
    {
      text: "Bot",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
    return (
    <div className="bg-textPrimary text-black flex flex-col md:flex-row items-center justify-center min-h-[75vh] text-base sm:text-xl md:text-2xl lg:text-3xl py-20 sm:pt-8 md:pt-8 lg:pt-16 bg-grid-white/[0.02] relative overflow-hidden border-cyan-100 rounded-md antialiased">
      <div className="container p-4 sm:p-6 md:p-8 max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto text-wrap flex flex-col md:flex-row items-center">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <TypewriterEffect words={words} />
          <h3 className="text-xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-black">
            Data Scientist & <br />
            Software Engineer
          </h3>
          <p className="mt-4 text-xl max-w-lg mx-auto text-black text-wrap">
            Welcome to my portfolio! I am a dedicated professional in the fields of AI and software engineering,
            committed to delivering high-quality solutions and driving innovation. I specialize in <b>Data Science.</b>
          </p>
        </div>
        <div className="md:w-2/5 flex justify-center w-full">
        <motion.div
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mt-8 md:mt-0 pl-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/aashish_tangnami.jpg"
            alt="picture"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-full"
          />
        </motion.div>
        </div>
      </div>
    </div>
 
    )
  }
