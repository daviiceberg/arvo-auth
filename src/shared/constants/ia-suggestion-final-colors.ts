import { type AISuggestionFinal } from '@/types/pedido';

import { type ChipColor } from './status-colors';

/**
 * Cores da Sugestão IA decisória (snapshot final usado no Histórico).
 * Apenas 3 valores: Aprovar / Negar / Aprovar Parcial.
 *
 * Para Sugestão IA operacional (Fila), usar `iaSuggestionColorMap` que
 * cobre 4 valores incluindo Pendenciar e Junta Médica.
 */
export const aiSuggestionFinalColorMap: Record<AISuggestionFinal, ChipColor> = {
  Aprovar: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  Negar: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Aprovar Parcial': { bg: 'rgba(245,158,11,0.18)', color: '#d97706' },
};
