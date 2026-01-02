'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTIONS = [
  { emoji: '👍', label: 'Útil' },
  { emoji: '💡', label: 'Insight' },
  { emoji: '🤔', label: 'Pensar mais' },
];

interface MessageReactionsProps {
  messageId: string;
  onReact?: (messageId: string, reaction: string) => void;
  className?: string;
}

export function MessageReactions({
  messageId,
  onReact,
  className = '',
}: MessageReactionsProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReact = (emoji: string) => {
    if (selectedReaction === emoji) {
      setSelectedReaction(null);
      onReact?.(messageId, '');
    } else {
      setSelectedReaction(emoji);
      onReact?.(messageId, emoji);
    }
  };

  return (
    <div className={`flex items-center gap-1 mt-2 ${className}`}>
      {REACTIONS.map(({ emoji, label }) => (
        <motion.button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className={`
            px-2 py-1 rounded-md text-sm transition-colors
            ${selectedReaction === emoji
              ? 'bg-[var(--accent)]/20 scale-110'
              : 'hover:bg-white/10'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={label}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedReaction === emoji ? 'selected' : 'default'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {emoji}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
}
