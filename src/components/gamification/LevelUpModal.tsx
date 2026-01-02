'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '@/stores/gamification-store';
import { LevelBadge } from './LevelBadge';

export function LevelUpModal() {
  const { showLevelUp, levelUpLevel, dismissLevelUp } = useGamificationStore();

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#FFD700', '#FFA500'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#FFD700', '#FFA500'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  useEffect(() => {
    if (showLevelUp) {
      fireConfetti();
    }
  }, [showLevelUp, fireConfetti]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLevelUp) {
        dismissLevelUp();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showLevelUp, dismissLevelUp]);

  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={dismissLevelUp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 p-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Stars decoration */}
            <motion.div
              className="text-4xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ✨ LEVEL UP! ✨
            </motion.div>

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <LevelBadge level={levelUpLevel} size="lg" />
            </motion.div>

            {/* Message */}
            <motion.p
              className="text-xl text-white/90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Você alcançou o nível {levelUpLevel}!
            </motion.p>

            {/* Continue Button */}
            <motion.button
              className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              onClick={dismissLevelUp}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continuar →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
