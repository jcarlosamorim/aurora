import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createInitialLayers } from '@/lib/layers';

// GET sessions for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST create new session
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const initialLayers = createInitialLayers();

    const session = await prisma.session.create({
      data: {
        userId,
        layers: JSON.stringify(initialLayers),
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// PUT update session
export async function PUT(request: Request) {
  try {
    const { sessionId, phase, progress, layers, completedAt } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (phase !== undefined) updateData.phase = phase;
    if (progress !== undefined) updateData.progress = progress;
    if (layers !== undefined) updateData.layers = JSON.stringify(layers);
    if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
