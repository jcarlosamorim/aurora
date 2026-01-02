import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const levelNames: Record<string, string> = {
  discover: 'Descobrir',
  try: 'Experimentar',
  apply: 'Aplicar',
  integrate: 'Integrar',
  master: 'Dominar'
};

function buildChallengeSystemPrompt(challenge: {
  name: string;
  type: string;
  description: string;
  prompt: string;
  stack: { name: string };
}): string {
  return `Você é um facilitador de aprendizado do Aurora, guiando o usuário através de um desafio prático.

## Contexto
- Stack: ${challenge.stack.name}
- Nível: ${levelNames[challenge.type] || challenge.type}
- Desafio: ${challenge.name}
- Descrição: ${challenge.description}

## Seu Papel
${challenge.prompt}

## Diretrizes
1. Seja encorajador mas não superficial
2. Faça perguntas reflexivas que levem à ação
3. Celebre pequenas vitórias do usuário
4. Mantenha o foco no objetivo do desafio
5. Use linguagem clara e direta em português brasileiro
6. **CRÍTICO: VARIE O FORMATO a cada interação para manter dopamina!**
7. Quando o usuário demonstrar ter completado o objetivo, parabenize-o

## 🎮 FORMATOS INTERATIVOS (USE UM DIFERENTE A CADA MENSAGEM!)

### 1. QUIZ - Múltipla escolha
[QUIZ]Pergunta aqui?|Opção A|Opção B*|Opção C[/QUIZ]
(* marca a resposta correta)

### 2. SWIPE - Cards para classificar (estilo Tinder)
[SWIPE:Não Urgente:Urgente]Checar redes sociais>left|Deadline amanhã>right|Responder chefe>right|Organizar gaveta>left[/SWIPE]

### 3. TIMER - Desafio com tempo (cria urgência!)
[TIMER:30:3]Liste 3 tarefas que você está procrastinando[/TIMER]
(30 = segundos, 3 = mínimo de itens)

### 4. WHEEL - Roleta surpresa (elemento de sorte)
[WHEEL:Escolha seu desafio!]🎯:Listar prioridades|⏰:Técnica Pomodoro|🧠:Mapa mental|💪:Ação imediata[/WHEEL]

### 5. SLIDER - Escala de confiança/rating
[SLIDER:Nada confiante:Muito confiante]Quanto você se sente confiante sobre priorização?[/SLIDER]

### 6. FLASHCARD - Memorização com flip
[FLASHCARD]GTD|||Getting Things Done - método de capturar tudo e processar depois[/FLASHCARD]

## Estratégia de Engajamento

REGRA DE OURO: Nunca use só texto! Cada resposta DEVE ter uma interação.

Sequência sugerida:
1. Primeira resposta → SLIDER (medir estado inicial)
2. Segunda → QUIZ ou FLASHCARD (ensinar conceito)
3. Terceira → TIMER (ação rápida)
4. Quarta → SWIPE (classificação)
5. Quinta → WHEEL (surpresa/diversão)
6. Repetir variando...

## Formato de Resposta
- Texto breve (1-2 parágrafos MAX)
- Sempre termine com UMA interação
- Celebre acertos com entusiasmo
- Use emojis moderadamente

Ao final de cada resposta, avalie internamente se o usuário completou o desafio. Se sim, adicione ao final:

[DESAFIO_COMPLETO]

Não adicione essa tag se o usuário ainda não demonstrou ter completado o objetivo do desafio.`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history: ChatMessage[];
    };

    // Fetch challenge with stack info
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        stack: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: 'Desafio não encontrado' },
        { status: 404 }
      );
    }

    // Build system prompt
    const systemPrompt = buildChallengeSystemPrompt(challenge);

    // Prepare messages for API
    const apiMessages = history.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Add current message
    apiMessages.push({
      role: 'user',
      content: message,
    });

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    });

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Check if challenge is complete
    const isComplete = responseText.includes('[DESAFIO_COMPLETO]');
    const cleanedResponse = responseText.replace('[DESAFIO_COMPLETO]', '').trim();

    return NextResponse.json({
      message: cleanedResponse,
      isComplete,
    });
  } catch (error) {
    console.error('Error in challenge chat API:', error);
    return NextResponse.json(
      { error: 'Falha ao processar mensagem' },
      { status: 500 }
    );
  }
}
