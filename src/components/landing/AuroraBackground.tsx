'use client';

import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0D0D0D] to-[#0D0D0D]" />

      {/* Aurora layer 1 - Gold/Amber (primary brand color) */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(201,162,39,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(201,162,39,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 80% 20%, rgba(201,162,39,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 50% 10%, rgba(201,162,39,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(201,162,39,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora layer 2 - Teal/Cyan accent */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(56,189,248,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(56,189,248,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(56,189,248,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(56,189,248,0.25) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora layer 3 - Purple/Violet mystical */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'radial-gradient(ellipse 70% 60% at 40% 10%, rgba(139,92,246,0.3) 0%, transparent 40%)',
            'radial-gradient(ellipse 70% 60% at 60% 20%, rgba(139,92,246,0.3) 0%, transparent 40%)',
            'radial-gradient(ellipse 70% 60% at 80% 10%, rgba(139,92,246,0.3) 0%, transparent 40%)',
            'radial-gradient(ellipse 70% 60% at 40% 10%, rgba(139,92,246,0.3) 0%, transparent 40%)',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
