import { type AuditLevel } from '@/types/pedido';

import { type ChipColor } from './status-colors';

export const auditLevelColorMap: Record<AuditLevel, ChipColor> = {
  AMBULATORIAL: { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  HOSPITALAR: { bg: 'rgba(3,105,161,0.1)', color: '#0369a1' },
  UTI: { bg: 'rgba(185,28,28,0.1)', color: '#b91c1c' },
};

export const auditLevelLabel: Record<AuditLevel, string> = {
  AMBULATORIAL: 'Ambulatorial',
  HOSPITALAR: 'Hospitalar',
  UTI: 'UTI',
};
