'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.3) 0%, rgba(201,162,39,0) 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[var(--accent)] font-medium mb-4 text-glow">
            Janeiro de 2026
          </p>
          <p className="text-lg text-[var(--text-secondary)] mb-2">
            Você vai fazer novas metas.
          </p>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Em março, vai ter abandonado de novo.
          </p>

          <p className="text-base text-[var(--text-muted)] mb-8 italic">
            A menos que você descubra o padrão que te faz parar.
            <br />
            Aurora mapeia qual é — com método, não achismo.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-8">
            Comece 2026 sabendo a verdade sobre você.
          </h2>

          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--accent)] text-[var(--background)] px-10 py-5 rounded-lg font-medium text-lg transition-all duration-300 animate-pulse-glow hover:animate-none hover:glow-accent-strong"
            >
              Ver o que você está escondendo
            </motion.button>
          </Link>

          <p className="text-sm text-[var(--text-muted)] mt-6">
            15 minutos. Sem cadastro. Sem cartão.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
