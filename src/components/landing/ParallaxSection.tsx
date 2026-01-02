'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = slower, positive = faster
  direction?: 'up' | 'down';
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yRange = direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed];
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  depth?: number; // 0 = no movement, 1 = full movement
  offset?: number;
}

export function ParallaxLayer({
  children,
  className = '',
  depth = 0.5,
  offset = 0,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset + 150 * depth, offset - 150 * depth]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
}

// Single floater component to properly use hooks
function Floater({
  scrollYProgress,
  size,
  x,
  depth,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  size: number;
  x: string;
  depth: number;
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [200 * depth, -200 * depth]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 360 * depth]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8, 1, 0.8]
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: '50%',
        y,
        rotate,
        scale,
        width: size,
        height: size,
      }}
    >
      <div
        className="w-full h-full rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(201,162,39,0.4) 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </motion.div>
  );
}

// Floating decorative elements that move on scroll
export function ParallaxFloaters() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const floaters = [
    { size: 80, x: '10%', depth: 0.8 },
    { size: 40, x: '85%', depth: 0.4 },
    { size: 60, x: '75%', depth: 0.6 },
    { size: 30, x: '20%', depth: 0.3 },
    { size: 50, x: '50%', depth: 0.5 },
  ];

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {floaters.map((floater, i) => (
        <Floater
          key={i}
          scrollYProgress={scrollYProgress}
          size={floater.size}
          x={floater.x}
          depth={floater.depth}
        />
      ))}
    </div>
  );
}
