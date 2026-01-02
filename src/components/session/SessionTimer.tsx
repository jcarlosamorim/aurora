'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SessionTimerProps {
  durationMinutes: number;
  onTimeUp?: () => void;
  isRunning?: boolean;
}

export function SessionTimer({ durationMinutes, onTimeUp, isRunning = true }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;
  const isUrgent = timeLeft < 120; // less than 2 minutes

  return (
    <div className="flex items-center gap-3">
      {/* Timer display */}
      <div className={`flex items-center gap-1 font-mono text-lg font-semibold ${
        isUrgent ? 'text-red-400' : 'text-[var(--text-primary)]'
      }`}>
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.span>
      </div>

      {/* Progress ring */}
      <div className="relative w-8 h-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
          <circle
            cx={16}
            cy={16}
            r={14}
            fill="none"
            stroke="var(--surface)"
            strokeWidth={3}
          />
          <motion.circle
            cx={16}
            cy={16}
            r={14}
            fill="none"
            stroke={isUrgent ? '#ef4444' : 'var(--accent)'}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={88}
            initial={{ strokeDashoffset: 88 }}
            animate={{ strokeDashoffset: 88 - (progress / 100) * 88 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
}
