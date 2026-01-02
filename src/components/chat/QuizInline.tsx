'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface QuizInlineProps {
  question: string;
  options: QuizOption[];
  onAnswer: (option: QuizOption) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  xpReward?: number;
}

export function QuizInline({
  question,
  options,
  onAnswer,
  disabled = false,
  showFeedback = true,
  xpReward = 10,
}: QuizInlineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: QuizOption) => {
    if (answered || disabled) return;

    setSelectedId(option.id);
    setAnswered(true);

    // Small delay for visual feedback before triggering callback
    setTimeout(() => {
      onAnswer(option);
    }, 600);
  };

  const getOptionState = (option: QuizOption) => {
    if (!answered) return 'default';
    if (option.id === selectedId) {
      return option.isCorrect ? 'correct' : 'incorrect';
    }
    if (option.isCorrect && showFeedback) return 'reveal-correct';
    return 'default';
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
        {question}
      </p>

      <div className="space-y-2">
        {options.map((option, index) => {
          const state = getOptionState(option);

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={answered || disabled}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.98 } : {}}
              className={`
                w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-300
                flex items-center gap-3 group
                ${state === 'default' && !answered
                  ? 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 cursor-pointer'
                  : ''
                }
                ${state === 'default' && answered
                  ? 'border-[var(--border)] bg-[var(--surface)] opacity-50'
                  : ''
                }
                ${state === 'correct'
                  ? 'border-green-500 bg-green-500/10'
                  : ''
                }
                ${state === 'incorrect'
                  ? 'border-red-500 bg-red-500/10'
                  : ''
                }
                ${state === 'reveal-correct'
                  ? 'border-green-500/50 bg-green-500/5'
                  : ''
                }
                ${answered ? 'cursor-default' : ''}
              `}
            >
              {/* Letter indicator */}
              <span className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                transition-colors
                ${state === 'correct' ? 'bg-green-500 text-white' : ''}
                ${state === 'incorrect' ? 'bg-red-500 text-white' : ''}
                ${state === 'reveal-correct' ? 'bg-green-500/30 text-green-400' : ''}
                ${state === 'default' ? 'bg-[var(--background)] text-[var(--text-muted)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)]' : ''}
              `}>
                {state === 'correct' ? <Check size={14} /> :
                 state === 'incorrect' ? <X size={14} /> :
                 String.fromCharCode(65 + index)}
              </span>

              {/* Option text */}
              <span className={`
                flex-1 text-sm
                ${state === 'correct' ? 'text-green-400 font-medium' : ''}
                ${state === 'incorrect' ? 'text-red-400' : ''}
                ${state === 'reveal-correct' ? 'text-green-400/70' : ''}
                ${state === 'default' ? 'text-[var(--text-primary)]' : ''}
              `}>
                {option.text}
              </span>

              {/* XP indicator for correct answer */}
              {state === 'correct' && xpReward > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex items-center gap-1 text-xs font-bold text-[var(--accent)]"
                >
                  <Zap size={12} />
                  +{xpReward} XP
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback message */}
      {answered && showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`
            mt-3 px-3 py-2 rounded-lg text-xs font-medium
            ${selectedId && options.find(o => o.id === selectedId)?.isCorrect
              ? 'bg-green-500/10 text-green-400'
              : 'bg-[var(--surface)] text-[var(--text-muted)]'
            }
          `}
        >
          {selectedId && options.find(o => o.id === selectedId)?.isCorrect
            ? '🎯 Excelente! Você acertou!'
            : '💪 Continue tentando! O importante é aprender.'}
        </motion.div>
      )}
    </div>
  );
}
