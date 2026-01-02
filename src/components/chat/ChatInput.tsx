'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Digite sua resposta...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-3 p-4 border-t border-[var(--border)] bg-[var(--surface)]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-[var(--background)] text-[var(--text-primary)]
                   placeholder-[var(--text-muted)] rounded-lg px-4 py-3
                   border border-[var(--border)] focus:border-[var(--accent)]
                   focus:outline-none transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="p-3 rounded-lg bg-[var(--accent)] text-[var(--background)]
                   hover:bg-[var(--accent-hover)] transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Enviar mensagem"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
