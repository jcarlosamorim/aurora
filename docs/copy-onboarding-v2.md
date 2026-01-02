# Aurora: Copy de Onboarding v2

**Objetivo:** Substituir a copy "feijão com arroz" por copy que aplica Schwartz + Hormozi + Kapil

---

## 1. UserSelector (Tela de Entrada)

### ANTES (Atual)
```tsx
<h1>Aurora</h1>
<p>Descubra sua filosofia real de vida em 8 minutos</p>
```

### DEPOIS (Nova Copy)

**Opção A - Confronto Direto:**
```tsx
<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
  Você sabe o que você quer?
</h1>
<p className="text-[var(--text-muted)] mb-1">
  Não o que você diz querer.
</p>
<p className="text-[var(--accent)] font-medium">
  O que você REALMENTE quer.
</p>
```

**Opção B - Provocação:**
```tsx
<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
  10 cursos. 0 mudanças reais.
</h1>
<p className="text-[var(--text-muted)]">
  Talvez o problema nunca tenha sido o curso.
</p>
```

**Opção C - Espelho (Recomendada):**
```tsx
<h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
  Aurora
</h1>
<p className="text-[var(--text-muted)] text-sm mb-4">
  Em 8 minutos você vai ver o que anos de cursos esconderam.
</p>
<p className="text-[var(--accent)] text-xs">
  Não é teste. Não categoriza. Só revela.
</p>
```

### Texto "Nova jornada" → "Primeira revelação"
```tsx
// ANTES
<p className="text-xs text-[var(--text-muted)]">
  {user.sessions.length > 0 ? `${user.sessions.length} sessão(ões)` : 'Nova jornada'}
</p>

// DEPOIS
<p className="text-xs text-[var(--text-muted)]">
  {user.sessions.length > 0
    ? `${user.sessions.length} revelação(ões)`
    : 'Primeira vez aqui'
  }
</p>
```

### Botão "Iniciar" → Copy com tensão
```tsx
// ANTES
{hasHistory ? 'Continuar' : 'Iniciar'}

// DEPOIS
{hasHistory ? 'Continuar' : 'Ver a verdade'}
```

### Footer
```tsx
// ANTES
<p>Sua conversa é salva automaticamente</p>

// DEPOIS
<p className="text-center text-xs text-[var(--text-muted)] mt-6">
  O que você descobrir aqui não dá pra desver.
</p>
```

---

## 2. PHASE_CONTEXT (Fases da Sessão)

### ANTES (Atual)
```tsx
const PHASE_CONTEXT = {
  abertura: {
    title: 'Quebrando o gelo',
    subtitle: 'Estou conhecendo como você pensa sobre mudança',
  },
  exploracao: {
    title: 'Explorando padrões',
    subtitle: 'Identificando o que te move e o que te trava',
  },
  // ...
};
```

### DEPOIS (Nova Copy)
```tsx
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
```

---

## 3. ProgressStepper (Labels das Fases)

### ANTES
```tsx
const PHASES = [
  { id: 'abertura', label: 'Quebra-gelo', minLayers: 0 },
  { id: 'exploracao', label: 'Exploração', minLayers: 2 },
  { id: 'aprofundamento', label: 'Profundidade', minLayers: 5 },
  { id: 'sintese', label: 'Síntese', minLayers: 8 },
  { id: 'fechamento', label: 'Revelação', minLayers: 10 },
];
```

### DEPOIS
```tsx
const PHASES: { id: SessionPhase; label: string; minLayers: number }[] = [
  { id: 'abertura', label: 'Loop', minLayers: 0 },
  { id: 'exploracao', label: 'Espelho', minLayers: 2 },
  { id: 'aprofundamento', label: 'Raiz', minLayers: 5 },
  { id: 'sintese', label: 'Verdade', minLayers: 8 },
  { id: 'fechamento', label: 'Você', minLayers: 10 },
];
```

---

## 4. MilestoneNotification (Camada Descoberta)

### ANTES
```tsx
<p className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-medium">
  Camada descoberta
</p>
<p className="text-sm font-semibold text-[var(--text-primary)]">
  {layer.name}
</p>
```

### DEPOIS
```tsx
<p className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-medium">
  Revelado
</p>
<p className="text-sm font-semibold text-[var(--text-primary)]">
  {layer.name}
</p>
<p className="text-[10px] text-[var(--text-muted)] mt-0.5">
  Toque na árvore para ver mais
</p>
```

---

## 5. Modal de Sessão Completa

### ANTES
```tsx
<div className="text-4xl font-bold text-[var(--accent)] mb-2">
  {discoveredCount}/12
</div>
<h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
  Sessão Completa
</h2>
<p className="text-[var(--text-secondary)] mb-6">
  Em 8 minutos descobrimos {discoveredCount} camadas da sua personalidade.
  Sua sessão foi salva.
</p>
```

### DEPOIS
```tsx
<h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
  Agora você sabe.
</h2>
<p className="text-[var(--text-secondary)] mb-4">
  Em 8 minutos você viu o que estava escondido.
</p>
<div className="text-4xl font-bold text-[var(--accent)] mb-2">
  {discoveredCount}
  <span className="text-base text-[var(--text-muted)] font-normal"> verdades reveladas</span>
</div>
<p className="text-xs text-[var(--text-muted)] mb-6">
  E não dá pra desver.
</p>
```

**Botões:**
```tsx
// ANTES
<button>Ver minha árvore</button>
<button>Nova sessão</button>

// DEPOIS
<button>Ver o que descobri</button>
<button>Começar de novo</button>
```

---

## 6. Layer Content (Definições das Camadas)

### Exemplo: Motor Oculto

**ANTES:**
```ts
'motor-oculto': {
  name: 'Motor Oculto',
  definition: 'A motivacao inconsciente que impulsiona suas decisoes. Nao e o que voce diz querer, mas o que realmente te move.',
  whyItMatters: 'Entender seu motor oculto revela por que voce faz escolhas que as vezes nem voce entende. E a diferenca entre remar contra ou a favor da mare.',
  // ...
}
```

**DEPOIS:**
```ts
'motor-oculto': {
  name: 'Motor Oculto',
  definition: 'O que realmente te move. Não é o que você diz - é o que você faz quando ninguém está olhando.',
  whyItMatters: 'Você persegue dinheiro? Ou validação disfarçada de dinheiro? Saber a diferença muda tudo.',
  genericExample: 'Você diz que quer liberdade. Mas toda escolha que faz busca segurança. O que você quer de verdade?',
  // ...
}
```

### Exemplo: Ferida Fundadora

**ANTES:**
```ts
'ferida-fundadora': {
  name: 'Ferida Fundadora',
  definition: 'Uma experiencia marcante (geralmente na infancia) que moldou como voce se protege do mundo.',
  whyItMatters: 'Suas defesas atuais foram criadas para proteger essa ferida. Conhece-la te da poder de escolher novas formas de se proteger.',
  // ...
}
```

**DEPOIS:**
```ts
'ferida-fundadora': {
  name: 'Ferida Fundadora',
  definition: 'O momento em que você aprendeu a se proteger. A armadura que você veste até hoje.',
  whyItMatters: 'Essa proteção funcionou lá. Ainda funciona aqui? Ou está te custando mais do que protege?',
  genericExample: 'Quem foi abandonado não confia. Quem foi humilhado não se expõe. O que você evita sem perceber?',
  // ...
}
```

### Exemplo: Ciclo de Sabotagem

**ANTES:**
```ts
'ciclo-sabotagem': {
  name: 'Ciclo de Sabotagem',
  definition: 'Um padrao repetitivo que te impede de alcancar o que voce quer. Voce sabe que faz, mas continua fazendo.',
  whyItMatters: 'Ciclos de sabotagem tem uma funcao protetora escondida. Descobrir essa funcao e a chave para quebra-los.',
  // ...
}
```

**DEPOIS:**
```ts
'ciclo-sabotagem': {
  name: 'Ciclo de Sabotagem',
  definition: 'Curso → empolgação → desistência → "o problema sou eu" → novo curso. Quantas vezes?',
  whyItMatters: 'Você não tem problema de disciplina. Você tem um ciclo que se repete porque está protegendo algo.',
  genericExample: 'Você sempre para perto do fim. Por quê? O que acontece se você conseguir?',
  // ...
}
```

### Exemplo: Zona de Genialidade

**ANTES:**
```ts
'zona-genialidade': {
  name: 'Zona de Genialidade',
  definition: 'A interseccao unica de seus talentos naturais, interesse genuino e capacidade de impacto. Onde voce e insubstituivel.',
  // ...
}
```

**DEPOIS:**
```ts
'zona-genialidade': {
  name: 'Zona de Genialidade',
  definition: 'O que só você faz do jeito que faz. Onde trabalho vira jogo e ninguém compete com você.',
  whyItMatters: 'Você está perseguindo o que "deveria" fazer ou o que só você pode fazer?',
  genericExample: 'Aquela coisa que outros pedem sua ajuda. Que você faz sem esforço. Que você chama de "hobby". Isso.',
  // ...
}
```

---

## 7. Header da Sessão

### ANTES
```tsx
<div className="text-right">
  <div className="text-2xl font-bold text-[var(--accent)]">
    {discoveredCount}
    <span className="text-base text-[var(--text-muted)] font-normal">/12</span>
  </div>
  <p className="text-xs text-[var(--text-muted)]">camadas reveladas</p>
</div>
```

### DEPOIS
```tsx
<div className="text-right">
  <div className="text-2xl font-bold text-[var(--accent)]">
    {discoveredCount}
    <span className="text-base text-[var(--text-muted)] font-normal">/12</span>
  </div>
  <p className="text-xs text-[var(--text-muted)]">verdades expostas</p>
</div>
```

---

## 8. Mensagem de Erro

### ANTES
```tsx
content: 'Desculpe, houve um erro. Pode repetir?',
```

### DEPOIS
```tsx
content: 'Algo travou aqui. Me conta de novo?',
```

---

## Resumo das Mudanças

| Local | Mudança Principal |
|-------|-------------------|
| **Header UserSelector** | De genérico → confronto/provocação |
| **"Nova jornada"** | → "Primeira vez aqui" |
| **Botão Iniciar** | → "Ver a verdade" |
| **Footer** | → "O que você descobrir não dá pra desver" |
| **Fases** | De técnico → metáforas (Loop, Espelho, Raiz, Verdade, Você) |
| **Milestone** | "Camada descoberta" → "Revelado" |
| **Modal final** | "Sessão Completa" → "Agora você sabe" |
| **Layers** | Definições acadêmicas → espelhos confrontacionais |
| **Contador** | "camadas reveladas" → "verdades expostas" |

---

## Próximo Passo

Quer que eu aplique essas mudanças diretamente nos arquivos do código?

Posso fazer em ordem de impacto:
1. **UserSelector.tsx** - primeira impressão
2. **page.tsx** - PHASE_CONTEXT e modal
3. **ProgressStepper.tsx** - labels das fases
4. **MilestoneNotification.tsx** - notificação
5. **layer-content.ts** - definições das camadas
