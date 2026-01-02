'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  role: 'aurora' | 'user';
  text: string;
  isRevelation?: boolean;
}

const conversation: Message[] = [
  { role: 'aurora', text: 'O que te fez buscar o Aurora hoje?' },
  { role: 'user', text: 'Quero finalmente fazer as coisas acontecerem. Parar de procrastinar.' },
  { role: 'aurora', text: 'O que você está procrastinando?' },
  { role: 'user', text: 'Um projeto meu. Já deveria ter lançado há meses.' },
  { role: 'aurora', text: 'O que acontece quando você lança?' },
  { role: 'user', text: 'Eu ganho dinheiro, realizo meu sonho, provo que consigo.' },
  { role: 'aurora', text: 'Prova pra quem?' },
  { role: 'user', text: '...pra mim mesmo, eu acho.' },
  { role: 'aurora', text: 'Você acha ou você sabe?' },
  { role: 'user', text: 'Pro meu pai também. Ele nunca acreditou em mim.' },
  { role: 'aurora', text: 'E se você lançar e não der certo?' },
  { role: 'user', text: 'Aí ele estava certo.' },
  { role: 'aurora', text: 'Então enquanto você não lança, ele ainda pode estar errado.' },
  { role: 'user', text: '...' },
  { role: 'aurora', text: 'Você não está procrastinando. Está protegendo a possibilidade de provar que ele estava errado. Se você não tenta, ele nunca estará certo.', isRevelation: true },
];

const revelation = {
  layer: 'Ciclo de Sabotagem',
  layerNumber: 10,
  insight: 'Você não tem medo de falhar. Tem medo de confirmar a narrativa de quem duvidou de você. A procrastinação é proteção.',
  pattern: 'Protege a possibilidade ao custo da realização',
};

export function ChatSimulation() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showRevelation, setShowRevelation] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleMessages]);

  useEffect(() => {
    if (!isPlaying) return;

    if (visibleMessages < conversation.length) {
      const currentMessage = conversation[visibleMessages];
      // Longer delays for reading: user messages 2.5s, aurora messages 3s, revelation 4s
      let delay = currentMessage.role === 'user' ? 2500 : 3000;
      if (currentMessage.isRevelation) delay = 4000;

      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);

        // Show tree animation when revelation message appears
        if (conversation[visibleMessages]?.isRevelation) {
          setTimeout(() => setShowTree(true), 500);
          setTimeout(() => setShowRevelation(true), 1500);
        }
      }, visibleMessages === 0 ? 1000 : delay);

      return () => clearTimeout(timer);
    }
  }, [visibleMessages, isPlaying]);

  const handleStart = () => {
    setVisibleMessages(0);
    setShowRevelation(false);
    setShowTree(false);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setVisibleMessages(0);
    setShowRevelation(false);
    setShowTree(false);
    setIsPlaying(false);
  };

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] text-center mb-4"
        >
          Veja Aurora em ação
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-[var(--text-muted)] mb-8"
        >
          Uma conversa real. Um padrão que você não viu.
        </motion.p>

        <div className="grid md:grid-cols-[1fr,280px] gap-6">
          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden"
          >
            {/* Chat Header with Progress */}
            <div className="bg-[var(--background)] border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Aurora</span>
                <span className="text-xs text-[var(--text-muted)]">Sessão simulada</span>
                {isPlaying && !showRevelation && (
                  <span className="ml-auto text-xs text-[var(--text-muted)]">
                    {Math.round((visibleMessages / conversation.length) * 100)}%
                  </span>
                )}
              </div>
              {/* Progress bar */}
              {isPlaying && (
                <div className="mt-2 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(visibleMessages / conversation.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="p-4 space-y-3 min-h-[420px] max-h-[420px] overflow-y-auto scroll-smooth"
            >
              {!isPlaying ? (
                <div className="flex flex-col items-center justify-center h-[380px] text-center px-4">
                  <p className="text-[var(--text-muted)] mb-6 max-w-sm">
                    Veja como Aurora revela o que você esconde de si mesmo
                  </p>
                  <button
                    onClick={handleStart}
                    className="bg-[var(--accent)] text-[var(--background)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Iniciar simulação
                  </button>
                </div>
              ) : (
                <>
                  {conversation.slice(0, visibleMessages).map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-[var(--accent)]/20 text-[var(--text-primary)] rounded-br-md'
                            : message.isRevelation
                              ? 'bg-[var(--accent)]/30 text-[var(--text-primary)] rounded-bl-md border border-[var(--accent)]/50'
                              : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] rounded-bl-md border border-[var(--border)]'
                        }`}
                      >
                        <p className={`text-sm ${message.isRevelation ? 'font-medium' : ''}`}>
                          {message.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {visibleMessages < conversation.length && visibleMessages > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[var(--surface-elevated)] border border-[var(--border)] px-4 py-2.5 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Reset button */}
            {showRevelation && (
              <div className="border-t border-[var(--border)] p-3 flex justify-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Ver novamente
                </button>
              </div>
            )}
          </motion.div>

          {/* Tree/Layer Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 h-full">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Árvore de Padrões
              </p>

              {/* Mini tree visualization */}
              <div className="space-y-2">
                {[
                  { num: '01', name: 'Motor Oculto', active: false },
                  { num: '02', name: 'Ferida Fundadora', active: false },
                  { num: '03', name: 'Sombra Ativa', active: false },
                  { num: '08', name: 'Narrativa', active: false },
                  { num: '10', name: 'Ciclo de Sabotagem', active: showTree },
                  { num: '11', name: 'Potencial Latente', active: false },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    animate={item.active ? {
                      scale: [1, 1.02, 1],
                      transition: { duration: 0.3 }
                    } : {}}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-500 ${
                      item.active
                        ? 'bg-[var(--accent)]/20 border border-[var(--accent)]/50'
                        : 'bg-[var(--background)] border border-transparent opacity-40'
                    }`}
                  >
                    <span className={`text-xs font-mono ${item.active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                      {item.num}
                    </span>
                    <span className={`text-xs ${item.active ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`}>
                      {item.name}
                    </span>
                    {item.active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)]"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Revelation Card */}
              <AnimatePresence>
                {showRevelation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                      <span className="text-xs font-medium text-[var(--accent)]">
                        Padrão Detectado
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {revelation.pattern}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Mobile Revelation */}
        <AnimatePresence>
          {showRevelation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-xs font-medium text-[var(--accent)] uppercase tracking-wider">
                  {revelation.layer}
                </span>
              </div>
              <p className="text-sm text-[var(--text-primary)]">
                {revelation.insight}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA After Simulation */}
        <AnimatePresence>
          {showRevelation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <p className="text-lg text-[var(--text-secondary)] mb-4">
                Isso foi uma simulação.
              </p>
              <p className="text-base text-[var(--text-muted)] mb-6">
                Agora faça com <span className="text-[var(--accent)] font-medium">suas</span> respostas.
              </p>
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[var(--accent)] text-[var(--background)] px-8 py-4 rounded-lg font-medium text-lg hover:bg-[var(--accent-hover)] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                >
                  Descobrir meu padrão
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
