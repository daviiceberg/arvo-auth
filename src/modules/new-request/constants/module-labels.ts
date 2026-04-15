import { type ModuloType } from '../types';

export const moduloLabels: Record<ModuloType, string> = {
  terapias: 'Terapias Especiais',
};

export const getStep3Label = (_modulo: ModuloType | ''): string => 'Sessões de Terapia';
