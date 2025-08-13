export type Skills = {
    skills: string[];
    description: string[];
    technologies: string[];
    picture: string;
};

export type ProjectData = {
    id: number;
    title: string,
    description: string;
    techStack: string[],
    githubLink: string,
    externalLink: string,
    backgroundImage: string
};

export type ExperienceData = {
    id : number;
    company: string;
    position: string;
    period: string;
    url: string;
    responsibilities: string[];
    techStack?: string[];
    location?: string;
}
