import { NextResponse } from 'next/server';

// Sample project data
const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A personal portfolio website built using Next.Js and TailwindCSS to showcase my projects and skills.",
    techStack: ["Next.Js", "Tailwind CSS", "TypeScript"],
    githubLink: "https://github.com/AashishTangnami/portfolio",
    externalLink: "https://aashishtangnami.vercel.app",
    backgroundImage: ""
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform with user authentication, product catalog, and payment processing.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    githubLink: "https://github.com/username/ecommerce",
    externalLink: "https://example.com",
    backgroundImage: ""
  },
  {
    id: 3,
    title: "AI Image Generator",
    description: "An application that uses machine learning to generate unique images based on text prompts.",
    techStack: ["Python", "TensorFlow", "Flask", "React"],
    githubLink: "https://github.com/username/ai-image-gen",
    externalLink: "https://example.com",
    backgroundImage: ""
  }
];

export async function GET() {
  return NextResponse.json({ projects });
}
