/**
 * Extractions service — single entry point used by hooks and pages.
 *
 * Consumers import `extractionsService` from here and call its methods without
 * knowing whether the implementation is backed by the real API or the fake.
 * The decision is made at build time via `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`.
 *
 * See `AGENTS.mode.prototype.md` for the full Prototyping pattern.
 */

import { extractionsApi } from './extractions.api';
import { extractionsFake } from './extractions.fake';
import { type ExtractionsService } from './extractions.types';

/**
 * Fake is the default so fresh checkouts work without requiring a local back.
 * To hit the real API, set `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false` explicitly
 * (Prototyping Mode opts out into real integration).
 */
const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_EXTRACTIONS !== 'false';

export const extractionsService: ExtractionsService = USE_FAKE ? extractionsFake : extractionsApi;

export type {
  ExtractionsService,
  UploadExtractionInput,
  UploadExtractionResponse,
  UploadStatus,
} from './extractions.types';
