'use client';

import { useEffect } from 'react';
import { useGamificationStore } from '@/stores/gamification-store';
import { XPFloaterContainer } from './XPFloater';
import { LevelUpModal } from './LevelUpModal';

interface GamificationProviderProps {
  children: React.ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const { fetchGamification } = useGamificationStore();

  useEffect(() => {
    // Load gamification data on mount
    fetchGamification();
  }, [fetchGamification]);

  return (
    <>
      {children}
      <XPFloaterContainer />
      <LevelUpModal />
    </>
  );
}
