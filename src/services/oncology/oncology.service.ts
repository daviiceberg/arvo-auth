/**
 * Oncology protocol analysis service — single entry point.
 * Currently fake-only (M3 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { createPendingApiService } from '../_shared/createPendingApiService';

import { oncologyFake } from './oncology.fake';
import { type OncologyService } from './oncology.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_ONCOLOGY !== 'false';

const oncologyApiPending = createPendingApiService<OncologyService>(
  'oncologyService',
  'NEXT_PUBLIC_USE_FAKE_ONCOLOGY',
);

export const oncologyService: OncologyService = USE_FAKE ? oncologyFake : oncologyApiPending;

export type {
  OncologyAnalysisRequest,
  OncologyAnalysisResponse,
  OncologyService,
} from './oncology.types';
