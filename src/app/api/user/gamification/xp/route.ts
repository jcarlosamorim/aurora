import { NextRequest, NextResponse } from 'next/server';
import {
  addXp,
  updateStreak,
  incrementChallengesCompleted,
  incrementStacksCompleted,
  checkAndAwardBadges,
} from '@/lib/gamification';
import { prisma } from '@/lib/db';
import type { AddXpRequest } from '@/types/gamification';

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AddXpRequest & { userId?: string };
    const { amount, source, metadata, userId: bodyUserId } = body;

    // Validate required fields
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount deve ser um número positivo' },
        { status: 400 }
      );
    }

    if (!source) {
      return NextResponse.json(
        { error: 'Source é obrigatório' },
        { status: 400 }
      );
    }

    const userId = bodyUserId || DEMO_USER_ID;

    // Ensure user exists
    await ensureDemoUser();

    // Determine special trigger for hidden badges
    let specialTrigger: string | undefined;

    const now = new Date();
    const hour = now.getHours();

    if (hour < 7) {
      specialTrigger = 'early_morning';
    } else if (hour >= 23) {
      specialTrigger = 'late_night';
    }

    if (metadata?.bonusType === 'speed') {
      specialTrigger = 'speed_bonus';
    }

    // Add XP
    const result = await addXp(userId, amount, source, specialTrigger);

    // Handle source-specific logic
    if (source === 'challenge_complete') {
      await incrementChallengesCompleted(userId);
      await updateStreak(userId);

      // Re-check badges after incrementing challenges
      const gamification = await prisma.userGamification.findUnique({
        where: { userId },
      });

      if (gamification) {
        const stats = {
          challengesCompleted: gamification.challengesCompleted,
          currentStreak: gamification.currentStreak,
          stacksCompleted: gamification.stacksCompleted,
          currentLevel: result.newLevel,
        };

        const additionalBadges = await checkAndAwardBadges(
          userId,
          stats,
          specialTrigger
        );

        result.newBadges.push(...additionalBadges);
      }
    }

    if (source === 'stack_complete') {
      await incrementStacksCompleted(userId);

      // Re-check badges after incrementing stacks
      const gamification = await prisma.userGamification.findUnique({
        where: { userId },
      });

      if (gamification) {
        const stats = {
          challengesCompleted: gamification.challengesCompleted,
          currentStreak: gamification.currentStreak,
          stacksCompleted: gamification.stacksCompleted,
          currentLevel: result.newLevel,
        };

        const additionalBadges = await checkAndAwardBadges(userId, stats);
        result.newBadges.push(...additionalBadges);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding XP:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar XP' },
      { status: 500 }
    );
  }
}
