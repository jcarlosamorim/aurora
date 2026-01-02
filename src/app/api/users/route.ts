import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sessions: {
          orderBy: { startedAt: 'desc' },
          include: {
            _count: {
              select: { messages: true },
            },
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return NextResponse.json(existing);
      }
    }

    const user = await prisma.user.create({
      data: { name, email },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
