/**
 * Contracts for the ANVISA registration service (M5 — Prototyping Mode).
 *
 * Endpoints planejados (não existem ainda no Swagger):
 *   GET  /api/v1/anvisa/check?registration={registration}
 *   POST /api/v1/anvisa/batch-check
 *
 * Integração futura: consulta ANVISA pública via webhook async (ver Riscos-M5/R-M5-01).
 */

import { type AnvisaStatus } from '@/types/pedido';

export interface AnvisaCheckRequest {
  registration: string;
}

export interface AnvisaCheckResponse {
  registration: string;
  status: AnvisaStatus;
  productName?: string;
  manufacturer?: string;
  category?: string;
  validUntil?: string;
  source: 'cache' | 'live' | 'unknown';
  checkedAt: string;
}

export interface AnvisaBatchCheckRequest {
  registrations: string[];
}

export interface AnvisaBatchCheckResponse {
  results: AnvisaCheckResponse[];
}

export interface AnvisaService {
  check(req: AnvisaCheckRequest): Promise<AnvisaCheckResponse>;
  batchCheck(req: AnvisaBatchCheckRequest): Promise<AnvisaBatchCheckResponse>;
}
