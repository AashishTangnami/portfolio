import { NextResponse } from 'next/server';
import { getAllExperiences, createExperience } from '@/lib/experience-service';

export async function GET() {
  try {
    const experiences = await getAllExperiences();
    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('Error in GET /api/experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Parse date strings to Date objects
    const data = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null
    };

    // Create the experience entry
    const experience = await createExperience(data);

    return NextResponse.json({ experience }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience entry' },
      { status: 500 }
    );
  }
}
