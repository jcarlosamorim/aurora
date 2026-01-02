import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stacks = await prisma.stack.findMany({
      orderBy: { order: 'asc' },
      include: {
        challenges: {
          orderBy: { level: 'asc' }
        }
      }
    });

    return NextResponse.json(stacks);
  } catch (error) {
    console.error('Error fetching stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stacks' },
      { status: 500 }
    );
  }
}
