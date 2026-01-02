import { prisma } from './db';
import type {
  UserGamificationData,
  EarnedBadge,
  BadgeRequirement,
  AddXpResponse,
} from '@/types/gamification';

// Level thresholds - XP required to reach each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  500,    // Level 2
  1250,   // Level 3
  2250,   // Level 4
  3750,   // Level 5
  5750,   // Level 6
  8250,   // Level 7
  11250,  // Level 8
  15250,  // Level 9
  20250,  // Level 10
];

/**
 * Calculate user level based on total XP
 */
export function calculateLevel(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP required for next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    // Max level reached, return large number
    return 999999;
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Get XP progress within current level
 */
export function getXpProgress(totalXp: number, currentLevel: number): number {
  if (currentLevel <= 1) {
    return totalXp;
  }
  const previousLevelThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  return totalXp - previousLevelThreshold;
}

/**
 * Get or create UserGamification for a user (lazy init)
 */
export async function getOrCreateUserGamification(userId: string) {
  let gamification = await prisma.userGamification.findUnique({
    where: { userId },
  });

  if (!gamification) {
    gamification = await prisma.userGamification.create({
      data: { userId },
    });
  }

  return gamification;
}

/**
 * Get user's earned badges
 */
export async function getUserBadges(userId: string): Promise<EarnedBadge[]> {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });

  return userBadges.map((ub) => ({
    slug: ub.badge.slug,
    name: ub.badge.name,
    description: ub.badge.description,
    icon: ub.badge.icon,
    category: ub.badge.category,
    earnedAt: ub.earnedAt,
  }));
}

/**
 * Get full gamification data for a user
 */
export async function getUserGamificationData(
  userId: string
): Promise<UserGamificationData> {
  const gamification = await getOrCreateUserGamification(userId);
  const badges = await getUserBadges(userId);

  const xpForNextLevel = getXpForNextLevel(gamification.currentLevel);
  const xpProgress = getXpProgress(
    gamification.totalXp,
    gamification.currentLevel
  );

  return {
    totalXp: gamification.totalXp,
    currentLevel: gamification.currentLevel,
    xpForNextLevel,
    xpProgress,
    currentStreak: gamification.currentStreak,
    longestStreak: gamification.longestStreak,
    challengesCompleted: gamification.challengesCompleted,
    stacksCompleted: gamification.stacksCompleted,
    badges,
  };
}

/**
 * Check if a badge requirement is met
 */
export function checkBadgeRequirement(
  requirement: BadgeRequirement,
  stats: {
    challengesCompleted: number;
    currentStreak: number;
    stacksCompleted: number;
    currentLevel: number;
  },
  specialTrigger?: string
): boolean {
  // Handle special triggers (hidden badges)
  if (requirement.type === 'special') {
    return requirement.trigger === specialTrigger;
  }

  // Handle field-based requirements
  if (!requirement.field || !requirement.operator || requirement.value === undefined) {
    return false;
  }

  const fieldValue = stats[requirement.field];

  switch (requirement.operator) {
    case '>=':
      return fieldValue >= requirement.value;
    case '>':
      return fieldValue > requirement.value;
    case '==':
      return fieldValue === requirement.value;
    case '<':
      return fieldValue < requirement.value;
    case '<=':
      return fieldValue <= requirement.value;
    default:
      return false;
  }
}

/**
 * Check and award new badges
 */
export async function checkAndAwardBadges(
  userId: string,
  stats: {
    challengesCompleted: number;
    currentStreak: number;
    stacksCompleted: number;
    currentLevel: number;
  },
  specialTrigger?: string
): Promise<EarnedBadge[]> {
  // Get all badges
  const allBadges = await prisma.badge.findMany();

  // Get user's existing badges
  const existingBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const existingBadgeIds = new Set(existingBadges.map((b) => b.badgeId));

  const newBadges: EarnedBadge[] = [];

  for (const badge of allBadges) {
    // Skip if already earned
    if (existingBadgeIds.has(badge.id)) {
      continue;
    }

    const requirement = JSON.parse(badge.requirement) as BadgeRequirement;

    if (checkBadgeRequirement(requirement, stats, specialTrigger)) {
      // Award badge
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      // Add XP reward if any
      if (badge.xpReward > 0) {
        await prisma.userGamification.update({
          where: { userId },
          data: {
            totalXp: { increment: badge.xpReward },
          },
        });
      }

      newBadges.push({
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        earnedAt: new Date(),
      });
    }
  }

  return newBadges;
}

/**
 * Add XP to user and check for level up and badges
 */
export async function addXp(
  userId: string,
  amount: number,
  source: string,
  specialTrigger?: string
): Promise<AddXpResponse> {
  const gamification = await getOrCreateUserGamification(userId);

  const previousXp = gamification.totalXp;
  const previousLevel = gamification.currentLevel;

  const newXp = previousXp + amount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > previousLevel;

  // Update gamification
  await prisma.userGamification.update({
    where: { userId },
    data: {
      totalXp: newXp,
      currentLevel: newLevel,
      lastActiveAt: new Date(),
    },
  });

  // Check for new badges
  const stats = {
    challengesCompleted: gamification.challengesCompleted,
    currentStreak: gamification.currentStreak,
    stacksCompleted: gamification.stacksCompleted,
    currentLevel: newLevel,
  };

  const newBadges = await checkAndAwardBadges(userId, stats, specialTrigger);

  return {
    previousXp,
    newXp,
    previousLevel,
    newLevel,
    leveledUp,
    newBadges,
  };
}

/**
 * Update streak for user
 */
export async function updateStreak(userId: string): Promise<number> {
  const gamification = await getOrCreateUserGamification(userId);

  const now = new Date();
  const lastActive = gamification.lastActiveAt;

  let newStreak = gamification.currentStreak;

  if (!lastActive) {
    // First activity
    newStreak = 1;
  } else {
    const hoursSinceLastActive =
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastActive < 24) {
      // Same day or within 24 hours, streak continues
      // Only increment if it's a new day
      const lastActiveDate = lastActive.toDateString();
      const todayDate = now.toDateString();

      if (lastActiveDate !== todayDate) {
        newStreak = gamification.currentStreak + 1;
      }
    } else if (hoursSinceLastActive < 48) {
      // Within 48 hours but more than 24, increment streak
      newStreak = gamification.currentStreak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(newStreak, gamification.longestStreak);

  await prisma.userGamification.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActiveAt: now,
    },
  });

  return newStreak;
}

/**
 * Increment challenges completed
 */
export async function incrementChallengesCompleted(
  userId: string
): Promise<number> {
  await getOrCreateUserGamification(userId);

  const updated = await prisma.userGamification.update({
    where: { userId },
    data: {
      challengesCompleted: { increment: 1 },
    },
  });

  return updated.challengesCompleted;
}

/**
 * Increment stacks completed
 */
export async function incrementStacksCompleted(userId: string): Promise<number> {
  await getOrCreateUserGamification(userId);

  const updated = await prisma.userGamification.update({
    where: { userId },
    data: {
      stacksCompleted: { increment: 1 },
    },
  });

  return updated.stacksCompleted;
}
