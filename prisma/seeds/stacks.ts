import { PrismaClient } from '@prisma/client';

export const stacks = [
  {
    slug: 'inner-mastery',
    name: 'The Inner Mastery',
    description: 'Para quem busca autoconhecimento, resiliência e paz interior',
    icon: '🧘',
    color: '#EC4899',
    tools: JSON.stringify([
      'Stoic Dichotomy of Control',
      'Negative Visualization',
      'Journaling',
      'Meditation',
      'Memento Mori',
      'Habit Stacking',
      'Zone of Genius Framework',
      'Ikigai Method'
    ]),
    profileMatch: JSON.stringify({
      openness: { min: 0.5 },
      neuroticism: { max: 0.6 },
      introversion: { min: 0.4 },
      primary: true
    }),
    order: 1
  },
  {
    slug: 'focused-achiever',
    name: 'The Focused Achiever',
    description: 'Para quem precisa de ordem, clareza e produtividade máxima',
    icon: '🎯',
    color: '#3B82F6',
    tools: JSON.stringify([
      'GTD',
      'Eisenhower Matrix',
      'SMART Goals',
      'Deep Work',
      'Time Blocking',
      'Pomodoro Technique',
      'Distraction Matrix',
      'Flow State Triggers'
    ]),
    profileMatch: JSON.stringify({
      conscientiousness: { min: 0.7 },
      impulsivity: { max: 0.4 },
      primary: true
    }),
    order: 2
  },
  {
    slug: 'data-driven-decider',
    name: 'The Data-Driven Decider',
    description: 'Para quem precisa de decisões baseadas em evidência e análise',
    icon: '📊',
    color: '#6366F1',
    tools: JSON.stringify([
      'Bayesian Thinking',
      'RICE Scoring',
      'Probabilistic Thinking',
      'Decision Matrix',
      'Pre-mortem Analysis'
    ]),
    profileMatch: JSON.stringify({
      needForCognition: { min: 0.7 },
      impulsivity: { max: 0.4 },
      analyticalThinking: { min: 0.6 },
      primary: true
    }),
    order: 3
  },
  {
    slug: 'strategic-navigator',
    name: 'The Strategic Navigator',
    description: 'Para quem precisa de visão estratégica e gestão de riscos',
    icon: '🧭',
    color: '#10B981',
    tools: JSON.stringify([
      'SWOT Analysis',
      'OKRs',
      'Wardley Maps',
      'Porter\'s 5 Forces',
      'Scenario Planning',
      'Risk Register',
      'Decision Trees',
      'Simulation/Stress Testing'
    ]),
    profileMatch: JSON.stringify({
      systemicThinking: { min: 0.7 },
      ambiguityTolerance: { min: 0.6 },
      riskAwareness: { min: 0.5 },
      primary: true
    }),
    order: 4
  },
  {
    slug: 'innovation-designer',
    name: 'The Innovation Designer',
    description: 'Para quem cria soluções inovadoras centradas no usuário',
    icon: '💡',
    color: '#8B5CF6',
    tools: JSON.stringify([
      'Design Thinking',
      'Mind Mapping',
      'First Principles',
      'Jobs To Be Done',
      'User Research',
      'Empathy Mapping',
      'Rapid Prototyping',
      'Brainstorming'
    ]),
    profileMatch: JSON.stringify({
      openness: { min: 0.7 },
      needForCognition: { min: 0.6 },
      empathy: { min: 0.5 },
      primary: true
    }),
    order: 5
  },
  {
    slug: 'execution-engine',
    name: 'The Execution Engine',
    description: 'Para quem gerencia operações e busca eficiência máxima',
    icon: '⚡',
    color: '#F59E0B',
    tools: JSON.stringify([
      'Lean Startup',
      'SCRUM',
      'Kanban',
      'Pomodoro',
      'Retrospectives',
      'Lean Manufacturing',
      'Six Sigma',
      'Process Mapping',
      'PDCA Cycle',
      'Bottleneck Analysis'
    ]),
    profileMatch: JSON.stringify({
      energy: { min: 0.6 },
      changeOrientation: { min: 0.5 },
      processOrientation: { min: 0.6 },
      primary: true
    }),
    order: 6
  },
  {
    slug: 'knowledge-architect',
    name: 'The Knowledge Architect',
    description: 'Para quem constrói sistemas de conhecimento e aprendizado',
    icon: '📚',
    color: '#14B8A6',
    tools: JSON.stringify([
      'Mental Models Latticework',
      'Spaced Repetition',
      'Concept Mapping',
      'Feynman Technique',
      'Knowledge Graph',
      'Zettelkasten'
    ]),
    profileMatch: JSON.stringify({
      needForCognition: { min: 0.7 },
      conscientiousness: { min: 0.6 },
      teachingOrientation: { min: 0.5 },
      primary: true
    }),
    order: 7
  },
  {
    slug: 'change-catalyst',
    name: 'The Change Catalyst',
    description: 'Para quem lidera transformação organizacional',
    icon: '🔥',
    color: '#EF4444',
    tools: JSON.stringify([
      'Transformational Leadership',
      'Stakeholder Mapping',
      'Change Management',
      'Narrative Design',
      'Coalition Building'
    ]),
    profileMatch: JSON.stringify({
      openness: { min: 0.7 },
      extraversion: { min: 0.6 },
      ambiguityTolerance: { min: 0.6 },
      primary: true
    }),
    order: 8
  },
  {
    slug: 'negotiator-influencer',
    name: 'The Negotiator & Influencer',
    description: 'Para quem precisa ganhar acordos e influenciar decisões',
    icon: '🤝',
    color: '#F97316',
    tools: JSON.stringify([
      'Interest-Based Negotiation (Fisher)',
      'BATNA Analysis',
      'Anchoring & Framing',
      'Social Proof & Reciprocity',
      'Principled Disagreement'
    ]),
    profileMatch: JSON.stringify({
      extraversion: { min: 0.6 },
      empathy: { min: 0.6 },
      persuasion: { min: 0.5 },
      socialReading: { min: 0.5 },
      primary: true
    }),
    order: 9
  }
];

export async function seedStacks(prisma: PrismaClient) {
  console.log('Seeding stacks...');

  for (const stack of stacks) {
    await prisma.stack.upsert({
      where: { slug: stack.slug },
      update: stack,
      create: stack
    });
  }

  console.log(`Seeded ${stacks.length} stacks`);
}
