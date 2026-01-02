'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamification-store';

export function XPFloaterContainer() {
  const { pendingXpFloaters, removeXpFloater } = useGamificationStore();

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {pendingXpFloaters.map((floater, index) => (
          <XPFloater
            key={floater.id}
            amount={floater.amount}
            index={index}
            onComplete={() => removeXpFloater(floater.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface XPFloaterProps {
  amount: number;
  index: number;
  onComplete: () => void;
}

function XPFloater({ amount, index, onComplete }: XPFloaterProps) {
  return (
    <motion.div
      className="flex items-center gap-1 text-lg font-bold"
      style={{
        color: amount > 0 ? '#4ADE80' : '#F87171',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0, y: 20, x: index * 10 }}
      animate={{ opacity: 1, y: -30 - index * 40 }}
      exit={{ opacity: 0, y: -60 - index * 40 }}
      transition={{
        duration: 1.5,
        ease: 'easeOut',
      }}
      onAnimationComplete={onComplete}
    >
      <span>{amount > 0 ? '+' : ''}{amount} XP</span>
      <span className="text-base">✨</span>
    </motion.div>
  );
}
