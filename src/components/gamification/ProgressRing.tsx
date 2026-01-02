'use client';

import { motion } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  showPercentage = true,
  label,
  className = '',
  color = 'var(--accent)',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const animatedProgress = useAnimatedCounter(Math.round(progress), 800, 0);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        />
      </svg>

      {/* Center content */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">
            {animatedProgress}%
          </span>
        </div>
      )}

      {/* Label */}
      {label && (
        <span className="mt-2 text-xs text-white/60 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
