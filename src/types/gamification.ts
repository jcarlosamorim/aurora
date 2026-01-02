// Gamification Types

export interface UserGamificationData {
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  stacksCompleted: number;
  badges: EarnedBadge[];
}

export interface EarnedBadge {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: Date;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'mastery' | 'hidden';
  requirement: BadgeRequirement;
  xpReward: number;
  order: number;
}

export interface BadgeRequirement {
  field?: 'challengesCompleted' | 'currentStreak' | 'stacksCompleted' | 'currentLevel';
  operator?: '>=' | '>' | '==' | '<' | '<=';
  value?: number;
  type?: 'special';
  trigger?: 'speed_bonus' | 'early_morning' | 'late_night';
}

export interface AddXpRequest {
  amount: number;
  source: XpSource;
  metadata?: {
    challengeId?: string;
    level?: string;
    stackId?: string;
    bonusType?: string;
  };
}

export type XpSource =
  | 'message_sent'
  | 'insight_detected'
  | 'challenge_complete'
  | 'stack_complete'
  | 'badge_earned'
  | 'streak_bonus';

export interface AddXpResponse {
  previousXp: number;
  newXp: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newBadges: EarnedBadge[];
}

// XP values by source
export const XP_VALUES: Record<XpSource, number> = {
  message_sent: 5,
  insight_detected: 15,
  challenge_complete: 100, // Base value, varies by level
  stack_complete: 500,
  badge_earned: 0, // Badges have their own xpReward
  streak_bonus: 0, // Calculated as percentage
};

// XP multipliers by challenge level
export const CHALLENGE_XP_MULTIPLIERS: Record<string, number> = {
  discover: 1.0,   // 100 XP
  try: 1.5,        // 150 XP
  apply: 2.5,      // 250 XP
  integrate: 4.0,  // 400 XP
  master: 6.0,     // 600 XP
};
