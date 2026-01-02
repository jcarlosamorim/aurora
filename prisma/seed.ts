import { PrismaClient } from '@prisma/client';
import { seedStacks } from './seeds/stacks';
import { seedChallenges } from './seeds/challenges';
import { seedBadges } from './seeds/badges';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed stacks first (challenges depend on them)
  await seedStacks(prisma);

  // Seed challenges
  await seedChallenges(prisma);

  // Seed badges
  await seedBadges(prisma);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
