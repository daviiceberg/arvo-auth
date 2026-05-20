/**
 * Urgency analysis service — single entry point for U/E request analysis.
 * Currently fake-only (M3 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { createPendingApiService } from '../_shared/createPendingApiService';

import { urgencyFake } from './urgency.fake';
import { type UrgencyService } from './urgency.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_URGENCY !== 'false';

const urgencyApiPending = createPendingApiService<UrgencyService>(
  'urgencyService',
  'NEXT_PUBLIC_USE_FAKE_URGENCY',
);

export const urgencyService: UrgencyService = USE_FAKE ? urgencyFake : urgencyApiPending;

export type {
  UrgencyAnalysisRequest,
  UrgencyAnalysisResponse,
  UrgencyService,
} from './urgency.types';
