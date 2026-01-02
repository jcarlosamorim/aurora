import { LayerId } from '@/types';

export interface LayerBaseContent {
  id: LayerId;
  name: string;
  definition: string;
  whyItMatters: string;
  genericExample: string;
  triggerTopics: string[];
  discoveryQuestions: string[];
}

export const LAYER_CONTENT: Record<LayerId, LayerBaseContent> = {
  'motor-oculto': {
    id: 'motor-oculto',
    name: 'Motor Oculto',
    definition: 'O que realmente te move. Não é o que você diz - é o que você faz quando ninguém está olhando.',
    whyItMatters: 'Você persegue dinheiro? Ou validação disfarçada de dinheiro? Saber a diferença muda tudo.',
    genericExample: 'Você diz que quer liberdade. Mas toda escolha que faz busca segurança. O que você quer de verdade?',
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
    definition: 'O momento em que você aprendeu a se proteger. A armadura que você veste até hoje.',
    whyItMatters: 'Essa proteção funcionou lá. Ainda funciona aqui? Ou está te custando mais do que protege?',
    genericExample: 'Quem foi abandonado não confia. Quem foi humilhado não se expõe. O que você evita sem perceber?',
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
    definition: 'O que você não quer ver em você. O que te irrita nos outros geralmente mora em você também.',
    whyItMatters: 'Esconder sua sombra consome energia. Reconhecê-la libera essa energia pra outras coisas.',
    genericExample: 'Você critica gente "preguiçosa"? Talvez você tenha medo de descansar. O que você julga demais?',
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
    definition: 'Você quer duas coisas opostas ao mesmo tempo. Essa tensão pode te paralisar ou te impulsionar.',
    whyItMatters: 'Parar de lutar contra você mesmo é o primeiro passo. Seu paradoxo não é defeito - é combustível.',
    genericExample: 'Quer liberdade E segurança. Quer ser visto E ter paz. Quer mudar E manter. E daí?',
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
    definition: 'O que te carrega e o que te drena. Pessoas, lugares, atividades, horários.',
    whyItMatters: 'Você está desenhando uma vida que te sustenta ou que te esgota? Seu mapa mostra a verdade.',
    genericExample: 'Você diz que gosta de pessoas. Mas depois de eventos sociais, precisa de dias pra se recuperar. Hmm.',
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
    definition: 'Como você realmente decide. Não como você acha que decide - como você de fato escolhe.',
    whyItMatters: 'Você pensa que analisa tudo. Mas compra por impulso. Conhecer seu algoritmo real evita arrependimentos.',
    genericExample: 'Você diz que é racional. Mas todas suas grandes decisões foram emocionais. Percebeu?',
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
    definition: 'Regras invisíveis que governam sua vida. Verdades que você nunca questionou.',
    whyItMatters: '"Dinheiro é difícil." "Pessoas decepcionam." Essas crenças são suas ou você herdou?',
    genericExample: 'Você age como se sucesso exigisse sacrifício. Quem te ensinou isso? É verdade?',
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
    definition: 'A história que você conta sobre você. Vítima? Herói? Sortudo? Azarado? Lutador?',
    whyItMatters: 'Sua narrativa molda como você interpreta tudo. Mudar a história muda a experiência.',
    genericExample: 'A mesma demissão pode ser "injustiça" ou "libertação". Qual história você conta?',
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
    definition: 'Como você se conecta com pessoas. Ou como você evita conexão.',
    whyItMatters: 'Você sempre cuida dos outros? Sempre escolhe pessoas indisponíveis? Sempre foge de conflito? Por quê?',
    genericExample: 'Todos seus ex têm algo em comum. Você sabe o que é. Só não quer admitir.',
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
    definition: 'Curso → empolgação → desistência → "o problema sou eu" → novo curso. Quantas vezes?',
    whyItMatters: 'Você não tem problema de disciplina. Você tem um ciclo que se repete porque está protegendo algo.',
    genericExample: 'Você sempre para perto do fim. Por quê? O que acontece se você conseguir?',
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
    definition: 'Aquilo que você faz bem mas chama de "hobby". Que outros pedem ajuda mas você não leva a sério.',
    whyItMatters: 'Seu potencial está esperando permissão. De quem você precisa de autorização pra começar?',
    genericExample: 'Pessoas pedem seus conselhos sobre X. Você faz de graça. E busca emprego em Y. Faz sentido?',
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
    definition: 'O que só você faz do jeito que faz. Onde trabalho vira jogo e ninguém compete com você.',
    whyItMatters: 'Você está perseguindo o que "deveria" fazer ou o que só você pode fazer?',
    genericExample: 'Aquela coisa que outros pedem sua ajuda. Que você faz sem esforço. Que você chama de "hobby". Isso.',
    triggerTopics: ['propósito', 'contribuição única', 'flow', 'excelência natural'],
    discoveryQuestions: [
      'O que você faz que as pessoas dizem "como você consegue?"',
      'Quando você perde a noção do tempo E está gerando valor?',
      'O que só você faz do jeito que faz?'
    ]
  }
};

export function getLayerContent(layerId: LayerId): LayerBaseContent | undefined {
  return LAYER_CONTENT[layerId];
}
