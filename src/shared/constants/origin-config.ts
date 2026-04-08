import { type OrigemPedido } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export interface OriginEntry extends ChipColor {
  label: string;
}

export const originConfigMap: Record<OrigemPedido, OriginEntry> = {
  app: { label: 'App', bg: 'rgba(37,99,235,0.08)', color: '#2563eb' },
  whatsapp: { label: 'WhatsApp', bg: 'rgba(22,163,74,0.08)', color: '#16a34a' },
  email: { label: 'E-mail', bg: 'rgba(8,145,178,0.08)', color: '#0891b2' },
  prestador: { label: 'Prestador', bg: 'rgba(144,43,41,0.08)', color: '#902B29' },
  call_center: { label: 'Call Center', bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
};
