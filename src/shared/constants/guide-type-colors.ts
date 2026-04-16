import { type GuideType } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const guideTypeColorMap: Record<GuideType, ChipColor> = {
  Eleitiva: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
};
