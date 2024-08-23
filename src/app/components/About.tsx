import Image from 'next/image';

export default function About() {
    const skills = ['Python', 'Pytorch', 'Tensorflow', 'JavaScript (ES6+)', 'Rust','TypeScript', 'NextJS'];

    return (
        <section id="about" className="min-h-[75vh] bg-primary text-black border-b-2 py-24">
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold mb-8">About Me</h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-center mx-auto">
                    <div className="md:w-3/4 ml-8">
                        <p className="mb-4 text-base sm:text-lg md:text-xl leading-relaxed">
                            Hello! I am a data scientist and software engineer. I enjoy problem solving. 
                            I worked as a software engineer for about 2 years, and my interest in AI and Data Science started 
                            when I was trying to solve a problem in my previous company. I have been working on AI and Data Science projects since then.
                        </p>
                        <p className="mb-4 text-base sm:text-lg md:text-xl leading-relaxed">
                            I am passionate about leveraging data to create meaningful insights and drive innovation. My experience spans across 
                            various technologies and platforms, making me a versatile professional in the tech industry.
                        </p>
                        <p className="mt-8 mb-4 text-lg md:text-xl font-semibold">Technologies I love to work with:</p>
                        <ul className="grid grid-cols-2 gap-2 mt-4 list-none text-base sm:text-lg md:text-xl">
                            {skills.map((skill, i) => (
                                <li key={i} className="flex items-center before:content-['>'] before:text-slate-800 before:mr-2">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="md:w-2/5 flex justify-center w-full">
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto">
                            <Image 
                                src="/aashish_tangnami.jpg" 
                                alt="Aashish Tangnami"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="rounded-full absolute transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}