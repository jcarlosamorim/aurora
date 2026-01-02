// Layer types
export type LayerId =
  | 'motor-oculto'
  | 'ferida-fundadora'
  | 'sombra-ativa'
  | 'paradoxo'
  | 'mapa-energia'
  | 'algoritmo-decisao'
  | 'sistema-crencas'
  | 'narrativa'
  | 'padrao-relacional'
  | 'ciclo-sabotagem'
  | 'potencial-latente'
  | 'zona-genialidade';

export type LayerRegion = 'raizes' | 'tronco' | 'copa' | 'coroa';

export type LayerState = 'hidden' | 'emerging' | 'confirmed';

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
  strength: number; // 0-100
  subtype?: string;
  evidences: Evidence[];
  insight?: string;
  interpretation?: LayerInterpretation;
}

// Chat types
export type MessageRole = 'aurora' | 'user';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  layersRevealed?: LayerId[];
}

// Session types
export type SessionPhase =
  | 'abertura'
  | 'exploracao'
  | 'aprofundamento'
  | 'sintese'
  | 'fechamento';

export interface Session {
  id: string;
  startedAt: Date;
  phase: SessionPhase;
  messages: Message[];
  layers: Layer[];
  philosophy?: string;
}

// Tree visualization
export type TreeStage = 'seed' | 'sprout' | 'young' | 'mature' | 'complete';

export interface TreeState {
  stage: TreeStage;
  progress: number; // 0-100
  revealedLayers: LayerId[];
}

// API types
export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  layersUpdated: Partial<Layer>[];
  phase: SessionPhase;
  progress: number;
}
