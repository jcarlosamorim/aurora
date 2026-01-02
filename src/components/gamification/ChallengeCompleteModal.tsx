'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { LevelBadge } from './LevelBadge';
import type { EarnedBadge } from '@/types/gamification';

interface ChallengeCompleteResult {
  xpEarned: number;
  bonusXp?: number;
  newLevel?: number;
  leveledUp: boolean;
  newBadges: EarnedBadge[];
  currentStreak: number;
  nextChallenge?: {
    name: string;
    type: string;
    level: number;
  };
  stackSlug: string;
  stackName: string;
}

interface ChallengeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ChallengeCompleteResult;
}

export function ChallengeCompleteModal({
  isOpen,
  onClose,
  result,
}: ChallengeCompleteModalProps) {
  const router = useRouter();
  const totalXp = (result.xpEarned || 0) + (result.bonusXp || 0);
  const animatedXp = useAnimatedCounter(isOpen ? totalXp : 0, 1000, 500);

  const fireCelebration = useCallback(() => {
    // Initial burst from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#FFD700', '#FFA500'],
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
      });
    }, 200);

    // Extra burst for level up
    if (result.leveledUp) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B'],
        });
      }, 400);
    }
  }, [result.leveledUp]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(fireCelebration, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fireCelebration]);

  const handleContinue = () => {
    onClose();
    router.push(`/stacks/${result.stackSlug}`);
  };

  const levelNames: Record<string, string> = {
    discover: 'Descobrir',
    try: 'Experimentar',
    apply: 'Aplicar',
    integrate: 'Integrar',
    master: 'Dominar',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop - não fecha ao clicar */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 p-8 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Title */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="text-3xl font-bold text-white mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ✨ DESAFIO COMPLETO! ✨
              </motion.div>
              <p className="text-white/60 text-sm">{result.stackName}</p>
            </motion.div>

            {/* XP Counter */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <div className="text-5xl font-bold text-[var(--accent)]">
                +{animatedXp}
              </div>
              <div className="text-white/60 text-sm mt-1">XP ganhos</div>
              {result.bonusXp && result.bonusXp > 0 && (
                <div className="text-green-400 text-xs mt-1">
                  (+{result.bonusXp} bônus)
                </div>
              )}
            </motion.div>

            {/* Level Up */}
            {result.leveledUp && result.newLevel && (
              <motion.div
                className="bg-white/10 rounded-xl p-4 text-center border border-[var(--accent)]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">🔓</span>
                  <LevelBadge level={result.newLevel} size="md" animate />
                </div>
                <div className="text-white font-medium">Nível {result.newLevel}</div>
                <div className="text-white/60 text-sm">Desbloqueado!</div>
              </motion.div>
            )}

            {/* Streak */}
            {result.currentStreak > 0 && (
              <motion.div
                className="flex items-center gap-2 text-orange-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="text-xl">🔥</span>
                <span className="font-medium">
                  Streak: {result.currentStreak} {result.currentStreak === 1 ? 'dia' : 'dias'}
                </span>
              </motion.div>
            )}

            {/* New Badges */}
            {result.newBadges && result.newBadges.length > 0 && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-center text-white/60 text-xs uppercase tracking-wider mb-3">
                  Conquistas desbloqueadas
                </div>
                <div className="space-y-2">
                  {result.newBadges.map((badge, index) => (
                    <motion.div
                      key={badge.slug}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="text-white font-medium">{badge.name}</div>
                        <div className="text-white/60 text-xs">{badge.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Next Challenge Preview */}
            {result.nextChallenge && (
              <motion.div
                className="text-center text-white/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <span className="text-white/40">Próximo: </span>
                <span className="text-white">
                  {levelNames[result.nextChallenge.type]} - {result.nextChallenge.name}
                </span>
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.button
              className="mt-4 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-4 rounded-xl font-medium text-lg transition-colors"
              onClick={handleContinue}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continuar Jornada →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
