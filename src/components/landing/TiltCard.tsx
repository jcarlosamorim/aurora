'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
}

// Separate component for glare to avoid conditional hook calls
function GlareEffect({ glareX, glareY }: { glareX: MotionValue<string>; glareY: MotionValue<string> }) {
  const background = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.15) 0%, transparent 50%)`
  );

  return (
    <motion.div
      className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
      style={{ background }}
    />
  );
}

export function TiltCard({ children, className = '', glareEnabled = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`relative ${className}`}
    >
      {/* Content */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>

      {/* Glare effect */}
      {glareEnabled && <GlareEffect glareX={glareX} glareY={glareY} />}
    </motion.div>
  );
}
