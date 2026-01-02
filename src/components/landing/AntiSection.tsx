'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const antiPoints = [
  'Mais um plano de ação que você não vai seguir',
  'Validação do que você já acredita',
  'Um rótulo confortável (INTJ, Eneagrama 7...)',
  'Alguém te dizendo o que fazer',
];

export function AntiSection() {
  return (
    <section className="py-10 md:py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 md:p-12"
        >
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            Aurora NÃO é para quem quer
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">
            Se você quer conforto, vá comprar outro curso.
          </p>

          <div className="space-y-4">
            {antiPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-[var(--text-muted)]"
              >
                <X size={20} className="text-[var(--error)] opacity-50 flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
