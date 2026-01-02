'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { GoldenOrb } from './GoldenOrb';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl relative z-10"
      >
        {/* 3D Golden Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        >
          <GoldenOrb />
        </motion.div>

        {/* Aurora logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-3xl md:text-4xl font-light tracking-[0.4em] text-[var(--accent)] text-glow uppercase">
            Aurora
          </span>
        </motion.div>

        {/* Timing hook */}
        <motion.p
          className="text-sm text-[var(--text-muted)] font-medium mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Janeiro de 2026
        </motion.p>

        {/* Single powerful headline */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Esse ano vai ser diferente?
          <br />
          <span className="text-[var(--text-secondary)]">Só se você parar de se enganar.</span>
        </motion.h1>

        {/* Single subheadline */}
        <motion.p
          className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Não é falta de disciplina. É um padrão que você repete — Aurora mapeia qual.
        </motion.p>

        {/* Primary CTA with glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,162,39,0.6)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--accent)] text-[var(--background)] px-10 py-5 rounded-lg font-medium text-lg transition-all duration-300 animate-pulse-glow hover:animate-none"
            >
              Descobrir meu padrão
            </motion.button>
          </Link>
        </motion.div>

        <motion.p
          className="text-sm text-[var(--text-muted)] mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          15 minutos. Sem cadastro. Sem cartão.
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
