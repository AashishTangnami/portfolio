export type Skills = {
    skills: string[];
    description: string;
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
}

export type EducationData = {
    id: number;
    institution: string;
    degree: string;
    field: string;
    period: string;
    location: string;
    achievements: string[];
}

export type PersonalData = {
    name: string;
    title: string;
    location: string;
    phone: string;
    email: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
}
