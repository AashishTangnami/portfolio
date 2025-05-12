import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/project-service';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const projects = await getAllProjects();
    console.log('API - Projects fetched:', projects.length);

    // Log a sample project if available
    if (projects.length > 0) {
      console.log('API - Sample project:', {
        id: projects[0].id,
        title: projects[0].title,
        githubUrl: projects[0].githubUrl,
        demoUrl: projects[0].demoUrl
      });
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create the project
    const project = await createProject(body);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
