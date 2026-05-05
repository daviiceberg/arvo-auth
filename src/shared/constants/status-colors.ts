import { type GuideStatus } from '@/types/pedido';

export interface ChipColor {
  bg: string;
  color: string;
}

export const statusColorMap: Record<GuideStatus, ChipColor> = {
  'Em Análise': { bg: 'rgba(245,158,11,0.18)', color: '#92400e' },
  Aprovado: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  Negado: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Aprovado Parcial': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  Pendente: { bg: 'rgba(245,158,11,0.18)', color: '#92400e' },
  Devolutiva: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
};
