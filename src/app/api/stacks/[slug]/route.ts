import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const stack = await prisma.stack.findUnique({
      where: { slug },
      include: {
        challenges: {
          orderBy: { level: 'asc' }
        }
      }
    });

    if (!stack) {
      return NextResponse.json(
        { error: 'Stack não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(stack);
  } catch (error) {
    console.error('Erro ao buscar stack:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar stack' },
      { status: 500 }
    );
  }
}
