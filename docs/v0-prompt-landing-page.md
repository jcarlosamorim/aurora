# Prompt para v0 - Aurora Landing Page

**Gerado por:** Sally (UX Expert)
**Data:** 2025-12-30
**Target:** v0.dev by Vercel

---

## Como Usar

1. Acesse [v0.dev](https://v0.dev)
2. Cole o prompt abaixo
3. Gere a UI
4. Copie o código para `aurora/src/app/(landing)/page.tsx`
5. Ajuste as variáveis CSS para usar as do projeto

---

## Prompt Principal (Copie Abaixo)

```
Create a dark mode landing page for "Aurora" - an AI self-revelation tool. The page should feel minimalist, tense, and confrontational but compassionate.

## TECH STACK
- Next.js 14+ with App Router
- Tailwind CSS
- TypeScript
- Framer Motion for animations

## DESIGN SYSTEM
Use these exact CSS variables (they're already defined in the project):
- Background: #0D0D0D (--background)
- Surface: #1A1A1A (--surface)
- Surface Elevated: #262626 (--surface-elevated)
- Border: #333333 (--border)
- Text Primary: #F5F5F5 (--text-primary)
- Text Secondary: #A3A3A3 (--text-secondary)
- Text Muted: #666666 (--text-muted)
- Accent (Gold): #C9A227 (--accent)
- Accent Hover: #D4B03A (--accent-hover)
- Font: Inter

## PAGE STRUCTURE

### Section 1: Hero (Full Viewport Height)
- Small "Aurora" text at top (muted, not competing with headline)
- Large headline: "Você não precisa de mais um curso."
- Second headline line: "Você precisa ver o que todos os cursos esconderam."
- Subtext: "Em 15 minutos, Aurora revela o que você realmente quer. Não o que você diz querer. O que você REALMENTE quer."
- Two buttons:
  - Primary (gold background, dark text): "Ver a verdade"
  - Secondary (border only): "Como funciona"
- Animated scroll indicator at bottom (bouncing arrow down)
- Everything centered, lots of breathing room

### Section 2: Agitation (Pain Points)
- Heading: "Aurora é para quem está cansado de"
- List of items with empty checkbox visuals (☐):
  - "Começar empolgado e parar depois"
  - "Achar que o problema é disciplina"
  - "Comprar curso achando que 'esse é o definitivo'"
  - "Ouvir 'você só precisa de mais foco'"
  - "Se comparar com gurus que ignoram sorte"
- Stagger animation on scroll (items appear one by one)
- Max-width container, centered

### Section 3: Anti-Section (Filter)
- Container with surface background and subtle border
- Heading: "Aurora NÃO é para quem quer"
- List with X icons (red/muted):
  - "Mais um plano de ação"
  - "Validação do que já acredita"
  - "Um rótulo (INTJ, Eneagrama 7, etc.)"
  - "Alguém dizendo o que fazer"

### Section 4: How It Works
- Heading: "O Protocolo de 15 Minutos"
- Intro text (italic): "Aurora não te pergunta 'o que você quer?' Isso só ativa suas racionalizações."
- 3-step horizontal flow with connecting lines:
  1. Circle with "1" → "Aurora faz perguntas"
  2. Circle with "2" → "Você vê contradições"
  3. Circle with "3" → "Você decide o que fazer"
- Gold accent on step numbers

### Section 5: What You Discover (Layers Preview)
- Heading: "12 verdades que Aurora revela"
- Grid of 12 cards (2 cols mobile, 3 cols tablet, 4 cols desktop)
- Each card shows layer name:
  - Motor Oculto, Ferida Fundadora, Sombra Ativa
  - Paradoxo, Mapa de Energia, Algoritmo de Decisão
  - Sistema de Crenças, Narrativa, Padrão Relacional
  - Ciclo de Sabotagem, Potencial Latente, Zona de Genialidade
- Cards have surface background, border, hover effect (border turns gold)
- Locked/mystery appearance (they're revealed in the actual app)

### Section 6: Guarantee
- Container with gold tinted background (accent at 10% opacity)
- Gold border at 30% opacity
- Heading: "Garantia: 1 insight ou 100% de devolução"
- Text: "Complete 15 minutos de conversa. Se você não tiver pelo menos 1 insight novo sobre você mesmo, devolvemos 100%. Sem perguntas."
- Centered, max-width

### Section 7: Final CTA
- Large manifesto text:
  "Aurora não te conserta. Aurora te revela."
  "O que você faz com essa clareza é escolha sua."
- Large gold CTA button: "Ver a verdade em 15 minutos"
- Small muted text below: "O que você descobrir não dá pra desver."
- Lots of vertical padding

### Section 8: Footer
- Simple, minimal
- Thin border top
- Text: "Aurora · 2025"
- Small text, muted, centered

## ANIMATIONS
- Hero: Fade in on load
- Agitation checkboxes: Stagger animation on scroll into view
- Steps: Sequential reveal
- All sections: Fade in up when scrolling into view
- Buttons: Scale slightly on hover with transition
- Scroll indicator: Subtle bounce animation

## CONSTRAINTS
- NO stock images
- NO emojis except the checkbox (☐) and X (✗) visual indicators
- Keep it MINIMAL - lots of negative space
- Typography-focused design
- Mobile-first approach
- Use semantic HTML (header, main, section, footer)
- Add appropriate aria-labels

## DO NOT
- Add a navigation bar (this is a focused landing page)
- Use any colors outside the defined palette
- Add any decorative elements
- Make it look "friendly" or "playful" - it should feel serious and revealing

Generate the complete page as a single React component with all sections.
```

---

## Prompt Alternativo (Seção por Seção)

Se o prompt acima for muito longo, use este fluxo:

### Prompt 1: Hero
```
Create a hero section for a dark landing page. Full viewport height, centered content.

Colors: Background #0D0D0D, Text #F5F5F5, Accent #C9A227, Muted #666666

Content:
- Small "Aurora" text (muted)
- Headline: "Você não precisa de mais um curso."
- Second line: "Você precisa ver o que todos os cursos esconderam."
- Subtext about 15 minutes revealing what you really want
- Gold primary button "Ver a verdade"
- Secondary outlined button "Como funciona"
- Bouncing scroll indicator arrow at bottom

Use Next.js, TypeScript, Tailwind. Include framer-motion fade-in animation.
```

### Prompt 2: Agitation Section
```
Create a section with pain points for a dark landing page.

Colors: Background #0D0D0D, Text Secondary #A3A3A3, Accent #C9A227

Heading: "Aurora é para quem está cansado de"

List with empty checkbox visuals:
- Começar empolgado e parar depois
- Achar que o problema é disciplina
- Comprar curso achando que "esse é o definitivo"
- Ouvir "você só precisa de mais foco"
- Se comparar com gurus que ignoram sorte

Add stagger animation with framer-motion when scrolling into view.
```

### Prompt 3: Anti-Section
```
Create a "not for" filter section with dark surface background (#1A1A1A).

Heading: "Aurora NÃO é para quem quer"

List with X icons (use Lucide X icon, muted red):
- Mais um plano de ação
- Validação do que já acredita
- Um rótulo (INTJ, Eneagrama 7, etc.)
- Alguém dizendo o que fazer

Subtle border, rounded corners, padding.
```

### Prompt 4: How It Works
```
Create a 3-step process section for dark theme.

Heading: "O Protocolo de 15 Minutos"
Italic intro: "Aurora não te pergunta 'o que você quer?' Isso só ativa suas racionalizações."

3 steps connected by lines:
1. "Aurora faz perguntas"
2. "Você vê contradições"
3. "Você decide o que fazer"

Step numbers in gold circles (#C9A227). Responsive: vertical on mobile, horizontal on desktop.
```

### Prompt 5: Layers Grid
```
Create a preview grid of 12 "layers" for a dark theme page.

Heading: "12 verdades que Aurora revela"

Grid: 2 cols mobile, 3 tablet, 4 desktop

Cards with these names:
Motor Oculto, Ferida Fundadora, Sombra Ativa, Paradoxo, Mapa de Energia, Algoritmo de Decisão, Sistema de Crenças, Narrativa, Padrão Relacional, Ciclo de Sabotagem, Potencial Latente, Zona de Genialidade

Each card: surface background (#1A1A1A), border (#333333), hover turns border gold (#C9A227). Mysterious/locked feel.
```

### Prompt 6: Guarantee + Final CTA
```
Create a guarantee section and final CTA for dark landing page.

Guarantee:
- Gold-tinted background (10% opacity of #C9A227)
- Heading: "Garantia: 1 insight ou 100% de devolução"
- Text about completing 15 minutes and getting money back if no insight

Final CTA:
- Large text: "Aurora não te conserta. Aurora te revela. O que você faz com essa clareza é escolha sua."
- Large gold button: "Ver a verdade em 15 minutos"
- Small muted footer: "O que você descobrir não dá pra desver."

Lots of vertical spacing.
```

---

## Após Gerar no v0

### Ajustes Necessários

1. **Substituir cores hardcoded por variáveis CSS:**
```tsx
// De:
className="bg-[#0D0D0D]"
// Para:
className="bg-[var(--background)]"
```

2. **Adicionar link do CTA para o app:**
```tsx
import Link from 'next/link';

<Link href="/app">
  <button>Ver a verdade</button>
</Link>
```

3. **Verificar imports do Framer Motion:**
```tsx
'use client';
import { motion } from 'framer-motion';
```

4. **Criar route group para landing:**
```
aurora/src/app/(landing)/page.tsx
```

---

*Prompt gerado por Sally (UX Expert) - AIOS*
