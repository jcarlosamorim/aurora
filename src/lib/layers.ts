import { Layer, LayerId, LayerRegion, Evidence } from '@/types';

export const LAYER_CONFIG: Record<LayerId, { name: string; region: LayerRegion; icon: string }> = {
  'motor-oculto': { name: 'Motor Oculto', region: 'raizes', icon: 'Zap' },
  'ferida-fundadora': { name: 'Ferida Fundadora', region: 'raizes', icon: 'HeartCrack' },
  'sombra-ativa': { name: 'Sombra Ativa', region: 'raizes', icon: 'Moon' },
  'paradoxo': { name: 'Paradoxo Produtivo', region: 'tronco', icon: 'Scale' },
  'mapa-energia': { name: 'Mapa de Energia', region: 'tronco', icon: 'BatteryMedium' },
  'algoritmo-decisao': { name: 'Algoritmo de Decisao', region: 'tronco', icon: 'Compass' },
  'sistema-crencas': { name: 'Sistema de Crencas', region: 'tronco', icon: 'Layers' },
  'narrativa': { name: 'Narrativa Dominante', region: 'copa', icon: 'BookOpen' },
  'padrao-relacional': { name: 'Padrao Relacional', region: 'copa', icon: 'Link2' },
  'ciclo-sabotagem': { name: 'Ciclo de Sabotagem', region: 'copa', icon: 'RefreshCw' },
  'potencial-latente': { name: 'Potencial Latente', region: 'copa', icon: 'Sparkles' },
  'zona-genialidade': { name: 'Zona de Genialidade', region: 'coroa', icon: 'Crown' },
};

export function createInitialLayers(): Layer[] {
  return Object.entries(LAYER_CONFIG).map(([id, config]) => ({
    id: id as LayerId,
    name: config.name,
    region: config.region,
    icon: config.icon,
    state: 'hidden' as const,
    strength: 0,
    evidences: [] as Evidence[],
  }));
}

export function getLayersByRegion(layers: Layer[], region: LayerRegion): Layer[] {
  return layers.filter(l => l.region === region);
}

export function getVisibleLayers(layers: Layer[]): Layer[] {
  return layers.filter(l => l.state !== 'hidden');
}

export function calculateProgress(layers: Layer[]): number {
  const visible = layers.filter(l => l.state !== 'hidden').length;
  return Math.round((visible / layers.length) * 100);
}
