/**
 * Urgency analysis service — single entry point for U/E request analysis.
 * Currently fake-only (M3 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { urgencyFake } from './urgency.fake';
import { type UrgencyService } from './urgency.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_URGENCY !== 'false';

export const urgencyService: UrgencyService = USE_FAKE ? urgencyFake : urgencyFake;

export type {
  UrgencyAnalysisRequest,
  UrgencyAnalysisResponse,
  UrgencyService,
} from './urgency.types';
