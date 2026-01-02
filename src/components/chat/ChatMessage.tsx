'use client';

import { motion } from 'framer-motion';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAurora = message.role === 'aurora';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isAurora ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isAurora
            ? 'bg-[var(--surface)] text-[var(--text-primary)]'
            : 'bg-[var(--surface-elevated)] text-[var(--text-primary)]'
        }`}
      >
        {isAurora && (
          <div className="text-xs text-[var(--text-muted)] mb-1 font-medium">
            Aurora
          </div>
        )}
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
