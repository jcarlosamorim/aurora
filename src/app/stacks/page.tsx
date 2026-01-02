'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackGrid } from '@/components/stacks/StackGrid';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { XPBar, LevelBadge } from '@/components/gamification';
import { useGamificationStore } from '@/stores/gamification-store';

interface Challenge {
  id: string;
  level: number;
  name: string;
  type: string;
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

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);

  const { currentLevel, xpProgress, xpForNextLevel } = useGamificationStore();

  useEffect(() => {
    fetch('/api/stacks')
      .then(res => res.json())
      .then(data => {
        setStacks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar stacks:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Cabeçalho */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">Suas Stacks</h1>
              <p className="text-sm text-[var(--text-muted)]">Trilha de desenvolvimento</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LevelBadge level={currentLevel} size="sm" />
            <XPBar
              currentXp={xpProgress}
              xpForNextLevel={xpForNextLevel}
              level={currentLevel}
              className="w-24"
            />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Stack Atual */}
        {stacks[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  Stack atual
                </span>
                <h2 className="text-xl font-semibold text-[var(--accent)] mt-1">
                  {stacks[0].name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Nível 3 de 5 — Aplicar
                </p>
              </div>
              <Link
                href={`/stacks/${stacks[0].slug}`}
                className="bg-[var(--accent)] text-[var(--background)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                Continuar
              </Link>
            </div>

            {/* Progresso */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[var(--text-muted)]">2/5 níveis completos</span>
                <span className="text-xs text-[var(--text-muted)]">40%</span>
              </div>
              <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[var(--accent)]"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Título da seção */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[var(--text-primary)]">
            Todas as stacks
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            9 stacks • 45 desafios
          </span>
        </div>

        {/* Lista de Stacks */}
        <StackGrid
          stacks={stacks}
          onStackClick={(stack) => setSelectedStack(stack)}
        />
      </main>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedStack && (
          <StackDetailModal
            stack={selectedStack}
            index={stacks.findIndex(s => s.id === selectedStack.id)}
            onClose={() => setSelectedStack(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StackDetailModal({
  stack,
  index,
  onClose
}: {
  stack: Stack;
  index: number;
  onClose: () => void;
}) {
  const tools = JSON.parse(stack.tools) as string[];
  const levelNames: Record<string, string> = {
    discover: 'Descobrir',
    try: 'Experimentar',
    apply: 'Aplicar',
    integrate: 'Integrar',
    master: 'Dominar'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[var(--surface)] rounded-lg p-6 max-w-lg w-full border border-[var(--border)] max-h-[85vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <X size={18} className="text-[var(--text-muted)]" />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-1">
            {stack.name}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {stack.description}
          </p>
        </div>

        {/* Ferramentas */}
        <div className="mb-6">
          <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Ferramentas ({tools.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--background)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Jornada */}
        <div className="mb-6">
          <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Jornada (5 níveis)
          </h3>
          <div className="space-y-2">
            {stack.challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[var(--text-muted)] w-5">
                    {String(challenge.level).padStart(2, '0')}
                  </span>
                  <div>
                    <span className="text-sm text-[var(--text-primary)]">
                      {challenge.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] block">
                      {levelNames[challenge.type] || challenge.type}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {challenge.duration}min
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de ação */}
        <button
          className="w-full bg-[var(--accent)] text-[var(--background)] py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
          onClick={() => window.location.href = `/stacks/${stack.slug}`}
        >
          Começar jornada
        </button>
      </motion.div>
    </motion.div>
  );
}
