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
      text: "Aashish,",
      className: "text-blue-500 dark:text-blue-500",
    },
	{
		text: "Data",
		className: "text-blue-500 dark:text-blue-500",
	  },
	  {
		text: "Scientist",
		className: "text-blue-500 dark:text-blue-500",
	  },
  ];
    return (
      <>
      <section id="intro" className="bg-textPrimary text-black min-h-[75vh] py-24 lg:py-24 relative overflow-hidden">
        <div className="bg-grid-white/[0.02] absolute inset-0"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 py-24">
              <div className="flex-1 text-center lg:text-left">
                <TypewriterEffect words={words} className="mb-4 text-xl md:text-2xl lg:text-5xl" />
               
                <p className="text-lg sm:text-sm lg:text-xl max-w-2xl mx-auto lg:mx-0">
                  Welcome to my portfolio! <br></br>
				  I am a dedicated professional in the fields of AI and software engineering, <br></br>
                  committed to delivering high-quality solutions and driving innovation. <br></br>I specialize in <strong>Data Science.</strong>
                </p>
              </div>
              <div className="lg:w-2/5 flex justify-center">
                <motion.div
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src="/aashish_tangnami.jpg"
                    alt="Profile picture"
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1200px) 288px, 320px"
                    className="rounded-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
        </div>
      </section>
    </>
    )
  }
