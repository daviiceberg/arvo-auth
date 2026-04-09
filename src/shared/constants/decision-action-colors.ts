import { type DecisionAction } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export interface DecisionActionConfig extends ChipColor {
  label: string;
}

export const decisionActionConfigMap: Record<DecisionAction, DecisionActionConfig> = {
  Aprovado: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a', label: 'Aprovado' },
  Negado: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d', label: 'Negado' },
  'Aprovado Parcial': { bg: 'rgba(217,119,6,0.12)', color: '#b45309', label: 'Parcial' },
  Devolutiva: { bg: 'rgba(245,158,11,0.12)', color: '#92400e', label: 'Devolutiva' },
};
