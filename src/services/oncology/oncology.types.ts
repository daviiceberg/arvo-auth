/**
 * Contracts for the oncology protocol analysis service (M3 — Prototyping Mode).
 *
 * Endpoints planejados (não existem ainda no Swagger):
 *   POST /api/v1/oncology/analyze
 *   GET  /api/v1/oncology/{requestId}/cycles
 */

import {
  type ChecklistItem,
  type OncologyTreatmentLine,
  type OncologyTreatmentType,
} from '@/types/pedido';

export interface OncologyAnalysisRequest {
  requestId: string;
  type: OncologyTreatmentType;
  protocol: string;
  line: OncologyTreatmentLine;
  cycle: string;
  cid: string;
  tussCode: string;
}

export interface OncologyAnalysisResponse {
  requestId: string;
  recommendation: 'Aprovar' | 'Negar' | 'Junta Médica';
  confidence: number;
  checklist: ChecklistItem[];
  rnApplicable: 'RN_566_2022';
  protocolRecognized: boolean;
  dutNumber?: number;
}

export interface OncologyService {
  analyze(req: OncologyAnalysisRequest): Promise<OncologyAnalysisResponse>;
}
