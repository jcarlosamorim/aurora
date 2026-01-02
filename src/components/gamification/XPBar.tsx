'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  currentXp: number;
  xpForNextLevel: number;
  level: number;
  showLabel?: boolean;
  className?: string;
}

export function XPBar({
  currentXp,
  xpForNextLevel,
  level: _level,
  showLabel = true,
  className = '',
}: XPBarProps) {
  // _level reserved for future color customization based on level
  const progress = Math.min((currentXp / xpForNextLevel) * 100, 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
            width: '20%',
          }}
          animate={{
            x: ['0%', '500%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-white/60 whitespace-nowrap">
          {currentXp}/{xpForNextLevel} XP
        </span>
      )}
    </div>
  );
}
