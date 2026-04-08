import { type TipoGuia } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const guideTypeColorMap: Record<TipoGuia, ChipColor> = {
  Eleitiva: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  Urgente: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  Emergência: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
};
