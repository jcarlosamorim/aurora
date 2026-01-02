'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FlashcardFlipProps {
  front: string;
  back: string;
  frontEmoji?: string;
  backEmoji?: string;
  onComplete: (remembered: boolean) => void;
  xpReward?: number;
}

export function FlashcardFlip({
  front,
  back,
  frontEmoji = '❓',
  backEmoji = '💡',
  onComplete,
  xpReward = 8,
}: FlashcardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [showXp, setShowXp] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleResult = (remembered: boolean) => {
    setResult(remembered);
    setIsComplete(true);
    if (remembered) {
      setShowXp(true);
    }
    setTimeout(() => {
      onComplete(remembered);
    }, 1000);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="text-3xl mb-2"
        >
          {result ? '🎉' : '💪'}
        </motion.div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {result ? 'Ótima memória!' : 'Continue praticando!'}
        </p>
        <AnimatePresence>
          {showXp && result && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[var(--accent)] mt-2 flex items-center justify-center gap-1"
            >
              <Zap size={12} />
              +{xpReward} XP
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Instructions */}
      {!isFlipped && (
        <p className="text-xs text-[var(--text-muted)] text-center mb-3">
          Tente lembrar a resposta, depois toque para revelar
        </p>
      )}

      {/* Card container */}
      <div
        className="relative w-full h-40 cursor-pointer perspective-1000"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl p-4 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-3xl mb-2">{frontEmoji}</span>
            <p className="text-sm font-medium text-[var(--background)]">
              {front}
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-3 text-[var(--background)]/60 text-xs flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Toque para virar
            </motion.div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full bg-[var(--surface)] border-2 border-[var(--accent)] rounded-xl p-4 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-3xl mb-2">{backEmoji}</span>
            <p className="text-sm text-[var(--text-primary)]">
              {back}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Result buttons (only show when flipped) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <p className="text-xs text-[var(--text-muted)] text-center mb-3">
              Você lembrou corretamente?
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResult(false)}
                className="flex-1 py-2.5 bg-[var(--surface)] border border-red-500/30 text-red-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-500/10"
              >
                <ThumbsDown size={16} />
                Não lembrei
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResult(true)}
                className="flex-1 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-500/20"
              >
                <ThumbsUp size={16} />
                Lembrei!
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
