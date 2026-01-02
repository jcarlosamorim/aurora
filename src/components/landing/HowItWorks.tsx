'use client';

import { motion } from 'framer-motion';

const steps = [
  { number: '1', title: 'Aurora faz perguntas', detail: 'Não sobre o que você quer. Sobre o que você evita.' },
  { number: '2', title: 'Você vê o padrão', detail: 'A diferença entre o que diz e o que faz.' },
  { number: '3', title: 'Você decide', detail: 'Aurora não prescreve. Você escolhe.' },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-6"
        >
          O Protocolo de 15 Minutos
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-[var(--text-secondary)] italic mb-16 max-w-xl mx-auto"
        >
          Aurora não analisa o que você diz.
          <br />
          Analisa o que você <span className="text-[var(--text-primary)]">evita</span> dizer.
        </motion.p>

        <div className="relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-[var(--border)]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-bold text-lg mb-4 group-hover:scale-110 group-hover:bg-[var(--accent)]/30 transition-all duration-300 relative z-10">
                  {step.number}
                </div>
                <p className="text-lg font-medium text-[var(--text-primary)]">
                  {step.title}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {step.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
