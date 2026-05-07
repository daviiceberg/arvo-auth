/**
 * Oncology protocol analysis service — single entry point.
 * Currently fake-only (M3 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { oncologyFake } from './oncology.fake';
import { type OncologyService } from './oncology.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_ONCOLOGY !== 'false';

export const oncologyService: OncologyService = USE_FAKE ? oncologyFake : oncologyFake;

export type {
  OncologyAnalysisRequest,
  OncologyAnalysisResponse,
  OncologyService,
} from './oncology.types';
