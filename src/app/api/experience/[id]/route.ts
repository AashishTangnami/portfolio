import { NextResponse } from 'next/server';
import { getExperienceById, updateExperience, deleteExperience } from '@/lib/experience-service';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const experience = await getExperienceById(id);

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error(`Error in GET /api/experience/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch experience entry' },
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

    // Check if experience exists
    const existingExperience = await getExperienceById(id);

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experience entry not found' },
        { status: 404 }
      );
    }

    // Parse date strings to Date objects if they exist
    const data = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : body.endDate === null ? null : undefined
    };

    // Update the experience entry
    const updatedExperience = await updateExperience(id, data);

    return NextResponse.json({ experience: updatedExperience });
  } catch (error) {
    console.error(`Error in PUT /api/experience/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update experience entry' },
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

    // Check if experience exists
    const existingExperience = await getExperienceById(id);

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experience entry not found' },
        { status: 404 }
      );
    }

    // Delete the experience entry
    await deleteExperience(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/experience/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete experience entry' },
      { status: 500 }
    );
  }
}
