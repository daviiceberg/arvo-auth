/**
 * Hospitalization analysis service — single entry point.
 * Currently fake-only (M4 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { hospitalizationFake } from './hospitalization.fake';
import { type HospitalizationService } from './hospitalization.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_HOSPITALIZATION !== 'false';

export const hospitalizationService: HospitalizationService = USE_FAKE
  ? hospitalizationFake
  : hospitalizationFake;

export type {
  HospitalEstimateRequest,
  HospitalEstimateResponse,
  HospitalizationAnalysisRequest,
  HospitalizationAnalysisResponse,
  HospitalizationService,
} from './hospitalization.types';
