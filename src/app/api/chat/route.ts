import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AURORA_SYSTEM_PROMPT, buildPrompt } from '@/lib/aurora-prompt';
import { INTERPRETER_SYSTEM_PROMPT, buildInterpreterPrompt } from '@/lib/interpreter-prompt';
import { Message, Layer, SessionPhase, LayerInterpretation, Evidence } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Context window management
const MAX_MESSAGES_IN_CONTEXT = 30;

function prepareMessagesForContext(messages: Message[]): { role: 'user' | 'assistant'; content: string }[] {
  if (messages.length > MAX_MESSAGES_IN_CONTEXT) {
    const firstMessages = messages.slice(0, 4);
    const recentMessages = messages.slice(-MAX_MESSAGES_IN_CONTEXT + 4);

    const summaryBridge = {
      role: 'assistant' as const,
      content: `[Continuação da conversa - ${messages.length - MAX_MESSAGES_IN_CONTEXT} mensagens anteriores resumidas]`,
    };

    return [
      ...firstMessages.map((m) => ({
        role: m.role === 'aurora' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
      summaryBridge,
      ...recentMessages.map((m) => ({
        role: m.role === 'aurora' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
    ];
  }

  return messages.map((m) => ({
    role: m.role === 'aurora' ? 'assistant' as const : 'user' as const,
    content: m.content,
  }));
}

interface LayerDetected {
  id: string;
  strength: number;
  evidence: string;
}

interface AuroraResponse {
  message: string;
  layers_detected: LayerDetected[];
}

function parseAuroraResponse(text: string): AuroraResponse {
  // Try to extract JSON from the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error('Failed to parse JSON from code block:', e);
    }
  }

  // Try to parse the whole text as JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse response as JSON:', e);
  }

  // Fallback: return the text as message with no layers
  return {
    message: text,
    layers_detected: [],
  };
}

interface InterpreterResponse {
  layer_id: string;
  interpretation: LayerInterpretation;
  evidence_interpretation: string;
}

async function interpretLayer(
  detected: LayerDetected,
  userMessage: string,
  conversationContext: string
): Promise<{ interpretation: LayerInterpretation; evidenceInterpretation: string } | null> {
  try {
    const prompt = buildInterpreterPrompt({
      layerId: detected.id,
      strength: detected.strength,
      evidence: detected.evidence,
      userMessage,
      conversationContext,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: INTERPRETER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonMatch) {
      const parsed: InterpreterResponse = JSON.parse(jsonMatch[1]);
      return {
        interpretation: parsed.interpretation,
        evidenceInterpretation: parsed.evidence_interpretation,
      };
    }

    // Try parsing the whole text
    const parsed: InterpreterResponse = JSON.parse(text);
    return {
      interpretation: parsed.interpretation,
      evidenceInterpretation: parsed.evidence_interpretation,
    };
  } catch (error) {
    console.error('Error interpreting layer:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages, layers, phase } = body as {
      message: string;
      messages: Message[];
      layers: Layer[];
      phase: SessionPhase;
    };

    // Build context for Aurora
    const contextPrompt = buildPrompt(messages, layers, phase);

    // Prepare messages with context window management
    const contextMessages = prepareMessagesForContext(messages);

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: AURORA_SYSTEM_PROMPT,
      messages: [
        ...contextMessages,
        {
          role: 'user',
          content: `${message}\n\n---\n${contextPrompt}`,
        },
      ],
    });

    // Extract and parse Aurora's response
    const rawResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    const parsed = parseAuroraResponse(rawResponse);

    // Build conversation context for interpreter
    const recentMessages = messages.slice(-6);
    const conversationContext = recentMessages
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Aurora'}: ${m.content}`)
      .join('\n');

    // Convert detected layers to layer updates with interpretations
    const layerUpdates: Partial<Layer>[] = await Promise.all(
      parsed.layers_detected.map(async (detected) => {
        // Get interpretation from the interpreter agent
        const interpreted = await interpretLayer(detected, message, conversationContext);

        const evidence: Evidence = {
          quote: detected.evidence,
          interpretation: interpreted?.evidenceInterpretation || '',
          timestamp: new Date(),
        };

        return {
          id: detected.id as Layer['id'],
          state: 'emerging' as const,
          strength: Math.min(detected.strength, 100),
          evidences: [evidence],
          interpretation: interpreted?.interpretation,
        };
      })
    );

    // Determine progress and phase based on conversation length
    const totalMessages = messages.length + 2;
    let newPhase: SessionPhase = phase;
    let progress = 0;

    if (totalMessages <= 4) {
      newPhase = 'abertura';
      progress = 15;
    } else if (totalMessages <= 8) {
      newPhase = 'exploracao';
      progress = 35;
    } else if (totalMessages <= 14) {
      newPhase = 'aprofundamento';
      progress = 60;
    } else if (totalMessages <= 20) {
      newPhase = 'sintese';
      progress = 85;
    } else {
      newPhase = 'fechamento';
      progress = 100;
    }

    // Boost progress based on discovered layers
    const discoveredCount = layers.filter(l => l.state !== 'hidden').length + layerUpdates.length;
    progress = Math.max(progress, Math.round((discoveredCount / 12) * 100));

    return NextResponse.json({
      message: parsed.message,
      layersUpdated: layerUpdates,
      phase: newPhase,
      progress,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
