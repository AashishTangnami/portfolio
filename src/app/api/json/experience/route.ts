import { NextResponse } from 'next/server';

// Sample experience data
const experience = [
  {
    id: 1,
    company: "Direct Global/Direct Co-ops",
    position: "AI Engineer",
    period: "Sep 2023 - Jan 2024",
    url: "",
    responsibilities: [
      "Write modern, Developed a Data Entry Automation application, reducing 50% of manual work.",
      "Adopted POM and Page Factory Architecture to build the application.",
      "Employed best practices in API security, version control, and documentation for enhanced system robustness and maintainability.",
      "Ensured compliance with data regulations, maintaining client data integrity.Utilized performance monitoring tools to drive continuous improvement."
    ]
  },
  {
    id: 2,
    company: "Terakoya Academia Inc",
    position: "Software Engineer",
    period: "Feburary - April 2021",
    url: "",
    responsibilities: [
      "Write modern, performant, maintainable code for a diverse array of client and internal projects",
      "Work with a variety of different languages, platforms, frameworks, and content management systems such as JavaScript, TypeScript, Gatsby, React, Craft, WordPress, Prismic, and Netlify",
      "Led the re-development of a KPI monitoring web-based application, transitioning from VBA to Python, Tornado, AngularJS and Elasticsearch.",
      "Adopted SOLID principles and Agile methodology improving software maintainability.",
      "Conceived and critically evaluated test routines using SonarQube."
    ]
  },
  {
    id: 3,
    company: "Terakoya Academia Inc",
    position: "Software Engineer Intern",
    period: "Feburary - April 2021",
    url: "",
    responsibilities: [
      "Researched, Pioneered and rigorously assessed an innovative coding curriculum for K-12 students, under the mentorship of a senior AI engineer at APPLE and an Infrastructure Engineer in Tokyo.",
      "Successfully implemented the curriculum in two schools in Nepal, resulting feedback from students and teachers alike.",
      "Designed and implemented a pilot web-based application using Django, React and MySQL.",
      "Staged a prototype web-based application on AWS ECS through CI/CD Jenkins pipe.",
      "Interfaced with clients on a weekly basis, providing technological expertise."
    ]
  }
];

export async function GET() {
  return NextResponse.json({ experience });
}
