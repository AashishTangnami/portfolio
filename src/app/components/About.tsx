import { motion } from 'framer-motion';
import { FaPython, FaDocker, FaGit, FaNodeJs, FaJsSquare, FaGitAlt } from 'react-icons/fa';
import { 
    SiTensorflow, 
    SiPytorch, 
    SiJavascript, 
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
    SiScikitlearn} from 'react-icons/si';


export default function About() {
 // The Design of the About me will be changed
    const skills: { [key: string]: { name: string; icon: JSX.Element }[] } = {
        "Programming Languages": [
            { name: 'Python', icon: <FaPython /> },
            { name: 'JavaScript (ES6+)', icon: <FaJsSquare /> },
            { name: 'Rust', icon: <SiRust /> },
            { name: 'TypeScript', icon: <SiTypescript /> },
            { name: 'R', icon: <SiR /> }
        ],
        "Machine Learning": [
            { name: 'PyTorch', icon: <SiPytorch /> },
            { name: 'TensorFlow', icon: <SiTensorflow /> },
            { name: 'Keras', icon: <SiPytorch /> },
            { name: 'scikit-learn', icon: <SiScikitlearn /> },
          
        ],
        "DevOps": [
            { name: 'Docker', icon: <FaDocker /> },
            { name: 'Kubernetes', icon: <SiKubernetes /> },
            { name: 'CI/CD', icon: <FaGitAlt /> }
        ],
        "Databases": [
            { name: 'SQL', icon: <SiSqlite /> },
            { name: 'NoSQL', icon: <SiMongodb /> },
        ],
        "Data Analysis & Visualization": [
            {name: 'Pandas', icon: <SiPandas />},
            {name: 'Numpy', icon: <SiNumpy />},
            {name: 'Matplotlib', icon: <SiMetasploit />},
            // {name: 'Seaborn', icon: <SiSeaborn />},
            {name: 'Plotly', icon: <SiPlotly />},
    
        ],
        "Frameworks": [
            { name: 'Next.js', icon: <SiNextdotjs /> },
            { name: 'FastAPI', icon: <SiFastapi /> },
            { name: 'Flask', icon: <SiFlask /> },
            { name: 'Jupyter', icon: <SiJupyter /> }
        ]
    };


    return (
        
        <section id="about" className="bg-primary text-black border-b-2 py-20">
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold mb-8">About Me</h2>

                <div className="items-center justify-center mx-auto">
                    <div className="md:w-3/4 ml-8">
                        <p className="mb-4 text-md sm:text-lg md:text-md leading-relaxed">
                            Hello! I am a data scientist and a software engineer. I have almost 2 years of software engineering experience. I got post graduate degree in AI and Data Scinence in 2024. 
                            when I was trying to solve a problem in my previous company. I have been working on AI and Data Science projects since then.
                        </p>
                        <p className="mb-4 text-md sm:text-lg md:text-md leading-relaxed">
                            As a curious, innovative individual and problem-solver, I thrive at the intersection of data and technology. With a passion for uncovering hidden insights and a drive to craft scalable solutions, I&apos;m always ready to dive into the next complex challenge.
                            Armed with a growth mindset and an infectious enthusiasm, I&apos;m dedicated to harnessing the power of data to fuel informed decisions and build cutting-edge software that drives real impact.
                        </p>
                    </div>
                    
                </div>
                <p className="mt-8 mb-4 text-lg md:text-xl font-semibold mx-auto text-center">Technologies I love to work with:</p>
                
                <div className="grid grid-rows-1 xs:grid-cols-2 md:grid-cols-6 gap-8">
                    {Object.keys(skills).map((category, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-4">{category}</h3>
                            <ul className="grid gap-4 list-none text-base sm:text-sm md:text-sm">
                            {skills[category].map((skill, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-center space-x-2 px-2 py-2 bg-slate-200 rounded-md"
                                        whileHover={{ scale: 1.1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 20 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-xl"
                                        >
                                            {skill.icon}
                                        </motion.div>
                                        <span>{skill.name}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
