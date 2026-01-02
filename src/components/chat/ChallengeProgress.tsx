'use client';

import { motion } from 'framer-motion';

interface ChallengeProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ChallengeProgress({
  currentStep,
  totalSteps,
  className = '',
}: ChallengeProgressProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <motion.div
              key={i}
              className={`
                w-2.5 h-2.5 rounded-full transition-colors
                ${isCompleted
                  ? 'bg-[var(--accent)]'
                  : isCurrent
                    ? 'bg-[var(--accent)]/50'
                    : 'bg-white/20'
                }
              `}
              initial={false}
              animate={isCurrent ? {
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isCurrent ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
      <span className="text-xs text-[var(--text-muted)]">
        {currentStep}/{totalSteps} etapas
      </span>
    </div>
  );
}
