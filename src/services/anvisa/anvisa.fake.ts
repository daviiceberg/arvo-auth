/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/anvisa/check
 *                   POST /api/v1/anvisa/batch-check
 *
 * Implementação fake do serviço ANVISA. Simula latência realista (350-900ms)
 * e devolve 3 status possíveis com base no dataset estático: valid, invalid
 * (vigência expirada) e not_found (registro não cadastrado).
 */

import { ANVISA_FAKE_RECORDS } from './anvisa.fake-data';
import {
  type AnvisaBatchCheckRequest,
  type AnvisaBatchCheckResponse,
  type AnvisaCheckRequest,
  type AnvisaCheckResponse,
  type AnvisaService,
} from './anvisa.types';

const MIN_DELAY_MS = 350;
const MAX_DELAY_MS = 900;

function delay(min = MIN_DELAY_MS, max = MAX_DELAY_MS): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((res) => setTimeout(res, ms));
}

function normalizeRegistration(registration: string): string {
  return registration.replace(/\D/g, '').trim();
}

function buildCheckResponse(registration: string): AnvisaCheckResponse {
  const normalized = normalizeRegistration(registration);
  const checkedAt = new Date().toISOString();

  if (normalized.length === 0) {
    return {
      registration,
      status: 'not_checked',
      source: 'unknown',
      checkedAt,
    };
  }

  const match = ANVISA_FAKE_RECORDS.find((r) => r.registration === normalized);

  if (!match) {
    return {
      registration: normalized,
      status: 'not_found',
      source: 'live',
      checkedAt,
    };
  }

  return {
    registration: match.registration,
    status: match.status,
    productName: match.productName,
    manufacturer: match.manufacturer,
    category: match.category,
    validUntil: match.validUntil,
    source: 'cache',
    checkedAt,
  };
}

export const anvisaFake: AnvisaService = {
  async check(req: AnvisaCheckRequest): Promise<AnvisaCheckResponse> {
    await delay();
    return buildCheckResponse(req.registration);
  },

  async batchCheck(req: AnvisaBatchCheckRequest): Promise<AnvisaBatchCheckResponse> {
    await delay();
    return {
      results: req.registrations.map((registration) => buildCheckResponse(registration)),
    };
  },
};
