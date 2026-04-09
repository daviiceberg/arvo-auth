import { type Category } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const categoryColorMap: Record<Category, ChipColor> = {
  Internação: { bg: 'rgba(144,43,41,0.1)', color: '#902B29' },
  'Urgência/Emergência': { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  Oncologia: { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
  'Terapias Especiais': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  OPME: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Exames Alta Complexidade': { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  'Cirurgias Eletivas': { bg: 'rgba(5,150,105,0.1)', color: '#059669' },
  'Home Care': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  SADT: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
};
