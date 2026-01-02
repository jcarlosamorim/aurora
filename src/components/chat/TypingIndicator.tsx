'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3">
        <div className="text-xs text-[var(--text-muted)] mb-1 font-medium">
          Aurora
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--accent)]"
              animate={{
                y: [0, -4, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
