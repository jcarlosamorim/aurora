'use client';

import { motion } from 'framer-motion';

export function GoldenOrb() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Second glow ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* 3D Sphere container */}
      <div
        className="absolute inset-8 md:inset-12"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Main rotating orb */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 15, 0, -15, 0],
          }}
          transition={{
            rotateY: {
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            },
            rotateX: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Sphere surface with gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%,
                  rgba(255,223,128,0.9) 0%,
                  rgba(201,162,39,1) 30%,
                  rgba(150,120,30,1) 60%,
                  rgba(100,80,20,1) 100%
                )
              `,
              boxShadow: `
                inset -20px -20px 40px rgba(0,0,0,0.4),
                inset 10px 10px 20px rgba(255,223,128,0.4),
                0 0 60px rgba(201,162,39,0.6),
                0 0 120px rgba(201,162,39,0.3)
              `,
            }}
          />

          {/* Highlight/reflection */}
          <motion.div
            className="absolute rounded-full"
            style={{
              top: '15%',
              left: '20%',
              width: '25%',
              height: '20%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
              filter: 'blur(2px)',
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Rotating ring 1 */}
          <motion.div
            className="absolute inset-[-10%] rounded-full border border-[var(--accent)]/30"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(75deg)',
            }}
            animate={{
              rotateZ: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Rotating ring 2 */}
          <motion.div
            className="absolute inset-[-15%] rounded-full border border-[var(--accent)]/20"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(60deg) rotateY(45deg)',
            }}
            animate={{
              rotateZ: [360, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[var(--accent)]"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-4px',
                marginLeft: '-4px',
                boxShadow: '0 0 10px rgba(201,162,39,0.8)',
              }}
              animate={{
                x: [
                  Math.cos((i * Math.PI) / 2) * 60,
                  Math.cos((i * Math.PI) / 2 + Math.PI) * 60,
                  Math.cos((i * Math.PI) / 2) * 60,
                ],
                y: [
                  Math.sin((i * Math.PI) / 2) * 60,
                  Math.sin((i * Math.PI) / 2 + Math.PI) * 60,
                  Math.sin((i * Math.PI) / 2) * 60,
                ],
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.5,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Center eye/core */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fff 0%, rgba(201,162,39,1) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(201,162,39,0.8)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
