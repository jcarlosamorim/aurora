'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  Brain,
  Target,
  Quote,
  HelpCircle,
  X
} from 'lucide-react';
import { Layer, Evidence } from '@/types';
import { LAYER_CONTENT } from '@/lib/layer-content';

interface LayerDetailCardProps {
  layer: Layer;
  onClose?: () => void;
  onAskQuestion?: (question: string) => void;
}

function ConfidenceIndicator({ strength }: { strength: number }) {
  const dots = 4;
  const filled = Math.ceil((strength / 100) * dots);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[var(--text-muted)] mr-1">Confianca:</span>
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < filled
              ? 'bg-[var(--accent)]'
              : 'bg-[var(--surface)] border border-[var(--border)]'
          }`}
        />
      ))}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  variant = 'default'
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'quote' | 'action';
}) {
  const bgColor = {
    default: 'bg-[var(--surface)]',
    quote: 'bg-[var(--background)] border-l-2 border-[var(--accent)]',
    action: 'bg-[var(--accent)]/10 border border-[var(--accent)]/30'
  }[variant];

  return (
    <div className={`rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--accent)]" />
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        {children}
      </div>
    </div>
  );
}

function getEvidenceQuote(evidence: Evidence | string): string {
  if (typeof evidence === 'string') {
    return evidence;
  }
  return evidence.quote;
}

function getEvidenceInterpretation(evidence: Evidence | string): string | undefined {
  if (typeof evidence === 'string') {
    return undefined;
  }
  return evidence.interpretation;
}

export function LayerDetailCard({ layer, onClose, onAskQuestion }: LayerDetailCardProps) {
  const baseContent = LAYER_CONTENT[layer.id];
  const interpretation = layer.interpretation;
  const latestEvidence = layer.evidences[layer.evidences.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-[var(--surface-elevated)] rounded-xl border border-[var(--border)] overflow-hidden max-h-[80vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] sticky top-0 bg-[var(--surface-elevated)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {layer.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {baseContent?.definition.split('.')[0]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ConfidenceIndicator strength={layer.strength} />
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-[var(--surface)] rounded"
              >
                <X size={16} className="text-[var(--text-muted)]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {interpretation ? (
          <>
            {/* O QUE DESCOBRI */}
            <Section icon={Lightbulb} title="O que descobri">
              {interpretation.whatItIs}
            </Section>

            {/* O QUE ISSO SIGNIFICA */}
            <Section icon={Brain} title="O que isso significa">
              {interpretation.whatItMeans}
            </Section>

            {/* COMO APARECE NA VIDA */}
            <Section icon={Target} title="Como isso aparece na sua vida">
              <ul className="space-y-1">
                {interpretation.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* BASEADO EM */}
            {latestEvidence && (
              <Section icon={Quote} title="Baseado em" variant="quote">
                <p className="italic mb-2">&ldquo;{getEvidenceQuote(latestEvidence)}&rdquo;</p>
                {getEvidenceInterpretation(latestEvidence) && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    → {getEvidenceInterpretation(latestEvidence)}
                  </p>
                )}
              </Section>
            )}

            {/* PARA EXPLORAR MAIS */}
            <Section icon={HelpCircle} title="Para explorar mais" variant="action">
              <p className="mb-2">{interpretation.deepenQuestion}</p>
              {onAskQuestion && (
                <button
                  onClick={() => onAskQuestion(interpretation.deepenQuestion)}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  Usar esta pergunta →
                </button>
              )}
            </Section>

            {/* Confidence explanation */}
            {interpretation.confidenceReason && (
              <p className="text-[10px] text-[var(--text-muted)] text-center pt-2 border-t border-[var(--border)]">
                {interpretation.confidenceReason}
              </p>
            )}
          </>
        ) : (
          /* Fallback: Conteudo base quando nao ha interpretacao */
          <>
            <Section icon={Lightbulb} title="O que e">
              {baseContent?.definition}
            </Section>

            <Section icon={Brain} title="Por que importa">
              {baseContent?.whyItMatters}
            </Section>

            <Section icon={Target} title="Exemplo">
              {baseContent?.genericExample}
            </Section>

            {latestEvidence && (
              <Section icon={Quote} title="Sua evidencia" variant="quote">
                <p className="italic">&ldquo;{getEvidenceQuote(latestEvidence)}&rdquo;</p>
              </Section>
            )}

            <Section icon={HelpCircle} title="Para descobrir mais" variant="action">
              <ul className="space-y-1">
                {baseContent?.discoveryQuestions.slice(0, 2).map((q, i) => (
                  <li key={i} className="text-xs">• {q}</li>
                ))}
              </ul>
            </Section>
          </>
        )}
      </div>
    </motion.div>
  );
}
