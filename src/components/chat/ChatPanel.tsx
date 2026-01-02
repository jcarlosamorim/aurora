'use client';

import { useRef, useEffect } from 'react';
import { Message } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

interface ChatPanelProps {
  messages: Message[];
  onSend: (message: string) => void;
  isTyping?: boolean;
  disabled?: boolean;
}

export function ChatPanel({ messages, onSend, isTyping, disabled }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput onSend={onSend} disabled={disabled || isTyping} />
    </div>
  );
}
