export type Skills = {
    skills: string[];
    description: string;
    technologies: string[];
    picture: string;
};

export type ProjectData = {
    id: string | number;
    title: string,
    description: string;
    techStack: string[],
    githubLink: string,
    externalLink: string,
    backgroundImage: string
};

export type ExperienceData = {
    id : string | number;
    company: string;
    position: string;
    period: string;
    url: string;
    responsibilities: string[];
}

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: {
        name: string;
        image?: string;
    };
    tags?: string[];
    publishedAt: string;
    updatedAt?: string;
}
