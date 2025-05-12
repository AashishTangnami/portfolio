'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPython, FaDocker, FaJsSquare, FaGitAlt } from 'react-icons/fa';
import {
    SiTensorflow,
    SiPytorch,
    SiRust,
    SiTypescript,
    SiNextdotjs,
    SiMongodb,
    SiKubernetes,
    SiNumpy,
    SiFastapi,
    SiFlask,
    SiJupyter,
    SiSqlite,
    SiR,
    SiPandas,
    SiMetasploit,
    SiPlotly,
    SiScikitlearn
} from 'react-icons/si';

interface Skill {
    name: string;
    icon: React.ElementType;
}

interface SkillRowProps {
    skills: Skill[];
    direction?: 'left' | 'right';
    speed?: number;
}

const SkillRow: React.FC<SkillRowProps> = ({ skills, direction = 'left', speed = 50 }) => {
    // Use useState and useEffect to control animation based on visibility
    const [isVisible, setIsVisible] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1 }
        );

        if (rowRef.current) {
            observer.observe(rowRef.current);
        }

        return () => {
            if (rowRef.current) {
                observer.unobserve(rowRef.current);
            }
        };
    }, []);

    return (
        <div ref={rowRef} className="flex overflow-hidden w-full py-4">
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={isVisible ? {
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                } : { x: 0 }}
                transition={isVisible ? {
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: "loop"
                } : {}}
            >
                {[...skills, ...skills].map((skill, index) => (
                    <div
                        key={`${skill.name}-${index}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                        <skill.icon className="text-2xl text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const SKILLS_DATA = {
    row1: [
        { name: 'Python', icon: FaPython },
        { name: 'JavaScript', icon: FaJsSquare },
        { name: 'TypeScript', icon: SiTypescript },
        { name: 'Rust', icon: SiRust },
        { name: 'R', icon: SiR },
        { name: 'Next.js', icon: SiNextdotjs },
        { name: 'FastAPI', icon: SiFastapi },
        { name: 'Flask', icon: SiFlask }
    ],
    row2: [
        { name: 'PyTorch', icon: SiPytorch },
        { name: 'TensorFlow', icon: SiTensorflow },
        { name: 'Scikit-learn', icon: SiScikitlearn },
        { name: 'Pandas', icon: SiPandas },
        { name: 'NumPy', icon: SiNumpy },
        { name: 'Jupyter', icon: SiJupyter },
        { name: 'Plotly', icon: SiPlotly },
        { name: 'Matplotlib', icon: SiMetasploit }
    ],
    row3: [
        { name: 'Docker', icon: FaDocker },
        { name: 'Kubernetes', icon: SiKubernetes },
        { name: 'Git', icon: FaGitAlt },
        { name: 'MongoDB', icon: SiMongodb },
        { name: 'SQLite', icon: SiSqlite },
        { name: 'Kubernetes', icon: SiKubernetes },
        { name: 'Git', icon: FaGitAlt },
        { name: 'MongoDB', icon: SiMongodb },
        { name: 'SQLite', icon: SiSqlite }
    ]
};

const ScrollingSkills: React.FC = () => {
    // Memoize the component to prevent unnecessary re-renders
    const MemoizedSkillRow = React.memo(SkillRow);

    return (
        <div className="w-full space-y-8 py-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
            <MemoizedSkillRow skills={SKILLS_DATA.row1} direction="right" speed={40} />
            <MemoizedSkillRow skills={SKILLS_DATA.row2} direction="left" speed={35} />
            <MemoizedSkillRow skills={SKILLS_DATA.row3} direction="right" speed={40} />
        </div>
    );
};

export default function About() {
    return (
        <section
            id="about"
            className="bg-primary dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-800 py-20"
            aria-label="About Me Section"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold mb-12">
                    About Me
                </h2>

                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <p className="text-md sm:text-lg md:text-md leading-relaxed text-gray-700 dark:text-gray-300">
                            Hello! I am a Data Engineer and Software Engineer with nearly 3 years of experience
                            in developing scalable, data-driven applications. In 2024, I earned the Ontario College
                            Graduate Certificate in Artificial Intelligence and Data Science nominated in Dean&apos;s List.
                            Throughout my career, I have contributed to AI, Data Engineering, and software projects,
                            solving real-world problems and optimizing performance for various industries.
                        </p>
                        <p className="text-md sm:text-lg md:text-md leading-relaxed text-gray-700 dark:text-gray-300">
                            I am passionate about leveraging data and technology to uncover insights and build
                            innovative, scalable solutions. With a growth mindset and enthusiasm for solving
                            complex challenges, I am committed to using data to drive impact through cutting-edge
                            software development and informed decision-making.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-lg md:text-xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">
                        Technologies I work with:
                    </h3>
                    <ScrollingSkills />
                </motion.div>
            </div>
        </section>
    );
}