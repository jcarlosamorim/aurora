'use client';

import { motion } from 'framer-motion';
import { StackCard } from './StackCard';

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

interface StackGridProps {
  stacks: Stack[];
  onStackClick?: (stack: Stack) => void;
}

export function StackGrid({ stacks, onStackClick }: StackGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {stacks.map((stack, index) => (
        <motion.div
          key={stack.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <StackCard
            stack={stack}
            index={index}
            isLocked={index > 0}
            progress={index === 0 ? 2 : 0}
            onClick={() => onStackClick?.(stack)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
