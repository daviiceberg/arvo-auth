import { type Category } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const categoryColorMap: Record<Category, ChipColor> = {
  'Terapias Especiais': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  SADT: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  'Exames Alta Complexidade': { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  'Home Care': { bg: 'rgba(13,148,136,0.1)', color: '#0d9488' },
};
