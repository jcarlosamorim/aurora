'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Layer {
  name: string;
  definition: string;
  example: string;
}

const layers: Layer[] = [
  {
    name: 'Motor Oculto',
    definition: 'O que realmente te move. Não é o que você diz — é o que você faz quando ninguém está olhando.',
    example: 'Você diz que quer liberdade. Mas toda escolha que faz busca segurança. O que você quer de verdade?',
  },
  {
    name: 'Ferida Fundadora',
    definition: 'O momento em que você aprendeu a se proteger. A armadura que você veste até hoje.',
    example: 'Quem foi abandonado não confia. Quem foi humilhado não se expõe. O que você evita sem perceber?',
  },
  {
    name: 'Sombra Ativa',
    definition: 'O que você não quer ver em você. O que te irrita nos outros geralmente mora em você também.',
    example: 'Você critica gente "preguiçosa"? Talvez você tenha medo de descansar.',
  },
  {
    name: 'Paradoxo',
    definition: 'Você quer duas coisas opostas ao mesmo tempo. Essa tensão pode te paralisar ou te impulsionar.',
    example: 'Quer liberdade E segurança. Quer ser visto E ter paz. Quer mudar E manter.',
  },
  {
    name: 'Mapa de Energia',
    definition: 'O que te carrega e o que te drena. Pessoas, lugares, atividades, horários.',
    example: 'Você diz que gosta de pessoas. Mas depois de eventos sociais, precisa de dias pra se recuperar.',
  },
  {
    name: 'Algoritmo de Decisão',
    definition: 'Como você realmente decide. Não como você acha que decide — como você de fato escolhe.',
    example: 'Você diz que é racional. Mas todas suas grandes decisões foram emocionais.',
  },
  {
    name: 'Sistema de Crenças',
    definition: 'Regras invisíveis que governam sua vida. Verdades que você nunca questionou.',
    example: '"Dinheiro é difícil." "Pessoas decepcionam." Essas crenças são suas ou você herdou?',
  },
  {
    name: 'Narrativa',
    definition: 'A história que você conta sobre você. Vítima? Herói? Sortudo? Azarado? Lutador?',
    example: 'A mesma demissão pode ser "injustiça" ou "libertação". Qual história você conta?',
  },
  {
    name: 'Padrão Relacional',
    definition: 'Como você se conecta com pessoas. Ou como você evita conexão.',
    example: 'Todos seus ex têm algo em comum. Você sabe o que é. Só não quer admitir.',
  },
  {
    name: 'Ciclo de Sabotagem',
    definition: 'Curso → empolgação → desistência → "o problema sou eu" → novo curso. Quantas vezes?',
    example: 'Você sempre para perto do fim. Por quê? O que acontece se você conseguir?',
  },
  {
    name: 'Potencial Latente',
    definition: 'Aquilo que você faz bem mas chama de "hobby". Que outros pedem ajuda mas você não leva a sério.',
    example: 'Pessoas pedem seus conselhos sobre X. Você faz de graça. E busca emprego em Y.',
  },
  {
    name: 'Zona de Genialidade',
    definition: 'O que só você faz do jeito que faz. Onde trabalho vira jogo.',
    example: 'Aquela coisa que você faz sem esforço. Que você chama de "hobby". Isso é seu trabalho.',
  },
];

export function LayersPreview() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Show first 4 layers, or all if expanded
  const visibleLayers = showAll ? layers : layers.slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] text-center mb-4"
        >
          12 camadas que Aurora revela
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[var(--text-muted)] mb-12"
        >
          Clique para ver o que cada uma expõe
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          {visibleLayers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 text-left hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--text-muted)] w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {layer.name}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--text-muted)] transition-transform duration-300 ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-9 space-y-3">
                        <p className="text-sm text-[var(--text-secondary)]">
                          {layer.definition}
                        </p>
                        <div className="bg-[var(--background)] rounded-lg p-3 border-l-2 border-[var(--accent)]">
                          <p className="text-sm text-[var(--text-muted)] italic">
                            {layer.example}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}

          {/* Ver mais button */}
          {!showAll && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-4 text-center"
            >
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg transition-colors"
              >
                <span>Ver todas as 12 camadas</span>
                <ChevronDown size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
