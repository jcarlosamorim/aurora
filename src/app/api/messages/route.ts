import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST create new message
export async function POST(request: Request) {
  try {
    const { sessionId, role, content } = await request.json();

    if (!sessionId || !role || !content) {
      return NextResponse.json(
        { error: 'sessionId, role, and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        sessionId,
        role,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
