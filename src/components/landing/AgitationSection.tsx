'use client';

import { motion } from 'framer-motion';

const painPoints = [
  'Já tentou infoproduto, mentoria, SaaS... nenhum pegou',
  'Pasta com 10+ cursos nunca terminados',
  'Trocar de nicho a cada 6 meses achando que agora vai',
  'Saber exatamente o que fazer — e não fazer',
  'Se perguntar se o problema é você',
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function AgitationSection() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-10"
        >
          Aurora é para quem está cansado de
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex items-start gap-3 text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
            >
              <div className="w-5 h-5 border-2 border-[var(--text-muted)] rounded mt-1 flex-shrink-0 group-hover:border-[var(--accent)] transition-colors" />
              <span>{point}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
