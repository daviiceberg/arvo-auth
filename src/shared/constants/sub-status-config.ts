import { type SubStatus } from '@/types/pedido';

export interface SubStatusConfig {
  label: string;
  color: string;
  pulsing: boolean;
}

export const subStatusConfigMap: Record<SubStatus, SubStatusConfig> = {
  PENDENTE_AGUARDANDO: { label: 'Aguardando', color: '#b45309', pulsing: true },
  PENDENTE_RETORNO_RECEBIDO: { label: 'Retorno recebido', color: '#b45309', pulsing: false },
  JUNTA_AGUARDANDO: { label: 'Ag. Junta Médica', color: '#2563eb', pulsing: true },
  JUNTA_PARECER_RECEBIDO: { label: 'Parecer recebido', color: '#2563eb', pulsing: false },
};
