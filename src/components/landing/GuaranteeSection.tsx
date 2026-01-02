'use client';

import { motion } from 'framer-motion';
import { Shield, Check } from 'lucide-react';

const guarantees = [
  'Você vai ver a contradição entre o que diz querer e o que faz',
  'Você vai entender por que nenhum método funcionou até agora',
  'Você vai reconhecer o ciclo de sabotagem que repete há anos',
];

export function GuaranteeSection() {
  return (
    <section className="py-12 md:py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
              <Shield size={32} className="text-[var(--accent)]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-2">
              A Garantia Aurora
            </h2>

            <p className="text-sm text-[var(--text-muted)]">
              Em 15 minutos, você vai:
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--accent)]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[var(--accent)]" />
                </div>
                <span className="text-[var(--text-secondary)]">{guarantee}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-6 border-t border-[var(--accent)]/20">
            <p className="text-lg text-[var(--text-secondary)] mb-2">
              Se nenhuma dessas coisas acontecer?
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              Você não paga nada.
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Sem cadastro. Sem cartão. Sem pegadinha.
            </p>
            <p className="text-xs text-[var(--accent)]/70 mt-6">
              Metodologia baseada em 40+ anos de pesquisa peer-reviewed
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
