'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  xOffset: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

// Pre-computed deterministic values to avoid hydration mismatch
const PARTICLE_DATA: Particle[] = [
  { id: 0, x: 12, y: 8, size: 2, duration: 18, delay: 1, opacity: 0.2, xOffset: 5 },
  { id: 1, x: 45, y: 15, size: 1.5, duration: 22, delay: 3, opacity: 0.15, xOffset: -3 },
  { id: 2, x: 78, y: 22, size: 2.5, duration: 25, delay: 0, opacity: 0.25, xOffset: 8 },
  { id: 3, x: 23, y: 35, size: 1.8, duration: 20, delay: 5, opacity: 0.18, xOffset: -6 },
  { id: 4, x: 56, y: 42, size: 3, duration: 28, delay: 2, opacity: 0.3, xOffset: 4 },
  { id: 5, x: 89, y: 18, size: 1.2, duration: 16, delay: 7, opacity: 0.12, xOffset: -8 },
  { id: 6, x: 34, y: 55, size: 2.2, duration: 24, delay: 4, opacity: 0.22, xOffset: 6 },
  { id: 7, x: 67, y: 62, size: 1.6, duration: 19, delay: 6, opacity: 0.16, xOffset: -4 },
  { id: 8, x: 8, y: 48, size: 2.8, duration: 26, delay: 1, opacity: 0.28, xOffset: 7 },
  { id: 9, x: 92, y: 38, size: 1.4, duration: 21, delay: 8, opacity: 0.14, xOffset: -5 },
  { id: 10, x: 15, y: 72, size: 2.4, duration: 23, delay: 3, opacity: 0.24, xOffset: 3 },
  { id: 11, x: 48, y: 78, size: 1.7, duration: 17, delay: 5, opacity: 0.17, xOffset: -7 },
  { id: 12, x: 81, y: 85, size: 3.2, duration: 30, delay: 0, opacity: 0.32, xOffset: 9 },
  { id: 13, x: 26, y: 92, size: 1.3, duration: 15, delay: 9, opacity: 0.13, xOffset: -2 },
  { id: 14, x: 59, y: 5, size: 2.6, duration: 27, delay: 2, opacity: 0.26, xOffset: 5 },
  { id: 15, x: 3, y: 28, size: 1.9, duration: 20, delay: 4, opacity: 0.19, xOffset: -9 },
  { id: 16, x: 37, y: 12, size: 2.1, duration: 22, delay: 6, opacity: 0.21, xOffset: 2 },
  { id: 17, x: 70, y: 45, size: 1.1, duration: 18, delay: 8, opacity: 0.11, xOffset: -1 },
  { id: 18, x: 95, y: 58, size: 2.9, duration: 29, delay: 1, opacity: 0.29, xOffset: 10 },
  { id: 19, x: 18, y: 65, size: 1.5, duration: 16, delay: 7, opacity: 0.15, xOffset: -10 },
  { id: 20, x: 51, y: 25, size: 2.3, duration: 24, delay: 3, opacity: 0.23, xOffset: 4 },
  { id: 21, x: 84, y: 32, size: 1.8, duration: 21, delay: 5, opacity: 0.18, xOffset: -6 },
  { id: 22, x: 6, y: 88, size: 3.5, duration: 32, delay: 0, opacity: 0.35, xOffset: 8 },
  { id: 23, x: 40, y: 95, size: 1.2, duration: 17, delay: 9, opacity: 0.12, xOffset: -3 },
  { id: 24, x: 73, y: 2, size: 2.7, duration: 26, delay: 2, opacity: 0.27, xOffset: 6 },
  { id: 25, x: 28, y: 52, size: 2, duration: 19, delay: 4, opacity: 0.2, xOffset: -8 },
  { id: 26, x: 62, y: 68, size: 1.6, duration: 23, delay: 6, opacity: 0.16, xOffset: 3 },
  { id: 27, x: 97, y: 75, size: 3.1, duration: 28, delay: 1, opacity: 0.31, xOffset: -4 },
  { id: 28, x: 21, y: 82, size: 1.4, duration: 15, delay: 8, opacity: 0.14, xOffset: 7 },
  { id: 29, x: 54, y: 10, size: 2.5, duration: 25, delay: 3, opacity: 0.25, xOffset: -5 },
];

const STAR_DATA: Star[] = [
  { id: 0, x: 10, y: 15, duration: 3.5, delay: 0 },
  { id: 1, x: 22, y: 35, duration: 4, delay: 1.5 },
  { id: 2, x: 34, y: 20, duration: 3.2, delay: 2.8 },
  { id: 3, x: 46, y: 45, duration: 4.5, delay: 0.8 },
  { id: 4, x: 58, y: 12, duration: 3.8, delay: 3.2 },
  { id: 5, x: 70, y: 55, duration: 4.2, delay: 1.2 },
  { id: 6, x: 82, y: 28, duration: 3.3, delay: 2.5 },
  { id: 7, x: 94, y: 42, duration: 4.8, delay: 0.5 },
];

export function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid the cascading renders lint error
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const particles = useMemo<Particle[]>(() => PARTICLE_DATA, []);
  const stars = useMemo<Star[]>(() => STAR_DATA, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[var(--accent)]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Occasional brighter stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: 4,
            height: 4,
            background: 'radial-gradient(circle, rgba(201,162,39,0.8) 0%, rgba(201,162,39,0) 70%)',
            boxShadow: '0 0 10px rgba(201,162,39,0.5)',
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
