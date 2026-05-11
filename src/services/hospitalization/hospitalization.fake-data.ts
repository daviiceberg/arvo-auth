/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/hospitalization/taxes
 *                   POST /api/v1/hospitalization/estimate
 *                   POST /api/v1/hospitalization/analyze
 *
 * Valores ilustrativos — whitelabel via operatorConfig (ADR-007).
 * NÃO refletem tabela real de qualquer operadora específica.
 */

import { type AuditLevel, type HospitalTax } from '@/types/pedido';

export const FAKE_DAILY_RATE_BY_LEVEL: Record<AuditLevel, number> = {
  AMBULATORIAL: 0,
  HOSPITALAR: 850,
  UTI: 3200,
};

export const FAKE_HOSPITAL_TAXES: HospitalTax[] = [
  {
    code: '60011081',
    description: 'Taxa de sala — leito hospitalar comum',
    quantity: 1,
    estimatedValue: 280,
  },
  {
    code: '60011219',
    description: 'Taxa de materiais comuns hospitalares',
    quantity: 1,
    estimatedValue: 420,
  },
  {
    code: '60012363',
    description: 'Taxa de medicação hospitalar (kit padrão)',
    quantity: 1,
    estimatedValue: 195,
  },
  {
    code: '60013009',
    description: 'Taxa de oxigenoterapia (diária)',
    quantity: 1,
    estimatedValue: 145,
  },
  {
    code: '60014005',
    description: 'Taxa de monitorização contínua',
    quantity: 1,
    estimatedValue: 320,
  },
];

export const UTI_MIN_JUSTIFICATION_CHARS = 50;
