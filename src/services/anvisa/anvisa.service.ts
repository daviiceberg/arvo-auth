/**
 * ANVISA registration service — single entry point.
 * Currently fake-only (M5 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { createPendingApiService } from '../_shared/createPendingApiService';

import { anvisaFake } from './anvisa.fake';
import { type AnvisaService } from './anvisa.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_ANVISA !== 'false';

const anvisaApiPending = createPendingApiService<AnvisaService>(
  'anvisaService',
  'NEXT_PUBLIC_USE_FAKE_ANVISA',
);

export const anvisaService: AnvisaService = USE_FAKE ? anvisaFake : anvisaApiPending;

export type {
  AnvisaBatchCheckRequest,
  AnvisaBatchCheckResponse,
  AnvisaCheckRequest,
  AnvisaCheckResponse,
  AnvisaService,
} from './anvisa.types';
