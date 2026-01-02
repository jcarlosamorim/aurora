import { NextRequest, NextResponse } from 'next/server';
import { getUserGamificationData } from '@/lib/gamification';
import { prisma } from '@/lib/db';

// For now, use a demo user ID. In production, get from session/auth.
const DEMO_USER_ID = 'demo-user';

// Ensure demo user exists
async function ensureDemoUser() {
  const user = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id: DEMO_USER_ID,
        name: 'Demo User',
        email: 'demo@aurora.app',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params or use demo
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || DEMO_USER_ID;

    // Ensure demo user exists if using demo
    if (userId === DEMO_USER_ID) {
      await ensureDemoUser();
    }

    const data = await getUserGamificationData(userId);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gamification data:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de gamificação' },
      { status: 500 }
    );
  }
}
