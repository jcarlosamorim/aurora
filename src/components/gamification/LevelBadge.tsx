'use client';

import { motion } from 'framer-motion';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

function getLevelColor(level: number): { bg: string; text: string; border: string } {
  if (level >= 10) {
    // Diamond
    return {
      bg: 'bg-gradient-to-br from-cyan-300 to-blue-400',
      text: 'text-blue-900',
      border: 'border-cyan-200',
    };
  } else if (level >= 7) {
    // Gold
    return {
      bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      text: 'text-amber-900',
      border: 'border-yellow-300',
    };
  } else if (level >= 4) {
    // Silver
    return {
      bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
      text: 'text-gray-800',
      border: 'border-gray-200',
    };
  } else {
    // Bronze
    return {
      bg: 'bg-gradient-to-br from-orange-400 to-amber-600',
      text: 'text-orange-900',
      border: 'border-orange-300',
    };
  }
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-lg',
};

export function LevelBadge({ level, size = 'md', animate = false }: LevelBadgeProps) {
  const colors = getLevelColor(level);

  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        ${colors.bg}
        ${colors.text}
        rounded-full
        flex items-center justify-center
        font-bold
        border-2 ${colors.border}
        shadow-lg
      `}
      initial={animate ? { scale: 0 } : false}
      animate={animate ? { scale: 1 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
    >
      {level}
    </motion.div>
  );
}
