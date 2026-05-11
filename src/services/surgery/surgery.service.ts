/**
 * Surgery analysis service — single entry point.
 * Currently fake-only (M4 Prototyping). Swap fake → api when Swagger has the endpoint.
 */

import { surgeryFake } from './surgery.fake';
import { type SurgeryService } from './surgery.types';

const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_SURGERY !== 'false';

export const surgeryService: SurgeryService = USE_FAKE ? surgeryFake : surgeryFake;

export type {
  PreOpRequirementsRequest,
  PreOpRequirementsResponse,
  PreOpRequirementTemplate,
  PreOpValidationRequest,
  PreOpValidationResponse,
  SurgeryAnalysisRequest,
  SurgeryAnalysisResponse,
  SurgeryService,
} from './surgery.types';
