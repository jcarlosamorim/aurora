import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        stack: {
          select: {
            id: true,
            slug: true,
            name: true,
            color: true,
          }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Desafio não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Erro ao buscar desafio:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar desafio' },
      { status: 500 }
    );
  }
}
