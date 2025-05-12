import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/project-service';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error(`Error in GET /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Check if project exists
    const existingProject = await getProjectById(id);

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    const updatedProject = await updateProject(id, body);

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error(`Error in PUT /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if project exists
    const existingProject = await getProjectById(id);

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the project
    await deleteProject(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
