'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export interface WheelOption {
  id: string;
  text: string;
  emoji?: string;
  color?: string;
}

interface WheelSpinProps {
  options: WheelOption[];
  onResult: (option: WheelOption) => void;
  title?: string;
  xpReward?: number;
}

const COLORS = [
  'var(--accent)',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
];

export function WheelSpin({
  options,
  onResult,
  title = 'Gire para seu desafio!',
  xpReward = 10,
}: WheelSpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelOption | null>(null);
  const [showXp, setShowXp] = useState(false);

  const segmentAngle = 360 / options.length;

  const spin = () => {
    if (isSpinning || result) return;

    setIsSpinning(true);

    // Random result
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    // Calculate rotation to land on selected option
    // Add multiple full rotations for effect
    const fullRotations = 5 + Math.random() * 3;
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = fullRotations * 360 + targetAngle;

    setRotation(totalRotation);

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedOption);
      setShowXp(true);

      setTimeout(() => {
        onResult(selectedOption);
      }, 1500);
    }, 4000);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-4xl mb-3"
        >
          {result.emoji || '🎯'}
        </motion.div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
          {result.text}
        </p>
        <AnimatePresence>
          {showXp && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[var(--accent)] flex items-center justify-center gap-1"
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
    <div className="w-full flex flex-col items-center">
      <p className="text-sm font-medium text-[var(--text-primary)] mb-4">
        {title}
      </p>

      {/* Wheel container */}
      <div className="relative w-48 h-48 mb-4">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[var(--accent)]" />
        </div>

        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full relative overflow-hidden border-4 border-[var(--border)]"
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          style={{ transformOrigin: 'center center' }}
        >
          {options.map((option, i) => {
            const startAngle = i * segmentAngle;
            const color = option.color || COLORS[i % COLORS.length];

            return (
              <div
                key={option.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${startAngle}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <div
                  className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                  style={{
                    transform: `rotate(${segmentAngle}deg) skewY(${90 - segmentAngle}deg)`,
                    background: color,
                  }}
                />
                {/* Label */}
                <div
                  className="absolute top-[15%] left-1/2 -translate-x-1/2 text-center"
                  style={{
                    transform: `rotate(${segmentAngle / 2}deg)`,
                  }}
                >
                  <span className="text-lg">{option.emoji}</span>
                </div>
              </div>
            );
          })}

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--background)] border-2 border-[var(--border)] flex items-center justify-center">
            <Sparkles size={16} className="text-[var(--accent)]" />
          </div>
        </motion.div>
      </div>

      {/* Options list for clarity */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {options.map((option, i) => (
          <span
            key={option.id}
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{
              borderColor: option.color || COLORS[i % COLORS.length],
              color: option.color || COLORS[i % COLORS.length],
            }}
          >
            {option.emoji} {option.text}
          </span>
        ))}
      </div>

      {/* Spin button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spin}
        disabled={isSpinning}
        className="px-6 py-2.5 bg-[var(--accent)] text-[var(--background)] rounded-full font-bold text-sm flex items-center gap-2 disabled:opacity-50"
      >
        {isSpinning ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              🎰
            </motion.span>
            Girando...
          </>
        ) : (
          <>
            🎰 GIRAR!
          </>
        )}
      </motion.button>
    </div>
  );
}
