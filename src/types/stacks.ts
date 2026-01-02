import type { Stack, Challenge, UserStack, UserChallenge } from '@prisma/client';

// Re-export Prisma types
export type { Stack, Challenge, UserStack, UserChallenge };

// Enums for challenge levels
export enum ChallengeLevel {
  DISCOVER = 1,
  TRY = 2,
  APPLY = 3,
  INTEGRATE = 4,
  MASTER = 5
}

export enum ChallengeType {
  DISCOVER = 'discover',
  TRY = 'try',
  APPLY = 'apply',
  INTEGRATE = 'integrate',
  MASTER = 'master'
}

export enum StackStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum ChallengeStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// Profile matching interfaces
export interface ProfileCriteria {
  min?: number;
  max?: number;
  ideal?: number;
  weight?: number;
}

export interface StackProfileMatch {
  conscientiousness?: ProfileCriteria;
  openness?: ProfileCriteria;
  extraversion?: ProfileCriteria;
  agreeableness?: ProfileCriteria;
  neuroticism?: ProfileCriteria;
  needForCognition?: ProfileCriteria;
  impulsivity?: ProfileCriteria;
  riskTolerance?: ProfileCriteria;
  ambiguityTolerance?: ProfileCriteria;
  systemicThinking?: ProfileCriteria;
  empathy?: ProfileCriteria;
  energy?: ProfileCriteria;
  introversion?: ProfileCriteria;
  analyticalThinking?: ProfileCriteria;
  riskAwareness?: ProfileCriteria;
  changeOrientation?: ProfileCriteria;
  processOrientation?: ProfileCriteria;
  teachingOrientation?: ProfileCriteria;
  persuasion?: ProfileCriteria;
  socialReading?: ProfileCriteria;
  primary?: boolean;
}

// User profile interface (extracted from onboarding)
export interface UserProfile {
  conscientiousness: number;
  openness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  needForCognition: number;
  impulsivity: number;
  riskTolerance: number;
}

// Challenge content interfaces
export interface DiscoverContent {
  mainTool: string;
  keyQuestions: string[];
}

export interface TryContent {
  mainTool: string;
  exercise: string;
  timeLimit: string;
}

export interface ApplyContent {
  mainTool: string;
  deliverable: string;
}

export interface IntegrateContent {
  tools: string[];
  deliverable: string;
}

export interface MasterContent {
  mainTool: string;
  scenario: string;
}

export type ChallengeContent =
  | DiscoverContent
  | TryContent
  | ApplyContent
  | IntegrateContent
  | MasterContent;

// API response interfaces
export interface StackWithProgress extends Stack {
  userStack?: UserStack | null;
  challenges: Challenge[];
  completedChallenges?: number;
}

export interface ChallengeWithProgress extends Challenge {
  userChallenge?: UserChallenge | null;
  stack: Stack;
}

export interface StackRecommendation {
  stack: Stack;
  score: number;
}

export interface RecommendationResponse {
  recommended: Stack;
  score: number;
  allScores: Array<{
    stackId: string;
    name: string;
    score: number;
  }>;
}

export interface ProgressionResult {
  type: 'level_completed' | 'stack_completed' | 'all_completed';
  level?: number;
  nextLevel?: number;
  completedStack?: Stack;
  unlockedStack?: Stack | null;
}

// Dashboard interfaces
export interface DashboardStats {
  stacksCompleted: number;
  totalStacks: number;
  challengesCompleted: number;
  totalChallenges: number;
  timeInvested: number;
  currentStack?: StackWithProgress | null;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date | null;
}

export interface ActivityItem {
  id: string;
  type: 'challenge_completed' | 'stack_completed' | 'stack_unlocked';
  challenge?: Challenge;
  stack?: Stack;
  timestamp: Date;
}

export interface DashboardData {
  stats: DashboardStats;
  userStacks: StackWithProgress[];
  badges: Badge[];
  insights: string[];
  recentActivity: ActivityItem[];
}
