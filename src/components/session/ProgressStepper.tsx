'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SessionPhase } from '@/types';

interface ProgressStepperProps {
  currentPhase: SessionPhase;
  discoveredLayers: number;
}

const PHASES: { id: SessionPhase; label: string; minLayers: number }[] = [
  { id: 'abertura', label: 'Loop', minLayers: 0 },
  { id: 'exploracao', label: 'Espelho', minLayers: 2 },
  { id: 'aprofundamento', label: 'Raiz', minLayers: 5 },
  { id: 'sintese', label: 'Verdade', minLayers: 8 },
  { id: 'fechamento', label: 'Você', minLayers: 10 },
];

export function ProgressStepper({ currentPhase, discoveredLayers }: ProgressStepperProps) {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-1">
      {PHASES.map((phase, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLocked = index > currentIndex;

        return (
          <div key={phase.id} className="flex items-center">
            {/* Step indicator */}
            <div className="relative group">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isComplete
                    ? 'var(--success)'
                    : isCurrent
                      ? 'var(--accent)'
                      : 'var(--surface)'
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                  isComplete
                    ? 'text-white'
                    : isCurrent
                      ? 'text-[var(--background)]'
                      : 'text-[var(--text-muted)]'
                }`}
              >
                {isComplete ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--surface-elevated)] rounded text-[10px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {phase.label}
                {isCurrent && (
                  <span className="block text-[var(--accent)]">Você está aqui</span>
                )}
              </div>
            </div>

            {/* Connector */}
            {index < PHASES.length - 1 && (
              <div className={`w-4 h-0.5 ${
                index < currentIndex
                  ? 'bg-[var(--success)]'
                  : 'bg-[var(--surface)]'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
