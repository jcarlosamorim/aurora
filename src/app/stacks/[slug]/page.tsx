'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Lock, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';
import { XPBar, LevelBadge } from '@/components/gamification';
import { useGamificationStore } from '@/stores/gamification-store';

interface Challenge {
  id: string;
  level: number;
  name: string;
  type: string;
  description: string;
  duration: number;
}

interface Stack {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: string;
  order: number;
  challenges: Challenge[];
}

const levelNames: Record<string, string> = {
  discover: 'Descobrir',
  try: 'Experimentar',
  apply: 'Aplicar',
  integrate: 'Integrar',
  master: 'Dominar'
};

const levelDescriptions: Record<string, string> = {
  discover: 'Leitura e reflexão inicial',
  try: 'Primeiro exercício guiado',
  apply: 'Desafio aplicado à vida real',
  integrate: 'Combine múltiplas ferramentas',
  master: 'Síntese e ensino'
};

export default function StackDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [stack, setStack] = useState<Stack | null>(null);
  const [loading, setLoading] = useState(true);
  const [stackLevel] = useState(1); // Simulado - virá do UserStack

  const { currentLevel: userLevel, xpProgress, xpForNextLevel } = useGamificationStore();

  useEffect(() => {
    fetch(`/api/stacks/${slug}`)
      .then(res => res.json())
      .then(data => {
        setStack(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar stack:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stack) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)] mb-4">Stack não encontrada</p>
          <Link
            href="/stacks"
            className="text-[var(--accent)] hover:underline"
          >
            Voltar para stacks
          </Link>
        </div>
      </div>
    );
  }

  const tools = JSON.parse(stack.tools) as string[];
  const completedLevels = stackLevel - 1;
  const progressPercent = Math.round((completedLevels / 5) * 100);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/stacks"
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">{stack.name}</h1>
              <p className="text-sm text-[var(--text-muted)]">Jornada de desenvolvimento</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LevelBadge level={userLevel} size="sm" />
            <XPBar
              currentXp={xpProgress}
              xpForNextLevel={xpForNextLevel}
              level={userLevel}
              className="w-24"
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Stack Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-[var(--text-secondary)] mb-6">
            {stack.description}
          </p>

          {/* Tools */}
          <div className="mb-6">
            <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Ferramentas ({tools.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Progresso da jornada</span>
              <span className="text-sm font-medium text-[var(--accent)]">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-[var(--accent)]"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {completedLevels} de 5 níveis completos
            </p>
          </div>
        </motion.div>

        {/* Challenges */}
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)] mb-4">
            Níveis da jornada
          </h2>

          <div className="space-y-3">
            {stack.challenges.map((challenge, index) => {
              const isLocked = challenge.level > stackLevel;
              const isCompleted = challenge.level < stackLevel;
              const isCurrent = challenge.level === stackLevel;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChallengeCard
                    challenge={challenge}
                    isLocked={isLocked}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function ChallengeCard({
  challenge,
  isLocked,
  isCompleted,
  isCurrent
}: {
  challenge: Challenge;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  return (
    <div
      className={`
        p-4 rounded-lg border transition-all
        ${isLocked
          ? 'border-[var(--border)] bg-[var(--surface)] opacity-50'
          : isCompleted
            ? 'border-[var(--accent)]/30 bg-[var(--surface)]'
            : 'border-[var(--accent)] bg-[var(--surface)]'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Status Icon */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${isCompleted
              ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
              : isCurrent
                ? 'bg-[var(--accent)] text-[var(--background)]'
                : 'bg-[var(--background)] text-[var(--text-muted)]'
            }
          `}>
            {isCompleted ? (
              <CheckCircle2 size={16} />
            ) : isLocked ? (
              <Lock size={14} />
            ) : (
              <span className="text-xs font-mono">{String(challenge.level).padStart(2, '0')}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs uppercase tracking-wider ${
                isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              }`}>
                {levelNames[challenge.type] || challenge.type}
              </span>
            </div>
            <h3 className={`font-medium ${
              isLocked ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
            }`}>
              {challenge.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
              {challenge.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Clock size={12} />
                {challenge.duration} min
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {levelDescriptions[challenge.type]}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isCurrent && (
          <Link
            href={`/challenge/${challenge.id}`}
            className="flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors ml-4"
          >
            <Play size={14} />
            Iniciar
          </Link>
        )}

        {isCompleted && (
          <span className="text-xs text-[var(--accent)] font-medium ml-4">
            Completo
          </span>
        )}
      </div>
    </div>
  );
}
