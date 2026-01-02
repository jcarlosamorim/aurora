'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ProgressRing } from '@/components/gamification';

interface Challenge {
  id: string;
  level: number;
  name: string;
  type: string;
  duration: number;
}

interface Stack {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: string;
  order: number;
  challenges: Challenge[];
}

interface StackCardProps {
  stack: Stack;
  index: number;
  isLocked?: boolean;
  progress?: number;
  onClick?: () => void;
}

export function StackCard({ stack, index, isLocked = false, progress = 0, onClick }: StackCardProps) {
  const tools = JSON.parse(stack.tools) as string[];

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.01 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      onClick={!isLocked ? onClick : undefined}
      disabled={isLocked}
      className={`
        w-full text-left bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4
        transition-all duration-300 group relative
        ${!isLocked
          ? 'hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] cursor-pointer'
          : 'opacity-50 cursor-not-allowed'
        }
      `}
    >
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xs font-mono text-[var(--text-muted)] w-6 pt-0.5">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h3 className={`font-medium transition-colors ${
            !isLocked
              ? 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'
              : 'text-[var(--text-muted)]'
          }`}>
            {stack.name}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
            {stack.description}
          </p>
        </div>
        {isLocked ? (
          <div className="flex items-center justify-center w-12 h-12">
            <Lock size={20} className="text-[var(--text-muted)]" />
          </div>
        ) : (
          <ProgressRing
            progress={progress * 20}
            size={48}
            strokeWidth={4}
            showPercentage={false}
          />
        )}
      </div>

      {/* Ferramentas */}
      <div className="pl-9">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tools.slice(0, 3).map((tool, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]"
            >
              {tool}
            </span>
          ))}
          {tools.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--background)] text-[var(--text-muted)]">
              +{tools.length - 3}
            </span>
          )}
        </div>

        {/* Info de progresso */}
        {!isLocked && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)]">
              {progress}/5 níveis completos
            </span>
            <span className="text-[10px] text-[var(--accent)] font-medium">
              {Math.round(progress * 20)}%
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
