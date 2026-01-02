import { PrismaClient } from '@prisma/client';

// Challenge types and levels
const LEVELS = {
  DISCOVER: { level: 1, type: 'discover', duration: 5 },
  TRY: { level: 2, type: 'try', duration: 10 },
  APPLY: { level: 3, type: 'apply', duration: 20 },
  INTEGRATE: { level: 4, type: 'integrate', duration: 25 },
  MASTER: { level: 5, type: 'master', duration: 35 }
};

// Base prompts for each level type
const BASE_PROMPTS = {
  discover: `Guie o usuário através de uma exploração reflexiva sobre o tema.
1. Comece perguntando o que ele já sabe sobre o tema
2. Apresente o conceito de forma simples com um exemplo
3. Faça 2-3 perguntas reflexivas sobre como isso se aplica à vida dele
4. Quando ele demonstrar compreensão básica, conclua
Objetivo: Usuário entender o "o quê" e "por quê" da ferramenta.`,

  try: `Guie o usuário através de um micro-exercício prático.
1. Dê uma instrução clara e simples (1 ação)
2. Peça que ele execute agora mesmo
3. Peça que compartilhe o resultado
4. Dê feedback e ajuste se necessário
5. Quando completar a ação, conclua
Objetivo: Usuário ter a primeira experiência prática.`,

  apply: `Ajude o usuário a aplicar a ferramenta em um contexto real da vida dele.
1. Pergunte sobre um desafio atual que ele enfrenta
2. Mostre como a ferramenta pode ajudar nesse caso específico
3. Guie-o na aplicação passo a passo
4. Peça que documente o plano/resultado
5. Quando tiver um plano concreto, conclua
Objetivo: Usuário conectar a ferramenta com sua realidade.`,

  integrate: `Guie o usuário a combinar múltiplas ferramentas da stack em uma situação.
1. Recapitule brevemente as ferramentas envolvidas
2. Apresente um cenário que requer ambas
3. Peça que ele proponha como combinar
4. Refine a proposta juntos
5. Quando demonstrar integração, conclua
Objetivo: Usuário entender como ferramentas se complementam.`,

  master: `Desafie o usuário a demonstrar domínio ensinando o conceito.
1. Peça que ele explique o conceito como se fosse para um iniciante
2. Faça perguntas desafiadoras como "aluno"
3. Peça exemplos práticos
4. Avalie clareza e profundidade
5. Quando demonstrar capacidade de ensinar, conclua
Objetivo: Usuário consolidar conhecimento através do ensino.`
};

// Challenges organized by stack slug
const challengesByStack: Record<string, Array<{
  name: string;
  description: string;
  level: number;
  type: string;
  duration: number;
  prompt: string;
  content: string;
}>> = {
  'inner-mastery': [
    {
      ...LEVELS.DISCOVER,
      name: 'Descobrindo o Controle Interior',
      description: 'Explore a Dicotomia do Controle dos Estoicos',
      prompt: `${BASE_PROMPTS.discover}\n\nTema específico: Dicotomia do Controle Estoico - a distinção entre o que podemos e não podemos controlar.`,
      content: JSON.stringify({
        mainTool: 'Stoic Dichotomy of Control',
        keyQuestions: [
          'O que você sente quando algo foge do seu controle?',
          'Cite 3 coisas que você tenta controlar mas não consegue',
          'Como seria focar apenas no que você pode controlar?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Primeiro Journaling',
      description: 'Pratique sua primeira sessão de journaling reflexivo',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Guie o usuário a escrever 3 parágrafos sobre: 1) Como foi seu dia, 2) O que aprendeu, 3) Pelo que é grato.`,
      content: JSON.stringify({
        mainTool: 'Journaling',
        exercise: 'Escreva 3 parágrafos: dia, aprendizado, gratidão',
        timeLimit: '5 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Meditação na Rotina',
      description: 'Integre meditação em um momento específico do seu dia',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Ajudar o usuário a identificar o melhor momento do dia para meditar e criar um plano concreto de implementação.`,
      content: JSON.stringify({
        mainTool: 'Meditation',
        deliverable: 'Plano de quando e como meditar diariamente'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Ritual Matinal Estoico',
      description: 'Combine Journaling + Meditação + Visualização Negativa',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Journaling, Meditation, Negative Visualization. Crie um ritual matinal de 15 minutos que integre as três práticas.`,
      content: JSON.stringify({
        tools: ['Journaling', 'Meditation', 'Negative Visualization'],
        deliverable: 'Ritual matinal de 15 minutos documentado'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Ensinando Estoicismo Prático',
      description: 'Demonstre domínio ensinando os princípios estoicos',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como usar a Dicotomia do Controle para lidar com ansiedade no trabalho, como se estivesse ensinando um amigo.`,
      content: JSON.stringify({
        mainTool: 'Stoic Dichotomy of Control',
        scenario: 'Ensinar um amigo ansioso sobre controle estoico'
      })
    }
  ],

  'focused-achiever': [
    {
      ...LEVELS.DISCOVER,
      name: 'Entendendo GTD',
      description: 'Descubra os fundamentos do Getting Things Done',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: GTD (Getting Things Done) - o método de David Allen para capturar, processar e organizar tarefas.`,
      content: JSON.stringify({
        mainTool: 'GTD',
        keyQuestions: [
          'Como você organiza suas tarefas hoje?',
          'O que acontece quando você esquece algo importante?',
          'Onde você anota ideias que surgem de repente?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Matriz de Eisenhower',
      description: 'Classifique 5 tarefas usando a Matriz de Eisenhower',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Peça 5 tarefas pendentes e ajude a classificá-las em Urgente/Importante, Importante/Não Urgente, Urgente/Não Importante, Nem Urgente/Nem Importante.`,
      content: JSON.stringify({
        mainTool: 'Eisenhower Matrix',
        exercise: 'Classificar 5 tarefas nos 4 quadrantes',
        timeLimit: '8 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Time Blocking Real',
      description: 'Crie um bloco de tempo para sua tarefa mais importante',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Identificar a tarefa mais importante da semana e agendar um bloco de 2h de Deep Work para executá-la.`,
      content: JSON.stringify({
        mainTool: 'Time Blocking',
        deliverable: 'Bloco de 2h agendado no calendário'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Sistema de Produtividade Pessoal',
      description: 'Combine GTD + Eisenhower + Time Blocking',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: GTD, Eisenhower Matrix, Time Blocking. Crie um sistema semanal que use as três ferramentas em conjunto.`,
      content: JSON.stringify({
        tools: ['GTD', 'Eisenhower Matrix', 'Time Blocking'],
        deliverable: 'Sistema semanal de produtividade documentado'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Mentoria de Produtividade',
      description: 'Ensine Deep Work para alguém com dificuldade de foco',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como implementar Deep Work para alguém que está sempre sendo interrompido no trabalho.`,
      content: JSON.stringify({
        mainTool: 'Deep Work',
        scenario: 'Ensinar colega que sofre com interrupções constantes'
      })
    }
  ],

  'data-driven-decider': [
    {
      ...LEVELS.DISCOVER,
      name: 'Pensamento Probabilístico',
      description: 'Descubra como pensar em probabilidades melhora decisões',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Pensamento Probabilístico - estimar chances ao invés de certezas absolutas.`,
      content: JSON.stringify({
        mainTool: 'Probabilistic Thinking',
        keyQuestions: [
          'Você costuma pensar em "vai dar certo" ou "não vai"?',
          'E se pensasse em "70% de chance de dar certo"?',
          'Como isso mudaria suas decisões?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'RICE na Prática',
      description: 'Priorize 3 projetos usando o framework RICE',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Aplique RICE (Reach, Impact, Confidence, Effort) em 3 projetos/tarefas para decidir qual fazer primeiro.`,
      content: JSON.stringify({
        mainTool: 'RICE Scoring',
        exercise: 'Pontuar 3 projetos com RICE',
        timeLimit: '10 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Pre-mortem de Decisão',
      description: 'Aplique Pre-mortem em uma decisão importante',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Usar Pre-mortem Analysis em uma decisão importante que o usuário está enfrentando - imaginar que falhou e identificar por quê.`,
      content: JSON.stringify({
        mainTool: 'Pre-mortem Analysis',
        deliverable: 'Lista de riscos identificados e mitigações'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Framework de Decisão Completo',
      description: 'Combine Decision Matrix + Pre-mortem + Bayesian',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Decision Matrix, Pre-mortem, Bayesian Thinking. Crie um processo para tomar uma decisão importante de carreira.`,
      content: JSON.stringify({
        tools: ['Decision Matrix', 'Pre-mortem Analysis', 'Bayesian Thinking'],
        deliverable: 'Framework de decisão aplicado a caso real'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Ensinando Decisões Racionais',
      description: 'Ensine alguém a evitar vieses cognitivos em decisões',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como usar pensamento bayesiano para atualizar crenças com novas evidências.`,
      content: JSON.stringify({
        mainTool: 'Bayesian Thinking',
        scenario: 'Ensinar colega a atualizar previsões com novas informações'
      })
    }
  ],

  'strategic-navigator': [
    {
      ...LEVELS.DISCOVER,
      name: 'Entendendo SWOT',
      description: 'Descubra como mapear forças, fraquezas, oportunidades e ameaças',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Análise SWOT - ferramenta clássica de planejamento estratégico.`,
      content: JSON.stringify({
        mainTool: 'SWOT Analysis',
        keyQuestions: [
          'Quais são seus maiores pontos fortes?',
          'Que oportunidades você está deixando passar?',
          'Quais ameaças externas te preocupam?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Criando OKRs',
      description: 'Defina um objetivo com 3 resultados-chave',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Criar 1 Objective e 3 Key Results para o próximo trimestre pessoal ou profissional.`,
      content: JSON.stringify({
        mainTool: 'OKRs',
        exercise: 'Definir 1 OKR completo',
        timeLimit: '10 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Scenario Planning Pessoal',
      description: 'Crie 3 cenários para sua carreira em 5 anos',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Usar Scenario Planning para explorar 3 futuros possíveis de carreira: otimista, realista, pessimista.`,
      content: JSON.stringify({
        mainTool: 'Scenario Planning',
        deliverable: '3 cenários de carreira documentados'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Estratégia Pessoal Integrada',
      description: 'Combine SWOT + OKRs + Scenario Planning',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: SWOT, OKRs, Scenario Planning. Crie um plano estratégico pessoal de 1 ano.`,
      content: JSON.stringify({
        tools: ['SWOT Analysis', 'OKRs', 'Scenario Planning'],
        deliverable: 'Plano estratégico pessoal de 1 ano'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Consultoria Estratégica',
      description: 'Ajude alguém a criar sua estratégia de carreira',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve guiar uma análise estratégica completa como se fosse consultor de carreira.`,
      content: JSON.stringify({
        mainTool: 'Strategic Planning',
        scenario: 'Ser consultor estratégico para um amigo em transição de carreira'
      })
    }
  ],

  'innovation-designer': [
    {
      ...LEVELS.DISCOVER,
      name: 'Princípios do Design Thinking',
      description: 'Entenda a mentalidade centrada no usuário',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Design Thinking - processo criativo focado em empatia e iteração.`,
      content: JSON.stringify({
        mainTool: 'Design Thinking',
        keyQuestions: [
          'Quando foi a última vez que você perguntou ao usuário o que ele precisa?',
          'Como você valida suas ideias antes de implementar?',
          'O que significa "falhar rápido"?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Mind Map Rápido',
      description: 'Crie um mapa mental sobre um problema atual',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Criar um Mind Map com um problema central e pelo menos 5 ramificações de causas/soluções.`,
      content: JSON.stringify({
        mainTool: 'Mind Mapping',
        exercise: 'Mind Map com problema + 5 ramificações',
        timeLimit: '8 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Jobs To Be Done Real',
      description: 'Identifique o "job" que seu usuário quer realizar',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Usar JTBD para entender o real trabalho que um cliente/usuário está tentando fazer, além da solução óbvia.`,
      content: JSON.stringify({
        mainTool: 'Jobs To Be Done',
        deliverable: 'Job statement + insights sobre o usuário'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Sprint de Inovação',
      description: 'Combine Empathy Mapping + JTBD + Rapid Prototyping',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Empathy Mapping, Jobs To Be Done, Rapid Prototyping. Execute um mini Design Sprint para resolver um problema real.`,
      content: JSON.stringify({
        tools: ['Empathy Mapping', 'Jobs To Be Done', 'Rapid Prototyping'],
        deliverable: 'Protótipo conceitual de solução'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Facilitando Design Thinking',
      description: 'Conduza uma sessão de ideação com um grupo',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como facilitaria uma sessão de brainstorming com uma equipe usando técnicas de Design Thinking.`,
      content: JSON.stringify({
        mainTool: 'Design Thinking',
        scenario: 'Facilitar workshop de inovação com equipe de 5 pessoas'
      })
    }
  ],

  'execution-engine': [
    {
      ...LEVELS.DISCOVER,
      name: 'Princípios Lean',
      description: 'Entenda a filosofia de eliminar desperdícios',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Lean - metodologia focada em eliminar desperdícios e entregar valor.`,
      content: JSON.stringify({
        mainTool: 'Lean Startup',
        keyQuestions: [
          'O que é desperdício no seu trabalho atual?',
          'Quanto tempo você gasta em coisas que não agregam valor?',
          'Como seria entregar mais com menos?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Kanban Pessoal',
      description: 'Configure um quadro Kanban para suas tarefas',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Criar um Kanban simples (To Do, Doing, Done) e mover 5 tarefas reais para ele.`,
      content: JSON.stringify({
        mainTool: 'Kanban',
        exercise: 'Kanban com 5 tarefas organizadas',
        timeLimit: '8 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Retrospectiva Solo',
      description: 'Faça uma retrospectiva da sua última semana',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Conduzir uma retrospectiva pessoal - o que foi bem, o que pode melhorar, ações para a próxima semana.`,
      content: JSON.stringify({
        mainTool: 'Retrospectives',
        deliverable: 'Retrospectiva com 3 ações de melhoria'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Sistema Ágil Pessoal',
      description: 'Combine Kanban + Pomodoro + Retrospectives',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Kanban, Pomodoro, Retrospectives. Crie um sistema semanal ágil para gerenciar seu trabalho.`,
      content: JSON.stringify({
        tools: ['Kanban', 'Pomodoro', 'Retrospectives'],
        deliverable: 'Sistema ágil pessoal documentado'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Coaching Ágil',
      description: 'Ensine metodologias ágeis para uma equipe iniciante',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como implementaria Scrum em uma equipe que nunca usou metodologias ágeis.`,
      content: JSON.stringify({
        mainTool: 'SCRUM',
        scenario: 'Treinar equipe de 6 pessoas em Scrum do zero'
      })
    }
  ],

  'knowledge-architect': [
    {
      ...LEVELS.DISCOVER,
      name: 'Modelos Mentais',
      description: 'Entenda o poder de ter múltiplos modelos mentais',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Mental Models Latticework - ter uma coleção diversa de modelos de pensamento.`,
      content: JSON.stringify({
        mainTool: 'Mental Models Latticework',
        keyQuestions: [
          'Quais "lentes" você usa para analisar problemas?',
          'Você conhece modelos de outras áreas além da sua?',
          'Como modelos diferentes levariam a conclusões diferentes?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Técnica Feynman',
      description: 'Explique um conceito complexo de forma simples',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Usar a Técnica Feynman para explicar um conceito da sua área como se fosse para uma criança de 10 anos.`,
      content: JSON.stringify({
        mainTool: 'Feynman Technique',
        exercise: 'Explicar conceito complexo em linguagem simples',
        timeLimit: '10 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Sistema de Revisão Espaçada',
      description: 'Configure um sistema de spaced repetition para algo que quer aprender',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Criar um plano de revisão espaçada para memorizar/aprender algo importante nos próximos 30 dias.`,
      content: JSON.stringify({
        mainTool: 'Spaced Repetition',
        deliverable: 'Calendário de revisão para 30 dias'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Base de Conhecimento Pessoal',
      description: 'Combine Concept Mapping + Feynman + Knowledge Graph',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Concept Mapping, Feynman Technique, Knowledge Graph. Crie uma estrutura para organizar seu conhecimento sobre um tema.`,
      content: JSON.stringify({
        tools: ['Concept Mapping', 'Feynman Technique', 'Knowledge Graph'],
        deliverable: 'Mapa conceitual interligado de um tema'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Professor por um Dia',
      description: 'Ensine modelos mentais para alguém que quer pensar melhor',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar 3 modelos mentais essenciais como se estivesse ensinando um mentorado.`,
      content: JSON.stringify({
        mainTool: 'Mental Models Latticework',
        scenario: 'Mentorar alguém sobre como pensar com múltiplos modelos'
      })
    }
  ],

  'change-catalyst': [
    {
      ...LEVELS.DISCOVER,
      name: 'Liderança Transformacional',
      description: 'Entenda como líderes inspiram mudança',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Transformational Leadership - liderar através de visão, inspiração e exemplo.`,
      content: JSON.stringify({
        mainTool: 'Transformational Leadership',
        keyQuestions: [
          'Quem te inspirou a mudar algo na sua vida?',
          'O que essa pessoa fez de diferente?',
          'Como você pode inspirar mudança nos outros?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Mapa de Stakeholders',
      description: 'Mapeie as pessoas-chave para uma mudança que você quer fazer',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Criar um mapa de stakeholders para uma mudança que você quer implementar (apoiadores, neutros, resistentes).`,
      content: JSON.stringify({
        mainTool: 'Stakeholder Mapping',
        exercise: 'Mapear 8-10 stakeholders em matriz de influência/interesse',
        timeLimit: '10 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Narrativa de Mudança',
      description: 'Crie uma história convincente para uma transformação',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Usar Narrative Design para criar uma história que inspire pessoas a adotar uma mudança que você quer implementar.`,
      content: JSON.stringify({
        mainTool: 'Narrative Design',
        deliverable: 'Pitch de 2 minutos para a mudança'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Plano de Gestão de Mudança',
      description: 'Combine Stakeholder Mapping + Narrative + Coalition Building',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: Stakeholder Mapping, Narrative Design, Coalition Building. Crie um plano completo para liderar uma mudança organizacional.`,
      content: JSON.stringify({
        tools: ['Stakeholder Mapping', 'Narrative Design', 'Coalition Building'],
        deliverable: 'Plano de gestão de mudança documentado'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Líder de Transformação',
      description: 'Guie alguém a liderar sua primeira mudança organizacional',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como ajudaria um novo gerente a liderar uma mudança de processo na equipe.`,
      content: JSON.stringify({
        mainTool: 'Change Management',
        scenario: 'Mentore um gerente iniciante em gestão de mudança'
      })
    }
  ],

  'negotiator-influencer': [
    {
      ...LEVELS.DISCOVER,
      name: 'Negociação Baseada em Interesses',
      description: 'Entenda a diferença entre posição e interesse',
      prompt: `${BASE_PROMPTS.discover}\n\nTema: Interest-Based Negotiation (Fisher) - focar em interesses reais, não posições.`,
      content: JSON.stringify({
        mainTool: 'Interest-Based Negotiation',
        keyQuestions: [
          'Qual foi sua última negociação difícil?',
          'Você descobriu o que a outra pessoa realmente queria?',
          'Como seria focar em interesses e não em posições?'
        ]
      })
    },
    {
      ...LEVELS.TRY,
      name: 'Definindo sua BATNA',
      description: 'Identifique sua melhor alternativa para uma negociação atual',
      prompt: `${BASE_PROMPTS.try}\n\nExercício: Escolher uma negociação próxima e definir sua BATNA (Best Alternative To Negotiated Agreement).`,
      content: JSON.stringify({
        mainTool: 'BATNA Analysis',
        exercise: 'Definir BATNA para negociação real',
        timeLimit: '8 minutos'
      })
    },
    {
      ...LEVELS.APPLY,
      name: 'Preparação de Negociação',
      description: 'Prepare-se completamente para uma negociação importante',
      prompt: `${BASE_PROMPTS.apply}\n\nObjetivo: Usar técnicas de preparação (BATNA, interesses, âncoras) para uma negociação real que o usuário vai enfrentar.`,
      content: JSON.stringify({
        mainTool: 'Negotiation Preparation',
        deliverable: 'Documento de preparação completo'
      })
    },
    {
      ...LEVELS.INTEGRATE,
      name: 'Framework de Influência',
      description: 'Combine BATNA + Framing + Social Proof',
      prompt: `${BASE_PROMPTS.integrate}\n\nFerramentas: BATNA, Anchoring & Framing, Social Proof. Crie uma estratégia de influência para uma situação real.`,
      content: JSON.stringify({
        tools: ['BATNA Analysis', 'Anchoring & Framing', 'Social Proof & Reciprocity'],
        deliverable: 'Estratégia de influência documentada'
      })
    },
    {
      ...LEVELS.MASTER,
      name: 'Mestre Negociador',
      description: 'Ensine técnicas de negociação para quem evita conflitos',
      prompt: `${BASE_PROMPTS.master}\n\nO usuário deve explicar como ajudaria alguém com aversão a conflito a negociar melhor seu salário.`,
      content: JSON.stringify({
        mainTool: 'Interest-Based Negotiation',
        scenario: 'Coaching de negociação salarial para pessoa conflict-averse'
      })
    }
  ]
};

export async function seedChallenges(prisma: PrismaClient) {
  console.log('Seeding challenges...');

  const stacks = await prisma.stack.findMany();
  let totalChallenges = 0;

  for (const stack of stacks) {
    const challenges = challengesByStack[stack.slug];

    if (!challenges) {
      console.warn(`No challenges found for stack: ${stack.slug}`);
      continue;
    }

    for (const challenge of challenges) {
      await prisma.challenge.upsert({
        where: {
          stackId_level: {
            stackId: stack.id,
            level: challenge.level
          }
        },
        update: {
          name: challenge.name,
          type: challenge.type,
          description: challenge.description,
          duration: challenge.duration,
          prompt: challenge.prompt,
          content: challenge.content
        },
        create: {
          stackId: stack.id,
          level: challenge.level,
          name: challenge.name,
          type: challenge.type,
          description: challenge.description,
          duration: challenge.duration,
          prompt: challenge.prompt,
          content: challenge.content
        }
      });
      totalChallenges++;
    }
  }

  console.log(`Seeded ${totalChallenges} challenges`);
}
