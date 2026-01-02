'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Layer } from '@/types';

interface MilestoneNotificationProps {
  layer: Layer | null;
  onDismiss: () => void;
}

export function MilestoneNotification({ layer, onDismiss }: MilestoneNotificationProps) {
  if (!layer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <motion.div
          className="flex items-center gap-3 px-5 py-3 bg-[var(--surface-elevated)] border border-[var(--accent)] rounded-lg shadow-2xl"
          initial={{ boxShadow: '0 0 0 0 rgba(201, 162, 39, 0)' }}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(201, 162, 39, 0.4)',
              '0 0 20px 10px rgba(201, 162, 39, 0)',
            ],
          }}
          transition={{ duration: 1, repeat: 2 }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/20">
            <Sparkles className="text-[var(--accent)]" size={20} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-medium">
              Revelado
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {layer.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Toque na árvore para ver mais
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="ml-4 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
