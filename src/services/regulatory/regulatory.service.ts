/**
 * Regulatory service — single entry point for Liminar Judicial and NIP
 * registration/listing operations.
 *
 * Currently exposed as fake-only (M3 Prototyping Mode). When real endpoints
 * exist in the backend Swagger, create `regulatory.api.ts` mirroring the
 * `RegulatoryService` interface and switch via env var as documented in
 * AGENTS.mode.prototype.md.
 */

import { regulatoryFake } from './regulatory.fake';
import { type RegulatoryService } from './regulatory.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_REGULATORY !== 'false';

export const regulatoryService: RegulatoryService = USE_FAKE ? regulatoryFake : regulatoryFake;

export type {
  ListActiveInjunctionsResponse,
  ListOpenNipsResponse,
  RegisterInjunctionRequest,
  RegisterInjunctionResponse,
  RegisterNipRequest,
  RegisterNipResponse,
  RegulatoryService,
} from './regulatory.types';
