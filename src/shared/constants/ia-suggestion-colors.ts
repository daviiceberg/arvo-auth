import { type IASuggestion } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const iaSuggestionColorMap: Record<IASuggestion, ChipColor> = {
  Aprovar: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  Negar: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
};
