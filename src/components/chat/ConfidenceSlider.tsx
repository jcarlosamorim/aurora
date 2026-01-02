'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ConfidenceSliderProps {
  question: string;
  leftLabel?: string;
  rightLabel?: string;
  leftEmoji?: string;
  rightEmoji?: string;
  onSubmit: (value: number) => void;
  xpReward?: number;
}

export function ConfidenceSlider({
  question,
  leftLabel = 'Nada confiante',
  rightLabel = 'Muito confiante',
  leftEmoji = '😰',
  rightEmoji = '😎',
  onSubmit,
  xpReward = 5,
}: ConfidenceSliderProps) {
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowXp(true);
    setTimeout(() => {
      onSubmit(value);
    }, 1000);
  };

  // Calculate emoji based on value
  const getEmoji = () => {
    if (value < 20) return '😰';
    if (value < 40) return '😕';
    if (value < 60) return '😐';
    if (value < 80) return '🙂';
    return '😎';
  };

  // Calculate color based on value
  const getColor = () => {
    if (value < 30) return '#ef4444';
    if (value < 50) return '#f59e0b';
    if (value < 70) return '#eab308';
    if (value < 90) return '#84cc16';
    return '#22c55e';
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="text-4xl mb-2"
        >
          {getEmoji()}
        </motion.div>
        <p className="text-lg font-bold text-[var(--text-primary)]">
          {value}%
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {value < 50 ? 'Vamos trabalhar nisso!' : 'Ótima confiança!'}
        </p>
        <AnimatePresence>
          {showXp && (
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
      <p className="text-sm font-medium text-[var(--text-primary)] mb-4 text-center">
        {question}
      </p>

      {/* Value display */}
      <div className="text-center mb-4">
        <motion.span
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-3xl"
        >
          {getEmoji()}
        </motion.span>
        <motion.p
          className="text-2xl font-bold mt-1"
          style={{ color: getColor() }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          {value}%
        </motion.p>
      </div>

      {/* Labels */}
      <div className="flex justify-between mb-2 px-1">
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          {leftEmoji} {leftLabel}
        </span>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          {rightLabel} {rightEmoji}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-3 bg-[var(--surface)] rounded-full overflow-hidden">
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: getColor() }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 shadow-lg cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(${value}% - 12px)`,
            borderColor: getColor(),
          }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        />

        {/* Invisible range input for interaction */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between px-1 mt-1">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="text-[10px] text-[var(--text-muted)]">
            {tick}
          </span>
        ))}
      </div>

      {/* Submit button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full mt-4 py-2.5 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium text-sm"
      >
        Confirmar {value}%
      </motion.button>
    </div>
  );
}
