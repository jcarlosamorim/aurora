# Aurora Layer Card Redesign - UI/UX Specification

**Versão:** 1.0
**Data:** 2025-12-30
**Autor:** Sally (UX Expert) + AIOS

---

## 1. Problema Identificado

### Estado Atual
O usuário recebe informações brutas sem interpretação contextualizada:

```
Narrativa Dominante | 75%
Evidência: "Ela tem a mesma sensação que eu, nós compartilhamos os gastos"
```

### Problemas de UX
1. **"Força 75%"** - Não comunica o que significa
2. **Evidência crua** - Não conecta a citação com o insight
3. **Sem ação** - Usuário não sabe o que fazer com a informação
4. **Sem contexto** - Não explica como isso afeta sua vida

---

## 2. Arquitetura de 2 Agentes

### 2.1 Fluxo Proposto

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUXO DE DADOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Usuário] ─── mensagem ───► [AURORA - Conversacional]          │
│                                    │                            │
│                                    │ resposta natural           │
│                                    ▼                            │
│                              [API /chat]                        │
│                                    │                            │
│                    ┌───────────────┴───────────────┐            │
│                    │                               │            │
│                    ▼                               ▼            │
│           [Aurora Response]              [INTERPRETADOR]        │
│           (mensagem ao user)             (análise profunda)     │
│                    │                               │            │
│                    │                               │            │
│                    │                     ┌─────────┴─────────┐  │
│                    │                     │ LayerInterpretation│  │
│                    │                     │ - whatItIs         │  │
│                    │                     │ - whatItMeans      │  │
│                    │                     │ - impact           │  │
│                    │                     │ - nextQuestion     │  │
│                    │                     └─────────┬─────────┘  │
│                    │                               │            │
│                    └───────────────┬───────────────┘            │
│                                    │                            │
│                                    ▼                            │
│                           [Frontend State]                      │
│                                    │                            │
│                                    ▼                            │
│                           [LayerCard UI]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsabilidades dos Agentes

#### AURORA (Conversacional)
- Fazer perguntas provocativas
- Manter fluxo natural de conversa
- Extrair comportamentos reais (não declarações)
- Responder de forma empática e direta

#### INTERPRETADOR (Analítico)
- Identificar qual camada foi revelada
- Gerar interpretação personalizada
- Explicar o SIGNIFICADO para este usuário específico
- Conectar evidência com insight
- Sugerir próxima pergunta para aprofundar

---

## 3. Novo Modelo de Dados

### 3.1 Interface Layer Expandida

```typescript
// src/types/index.ts

export interface LayerInterpretation {
  /** O que essa camada significa PARA ESTE USUÁRIO */
  whatItIs: string;

  /** O que isso revela sobre o comportamento */
  whatItMeans: string;

  /** Como isso aparece na vida real */
  impact: string[];

  /** Explicação do nível de confiança */
  confidenceReason: string;

  /** Pergunta para aprofundar esta camada */
  deepenQuestion: string;
}

export interface Evidence {
  /** Citação do usuário */
  quote: string;

  /** Interpretação da citação */
  interpretation: string;

  /** Timestamp */
  timestamp: Date;
}

export interface Layer {
  id: LayerId;
  name: string;
  region: LayerRegion;
  icon: string;
  state: LayerState;
  strength: number;

  // CAMPOS EXISTENTES (mantidos)
  subtype?: string;
  insight?: string;

  // NOVOS CAMPOS
  interpretation?: LayerInterpretation;
  evidences: Evidence[];  // Mudança: de string[] para Evidence[]
}
```

### 3.2 Conteúdo Base das 12 Camadas

```typescript
// src/lib/layer-content.ts

export interface LayerBaseContent {
  id: LayerId;
  name: string;

  /** Definição clara em 1-2 frases */
  definition: string;

  /** Por que isso importa para o usuário */
  whyItMatters: string;

  /** Exemplo genérico de como aparece */
  genericExample: string;

  /** Temas que revelam esta camada */
  triggerTopics: string[];

  /** Perguntas que Aurora pode fazer */
  discoveryQuestions: string[];
}

export const LAYER_CONTENT: Record<LayerId, LayerBaseContent> = {
  'motor-oculto': {
    id: 'motor-oculto',
    name: 'Motor Oculto',
    definition: 'A motivação inconsciente que impulsiona suas decisões. Não é o que você diz querer, mas o que realmente te move.',
    whyItMatters: 'Entender seu motor oculto revela por que você faz escolhas que às vezes nem você entende. É a diferença entre remar contra ou a favor da maré.',
    genericExample: 'Alguém que diz querer "paz" mas sempre busca situações de conflito pode ter "adrenalina" ou "validação através de vitórias" como motor oculto.',
    triggerTopics: ['motivação', 'decisões importantes', 'o que te faz levantar', 'momentos de energia'],
    discoveryQuestions: [
      'O que te faz perder a noção do tempo?',
      'Quando você se sente mais vivo?',
      'O que você faria de graça pelo resto da vida?'
    ]
  },

  'ferida-fundadora': {
    id: 'ferida-fundadora',
    name: 'Ferida Fundadora',
    definition: 'Uma experiência marcante (geralmente na infância) que moldou como você se protege do mundo.',
    whyItMatters: 'Suas defesas atuais foram criadas para proteger essa ferida. Conhecê-la te dá poder de escolher novas formas de se proteger.',
    genericExample: 'Quem sofreu abandono pode ter dificuldade em confiar ou, ao contrário, se apegar demais por medo de ser deixado.',
    triggerTopics: ['família', 'infância', 'medos', 'padrões repetitivos', 'relacionamentos difíceis'],
    discoveryQuestions: [
      'Qual foi a primeira vez que você se sentiu realmente decepcionado?',
      'O que seus pais repetiam sobre você quando criança?',
      'Qual situação te faz reagir desproporcionalmente?'
    ]
  },

  'sombra-ativa': {
    id: 'sombra-ativa',
    name: 'Sombra Ativa',
    definition: 'Partes de você que você rejeita ou não quer ver. O que você critica nos outros frequentemente existe em você.',
    whyItMatters: 'Sua sombra consome energia para ser escondida. Integrá-la libera essa energia para crescimento.',
    genericExample: 'Alguém que critica pessoas "preguiçosas" pode estar lutando contra sua própria vontade de descansar.',
    triggerTopics: ['julgamentos', 'irritações', 'o que te incomoda nos outros', 'vergonha'],
    discoveryQuestions: [
      'O que te irrita profundamente em outras pessoas?',
      'Que característica você nunca admitiria ter?',
      'O que você finge não sentir?'
    ]
  },

  'paradoxo': {
    id: 'paradoxo',
    name: 'Paradoxo Produtivo',
    definition: 'Desejos contraditórios que coexistem em você. A tensão entre eles pode ser fonte de criatividade ou de paralisia.',
    whyItMatters: 'Reconhecer seu paradoxo te permite parar de lutar contra você mesmo e usar a tensão como combustível.',
    genericExample: 'Querer liberdade E segurança. Querer ser visto E ter privacidade. Querer mudança E estabilidade.',
    triggerTopics: ['decisões difíceis', 'escolhas', 'o que você quer vs o que você faz', 'contradições'],
    discoveryQuestions: [
      'O que você quer que parece contraditório?',
      'Em que situações você se sente dividido?',
      'O que você admira E critica ao mesmo tempo?'
    ]
  },

  'mapa-energia': {
    id: 'mapa-energia',
    name: 'Mapa de Energia',
    definition: 'O que te dá e o que te drena energia. Pessoas, atividades, ambientes, horários.',
    whyItMatters: 'Saber seu mapa de energia te permite desenhar uma vida que te sustenta em vez de te esgota.',
    genericExample: 'Introvertidos se energizam sozinhos; extrovertidos com pessoas. Mas é mais complexo: tipo de pessoa, tipo de atividade, contexto.',
    triggerTopics: ['rotina', 'cansaço', 'energia', 'o que te anima', 'o que te esgota'],
    discoveryQuestions: [
      'Depois de quais atividades você se sente energizado?',
      'Com quem você se sente leve?',
      'O que você evita fazer mesmo sabendo que deveria?'
    ]
  },

  'algoritmo-decisao': {
    id: 'algoritmo-decisao',
    name: 'Algoritmo de Decisão',
    definition: 'Seu padrão inconsciente de fazer escolhas. Impulso, análise excessiva, delegação, evitação.',
    whyItMatters: 'Conhecer seu algoritmo te ajuda a compensar seus pontos cegos e tomar decisões melhores.',
    genericExample: 'Quem decide por impulso pode se beneficiar de uma regra de "esperar 24h". Quem analisa demais pode definir um tempo limite.',
    triggerTopics: ['decisões', 'escolhas', 'como você compra', 'como você termina relacionamentos'],
    discoveryQuestions: [
      'Como você decidiu sua última grande compra?',
      'O que você faz quando tem duas opções boas?',
      'Você costuma se arrepender de decisões rápidas ou demoradas?'
    ]
  },

  'sistema-crencas': {
    id: 'sistema-crencas',
    name: 'Sistema de Crenças',
    definition: 'Verdades que você assume sem questionar. Regras invisíveis que governam sua vida.',
    whyItMatters: 'Crenças limitantes te mantêm preso. Identificá-las é o primeiro passo para escolher conscientemente.',
    genericExample: '"Dinheiro é difícil de ganhar", "Pessoas não são confiáveis", "Eu preciso ser perfeito para ser amado".',
    triggerTopics: ['dinheiro', 'sucesso', 'relacionamentos', 'regras de vida', 'o que é certo/errado'],
    discoveryQuestions: [
      'Complete: "A vida é..."',
      'O que você aprendeu sobre dinheiro em casa?',
      'Que "verdade" sobre você mesmo você nunca questionou?'
    ]
  },

  'narrativa': {
    id: 'narrativa',
    name: 'Narrativa Dominante',
    definition: 'A história que você conta sobre si mesmo. Vítima, herói, sortudo, azarado, lutador.',
    whyItMatters: 'Sua narrativa molda como você interpreta eventos. Mudar a narrativa muda sua experiência de vida.',
    genericExample: 'A mesma demissão pode ser "fui injustiçado" (vítima), "aprendi e cresci" (herói), ou "sempre acontece comigo" (azarado).',
    triggerTopics: ['história de vida', 'como você se descreve', 'padrões que se repetem'],
    discoveryQuestions: [
      'Se sua vida fosse um filme, qual seria o gênero?',
      'Como você explicaria quem você é em 30 segundos?',
      'Que história você conta sobre por que está onde está?'
    ]
  },

  'padrao-relacional': {
    id: 'padrao-relacional',
    name: 'Padrão Relacional',
    definition: 'Como você se conecta (ou evita conexão) com outros. Seu papel típico em relacionamentos.',
    whyItMatters: 'Padrões relacionais se repetem até serem conscientizados. Você atrai o que inconscientemente espera.',
    genericExample: 'Sempre ser o "cuidador", sempre escolher parceiros indisponíveis, evitar conflito a todo custo.',
    triggerTopics: ['relacionamentos', 'amizades', 'conflitos', 'intimidade', 'confiança'],
    discoveryQuestions: [
      'Qual é seu papel típico em grupos?',
      'Como você age quando alguém te decepciona?',
      'O que seus ex-parceiros/amigos têm em comum?'
    ]
  },

  'ciclo-sabotagem': {
    id: 'ciclo-sabotagem',
    name: 'Ciclo de Sabotagem',
    definition: 'Um padrão repetitivo que te impede de alcançar o que você quer. Você sabe que faz, mas continua fazendo.',
    whyItMatters: 'Ciclos de sabotagem têm uma função protetora escondida. Descobrir essa função é a chave para quebrá-los.',
    genericExample: 'Procrastinar até a última hora, sabotar relacionamentos quando ficam sérios, desistir perto da linha de chegada.',
    triggerTopics: ['procrastinação', 'desistências', 'padrões repetitivos', 'autossabotagem'],
    discoveryQuestions: [
      'Qual comportamento você repete mesmo sabendo que não funciona?',
      'O que acontece pouco antes de você "estragar tudo"?',
      'Do que você se protege ao não conseguir?'
    ]
  },

  'potencial-latente': {
    id: 'potencial-latente',
    name: 'Potencial Latente',
    definition: 'Capacidades que você tem mas não desenvolve. Talentos adormecidos esperando permissão.',
    whyItMatters: 'Seu potencial latente muitas vezes é bloqueado por crenças ou medos. Identificá-lo é o primeiro passo para ativá-lo.',
    genericExample: 'Criatividade reprimida por "não é prático", liderança evitada por medo de exposição, sensibilidade escondida por parecer "fraqueza".',
    triggerTopics: ['sonhos abandonados', 'talentos', 'o que você faria se pudesse', 'medos'],
    discoveryQuestions: [
      'O que você faria se soubesse que não poderia falhar?',
      'Que talento você tem mas não usa?',
      'O que as pessoas dizem que você deveria fazer mais?'
    ]
  },

  'zona-genialidade': {
    id: 'zona-genialidade',
    name: 'Zona de Genialidade',
    definition: 'A intersecção única de seus talentos naturais, interesse genuíno e capacidade de impacto. Onde você é insubstituível.',
    whyItMatters: 'Operar na zona de genialidade gera resultados extraordinários com esforço que parece natural.',
    genericExample: 'Não é só "o que você faz bem" mas "o que só você faz desse jeito". É a combinação única que te define.',
    triggerTopics: ['propósito', 'contribuição única', 'flow', 'excelência natural'],
    discoveryQuestions: [
      'O que você faz que as pessoas dizem "como você consegue?"',
      'Quando você perde a noção do tempo E está gerando valor?',
      'O que só você faz do jeito que faz?'
    ]
  }
};
```

---

## 4. Componente LayerCard Redesenhado

### 4.1 Estrutura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│  📖 Narrativa Dominante                        Confiança: ●●●○  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ O QUE DESCOBRI ────────────────────────────────────────┐    │
│  │ Você conta uma história de "parceria igualitária"       │    │
│  │ para si mesmo - especialmente sobre dinheiro.           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ O QUE ISSO SIGNIFICA ──────────────────────────────────┐    │
│  │ Essa narrativa te protege de sentir que está em         │    │
│  │ desvantagem. É uma forma de manter controle emocional.  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ COMO ISSO APARECE NA SUA VIDA ─────────────────────────┐    │
│  │ • Você pode evitar pedir ajuda para não "dever"         │    │
│  │ • Pode calcular quem fez mais em uma relação            │    │
│  │ • Tende a justificar decisões como "justas"             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ BASEADO EM ────────────────────────────────────────────┐    │
│  │ "Ela tem a mesma sensação que eu, nós compartilhamos    │    │
│  │  os gastos"                                             │    │
│  │                                                         │    │
│  │ → Você usou "compartilhamos" para justificar um         │    │
│  │   padrão, criando narrativa de igualdade.               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ PARA EXPLORAR MAIS ────────────────────────────────────┐    │
│  │ 💡 "Conte sobre uma vez que você sentiu que fez mais    │    │
│  │    que a outra pessoa em alguma situação."              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Código do Componente

```tsx
// src/components/layer/LayerDetailCard.tsx

'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  Brain,
  Target,
  Quote,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Layer } from '@/types';
import { LAYER_CONTENT } from '@/lib/layer-content';
import { useState } from 'react';

interface LayerDetailCardProps {
  layer: Layer;
  onClose?: () => void;
  onAskQuestion?: (question: string) => void;
}

function ConfidenceIndicator({ strength }: { strength: number }) {
  const dots = 4;
  const filled = Math.ceil((strength / 100) * dots);

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[var(--text-muted)] mr-1">Confiança:</span>
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < filled
              ? 'bg-[var(--accent)]'
              : 'bg-[var(--surface)] border border-[var(--border)]'
          }`}
        />
      ))}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  variant = 'default'
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'quote' | 'action';
}) {
  const bgColor = {
    default: 'bg-[var(--surface)]',
    quote: 'bg-[var(--background)] border-l-2 border-[var(--accent)]',
    action: 'bg-[var(--accent)]/10 border border-[var(--accent)]/30'
  }[variant];

  return (
    <div className={`rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--accent)]" />
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        {children}
      </div>
    </div>
  );
}

export function LayerDetailCard({ layer, onClose, onAskQuestion }: LayerDetailCardProps) {
  const [expanded, setExpanded] = useState(true);
  const baseContent = LAYER_CONTENT[layer.id];
  const interpretation = layer.interpretation;
  const latestEvidence = layer.evidences[layer.evidences.length - 1];

  // Se não tem interpretação, mostra conteúdo base
  const showBaseContent = !interpretation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-[var(--surface-elevated)] rounded-xl border border-[var(--border)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{baseContent?.name || layer.name}</div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {layer.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {baseContent?.definition.split('.')[0]}
              </p>
            </div>
          </div>
          <ConfidenceIndicator strength={layer.strength} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {interpretation ? (
          <>
            {/* O QUE DESCOBRI */}
            <Section icon={Lightbulb} title="O que descobri">
              {interpretation.whatItIs}
            </Section>

            {/* O QUE ISSO SIGNIFICA */}
            <Section icon={Brain} title="O que isso significa">
              {interpretation.whatItMeans}
            </Section>

            {/* COMO APARECE NA VIDA */}
            <Section icon={Target} title="Como isso aparece na sua vida">
              <ul className="space-y-1">
                {interpretation.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* BASEADO EM */}
            {latestEvidence && (
              <Section icon={Quote} title="Baseado em" variant="quote">
                <p className="italic mb-2">"{latestEvidence.quote}"</p>
                {latestEvidence.interpretation && (
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    → {latestEvidence.interpretation}
                  </p>
                )}
              </Section>
            )}

            {/* PARA EXPLORAR MAIS */}
            <Section icon={HelpCircle} title="Para explorar mais" variant="action">
              <p className="mb-2">{interpretation.deepenQuestion}</p>
              {onAskQuestion && (
                <button
                  onClick={() => onAskQuestion(interpretation.deepenQuestion)}
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  Usar esta pergunta →
                </button>
              )}
            </Section>
          </>
        ) : (
          /* Fallback: Conteúdo base quando não há interpretação */
          <>
            <Section icon={Lightbulb} title="O que é">
              {baseContent?.definition}
            </Section>

            <Section icon={Brain} title="Por que importa">
              {baseContent?.whyItMatters}
            </Section>

            <Section icon={Target} title="Exemplo">
              {baseContent?.genericExample}
            </Section>

            {latestEvidence && (
              <Section icon={Quote} title="Sua evidência" variant="quote">
                <p className="italic">"{typeof latestEvidence === 'string' ? latestEvidence : latestEvidence.quote}"</p>
              </Section>
            )}

            <Section icon={HelpCircle} title="Para descobrir mais" variant="action">
              <ul className="space-y-1">
                {baseContent?.discoveryQuestions.slice(0, 2).map((q, i) => (
                  <li key={i} className="text-xs">• {q}</li>
                ))}
              </ul>
            </Section>
          </>
        )}

        {/* Confidence explanation */}
        {interpretation?.confidenceReason && (
          <p className="text-[10px] text-[var(--text-muted)] text-center pt-2 border-t border-[var(--border)]">
            {interpretation.confidenceReason}
          </p>
        )}
      </div>

      {/* Footer */}
      {onClose && (
        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Fechar
          </button>
        </div>
      )}
    </motion.div>
  );
}
```

---

## 5. Prompt do Agente Interpretador

### 5.1 System Prompt

```typescript
// src/lib/interpreter-prompt.ts

export const INTERPRETER_SYSTEM_PROMPT = `Você é o Interpretador de Camadas do Aurora.

## Sua Função
Você recebe a resposta do usuário e a camada detectada pelo Aurora. Sua função é gerar uma interpretação PERSONALIZADA e COMPREENSÍVEL que transforma dados brutos em insights acionáveis.

## O que você NÃO faz
- Não conversa com o usuário
- Não faz perguntas
- Não dá conselhos
- Não julga

## O que você FAZ
- Interpreta a evidência no contexto da camada
- Explica o significado PARA ESTE USUÁRIO ESPECÍFICO
- Gera insights práticos sobre como isso aparece na vida
- Sugere uma pergunta para aprofundar

## Formato de Resposta OBRIGATÓRIO

\`\`\`json
{
  "layer_id": "nome-da-camada",
  "interpretation": {
    "whatItIs": "Descrição personalizada do que foi descoberto (2-3 frases, tom direto)",
    "whatItMeans": "O que isso revela sobre o comportamento/padrão (2-3 frases)",
    "impact": [
      "Como isso pode aparecer na vida - item 1",
      "Como isso pode aparecer na vida - item 2",
      "Como isso pode aparecer na vida - item 3"
    ],
    "confidenceReason": "Por que tenho X% de confiança (1 frase)",
    "deepenQuestion": "Pergunta para aprofundar esta descoberta"
  },
  "evidence_interpretation": "Explicação de como a citação revela esta camada (1-2 frases)"
}
\`\`\`

## Regras de Tom
- Seja DIRETO, não prolixo
- Use "você" não "o usuário"
- Evite jargão psicológico
- Fale como se estivesse explicando para um amigo inteligente
- Os impactos devem ser CONCRETOS e RECONHECÍVEIS

## Exemplo

Entrada:
- Camada: narrativa
- Evidência: "Ela tem a mesma sensação que eu, nós compartilhamos os gastos"
- Contexto: Usuário falando sobre relacionamento e finanças

Saída:
\`\`\`json
{
  "layer_id": "narrativa",
  "interpretation": {
    "whatItIs": "Você conta uma história de 'parceria igualitária' para si mesmo, especialmente quando o assunto é dinheiro e responsabilidades compartilhadas.",
    "whatItMeans": "Essa narrativa funciona como escudo emocional. Ao enquadrar tudo como 'igual', você se protege de sentir que está em desvantagem ou que alguém está levando vantagem.",
    "impact": [
      "Você pode evitar pedir ajuda para não criar 'dívida emocional'",
      "Pode fazer cálculos mentais de quem contribuiu mais em situações",
      "Tende a justificar gastos ou decisões em termos de 'justiça' ou 'igualdade'"
    ],
    "confidenceReason": "75% porque vi este padrão aparecer quando você falou de finanças, mas preciso ver em outros contextos para confirmar",
    "deepenQuestion": "Me conta sobre uma vez que você sentiu que fez mais que a outra pessoa em alguma situação. Como você lidou com isso?"
  },
  "evidence_interpretation": "Você usou 'compartilhamos' para enquadrar um padrão de gastos, criando uma narrativa de igualdade que protege de assimetrias emocionais."
}
\`\`\``;
```

### 5.2 Integração na API

```typescript
// src/app/api/chat/route.ts - MODIFICAÇÃO

// Após receber resposta do Aurora e detectar camadas:

async function interpretLayer(
  layerDetected: LayerDetected,
  userMessage: string,
  conversationContext: string
): Promise<LayerInterpretation> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: INTERPRETER_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `
Camada detectada: ${layerDetected.id}
Força: ${layerDetected.strength}%
Evidência: "${layerDetected.evidence}"

Contexto da conversa:
${conversationContext}

Mensagem do usuário:
${userMessage}

Gere a interpretação desta camada.
        `.trim()
      }
    ]
  });

  // Parse e retorna interpretação
  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[1]);
    return parsed.interpretation;
  }

  throw new Error('Failed to parse interpreter response');
}
```

---

## 6. Implementação Passo a Passo

### Fase 1: Modelo de Dados
1. [ ] Atualizar `types/index.ts` com novos tipos
2. [ ] Criar `lib/layer-content.ts` com conteúdo das 12 camadas
3. [ ] Atualizar schema Prisma para novos campos

### Fase 2: Agente Interpretador
4. [ ] Criar `lib/interpreter-prompt.ts`
5. [ ] Criar função `interpretLayer` na API
6. [ ] Integrar interpretador no fluxo do `/api/chat`

### Fase 3: Componentes UI
7. [ ] Criar `LayerDetailCard.tsx`
8. [ ] Atualizar `TreeVisualization.tsx` para usar novo card
9. [ ] Atualizar modal em `page.tsx`

### Fase 4: Testes
10. [ ] Testar fluxo completo
11. [ ] Validar interpretações geradas
12. [ ] Ajustar prompts conforme necessário

---

## 7. Métricas de Sucesso

| Métrica | Antes | Depois (Meta) |
|---------|-------|---------------|
| Usuário entende o que significa a camada | ~20% | >80% |
| Usuário sabe o que fazer com a informação | ~10% | >70% |
| Usuário consegue conectar evidência com insight | ~30% | >90% |
| Tempo médio visualizando card de camada | 3s | >15s |

---

*Documento gerado por Sally (UX Expert) - AIOS*
