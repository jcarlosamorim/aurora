'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Play, History } from 'lucide-react';

interface SessionData {
  id: string;
  startedAt: string;
  progress: number;
  phase: string;
  completedAt: string | null;
  _count?: { messages: number };
}

interface UserData {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  sessions: SessionData[];
}

interface UserSelectorProps {
  onUserSelected: (userId: string, sessionId: string, isNewSession: boolean) => void;
}

export function UserSelector({ onUserSelected }: UserSelectorProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName.trim() }),
      });

      const user = await response.json();

      // Create first session for new user
      const sessionResponse = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const session = await sessionResponse.json();

      setNewUserName('');
      setCreating(false);

      // Go directly to the session
      onUserSelected(user.id, session.id, true);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleStartSession = async (user: UserData) => {
    // Check if user has an active (non-completed) session
    const activeSession = user.sessions.find(s => !s.completedAt);

    if (activeSession) {
      // Resume existing session
      onUserSelected(user.id, activeSession.id, false);
    } else {
      // Create new session
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const session = await response.json();
        onUserSelected(user.id, session.id, true);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Aurora
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-3">
            Em 8 minutos você vai ver o que anos de cursos esconderam.
          </p>
          <p className="text-[var(--accent)] text-xs font-medium">
            Não é teste. Não categoriza. Só revela.
          </p>
        </div>

        {/* User list */}
        <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[var(--text-secondary)]">
              Selecione um usuário
            </h2>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <Plus size={14} />
              Novo
            </button>
          </div>

          {/* Create user form */}
          {creating && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              onSubmit={handleCreateUser}
              className="mb-4 p-4 bg-[var(--background)] rounded-lg"
            >
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Nome do usuário"
                autoFocus
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] mb-3"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newUserName.trim()}
                  className="flex-1 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          )}

          {/* User list */}
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-center text-[var(--text-muted)] py-8">
                Nenhum usuário ainda. Crie o primeiro!
              </p>
            ) : (
              users.map((user) => {
                const activeSession = user.sessions.find(s => !s.completedAt);
                const hasHistory = activeSession && activeSession._count && activeSession._count.messages > 0;

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                        <User size={18} className="text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {user.name}
                        </p>
                        {hasHistory ? (
                          <p className="text-xs text-[var(--accent)] flex items-center gap-1">
                            <History size={10} />
                            Revelação em andamento ({activeSession.progress}%)
                          </p>
                        ) : (
                          <p className="text-xs text-[var(--text-muted)]">
                            {user.sessions.length > 0 ? `${user.sessions.length} revelação(ões)` : 'Primeira vez aqui'}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartSession(user)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium opacity-0 group-hover:opacity-100 hover:bg-[var(--accent-hover)] transition-all"
                    >
                      <Play size={14} />
                      {hasHistory ? 'Continuar' : 'Ver a verdade'}
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          O que você descobrir aqui não dá pra desver.
        </p>
      </motion.div>
    </div>
  );
}
