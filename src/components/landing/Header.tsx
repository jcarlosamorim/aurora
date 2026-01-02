'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Layers } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="text-xl font-light tracking-[0.3em] text-[var(--accent)] uppercase transition-all duration-300 group-hover:text-glow">
            Aurora
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/chat">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Chat</span>
            </motion.div>
          </Link>

          <Link href="/stacks">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              <Layers size={18} />
              <span className="text-sm font-medium">Stacks</span>
            </motion.div>
          </Link>

          {/* CTA Button */}
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,162,39,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[var(--accent)]/20"
            >
              Iniciar
            </motion.button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
