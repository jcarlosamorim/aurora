'use client';

import { motion } from 'framer-motion';
import { Brain, Dna, Target, X } from 'lucide-react';
import { TiltCard } from './TiltCard';

const foundations = [
  {
    icon: Brain,
    title: 'Psicologia Profunda',
    description: 'Sombra (Jung), Esquemas Cognitivos (Beck), Identidade Narrativa (McAdams) — os padrões que operam enquanto você dorme.',
  },
  {
    icon: Dna,
    title: 'Ciência da Decisão',
    description: 'Por que você decide emocionalmente e justifica racionalmente — baseado em Kahneman (Nobel 2002).',
  },
  {
    icon: Target,
    title: 'Intervenções Validadas',
    description: 'Terapia Cognitivo-Comportamental, Schema Therapy, Psicologia Positiva — adaptadas de protocolos clínicos.',
  },
];

const notThis = [
  'Chakras ou energia',
  'Espiritualidade abstrata',
  'Pensamento positivo',
  'Lei da atração',
];

export function MethodologySection() {
  return (
    <section className="py-14 md:py-20 px-6 bg-[var(--surface)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[var(--accent)] font-medium uppercase tracking-wider mb-4">
            A Base Científica
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-6">
            De Kahneman a Jung. De Bowlby a Csikszentmihalyi.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Aurora sintetiza 12 frameworks científicos validados em uma metodologia prática.
            O resultado: sua <span className="text-[var(--accent)] font-medium">Zona de Genialidade</span> — onde trabalho vira jogo.
          </p>
        </motion.div>

        {/* What it IS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {foundations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)]/50 transition-colors h-full">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                    <item.icon size={24} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {item.description}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* The Science - Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--background)] border border-[var(--accent)]/30 rounded-xl p-8 mb-12"
        >
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs text-[var(--accent)] font-medium uppercase tracking-wider mb-4">
              A Diferença
            </p>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Metodologia, não achismo.
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Aurora cruza suas respostas com <span className="text-[var(--accent)] font-medium">padrões validados cientificamente</span>.
              Cada revelação segue um protocolo — não é intuição, é método.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent)]">12</p>
                <p className="text-xs text-[var(--text-muted)]">Camadas estruturadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent)]">40+</p>
                <p className="text-xs text-[var(--text-muted)]">Anos de pesquisa</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent)]">15min</p>
                <p className="text-xs text-[var(--text-muted)]">Para resultado</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What it's NOT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          <span className="text-sm text-[var(--text-muted)] mr-2">Isso não é:</span>
          {notThis.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm text-[var(--text-muted)]"
            >
              <X size={12} className="text-[var(--error)]/50" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
