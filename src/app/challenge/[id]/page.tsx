'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Clock, Lightbulb, Zap } from 'lucide-react';
import Link from 'next/link';
import { XPBar, LevelBadge, ChallengeCompleteModal } from '@/components/gamification';
import {
  TypingIndicator,
  MessageReactions,
  ChallengeProgress,
  QuizInline,
  QuickActions,
  SwipeCards,
  TimerChallenge,
  WheelSpin,
  ConfidenceSlider,
  FlashcardFlip,
} from '@/components/chat';
import type { QuizOption, QuickAction, SwipeCard, WheelOption } from '@/components/chat';
import { useGamificationStore } from '@/stores/gamification-store';
import { CHALLENGE_XP_MULTIPLIERS, XP_VALUES, EarnedBadge } from '@/types/gamification';

interface Challenge {
  id: string;
  level: number;
  name: string;
  type: string;
  description: string;
  duration: number;
  prompt: string;
  content: string;
  stack: {
    id: string;
    slug: string;
    name: string;
    color: string;
  };
}

interface QuizData {
  question: string;
  options: QuizOption[];
  answered?: boolean;
}

interface SwipeData {
  cards: SwipeCard[];
  leftLabel: string;
  rightLabel: string;
  completed?: boolean;
}

interface TimerData {
  prompt: string;
  duration: number;
  minItems?: number;
  completed?: boolean;
}

interface WheelData {
  options: WheelOption[];
  title?: string;
  completed?: boolean;
}

interface SliderData {
  question: string;
  leftLabel?: string;
  rightLabel?: string;
  completed?: boolean;
}

interface FlashcardData {
  front: string;
  back: string;
  completed?: boolean;
}

type InteractionType = 'quiz' | 'swipe' | 'timer' | 'wheel' | 'slider' | 'flashcard';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  isInsight?: boolean;
  interactionType?: InteractionType;
  quiz?: QuizData;
  swipe?: SwipeData;
  timer?: TimerData;
  wheel?: WheelData;
  slider?: SliderData;
  flashcard?: FlashcardData;
  hideQuickActions?: boolean;
}

// Helper to detect if a message contains an insight
function detectInsight(content: string): boolean {
  const insightPatterns = [
    /\b(dica|insight|importante|lembre-se|observe|perceba|note que)\b/i,
    /💡|🎯|⭐|✨/,
    /\*\*[^*]+\*\*/,  // Bold text often indicates key points
  ];
  return insightPatterns.some(pattern => pattern.test(content));
}

// Parse all interaction formats from message
interface ParsedInteraction {
  text: string;
  interactionType?: InteractionType;
  quiz?: QuizData;
  swipe?: SwipeData;
  timer?: TimerData;
  wheel?: WheelData;
  slider?: SliderData;
  flashcard?: FlashcardData;
}

function parseInteractions(content: string): ParsedInteraction {
  let text = content;

  // [QUIZ]question|optionA|optionB*|optionC[/QUIZ]
  const quizMatch = text.match(/\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/);
  if (quizMatch) {
    const parts = quizMatch[1].trim().split('|').map(p => p.trim());
    if (parts.length >= 3) {
      const question = parts[0];
      const options: QuizOption[] = parts.slice(1).map((opt, i) => ({
        id: `opt-${i}`,
        text: opt.endsWith('*') ? opt.slice(0, -1) : opt,
        isCorrect: opt.endsWith('*'),
      }));
      text = text.replace(/\[QUIZ\][\s\S]*?\[\/QUIZ\]/, '').trim();
      return { text, interactionType: 'quiz', quiz: { question, options } };
    }
  }

  // [SWIPE:leftLabel:rightLabel]item1>right|item2>left|item3>right[/SWIPE]
  const swipeMatch = text.match(/\[SWIPE:([^:]*):([^\]]*)\]([\s\S]*?)\[\/SWIPE\]/);
  if (swipeMatch) {
    const [, leftLabel, rightLabel, cardsStr] = swipeMatch;
    const cards: SwipeCard[] = cardsStr.split('|').map((item, i) => {
      const [cardText, direction] = item.trim().split('>');
      return {
        id: `card-${i}`,
        text: cardText.trim(),
        correctSwipe: direction?.trim() as 'left' | 'right' | undefined,
      };
    });
    text = text.replace(/\[SWIPE:[^\]]*\][\s\S]*?\[\/SWIPE\]/, '').trim();
    return { text, interactionType: 'swipe', swipe: { cards, leftLabel, rightLabel } };
  }

  // [TIMER:duration:minItems]prompt[/TIMER]
  const timerMatch = text.match(/\[TIMER:(\d+):?(\d*)\]([\s\S]*?)\[\/TIMER\]/);
  if (timerMatch) {
    const [, duration, minItems, prompt] = timerMatch;
    text = text.replace(/\[TIMER:\d+:?\d*\][\s\S]*?\[\/TIMER\]/, '').trim();
    return {
      text,
      interactionType: 'timer',
      timer: { prompt: prompt.trim(), duration: parseInt(duration), minItems: minItems ? parseInt(minItems) : 1 }
    };
  }

  // [WHEEL:title]emoji1:text1|emoji2:text2|emoji3:text3[/WHEEL]
  const wheelMatch = text.match(/\[WHEEL:?([^\]]*)\]([\s\S]*?)\[\/WHEEL\]/);
  if (wheelMatch) {
    const [, title, optionsStr] = wheelMatch;
    const options: WheelOption[] = optionsStr.split('|').map((item, i) => {
      const [emoji, optText] = item.trim().split(':');
      return {
        id: `wheel-${i}`,
        emoji: emoji?.trim() || '🎯',
        text: optText?.trim() || emoji?.trim() || '',
      };
    });
    text = text.replace(/\[WHEEL:?[^\]]*\][\s\S]*?\[\/WHEEL\]/, '').trim();
    return { text, interactionType: 'wheel', wheel: { options, title: title?.trim() } };
  }

  // [SLIDER:leftLabel:rightLabel]question[/SLIDER]
  const sliderMatch = text.match(/\[SLIDER:?([^:]*):?([^\]]*)\]([\s\S]*?)\[\/SLIDER\]/);
  if (sliderMatch) {
    const [, leftLabel, rightLabel, question] = sliderMatch;
    text = text.replace(/\[SLIDER:?[^\]]*\][\s\S]*?\[\/SLIDER\]/, '').trim();
    return {
      text,
      interactionType: 'slider',
      slider: { question: question.trim(), leftLabel: leftLabel?.trim(), rightLabel: rightLabel?.trim() }
    };
  }

  // [FLASHCARD]front|||back[/FLASHCARD]
  const flashcardMatch = text.match(/\[FLASHCARD\]([\s\S]*?)\|\|\|([\s\S]*?)\[\/FLASHCARD\]/);
  if (flashcardMatch) {
    const [, front, back] = flashcardMatch;
    text = text.replace(/\[FLASHCARD\][\s\S]*?\[\/FLASHCARD\]/, '').trim();
    return { text, interactionType: 'flashcard', flashcard: { front: front.trim(), back: back.trim() } };
  }

  return { text };
}

const levelNames: Record<string, string> = {
  discover: 'Descobrir',
  try: 'Experimentar',
  apply: 'Aplicar',
  integrate: 'Integrar',
  master: 'Dominar'
};

export default function ChallengePage() {
  const params = useParams();
  const id = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionResult, setCompletionResult] = useState<{
    xpEarned: number;
    bonusXp?: number;
    newLevel?: number;
    leveledUp: boolean;
    newBadges: EarnedBadge[];
    currentStreak: number;
  } | null>(null);
  const [startTime] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps] = useState(5); // Default challenge steps
  const [xpBonus, setXpBonus] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { currentLevel, xpProgress, xpForNextLevel, addXp, currentStreak } = useGamificationStore();

  // Show XP bonus animation
  const showXpBonus = (amount: number) => {
    setXpBonus({ amount, visible: true });
    setTimeout(() => setXpBonus({ amount: 0, visible: false }), 2000);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Award XP when challenge is complete
  useEffect(() => {
    if (isComplete && !xpAwarded && challenge) {
      const awardXp = async () => {
        const baseXp = XP_VALUES.CHALLENGE_COMPLETE;
        const multiplier = CHALLENGE_XP_MULTIPLIERS[challenge.type as keyof typeof CHALLENGE_XP_MULTIPLIERS] || 1;
        const xpAmount = Math.round(baseXp * multiplier);

        const result = await addXp(xpAmount, 'challenge_complete', challenge.level);
        setXpAwarded(true);

        if (result) {
          setCompletionResult({
            xpEarned: xpAmount,
            leveledUp: result.leveledUp,
            newLevel: result.leveledUp ? result.newLevel : undefined,
            newBadges: result.newBadges,
            currentStreak: currentStreak,
          });
          setShowCelebration(true);
        }
      };
      awardXp();
    }
  }, [isComplete, xpAwarded, challenge, addXp, currentStreak]);

  // Fetch challenge
  useEffect(() => {
    fetch(`/api/challenges/${id}`)
      .then(res => res.json())
      .then(data => {
        setChallenge(data);
        setLoading(false);

        // Initial message from Aurora
        const initialContent = JSON.parse(data.content || '{}');
        const initialMessage = initialContent.initial_message ||
          `Olá! Vamos começar o desafio "${data.name}". ${data.description}\n\nVocê está pronto para começar?`;

        setMessages([{
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: initialMessage,
          isInsight: detectInsight(initialMessage),
        }]);
      })
      .catch(err => {
        console.error('Erro ao carregar desafio:', err);
        setLoading(false);
      });
  }, [id]);

  // Core send message function
  const sendMessage = async (userMessage: string, isQuickAction = false) => {
    if (sending) return;

    setSending(true);
    setLastAnswerCorrect(null);

    // Add user message (skip for some quick actions that don't need display)
    if (!isQuickAction || userMessage.length > 30) {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: userMessage,
        hideQuickActions: true,
      }]);
    }

    try {
      const response = await fetch(`/api/challenges/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();

      // Parse for all interaction types in response
      const parsed = parseInteractions(data.message);

      // Add assistant response with insight detection and interactions
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: parsed.text,
        isInsight: detectInsight(parsed.text),
        interactionType: parsed.interactionType,
        quiz: parsed.quiz,
        swipe: parsed.swipe,
        timer: parsed.timer,
        wheel: parsed.wheel,
        slider: parsed.slider,
        flashcard: parsed.flashcard,
      }]);

      // Increment step (progress through challenge)
      if (!data.isComplete) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      }

      if (data.isComplete) {
        setCurrentStep(totalSteps);
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Handle text input send
  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  // Handle quiz answer
  const handleQuizAnswer = async (messageId: string, option: QuizOption) => {
    // Mark quiz as answered
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.quiz
        ? { ...msg, quiz: { ...msg.quiz, answered: true } }
        : msg
    ));

    setLastAnswerCorrect(option.isCorrect || false);

    // Award XP for correct answer
    if (option.isCorrect) {
      const bonusXp = 10;
      showXpBonus(bonusXp);
      await addXp(bonusXp, 'quiz_correct');
    }

    // Send answer to continue conversation
    const answerText = option.isCorrect
      ? `Respondi: "${option.text}" ✓`
      : `Respondi: "${option.text}"`;

    await sendMessage(answerText, true);
  };

  // Handle quick action
  const handleQuickAction = async (action: QuickAction) => {
    // Small XP for engagement
    if (action.id === 'understood' || action.id === 'next') {
      showXpBonus(5);
      await addXp(5, 'quick_action');
    }

    await sendMessage(action.message, true);
  };

  // Handle swipe cards complete
  const handleSwipeComplete = async (messageId: string, results: { card: SwipeCard; swipedRight: boolean }[]) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.swipe
        ? { ...msg, swipe: { ...msg.swipe, completed: true } }
        : msg
    ));

    const correctCount = results.filter(r => {
      const card = r.card;
      return card.correctSwipe === (r.swipedRight ? 'right' : 'left');
    }).length;

    const xp = correctCount * 5;
    if (xp > 0) {
      showXpBonus(xp);
      await addXp(xp, 'swipe_correct');
    }

    await sendMessage(`Completei o swipe: ${correctCount}/${results.length} corretos`, true);
  };

  // Handle timer challenge complete
  const handleTimerComplete = async (messageId: string, items: string[], timeRemaining: number) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.timer
        ? { ...msg, timer: { ...msg.timer, completed: true } }
        : msg
    ));

    const baseXp = 15;
    const bonusXp = timeRemaining;
    const totalXp = baseXp + bonusXp;

    showXpBonus(totalXp);
    await addXp(totalXp, 'timer_complete');

    await sendMessage(`Listei ${items.length} itens: ${items.join(', ')}`, true);
  };

  // Handle wheel spin result
  const handleWheelResult = async (messageId: string, option: WheelOption) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.wheel
        ? { ...msg, wheel: { ...msg.wheel, completed: true } }
        : msg
    ));

    showXpBonus(10);
    await addXp(10, 'wheel_spin');

    await sendMessage(`A roleta escolheu: ${option.emoji} ${option.text}`, true);
  };

  // Handle slider submit
  const handleSliderSubmit = async (messageId: string, value: number) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.slider
        ? { ...msg, slider: { ...msg.slider, completed: true } }
        : msg
    ));

    showXpBonus(5);
    await addXp(5, 'slider_submit');

    await sendMessage(`Minha confiança: ${value}%`, true);
  };

  // Handle flashcard complete
  const handleFlashcardComplete = async (messageId: string, remembered: boolean) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.flashcard
        ? { ...msg, flashcard: { ...msg.flashcard, completed: true } }
        : msg
    ));

    if (remembered) {
      showXpBonus(8);
      await addXp(8, 'flashcard_remembered');
    }

    await sendMessage(remembered ? 'Lembrei corretamente!' : 'Preciso revisar esse conceito.', true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)] mb-4">Desafio não encontrado</p>
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

  const elapsedMinutes = Math.round((new Date().getTime() - startTime.getTime()) / 60000);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/stacks/${challenge.stack.slug}`}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--accent)] uppercase tracking-wider">
                  {levelNames[challenge.type]}
                </span>
                <span className="text-xs text-[var(--text-muted)]">•</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {challenge.stack.name}
                </span>
              </div>
              <h1 className="text-base font-semibold text-[var(--text-primary)]">
                {challenge.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ChallengeProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Clock size={14} />
              <span>{elapsedMinutes}/{challenge.duration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <LevelBadge level={currentLevel} size="sm" />
              <XPBar
                currentXp={xpProgress}
                xpForNextLevel={xpForNextLevel}
                level={currentLevel}
                showLabel={false}
                className="w-16"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => {
                const isLastAssistant = message.role === 'assistant' &&
                  index === messages.length - 1;
                const showQuickActions = isLastAssistant &&
                  !sending &&
                  !message.quiz?.answered !== false &&
                  !message.hideQuickActions;

                return (
                  <motion.div
                    key={message.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%]">
                      <div
                        className={`
                          px-4 py-3 rounded-lg relative
                          ${message.role === 'user'
                            ? 'bg-[var(--accent)] text-[var(--background)]'
                            : message.isInsight
                              ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--text-primary)]'
                              : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]'
                          }
                        `}
                      >
                        {/* Insight indicator */}
                        {message.role === 'assistant' && message.isInsight && (
                          <div className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-medium mb-2">
                            <Lightbulb size={12} />
                            <span>Insight</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* Interactive elements */}
                        {message.interactionType && message.id && (
                          <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            {/* Quiz */}
                            {message.quiz && (
                              <QuizInline
                                question={message.quiz.question}
                                options={message.quiz.options}
                                onAnswer={(option) => handleQuizAnswer(message.id!, option)}
                                disabled={message.quiz.answered}
                                xpReward={10}
                              />
                            )}

                            {/* Swipe Cards */}
                            {message.swipe && !message.swipe.completed && (
                              <SwipeCards
                                cards={message.swipe.cards}
                                leftLabel={message.swipe.leftLabel}
                                rightLabel={message.swipe.rightLabel}
                                onComplete={(results) => handleSwipeComplete(message.id!, results)}
                                xpPerCorrect={5}
                              />
                            )}

                            {/* Timer Challenge */}
                            {message.timer && !message.timer.completed && (
                              <TimerChallenge
                                prompt={message.timer.prompt}
                                duration={message.timer.duration}
                                minItems={message.timer.minItems}
                                onComplete={(items, time) => handleTimerComplete(message.id!, items, time)}
                              />
                            )}

                            {/* Wheel Spin */}
                            {message.wheel && !message.wheel.completed && (
                              <WheelSpin
                                options={message.wheel.options}
                                title={message.wheel.title}
                                onResult={(option) => handleWheelResult(message.id!, option)}
                                xpReward={10}
                              />
                            )}

                            {/* Confidence Slider */}
                            {message.slider && !message.slider.completed && (
                              <ConfidenceSlider
                                question={message.slider.question}
                                leftLabel={message.slider.leftLabel}
                                rightLabel={message.slider.rightLabel}
                                onSubmit={(value) => handleSliderSubmit(message.id!, value)}
                                xpReward={5}
                              />
                            )}

                            {/* Flashcard Flip */}
                            {message.flashcard && !message.flashcard.completed && (
                              <FlashcardFlip
                                front={message.flashcard.front}
                                back={message.flashcard.back}
                                onComplete={(remembered) => handleFlashcardComplete(message.id!, remembered)}
                                xpReward={8}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Reactions for assistant messages (hide if has interaction) */}
                      {message.role === 'assistant' && message.id && !message.interactionType && (
                        <MessageReactions
                          messageId={message.id}
                          onReact={(msgId, reaction) => {
                            if (reaction) {
                              showXpBonus(2);
                              addXp(2, 'reaction');
                            }
                          }}
                        />
                      )}

                      {/* Quick Actions after last assistant message (hide if has interaction) */}
                      {showQuickActions && !message.interactionType && (
                        <QuickActions
                          onAction={handleQuickAction}
                          context={lastAnswerCorrect === false ? 'quiz-wrong' : 'default'}
                          disabled={sending}
                          className="mt-3"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <TypingIndicator />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* XP Bonus Floater */}
      <AnimatePresence>
        {xpBonus.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-32 right-8 z-50 flex items-center gap-2 bg-[var(--accent)] text-[var(--background)] px-4 py-2 rounded-full font-bold shadow-lg"
          >
            <Zap size={16} />
            +{xpBonus.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      {challenge && completionResult && (
        <ChallengeCompleteModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          result={{
            ...completionResult,
            stackSlug: challenge.stack.slug,
            stackName: challenge.stack.name,
          }}
        />
      )}

      {/* Input Area */}
      <footer className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-[var(--accent)] text-[var(--background)] px-4 rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
