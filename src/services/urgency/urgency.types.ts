/**
 * Contracts for the urgency/emergency analysis service (M3 — Prototyping Mode).
 *
 * Endpoints planejados (não existem ainda no Swagger):
 *   POST /api/v1/urgency/analyze
 *   GET  /api/v1/urgency/{requestId}
 */

import { type ChecklistItem, type UrgencyType } from '@/types/pedido';

export interface UrgencyAnalysisRequest {
  requestId: string;
  urgencyType: UrgencyType;
  cid: string;
  tussCode: string;
  justification: string;
}

export interface UrgencyAnalysisResponse {
  requestId: string;
  recommendation: 'Aprovar' | 'Pendenciar';
  confidence: number;
  checklist: ChecklistItem[];
  rnApplicable: 'RN_566_2022_ART_3';
  fastTrackEligible: boolean;
}

export interface UrgencyService {
  analyze(req: UrgencyAnalysisRequest): Promise<UrgencyAnalysisResponse>;
}
