import { type GuideType } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const guideTypeColorMap: Record<GuideType, ChipColor> = {
  Eleitiva: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  Urgência: { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  Emergência: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
};
