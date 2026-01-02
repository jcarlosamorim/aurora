'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Send, AlertTriangle } from 'lucide-react';

interface TimerChallengeProps {
  prompt: string;
  duration: number; // seconds
  minItems?: number;
  onComplete: (items: string[], timeRemaining: number) => void;
  xpBase?: number;
  xpBonusPerSecond?: number;
}

export function TimerChallenge({
  prompt,
  duration,
  minItems = 1,
  onComplete,
  xpBase = 15,
  xpBonusPerSecond = 1,
}: TimerChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [items, setItems] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 10;
  const isExpired = timeLeft <= 0;

  // Timer countdown
  useEffect(() => {
    if (isComplete || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, isExpired]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addItem = () => {
    if (!currentInput.trim()) return;
    setItems(prev => [...prev, currentInput.trim()]);
    setCurrentInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const handleSubmit = () => {
    if (isComplete) return;
    setIsComplete(true);

    const finalItems = currentInput.trim()
      ? [...items, currentInput.trim()]
      : items;

    const bonusXp = timeLeft * xpBonusPerSecond;
    if (bonusXp > 0) {
      setShowBonus(true);
    }

    setTimeout(() => {
      onComplete(finalItems, timeLeft);
    }, 1500);
  };

  const totalXp = xpBase + (timeLeft * xpBonusPerSecond);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-3xl mb-2"
        >
          {items.length >= minItems ? '🎉' : '⏰'}
        </motion.div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {items.length} {items.length === 1 ? 'item' : 'itens'} em {duration - timeLeft}s
        </p>
        <AnimatePresence>
          {showBonus && timeLeft > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[var(--accent)] mt-1 flex items-center justify-center gap-1"
            >
              <Zap size={12} />
              +{totalXp} XP (bônus de tempo: +{timeLeft * xpBonusPerSecond})
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isUrgent ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {isUrgent ? (
              <AlertTriangle size={16} className="text-orange-400" />
            ) : (
              <Clock size={16} className="text-[var(--accent)]" />
            )}
          </motion.div>
          <span className={`text-sm font-mono font-bold ${isUrgent ? 'text-orange-400' : 'text-[var(--text-primary)]'}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full ${isUrgent ? 'bg-orange-400' : 'bg-[var(--accent)]'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Prompt */}
      <p className="text-sm text-[var(--text-primary)] mb-3 font-medium">
        {prompt}
      </p>

      {/* Items list */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {items.map((item, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
            >
              {item}
            </motion.span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite e pressione Enter..."
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addItem}
          disabled={!currentInput.trim()}
          className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent)] disabled:opacity-50"
        >
          +
        </motion.button>
      </div>

      {/* Submit button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={items.length < minItems && !currentInput.trim()}
        className="w-full mt-3 py-2.5 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send size={14} />
        Enviar ({items.length + (currentInput.trim() ? 1 : 0)} itens)
      </motion.button>

      {/* Bonus hint */}
      <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
        ⚡ Bônus: +{xpBonusPerSecond} XP por segundo restante
      </p>
    </div>
  );
}
