'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

export interface SwipeCard {
  id: string;
  text: string;
  correctSwipe?: 'left' | 'right';
}

interface SwipeCardsProps {
  cards: SwipeCard[];
  leftLabel?: string;
  rightLabel?: string;
  onComplete: (results: { card: SwipeCard; swipedRight: boolean }[]) => void;
  xpPerCorrect?: number;
}

export function SwipeCards({
  cards,
  leftLabel = 'Não',
  rightLabel = 'Sim',
  onComplete,
  xpPerCorrect = 5,
}: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ card: SwipeCard; swipedRight: boolean }[]>([]);
  const [showXp, setShowXp] = useState(false);
  const [streak, setStreak] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCard) return;

    const swipedRight = direction === 'right';
    const isCorrect = currentCard.correctSwipe === direction;

    const newResults = [...results, { card: currentCard, swipedRight }];
    setResults(newResults);

    if (isCorrect) {
      setStreak(s => s + 1);
      setShowXp(true);
      setTimeout(() => setShowXp(false), 800);
    } else {
      setStreak(0);
    }

    if (currentIndex + 1 >= cards.length) {
      setTimeout(() => onComplete(newResults), 300);
    }

    setCurrentIndex(i => i + 1);
    x.set(0);
  };

  const handleDragEnd = () => {
    const xVal = x.get();
    if (xVal > 100) {
      handleSwipe('right');
    } else if (xVal < -100) {
      handleSwipe('left');
    }
  };

  if (isComplete) {
    const correctCount = results.filter(
      r => cards.find(c => c.id === r.card.id)?.correctSwipe === (r.swipedRight ? 'right' : 'left')
    ).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {correctCount}/{cards.length} corretos!
        </p>
        <p className="text-xs text-[var(--accent)] mt-1">
          +{correctCount * xpPerCorrect} XP
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Streak indicator */}
      {streak > 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 right-0 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold z-10"
        >
          🔥 {streak}x
        </motion.div>
      )}

      {/* XP floater */}
      <AnimatePresence>
        {showXp && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[var(--accent)] font-bold text-sm z-20"
          >
            <Zap size={14} />+{xpPerCorrect} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Labels */}
      <div className="flex justify-between mb-2 px-2">
        <motion.span
          style={{ opacity: leftOpacity }}
          className="text-xs font-medium text-red-400 flex items-center gap-1"
        >
          <X size={12} /> {leftLabel}
        </motion.span>
        <span className="text-xs text-[var(--text-muted)]">
          {currentIndex + 1}/{cards.length}
        </span>
        <motion.span
          style={{ opacity: rightOpacity }}
          className="text-xs font-medium text-green-400 flex items-center gap-1"
        >
          {rightLabel} <Check size={12} />
        </motion.span>
      </div>

      {/* Card stack */}
      <div className="relative h-32 flex items-center justify-center">
        {/* Background cards */}
        {cards.slice(currentIndex + 1, currentIndex + 3).map((card, i) => (
          <motion.div
            key={card.id}
            className="absolute w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
            style={{
              scale: 1 - (i + 1) * 0.05,
              y: (i + 1) * 4,
              zIndex: -i - 1,
            }}
          >
            <p className="text-sm text-[var(--text-muted)] text-center opacity-50">
              {card.text}
            </p>
          </motion.div>
        ))}

        {/* Active card */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
          className="w-full bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg p-4 cursor-grab relative z-10"
        >
          {/* Swipe indicators on card */}
          <motion.div
            style={{ opacity: leftOpacity }}
            className="absolute top-2 left-2 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold"
          >
            {leftLabel}
          </motion.div>
          <motion.div
            style={{ opacity: rightOpacity }}
            className="absolute top-2 right-2 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold"
          >
            {rightLabel}
          </motion.div>

          <p className="text-sm text-[var(--text-primary)] text-center py-4">
            {currentCard.text}
          </p>
        </motion.div>
      </div>

      {/* Button controls */}
      <div className="flex justify-center gap-4 mt-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20"
        >
          <X size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/20"
        >
          <Check size={20} />
        </motion.button>
      </div>
    </div>
  );
}
