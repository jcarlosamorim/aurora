'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Layer, TreeStage, Evidence } from '@/types';
import { TreeNode } from './TreeNode';
import { getLayersByRegion, calculateProgress } from '@/lib/layers';

interface TreeVisualizationProps {
  layers: Layer[];
  stage: TreeStage;
  onLayerClick?: (layer: Layer) => void;
}

// Descrições das camadas - mais explicativas
const LAYER_INFO: Record<string, { description: string; question: string }> = {
  'motor-oculto': {
    description: 'A motivação profunda que te impulsiona',
    question: 'O que te faz levantar da cama mesmo quando ninguém está olhando?',
  },
  'ferida-fundadora': {
    description: 'Uma experiência que moldou como você se protege',
    question: 'Qual evento do passado ainda influencia suas decisões hoje?',
  },
  'sombra-ativa': {
    description: 'Partes de você que prefere não ver',
    question: 'O que você critica nos outros mas secretamente reconhece em si?',
  },
  'paradoxo': {
    description: 'Desejos opostos que coexistem em você',
    question: 'Quais contradições internas geram sua energia criativa?',
  },
  'mapa-energia': {
    description: 'O que aumenta e o que drena sua energia',
    question: 'Quais atividades te energizam vs. quais te esgotam?',
  },
  'algoritmo-decisao': {
    description: 'Seu padrão inconsciente de fazer escolhas',
    question: 'Como você realmente decide quando tem opções?',
  },
  'sistema-crencas': {
    description: 'Verdades que você assume sem questionar',
    question: 'Quais "regras" você segue sem nunca ter escolhido conscientemente?',
  },
  'narrativa': {
    description: 'A história que você conta sobre si mesmo',
    question: 'Como você se apresentaria se tivesse 30 segundos?',
  },
  'padrao-relacional': {
    description: 'Como você se conecta (ou evita conexão)',
    question: 'Qual é seu papel típico nos relacionamentos?',
  },
  'ciclo-sabotagem': {
    description: 'Um padrão repetitivo que te impede de avançar',
    question: 'Qual comportamento você repete mesmo sabendo que não funciona?',
  },
  'potencial-latente': {
    description: 'Capacidades adormecidas esperando ativação',
    question: 'O que você sabe que poderia fazer mas ainda não começou?',
  },
  'zona-genialidade': {
    description: 'Onde você é verdadeiramente único e insubstituível',
    question: 'O que só você faz do jeito que faz?',
  },
};

// Posições ajustadas com mais espaçamento
const nodePositions: Record<string, { x: number; y: number }[]> = {
  coroa: [{ x: 200, y: 50 }],
  copa: [
    { x: 80, y: 160 },   // Narrativa
    { x: 200, y: 130 },  // Padrão Relacional
    { x: 320, y: 160 },  // Ciclo Sabotagem
    { x: 200, y: 210 },  // Potencial Latente
  ],
  tronco: [
    { x: 120, y: 340 },  // Paradoxo
    { x: 280, y: 340 },  // Mapa Energia
    { x: 120, y: 420 },  // Algoritmo
    { x: 280, y: 420 },  // Sistema Crenças
  ],
  raizes: [
    { x: 100, y: 560 },  // Motor
    { x: 200, y: 600 },  // Ferida
    { x: 300, y: 560 },  // Sombra
  ],
};

export function TreeVisualization({ layers, stage, onLayerClick }: TreeVisualizationProps) {
  const [showGuide, setShowGuide] = useState(true);
  const progress = calculateProgress(layers);
  const visibleLayers = layers.filter(l => l.state !== 'hidden');

  const raizes = getLayersByRegion(layers, 'raizes');
  const tronco = getLayersByRegion(layers, 'tronco');
  const copa = getLayersByRegion(layers, 'copa');
  const coroa = getLayersByRegion(layers, 'coroa');

  return (
    <div className="flex flex-col h-full bg-[var(--background)] overflow-y-auto">
      {/* Header explicativo */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Sua Árvore
          </h2>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          >
            <Info size={14} />
            {showGuide ? 'Esconder' : 'O que é isso?'}
            {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Esta árvore é um mapa de quem você realmente é. Conforme conversamos,
                suas respostas revelam diferentes <strong>camadas da sua personalidade</strong>.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-16 font-medium text-[var(--text-secondary)]">Coroa</span>
                  <span>Sua essência única</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-16 font-medium text-[var(--text-secondary)]">Copa</span>
                  <span>Como você se apresenta ao mundo</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-16 font-medium text-[var(--text-secondary)]">Tronco</span>
                  <span>Como você opera no dia-a-dia</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-16 font-medium text-[var(--text-secondary)]">Raízes</span>
                  <span>O que está enterrado no inconsciente</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--text-muted)]">Descoberta</span>
          <span className="text-[var(--text-primary)] font-medium">
            {visibleLayers.length}/12 camadas
          </span>
        </div>
        <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Tree SVG - mais espaçado */}
      <div className="flex-shrink-0 px-2 py-4">
        <svg
          viewBox="0 0 400 680"
          className="w-full h-auto"
          role="img"
          aria-label={`Sua árvore com ${visibleLayers.length} de 12 camadas reveladas`}
        >
          {/* Region backgrounds */}
          <rect x={50} y={20} width={300} height={70} rx={8} fill="var(--surface)" opacity={0.3} />
          <rect x={30} y={100} width={340} height={160} rx={8} fill="var(--surface)" opacity={0.3} />
          <rect x={60} y={290} width={280} height={180} rx={8} fill="var(--surface)" opacity={0.3} />
          <rect x={50} y={510} width={300} height={140} rx={8} fill="var(--surface)" opacity={0.3} />

          {/* Region titles */}
          <text x={200} y={42} textAnchor="middle" className="text-[11px] fill-[var(--text-muted)] font-medium uppercase tracking-widest">
            Coroa — Essência
          </text>
          <text x={200} y={120} textAnchor="middle" className="text-[11px] fill-[var(--text-muted)] font-medium uppercase tracking-widest">
            Copa — Apresentação
          </text>
          <text x={200} y={310} textAnchor="middle" className="text-[11px] fill-[var(--text-muted)] font-medium uppercase tracking-widest">
            Tronco — Operação
          </text>
          <text x={200} y={530} textAnchor="middle" className="text-[11px] fill-[var(--text-muted)] font-medium uppercase tracking-widest">
            Raízes — Fundação
          </text>

          {/* Tree structure lines */}
          <path
            d="M200 90 L200 270"
            stroke="var(--border)"
            strokeWidth={3}
            fill="none"
          />
          <path
            d="M200 270 L200 490"
            stroke="var(--border)"
            strokeWidth={3}
            fill="none"
          />

          {/* Branches to copa */}
          <path
            d="M200 150 Q120 155 80 160"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M200 150 Q280 155 320 160"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />

          {/* Branches to tronco */}
          <path
            d="M200 360 Q160 355 120 340"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M200 360 Q240 355 280 340"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M200 400 Q160 415 120 420"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />
          <path
            d="M200 400 Q240 415 280 420"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />

          {/* Ground line */}
          <line
            x1={30}
            y1={500}
            x2={370}
            y2={500}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="6 4"
            opacity={0.5}
          />

          {/* Roots */}
          <path
            d="M200 500 L200 540 M200 540 Q140 570 100 560 M200 540 Q260 570 300 560"
            stroke="var(--border)"
            strokeWidth={2}
            fill="none"
          />

          {/* Nodes */}
          {coroa.map((layer, i) => (
            <TreeNode
              key={layer.id}
              layer={layer}
              x={nodePositions.coroa[i]?.x || 200}
              y={nodePositions.coroa[i]?.y || 50}
              onClick={() => onLayerClick?.(layer)}
              showLabel
            />
          ))}

          {copa.map((layer, i) => (
            <TreeNode
              key={layer.id}
              layer={layer}
              x={nodePositions.copa[i]?.x || 200}
              y={nodePositions.copa[i]?.y || 150}
              onClick={() => onLayerClick?.(layer)}
              showLabel
            />
          ))}

          {tronco.map((layer, i) => (
            <TreeNode
              key={layer.id}
              layer={layer}
              x={nodePositions.tronco[i]?.x || 200}
              y={nodePositions.tronco[i]?.y || 380}
              onClick={() => onLayerClick?.(layer)}
              showLabel
            />
          ))}

          {raizes.map((layer, i) => (
            <TreeNode
              key={layer.id}
              layer={layer}
              x={nodePositions.raizes[i]?.x || 200}
              y={nodePositions.raizes[i]?.y || 580}
              onClick={() => onLayerClick?.(layer)}
              showLabel
            />
          ))}
        </svg>
      </div>

      {/* Legenda */}
      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--border)] bg-transparent" />
            <span>Não revelado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]/30" />
            <span>Emergindo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
            <span>Confirmado</span>
          </div>
        </div>
      </div>

      {/* Descobertas */}
      <div className="flex-1 p-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
          {visibleLayers.length > 0 ? 'O que estou descobrindo sobre você' : 'Aguardando descobertas'}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          {visibleLayers.length > 0
            ? 'Clique em uma camada para entender melhor.'
            : 'Continue conversando. Suas respostas revelam quem você realmente é.'
          }
        </p>

        <div className="space-y-3">
          {visibleLayers.map((layer) => (
            <motion.button
              key={layer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onLayerClick?.(layer)}
              className="w-full text-left p-4 bg-[var(--surface)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors border border-[var(--border)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] block">
                    {layer.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {LAYER_INFO[layer.id]?.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    layer.state === 'confirmed'
                      ? 'bg-[var(--success)]/20 text-[var(--success)]'
                      : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                  }`}>
                    {layer.strength}%
                  </span>
                  <ChevronRight size={16} className="text-[var(--text-muted)]" />
                </div>
              </div>

              {/* Evidence */}
              {layer.evidences.length > 0 && (
                <div className="mt-2 p-2 bg-[var(--background)] rounded border-l-2 border-[var(--accent)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                    Baseado na sua resposta:
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] italic">
                    &ldquo;{(() => {
                      const lastEvidence = layer.evidences[layer.evidences.length - 1];
                      return typeof lastEvidence === 'string' ? lastEvidence : lastEvidence.quote;
                    })()}&rdquo;
                  </p>
                </div>
              )}

              {/* Status indicator */}
              <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                <div className={`w-2 h-2 rounded-full ${
                  layer.state === 'confirmed' ? 'bg-[var(--success)]' : 'bg-[var(--accent)] animate-pulse'
                }`} />
                <span>
                  {layer.state === 'confirmed'
                    ? 'Padrão confirmado por múltiplas respostas'
                    : 'Emergindo — preciso de mais informações para confirmar'
                  }
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
