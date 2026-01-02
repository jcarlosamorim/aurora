'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, HelpCircle, Lightbulb, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  message: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success';
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'understood',
    label: 'Entendi!',
    message: 'Entendi! Pode continuar.',
    icon: <ThumbsUp size={14} />,
    variant: 'success',
  },
  {
    id: 'explain-more',
    label: 'Explica mais',
    message: 'Pode explicar isso de forma mais detalhada?',
    icon: <HelpCircle size={14} />,
  },
  {
    id: 'example',
    label: 'Exemplo prático',
    message: 'Pode me dar um exemplo prático disso?',
    icon: <Lightbulb size={14} />,
  },
  {
    id: 'next',
    label: 'Próximo',
    message: 'Vamos para o próximo passo!',
    icon: <ArrowRight size={14} />,
    variant: 'primary',
  },
];

const REFLECTION_ACTIONS: QuickAction[] = [
  {
    id: 'try-again',
    label: 'Tentar de novo',
    message: 'Quero tentar responder de novo.',
    icon: <RotateCcw size={14} />,
  },
  {
    id: 'hint',
    label: 'Me dá uma dica',
    message: 'Pode me dar uma dica para pensar melhor?',
    icon: <Sparkles size={14} />,
    variant: 'primary',
  },
];

interface QuickActionsProps {
  onAction: (action: QuickAction) => void;
  actions?: QuickAction[];
  context?: 'default' | 'reflection' | 'quiz-wrong';
  disabled?: boolean;
  className?: string;
}

export function QuickActions({
  onAction,
  actions,
  context = 'default',
  disabled = false,
  className = '',
}: QuickActionsProps) {
  // Select actions based on context
  const displayActions = actions || (
    context === 'reflection' || context === 'quiz-wrong'
      ? REFLECTION_ACTIONS
      : DEFAULT_ACTIONS
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {displayActions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => !disabled && onAction(action)}
          disabled={disabled}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium
            transition-all duration-200 border
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${action.variant === 'primary'
              ? 'bg-[var(--accent)] text-[var(--background)] border-[var(--accent)] hover:bg-[var(--accent-hover)]'
              : action.variant === 'success'
                ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }
          `}
        >
          {action.icon}
          {action.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Export default actions for reuse
export { DEFAULT_ACTIONS, REFLECTION_ACTIONS };
