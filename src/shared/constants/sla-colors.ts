import { type SLAStatus } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const slaColorMap: Record<SLAStatus, ChipColor> = {
  ok: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  violated: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
};
