import { type Category } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const categoryColorMap: Record<Category, ChipColor> = {
  'Urgência/Emergência': { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
  Oncologia: { bg: 'rgba(147,51,234,0.1)', color: '#9333ea' },
  Internação: { bg: 'rgba(79,70,229,0.1)', color: '#4f46e5' },
  'Cirurgias Eletivas': { bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
  'Terapias Especiais': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  SADT: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  'Exames Alta Complexidade': { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  'Home Care': { bg: 'rgba(13,148,136,0.1)', color: '#0d9488' },
};
