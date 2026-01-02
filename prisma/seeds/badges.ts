import { PrismaClient } from '@prisma/client';

const badges = [
  {
    slug: 'first-step',
    name: 'Primeiro Passo',
    description: 'Completou seu primeiro desafio',
    icon: '🥉',
    category: 'achievement',
    requirement: JSON.stringify({ field: 'challengesCompleted', operator: '>=', value: 1 }),
    xpReward: 50,
    order: 1,
  },
  {
    slug: 'focused-3',
    name: 'Focado',
    description: 'Manteve streak de 3 dias',
    icon: '🎯',
    category: 'streak',
    requirement: JSON.stringify({ field: 'currentStreak', operator: '>=', value: 3 }),
    xpReward: 100,
    order: 2,
  },
  {
    slug: 'focused-7',
    name: 'Dedicado',
    description: 'Manteve streak de 7 dias',
    icon: '🏅',
    category: 'streak',
    requirement: JSON.stringify({ field: 'currentStreak', operator: '>=', value: 7 }),
    xpReward: 250,
    order: 3,
  },
  {
    slug: 'focused-30',
    name: 'Imparável',
    description: 'Manteve streak de 30 dias',
    icon: '🔥',
    category: 'streak',
    requirement: JSON.stringify({ field: 'currentStreak', operator: '>=', value: 30 }),
    xpReward: 1000,
    order: 4,
  },
  {
    slug: 'stack-complete',
    name: 'Mestre de Stack',
    description: 'Completou uma stack inteira',
    icon: '🏆',
    category: 'mastery',
    requirement: JSON.stringify({ field: 'stacksCompleted', operator: '>=', value: 1 }),
    xpReward: 500,
    order: 5,
  },
  {
    slug: 'level-5',
    name: 'Evoluindo',
    description: 'Alcançou nível 5',
    icon: '⭐',
    category: 'achievement',
    requirement: JSON.stringify({ field: 'currentLevel', operator: '>=', value: 5 }),
    xpReward: 200,
    order: 6,
  },
  {
    slug: 'level-10',
    name: 'Expert',
    description: 'Alcançou nível 10',
    icon: '💫',
    category: 'achievement',
    requirement: JSON.stringify({ field: 'currentLevel', operator: '>=', value: 10 }),
    xpReward: 500,
    order: 7,
  },
  {
    slug: 'speed-runner',
    name: 'Velocista',
    description: 'Completou desafio com bônus de tempo',
    icon: '⚡',
    category: 'hidden',
    requirement: JSON.stringify({ type: 'special', trigger: 'speed_bonus' }),
    xpReward: 100,
    order: 8,
  },
  {
    slug: 'early-bird',
    name: 'Madrugador',
    description: 'Completou desafio antes das 7h',
    icon: '🌅',
    category: 'hidden',
    requirement: JSON.stringify({ type: 'special', trigger: 'early_morning' }),
    xpReward: 75,
    order: 9,
  },
  {
    slug: 'night-owl',
    name: 'Coruja',
    description: 'Completou desafio depois das 23h',
    icon: '🦉',
    category: 'hidden',
    requirement: JSON.stringify({ type: 'special', trigger: 'late_night' }),
    xpReward: 75,
    order: 10,
  },
];

export async function seedBadges(prisma: PrismaClient) {
  console.log('Seeding badges...');

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }

  console.log(`Seeded ${badges.length} badges`);
}
