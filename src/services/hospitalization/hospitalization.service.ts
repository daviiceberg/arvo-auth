/**
 * Hospitalization analysis service — single entry point.
 * Currently fake-only (M4 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { createPendingApiService } from '../_shared/createPendingApiService';

import { hospitalizationFake } from './hospitalization.fake';
import { type HospitalizationService } from './hospitalization.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_HOSPITALIZATION !== 'false';

const hospitalizationApiPending = createPendingApiService<HospitalizationService>(
  'hospitalizationService',
  'NEXT_PUBLIC_USE_FAKE_HOSPITALIZATION',
);

export const hospitalizationService: HospitalizationService = USE_FAKE
  ? hospitalizationFake
  : hospitalizationApiPending;

export type {
  HospitalEstimateRequest,
  HospitalEstimateResponse,
  HospitalizationAnalysisRequest,
  HospitalizationAnalysisResponse,
  HospitalizationService,
} from './hospitalization.types';
