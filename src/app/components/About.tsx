'use client';

import React from 'react';
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
    return (
        <div className="flex overflow-hidden w-full py-4">
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                // whileHover={{ x: 0 }}
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: "loop"
                }}
            >
                {[...skills, ...skills].map((skill, index) => (
                    <div
                        key={`${skill.name}-${index}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
                    >
                        <skill.icon className="text-2xl text-blue-600" />
                        <span className="text-sm font-medium">{skill.name}</span>
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
    return (
        <div className="w-full space-y-8 py-12 bg-gray-50/50 rounded-xl">
            <SkillRow skills={SKILLS_DATA.row1} direction="right" speed={25} />
            <SkillRow skills={SKILLS_DATA.row2} direction="left" speed={20} />
            <SkillRow skills={SKILLS_DATA.row3} direction="right" speed={25} />
        </div>
    );
};

export default function About() {
    return (
        <section 
            id="about" 
            className="bg-primary text-black border-b-2 py-20"
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
                        <p className="text-md sm:text-lg md:text-md leading-relaxed">
                            Hello! I am a Data Engineer and Software Engineer with nearly 3 years of experience 
                            in developing scalable, data-driven applications. In 2024, I earned the Ontario College 
                            Graduate Certificate in Artificial Intelligence and Data Science nominated in Dean&apos;s List. 
                            Throughout my career, I have contributed to AI, Data Engineering, and software projects, 
                            solving real-world problems and optimizing performance for various industries.
                        </p>
                        <p className="text-md sm:text-lg md:text-md leading-relaxed">
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
                    <h3 className="text-lg md:text-xl font-semibold text-center mb-8">
                        Technologies I work with:
                    </h3>
                    <ScrollingSkills />
                </motion.div>
            </div>
        </section>
    );
}