# Aurora Landing Page - Front-End Specification

**Autor:** Sally (UX Expert)
**Data:** 2025-12-30
**Versão:** 1.0

---

## 1. Visão Geral

### Objetivo da Página
Converter visitantes frustrados com cursos/gurus em usuários do Aurora, comunicando que este NÃO é mais um teste de personalidade, mas um espelho que revela verdades.

### Tom Visual
- **Minimalista e tenso** - muito espaço em branco (ou preto, no caso)
- **Tipografia forte** - headlines grandes e confrontacionais
- **Accent dourado** - usado com parcimônia para destacar ação
- **Sem imagens stock** - o foco é no texto e na promessa

### Princípio de Design
> "Cada elemento deve criar tensão ou resolver tensão. Nada decorativo."

---

## 2. Design System (Existente)

```css
/* Cores */
--background: #0D0D0D;      /* Fundo principal */
--surface: #1A1A1A;         /* Cards/surfaces */
--surface-elevated: #262626; /* Hover states */
--border: #333333;          /* Bordas sutis */
--text-primary: #F5F5F5;    /* Texto principal */
--text-secondary: #A3A3A3;  /* Texto secundário */
--text-muted: #666666;      /* Texto terciário */
--accent: #C9A227;          /* Dourado (ação) */
--accent-hover: #D4B03A;    /* Dourado hover */

/* Tipografia */
font-family: 'Inter', sans-serif;

/* Animações */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--duration-normal: 300ms;
```

---

## 3. Estrutura de Seções

### Mobile-First Layout

```
┌─────────────────────────────────────┐
│           HERO SECTION              │
│  Headline confrontacional           │
│  Subheadline que nomeia a dor       │
│  CTA primário + secundário          │
│  Indicador de scroll                │
├─────────────────────────────────────┤
│         AGITAÇÃO SECTION            │
│  "Aurora é para quem está cansado"  │
│  Lista de checkbox dores            │
├─────────────────────────────────────┤
│       ANTI-SEÇÃO (Filtro)           │
│  "Aurora NÃO é para quem quer..."   │
│  Lista com ✗ do que não faz         │
├─────────────────────────────────────┤
│       COMO FUNCIONA                 │
│  3 passos simples (sem complexidade)│
│  Visual de fluxo linear             │
├─────────────────────────────────────┤
│       O QUE VOCÊ DESCOBRE           │
│  Grid das 12 camadas (preview)      │
│  Hover revela definição curta       │
├─────────────────────────────────────┤
│       PROVA/GARANTIA                │
│  Garantia de 1 insight ou devolução │
│  Número de pessoas (se houver)      │
├─────────────────────────────────────┤
│       CTA FINAL                     │
│  Manifesto curto                    │
│  Botão principal grande             │
├─────────────────────────────────────┤
│          FOOTER                     │
│  Minimalista, só essencial          │
└─────────────────────────────────────┘
```

---

## 4. Especificação por Seção

### 4.1 Hero Section

**Objetivo:** Criar identificação imediata e tensão

**Layout:**
```
[Centered, full viewport height]

                    Aurora

    Você não precisa de mais um curso.

    Você precisa ver o que todos
    os cursos esconderam.

    Em 15 minutos, Aurora revela o que você
    realmente quer. Não o que você diz querer.

    [Ver a verdade]   [Como funciona]

              ↓ (scroll indicator)
```

**Especificações:**
- **Logo "Aurora"**: text-lg, font-medium, text-muted (não compete com headline)
- **Headline principal**: text-4xl md:text-5xl lg:text-6xl, font-bold, text-primary
- **Subheadline**: text-xl md:text-2xl, text-secondary, max-w-2xl
- **Descrição**: text-base md:text-lg, text-muted
- **CTA Primário**: bg-accent, text-background, px-8 py-4, rounded-lg, font-medium
- **CTA Secundário**: border border-border, text-secondary, hover:text-primary
- **Scroll indicator**: animate-bounce, opacity-50

**Interações:**
- CTA primário: hover scale(1.02), glow sutil
- CTA secundário: hover border-accent
- Scroll indicator: fade out ao scrollar

---

### 4.2 Agitação Section

**Objetivo:** Intensificar a dor e criar identificação

**Layout:**
```
## Aurora é para quem está cansado de

☐ Começar empolgado e parar depois
☐ Achar que o problema é disciplina
☐ Comprar curso achando que "esse é o definitivo"
☐ Ouvir "você só precisa de mais foco"
☐ Se comparar com gurus que ignoram sorte
```

**Especificações:**
- **Container**: max-w-2xl, mx-auto, py-24
- **Heading**: text-2xl md:text-3xl, font-semibold
- **Checkbox items**: flex items-start gap-3, text-lg, text-secondary
- **Checkbox visual**: w-5 h-5, border-2 border-muted, rounded (não preenchido = tensão)
- **Spacing**: space-y-4 entre items

**Interações:**
- Checkboxes aparecem sequencialmente (stagger animation)
- Hover em cada item: text-primary, checkbox border-accent

---

### 4.3 Anti-Seção (Filtro)

**Objetivo:** Qualificar e criar escassez/exclusividade

**Layout:**
```
## Aurora NÃO é para quem quer

✗ Mais um plano de ação
✗ Validação do que já acredita
✗ Um rótulo (INTJ, Eneagrama 7, etc.)
✗ Alguém dizendo o que fazer
```

**Especificações:**
- **Container**: bg-surface, rounded-xl, p-8 md:p-12
- **Heading**: text-2xl, font-semibold, text-primary
- **X items**: flex items-center gap-3, text-muted
- **X icon**: text-error/50, size-5

**Interações:**
- Entrada com fade-in do container inteiro
- Items estáticos (sem hover) para transmitir "firmeza"

---

### 4.4 Como Funciona

**Objetivo:** Reduzir fricção, mostrar simplicidade

**Layout:**
```
## O Protocolo de 15 Minutos

Aurora não te pergunta "o que você quer?"
Isso só ativa suas racionalizações.

[1]──────────[2]──────────[3]

Aurora faz      Você vê        Você decide
perguntas      contradições    o que fazer

← Fluxo visual de 3 passos →
```

**Especificações:**
- **Container**: py-24, text-center
- **Intro text**: text-lg, text-secondary, italic
- **Steps**: grid grid-cols-1 md:grid-cols-3, gap-8
- **Step number**: w-12 h-12, rounded-full, bg-accent/20, text-accent, font-bold
- **Step title**: text-lg, font-medium, text-primary
- **Connector line**: hidden md:block, h-0.5, bg-border (entre steps)

**Interações:**
- Steps aparecem sequencialmente
- Hover no step: scale(1.05), glow sutil

---

### 4.5 O Que Você Descobre (Preview das Camadas)

**Objetivo:** Criar curiosidade sobre as 12 verdades

**Layout:**
```
## 12 verdades que Aurora revela

[Grid 3x4 ou 4x3 de cards clicáveis]

┌─────────┐ ┌─────────┐ ┌─────────┐
│ Motor   │ │ Ferida  │ │ Sombra  │
│ Oculto  │ │Fundadora│ │ Ativa   │
└─────────┘ └─────────┘ └─────────┘
     ...        ...        ...
```

**Especificações:**
- **Container**: py-24
- **Heading**: text-2xl md:text-3xl, font-semibold, text-center
- **Grid**: grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4, gap-4
- **Card**: bg-surface, border border-border, rounded-lg, p-4, text-center
- **Card title**: text-sm, font-medium, text-primary
- **Card locked state**: opacity-60, com ícone de "?"

**Interações:**
- Hover no card: border-accent, bg-surface-elevated
- Tooltip ou modal com definição curta
- Cards "bloqueados" visualmente indicam que só revelam no protocolo

---

### 4.6 Garantia Section

**Objetivo:** Remover risco, aumentar confiança

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│        Garantia: 1 insight ou           │
│        100% de devolução                │
│                                         │
│   Complete 15 minutos de conversa.      │
│   Se você não tiver pelo menos 1        │
│   insight novo sobre você mesmo,        │
│   devolvemos 100%. Sem perguntas.       │
│                                         │
└─────────────────────────────────────────┘
```

**Especificações:**
- **Container**: bg-accent/10, border border-accent/30, rounded-xl, p-8 md:p-12, text-center
- **Heading**: text-xl md:text-2xl, font-bold, text-accent
- **Body**: text-base, text-secondary, max-w-lg, mx-auto

---

### 4.7 CTA Final

**Objetivo:** Converter com urgência emocional

**Layout:**
```
Aurora não te conserta.
Aurora te revela.

O que você faz com essa clareza
é escolha sua.

[Ver a verdade em 15 minutos]

"O que você descobrir não dá pra desver."
```

**Especificações:**
- **Container**: py-32, text-center
- **Manifesto**: text-2xl md:text-3xl, font-medium, text-primary, leading-relaxed
- **CTA**: bg-accent, text-background, px-10 py-5, rounded-lg, text-lg, font-semibold
- **Footer note**: text-sm, text-muted, mt-6

**Interações:**
- CTA com pulse animation sutil
- Hover: scale(1.03), shadow-glow

---

### 4.8 Footer

**Objetivo:** Credibilidade sem distração

**Layout:**
```
────────────────────────────────────
Aurora · 2025 · Política de Privacidade
```

**Especificações:**
- **Container**: py-8, border-t border-border
- **Text**: text-xs, text-muted, text-center
- **Links**: hover:text-accent

---

## 5. Componentes Reutilizáveis

### Button Primary
```tsx
<button className="
  bg-[var(--accent)]
  text-[var(--background)]
  px-8 py-4
  rounded-lg
  font-medium
  hover:bg-[var(--accent-hover)]
  hover:scale-[1.02]
  transition-all
  duration-300
  shadow-lg
  hover:shadow-[var(--shadow-glow)]
">
  {children}
</button>
```

### Button Secondary
```tsx
<button className="
  border border-[var(--border)]
  text-[var(--text-secondary)]
  px-6 py-3
  rounded-lg
  font-medium
  hover:border-[var(--accent)]
  hover:text-[var(--text-primary)]
  transition-all
  duration-300
">
  {children}
</button>
```

### Section Container
```tsx
<section className="
  max-w-4xl
  mx-auto
  px-6
  py-24
">
  {children}
</section>
```

### Checkbox Item (Agitação)
```tsx
<div className="flex items-start gap-3 text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
  <div className="w-5 h-5 border-2 border-[var(--text-muted)] rounded mt-1 flex-shrink-0" />
  <span>{text}</span>
</div>
```

### X Item (Anti-seção)
```tsx
<div className="flex items-center gap-3 text-[var(--text-muted)]">
  <X className="text-[var(--error)] opacity-50" size={20} />
  <span>{text}</span>
</div>
```

---

## 6. Animações

### Entrada das Seções
```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s var(--ease-out) forwards;
}
```

### Stagger dos Checkboxes
```tsx
// Usando Framer Motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};
```

### Scroll Indicator Bounce
```css
.animate-scroll-indicator {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
```

---

## 7. Responsividade

### Breakpoints
```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

### Mobile Adjustments
- Hero: text-3xl para headline
- Sections: py-16 ao invés de py-24
- Grid camadas: 2 colunas
- CTAs: full width em mobile

### Tablet Adjustments
- Hero: text-4xl para headline
- Grid camadas: 3 colunas

### Desktop Adjustments
- Max-width containers: max-w-4xl ou max-w-5xl
- Grid camadas: 4 colunas
- Mais espaçamento vertical

---

## 8. Acessibilidade

- **Contraste**: Todos os textos passam WCAG AA
- **Focus states**: outline-2 outline-accent outline-offset-2
- **Reduced motion**: Respeitar prefers-reduced-motion
- **Semantic HTML**: Usar header, main, section, footer
- **ARIA labels**: Nos botões e elementos interativos

---

## 9. Performance

- **Font loading**: font-display: swap para Inter
- **Images**: Não há imagens no MVP
- **Animations**: GPU-accelerated (transform, opacity)
- **Above the fold**: Hero deve carregar em < 1s

---

## 10. Arquivos a Criar

```
aurora/
├── src/
│   ├── app/
│   │   └── (landing)/
│   │       └── page.tsx          # Landing page
│   └── components/
│       └── landing/
│           ├── Hero.tsx
│           ├── AgitationSection.tsx
│           ├── AntiSection.tsx
│           ├── HowItWorks.tsx
│           ├── LayersPreview.tsx
│           ├── GuaranteeSection.tsx
│           ├── FinalCTA.tsx
│           └── Footer.tsx
```

---

*Spec criada por Sally (UX Expert) - AIOS*
