import { type IASuggestion } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const iaSuggestionColorMap: Record<IASuggestion, ChipColor> = {
  Aprovar: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  Negar: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Junta Médica': { bg: 'rgba(124,58,237,0.12)', color: '#6d28d9' },
  Pendenciar: { bg: 'rgba(245,158,11,0.18)', color: '#d97706' },
};
