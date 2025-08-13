'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ABOUT_ICON_COMPONENTS } from '@/app/utils/icons';

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

const I = ABOUT_ICON_COMPONENTS; // shorthand

const SKILLS_DATA = {
    programmingLanguages: [
        { name: 'Python', icon: I.python },
        { name: 'JavaScript', icon: I.javascript },
        { name: 'TypeScript', icon: I.typescript },
        { name: 'Rust', icon: I.rust },
        { name: 'R', icon: I.r },
        { name: 'SQL', icon: I.sql },
        { name: 'Java', icon: I.java },
        { name: 'PHP', icon: I.php },
    ],
    databases: [
        { name: 'MongoDB', icon: I.mongodb },
        { name: 'SQLite', icon: I.sqlite },
        { name: 'MySQL', icon: I.mysql },
        { name: 'PostgreSQL', icon: I.postgresql },
        { name: 'Snowflake', icon: I.snowflake },
        { name: 'Amazon Redshift', icon: I.amazonredshift },
    ],
    cloudComputing: [
        { name: 'AWS Glue', icon: I.awsglue },
        { name: 'Amazon S3', icon: I.amazons3 },
        { name: 'AWS Lambda', icon: I.awslambda },
        { name: 'AWS Step Functions', icon: I.awsstepfunctions },
        { name: 'Databricks', icon: I.databricks },
        { name: 'Delta Lake', icon: I.deltalake },
        { name: 'CloudWatch', icon: I.cloudwatch },
        { name: 'AWS DMS', icon: I.awsdms },
        { name: 'Bedrock', icon: I.bedrock },
        { name: 'Snowflake', icon: I.snowflake },
        { name: 'Databricks', icon: I.databricks },
        { name: 'Azure Databricks', icon: I.azuredatabricks },
        { name: 'Azure Data Factory', icon: I.azuredatafactory },
        { name: 'Azure Data Lake Gen2', icon: I.azuredatalakegen2 },
        { name: 'Azure Blob Storage', icon: I.azureblobstorage },
    ],
    orchestrationNetworking: [
        { name: 'Kubernetes', icon: I.kubernetes },
        { name: 'Airflow', icon: I.airflow },
        { name: 'Kafka', icon: I.kafka },
        { name: 'Git', icon: I.git },
        { name: 'GitLab CI/CD', icon: I.gitlabcicd },
        { name: 'Terraform', icon: I.terraform },
        { name: 'Jenkins', icon: I.jenkins },
        { name: 'Elasticsearch', icon: I.elasticsearch },
    ],
    machineLearning: [
        { name: 'PyTorch', icon: I.pytorch },
        { name: 'TensorFlow', icon: I.tensorflow },
        { name: 'Scikit-learn', icon: I.scikitlearn },
        { name: 'Pandas', icon: I.pandas },
        { name: 'NumPy', icon: I.numpy },
        { name: 'Jupyter', icon: I.jupyter },
        { name: 'MLlib', icon: I.mllib },
    ],
};

const ScrollingSkills: React.FC = () => {
    return (
        <div className="w-full space-y-8 py-12 bg-gray-50/50 rounded-xl">
            <SkillRow skills={SKILLS_DATA.programmingLanguages} direction="right" speed={25} />
            <SkillRow skills={SKILLS_DATA.databases} direction="left" speed={25} />
            <SkillRow skills={SKILLS_DATA.cloudComputing} direction="right" speed={23} />
            <SkillRow skills={SKILLS_DATA.orchestrationNetworking} direction="left" speed={23} />
            <SkillRow skills={SKILLS_DATA.machineLearning} direction="right" speed={24} />
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
                            Hello! I am a Data Engineer and Software Engineer with almost 5 years ( and counting ) of experience 
                            in developing scalable, data-driven applications. My work spans Data Engineering and full-stack development,
                            where I’ve consistently delivered performance-optimized systems that solve real-world problems across diverse industries.
                            In 2024, I earned the Ontario College Graduate Certificate in Artificial Intelligence and Data Science with Dean’s List honors,
                            further strengthening my expertise in modern data and AI technologies.
                            
                            
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