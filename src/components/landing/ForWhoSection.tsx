'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { TiltCard } from './TiltCard';

const painPoints = [
  'Já tentou infoproduto, mentoria, SaaS... nenhum pegou',
  'Pasta com 10+ cursos nunca terminados',
  'Trocar de nicho a cada 6 meses achando que agora vai',
  'Saber exatamente o que fazer — e não fazer',
  'Se perguntar se o problema é você',
];

const antiPoints = [
  'Mais um plano de ação que você não vai seguir',
  'Validação do que você já acredita',
  'Um rótulo confortável (INTJ, Eneagrama 7...)',
  'Alguém te dizendo o que fazer',
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function ForWhoSection() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Para quem É */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-6">
              Para quem está cansado de
            </h2>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-start gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                >
                  <div className="w-5 h-5 rounded border-2 border-[var(--accent)]/50 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                    <Check size={12} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm md:text-base">{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Para quem NÃO é */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <TiltCard className="h-full">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 h-full">
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-2">
                  NÃO é para quem quer
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  Se você quer conforto, vá comprar outro curso.
                </p>

                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {antiPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="flex items-start gap-3 text-[var(--text-muted)]"
                    >
                      <X size={18} className="text-[var(--error)]/50 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{point}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
