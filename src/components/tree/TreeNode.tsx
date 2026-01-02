'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Layer, LayerState } from '@/types';

interface TreeNodeProps {
  layer: Layer;
  x: number;
  y: number;
  onClick?: () => void;
  showLabel?: boolean;
}

const iconMap: Record<string, keyof typeof Icons> = {
  'Zap': 'Zap',
  'HeartCrack': 'HeartCrack',
  'Moon': 'Moon',
  'Scale': 'Scale',
  'BatteryMedium': 'BatteryMedium',
  'Compass': 'Compass',
  'Layers': 'Layers',
  'BookOpen': 'BookOpen',
  'Link2': 'Link2',
  'RefreshCw': 'RefreshCw',
  'Sparkles': 'Sparkles',
  'Crown': 'Crown',
};

function getStateStyles(state: LayerState, strength: number) {
  switch (state) {
    case 'hidden':
      return {
        fill: 'transparent',
        stroke: 'var(--border)',
        opacity: 0.5,
        iconColor: 'text-[var(--text-muted)]',
        labelColor: 'fill-[var(--text-muted)]',
      };
    case 'emerging':
      return {
        fill: `rgba(201, 162, 39, 0.25)`,
        stroke: 'var(--accent)',
        opacity: 1,
        iconColor: 'text-[var(--accent)]',
        labelColor: 'fill-[var(--text-secondary)]',
      };
    case 'confirmed':
      return {
        fill: 'var(--success)',
        stroke: 'var(--success)',
        opacity: 1,
        iconColor: 'text-[var(--text-primary)]',
        labelColor: 'fill-[var(--text-primary)]',
      };
  }
}

export function TreeNode({ layer, x, y, onClick, showLabel }: TreeNodeProps) {
  const IconComponent = Icons[iconMap[layer.icon] || 'Circle'] as React.ComponentType<{ size: number; className?: string }>;
  const styles = getStateStyles(layer.state, layer.strength);
  const isActive = layer.state !== 'hidden';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: styles.opacity, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      style={{ cursor: isActive ? 'pointer' : 'default' }}
      role={isActive ? 'button' : undefined}
      aria-label={isActive ? `${layer.name}: ${layer.strength}%` : layer.name}
    >
      {/* Glow effect for active nodes */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={22}
          fill="none"
          stroke={layer.state === 'confirmed' ? 'var(--success)' : 'var(--accent)'}
          strokeWidth={2}
          opacity={0.4}
          animate={layer.state === 'emerging' ? {
            r: [22, 26, 22],
            opacity: [0.4, 0.2, 0.4],
          } : {}}
          transition={{
            duration: 2,
            repeat: layer.state === 'emerging' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Background circle */}
      <circle
        cx={x}
        cy={y}
        r={18}
        fill={styles.fill}
        stroke={styles.stroke}
        strokeWidth={2}
      />

      {/* Icon */}
      <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent
            size={14}
            className={styles.iconColor}
          />
        </div>
      </foreignObject>

      {/* Label - nome da camada */}
      {showLabel && (
        <text
          x={x}
          y={y + 35}
          textAnchor="middle"
          className={`text-[10px] ${styles.labelColor}`}
          style={{ fontWeight: isActive ? 500 : 400 }}
        >
          {layer.name}
        </text>
      )}

      {/* Strength percentage for active nodes */}
      {showLabel && isActive && layer.strength > 0 && (
        <text
          x={x}
          y={y + 47}
          textAnchor="middle"
          className={`text-[9px] ${layer.state === 'confirmed' ? 'fill-[var(--success)]' : 'fill-[var(--accent)]'}`}
        >
          {layer.strength}%
        </text>
      )}
    </motion.g>
  );
}
