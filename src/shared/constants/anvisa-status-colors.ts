export type AnvisaStatus = 'valid' | 'invalid' | 'not_found' | 'not_checked';

export interface AnvisaStatusConfig {
  bg: string;
  text: string;
  label: string;
}

export const anvisaStatusColorMap: Record<AnvisaStatus, AnvisaStatusConfig> = {
  valid: { bg: 'rgba(22,163,74,0.1)', text: '#16a34a', label: 'Válido' },
  invalid: { bg: 'rgba(212,24,61,0.1)', text: '#d4183d', label: 'Inválido' },
  not_found: { bg: 'rgba(212,24,61,0.1)', text: '#d4183d', label: 'Não encontrado' },
  not_checked: { bg: 'rgba(245,158,11,0.12)', text: '#b45309', label: 'Não consultado' },
};
