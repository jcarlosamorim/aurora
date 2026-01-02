'use client';

import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(
  end: number,
  duration: number = 1000,
  delay: number = 0
): number {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (end === 0) {
      // Use requestAnimationFrame to avoid synchronous setState
      animationRef.current = requestAnimationFrame(() => setCount(0));
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current - delay;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * eased));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, delay]);

  return count;
}
