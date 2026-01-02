import { create } from 'zustand';
import type { UserGamificationData, EarnedBadge } from '@/types/gamification';

interface AddXpResult {
  previousXp: number;
  newXp: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newBadges: EarnedBadge[];
}

interface GamificationState {
  // State
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  stacksCompleted: number;
  badges: EarnedBadge[];
  isLoading: boolean;
  error: string | null;

  // Animation state
  pendingXpFloaters: { id: string; amount: number }[];
  showLevelUp: boolean;
  levelUpLevel: number;

  // Actions
  fetchGamification: (userId?: string) => Promise<void>;
  addXp: (amount: number, source: string, challengeLevel?: number) => Promise<AddXpResult | null>;
  queueXpFloater: (amount: number) => void;
  removeXpFloater: (id: string) => void;
  triggerLevelUp: (level: number) => void;
  dismissLevelUp: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  // Initial state
  totalXp: 0,
  currentLevel: 1,
  xpForNextLevel: 500,
  xpProgress: 0,
  currentStreak: 0,
  longestStreak: 0,
  challengesCompleted: 0,
  stacksCompleted: 0,
  badges: [],
  isLoading: false,
  error: null,

  // Animation state
  pendingXpFloaters: [],
  showLevelUp: false,
  levelUpLevel: 1,

  // Actions
  fetchGamification: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId
        ? `/api/user/gamification?userId=${userId}`
        : '/api/user/gamification';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch gamification data');
      }

      const data: UserGamificationData = await response.json();

      set({
        totalXp: data.totalXp,
        currentLevel: data.currentLevel,
        xpForNextLevel: data.xpForNextLevel,
        xpProgress: data.xpProgress,
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        challengesCompleted: data.challengesCompleted,
        stacksCompleted: data.stacksCompleted,
        badges: data.badges,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  addXp: async (amount: number, source: string, challengeLevel?: number) => {
    try {
      const response = await fetch('/api/user/gamification/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          source,
          metadata: challengeLevel ? { challengeLevel } : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('XP API Error:', response.status, errorData);
        throw new Error(`Failed to add XP: ${response.status}`);
      }

      const result: AddXpResult = await response.json();

      // Update store state
      set((state) => ({
        totalXp: result.newXp,
        currentLevel: result.newLevel,
        badges: [...state.badges, ...result.newBadges],
      }));

      // Queue XP floater animation
      get().queueXpFloater(amount);

      // Trigger level up if applicable
      if (result.leveledUp) {
        get().triggerLevelUp(result.newLevel);
      }

      // Refetch to get updated xpProgress and xpForNextLevel
      await get().fetchGamification();

      return result;
    } catch (error) {
      console.error('Error adding XP:', error);
      return null;
    }
  },

  queueXpFloater: (amount: number) => {
    const id = `xp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      pendingXpFloaters: [...state.pendingXpFloaters, { id, amount }],
    }));
  },

  removeXpFloater: (id: string) => {
    set((state) => ({
      pendingXpFloaters: state.pendingXpFloaters.filter((f) => f.id !== id),
    }));
  },

  triggerLevelUp: (level: number) => {
    set({ showLevelUp: true, levelUpLevel: level });
  },

  dismissLevelUp: () => {
    set({ showLevelUp: false });
  },
}));
