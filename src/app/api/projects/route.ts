import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/project-service';
import { slugify } from '@/lib/utils';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const projects = await getAllProjects();
    logger.debug(`Projects fetched: ${projects.length}`);

    return NextResponse.json({ projects });
  } catch (error) {
    logger.error('Error in GET /api/projects:', error);
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
    logger.debug('Project created successfully');

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
