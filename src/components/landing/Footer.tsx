'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--text-muted)] text-sm">
          Aurora © {currentYear}
        </p>
        <p className="text-[var(--text-muted)] text-xs mt-2">
          Revelando o que você escondeu de si mesmo.
        </p>
      </div>
    </footer>
  );
}
