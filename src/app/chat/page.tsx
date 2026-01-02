'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatPanel } from '@/components/chat';
import { TreeVisualization } from '@/components/tree';
import { SessionTimer, ProgressStepper, MilestoneNotification } from '@/components/session';
import { UserSelector } from '@/components/user';
import { LayerDetailCard } from '@/components/layer';
import { Message, Layer, SessionPhase, TreeStage, Evidence } from '@/types';
import { createInitialLayers } from '@/lib/layers';

const INITIAL_MESSAGE: Message = {
  id: 'aurora-1',
  role: 'aurora',
  content: 'Me conta: qual foi o último curso, método ou guru que você seguiu achando que ia resolver sua vida?',
  timestamp: new Date(),
};

const PHASE_CONTEXT: Record<SessionPhase, { title: string; subtitle: string }> = {
  abertura: {
    title: 'O Loop',
    subtitle: 'Vamos ver o padrão que você não percebe',
  },
  exploracao: {
    title: 'O Espelho',
    subtitle: 'Seu comportamento está falando mais alto que suas palavras',
  },
  aprofundamento: {
    title: 'A Raiz',
    subtitle: 'De onde vem isso que você faz sem querer?',
  },
  sintese: {
    title: 'A Verdade',
    subtitle: 'Juntando as peças que você espalhou',
  },
  fechamento: {
    title: 'Você',
    subtitle: 'Este é o mapa de quem você realmente é',
  },
};

function getTreeStage(progress: number): TreeStage {
  if (progress < 15) return 'seed';
  if (progress < 35) return 'sprout';
  if (progress < 60) return 'young';
  if (progress < 85) return 'mature';
  return 'complete';
}

export default function Home() {
  // User/Session state
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Session state
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [layers, setLayers] = useState<Layer[]>(createInitialLayers());
  const [phase, setPhase] = useState<SessionPhase>('abertura');
  const [progress, setProgress] = useState(10);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [newlyDiscoveredLayer, setNewlyDiscoveredLayer] = useState<Layer | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  const previousLayersRef = useRef<Layer[]>(layers);

  // Detect when a new layer is discovered
  useEffect(() => {
    const prevVisible = previousLayersRef.current.filter(l => l.state !== 'hidden');
    const currentVisible = layers.filter(l => l.state !== 'hidden');

    if (currentVisible.length > prevVisible.length) {
      const newLayer = currentVisible.find(
        curr => !prevVisible.some(prev => prev.id === curr.id && prev.state !== 'hidden')
      );
      if (newLayer) {
        setNewlyDiscoveredLayer(newLayer);
        setTimeout(() => setNewlyDiscoveredLayer(null), 4000);
      }
    }

    previousLayersRef.current = layers;
  }, [layers]);

  // Save session state to database whenever it changes
  useEffect(() => {
    if (!sessionId) return;

    const saveSession = async () => {
      try {
        await fetch('/api/sessions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            phase,
            progress,
            layers,
          }),
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };

    // Debounce saves
    const timeout = setTimeout(saveSession, 1000);
    return () => clearTimeout(timeout);
  }, [sessionId, phase, progress, layers]);

  const discoveredCount = layers.filter(l => l.state !== 'hidden').length;
  const phaseContext = PHASE_CONTEXT[phase] || PHASE_CONTEXT.abertura;

  const loadSessionData = useCallback(async (sessionIdToLoad: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionIdToLoad}`);
      if (!response.ok) return;

      const session = await response.json();

      // Load layers from session
      if (session.layers) {
        try {
          const savedLayers = JSON.parse(session.layers);
          setLayers(savedLayers);
        } catch {
          console.error('Error parsing layers');
        }
      }

      // Load phase and progress
      if (session.phase) setPhase(session.phase as SessionPhase);
      if (session.progress) setProgress(session.progress);

      // Load messages
      if (session.messages && session.messages.length > 0) {
        const loadedMessages: Message[] = session.messages.map((m: { id: string; role: string; content: string; timestamp: string }) => ({
          id: m.id,
          role: m.role as 'user' | 'aurora',
          content: m.content,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(loadedMessages);
        // Timer already running if there are messages
        setTimerRunning(true);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }, []);

  const handleUserSelected = useCallback(async (selectedUserId: string, selectedSessionId: string, isNewSession: boolean) => {
    setUserId(selectedUserId);
    setSessionId(selectedSessionId);

    if (!isNewSession) {
      // Load existing session data
      await loadSessionData(selectedSessionId);
    } else {
      // Reset to initial state for new session
      setMessages([INITIAL_MESSAGE]);
      setLayers(createInitialLayers());
      setPhase('abertura');
      setProgress(10);
    }

    // Timer starts immediately when entering session
    setTimerRunning(true);
  }, [loadSessionData]);

  const saveMessage = useCallback(async (role: string, content: string) => {
    if (!sessionId) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, role, content }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [sessionId]);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Save user message to database
    saveMessage('user', content);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          messages: [...messages, userMessage],
          layers,
          phase,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const auroraMessage: Message = {
        id: `aurora-${Date.now()}`,
        role: 'aurora',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, auroraMessage]);

      // Save Aurora message to database
      saveMessage('aurora', data.message);

      if (data.layersUpdated?.length > 0) {
        setLayers((prev) =>
          prev.map((layer) => {
            const update = data.layersUpdated.find((u: Partial<Layer>) => u.id === layer.id);
            if (update) {
              // Merge evidences (can be Evidence objects or strings for backwards compatibility)
              const existingEvidences = layer.evidences || [];
              const newEvidences = (update.evidences || []).map((ev: Evidence | string) => {
                if (typeof ev === 'string') {
                  return { quote: ev, interpretation: '', timestamp: new Date() } as Evidence;
                }
                return ev;
              });

              return {
                ...layer,
                ...update,
                evidences: [...existingEvidences, ...newEvidences],
                // Keep interpretation from update if available
                interpretation: update.interpretation || layer.interpretation,
              };
            }
            return layer;
          })
        );
      }

      setPhase(data.phase);
      setProgress(data.progress);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'aurora',
          content: 'Algo travou aqui. Me conta de novo?',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, layers, phase, timerRunning, saveMessage]);

  const handleLayerClick = useCallback((layer: Layer) => {
    if (layer.state !== 'hidden') {
      setSelectedLayer(layer);
    }
  }, []);

  const handleTimeUp = useCallback(async () => {
    setSessionComplete(true);

    // Mark session as completed
    if (sessionId) {
      try {
        await fetch('/api/sessions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            completedAt: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }
  }, [sessionId]);

  // Show user selector if no user selected
  if (!userId || !sessionId) {
    return <UserSelector onUserSelected={handleUserSelected} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <SessionTimer
            durationMinutes={8}
            isRunning={timerRunning}
            onTimeUp={handleTimeUp}
          />
          <ProgressStepper
            currentPhase={phase}
            discoveredLayers={discoveredCount}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              {phaseContext.title}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {phaseContext.subtitle}
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--accent)]">
              {discoveredCount}
              <span className="text-base text-[var(--text-muted)] font-normal">/12</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">verdades expostas</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-[var(--border)]">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isTyping={isTyping}
          />
        </div>

        <div className="w-1/2 overflow-auto">
          <TreeVisualization
            layers={layers}
            stage={getTreeStage(progress)}
            onLayerClick={handleLayerClick}
          />
        </div>
      </div>

      {/* Milestone Notification */}
      <MilestoneNotification
        layer={newlyDiscoveredLayer}
        onDismiss={() => setNewlyDiscoveredLayer(null)}
      />

      {/* Session Complete Modal */}
      {sessionComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[var(--surface)] rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Agora você sabe.
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Em 8 minutos você viu o que estava escondido.
            </p>
            <div className="text-4xl font-bold text-[var(--accent)] mb-2">
              {discoveredCount}
              <span className="text-base text-[var(--text-muted)] font-normal ml-1">verdades reveladas</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              E não dá pra desver.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSessionComplete(false)}
                className="px-6 py-3 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                Ver o que descobri
              </button>
              <button
                onClick={() => {
                  setUserId(null);
                  setSessionId(null);
                }}
                className="px-6 py-3 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg font-medium hover:bg-[var(--surface-elevated)] transition-colors"
              >
                Começar de novo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layer Detail Modal */}
      {selectedLayer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLayer(null)}
        >
          <div
            className="max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <LayerDetailCard
              layer={selectedLayer}
              onClose={() => setSelectedLayer(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
