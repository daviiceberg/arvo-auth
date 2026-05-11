/**
 * Contracts for the surgery analysis service (M4 — Prototyping Mode).
 *
 * Endpoints planejados (não existem ainda no Swagger):
 *   GET  /api/v1/surgery/pre-op-requirements
 *   POST /api/v1/surgery/pre-op/validate
 *   POST /api/v1/surgery/analyze
 */

import { type ChecklistItem, type PreOpItem, type SurgeryType } from '@/types/pedido';

export type PreOpRequirementTemplate = Omit<
  PreOpItem,
  'status' | 'date' | 'provider' | 'resultRef'
>;

export interface SurgeryAnalysisRequest {
  requestId: string;
  type: SurgeryType;
  mainProcedureCode: string;
  accessoryProcedureCodes: string[];
  preOp: PreOpItem[];
  cid: string;
  hasOpme: boolean;
  hasOncologyLink: boolean;
}

export interface SurgeryAnalysisResponse {
  requestId: string;
  recommendation: 'Aprovar' | 'Negar' | 'Junta Médica' | 'Pendenciar';
  confidence: number;
  checklist: ChecklistItem[];
  preOpComplete: boolean;
  preOpPendingCount: number;
}

export interface PreOpRequirementsRequest {
  surgeryType: SurgeryType;
}

export interface PreOpRequirementsResponse {
  surgeryType: SurgeryType;
  items: PreOpRequirementTemplate[];
}

export interface PreOpValidationRequest {
  items: PreOpItem[];
}

export interface PreOpValidationResponse {
  complete: boolean;
  pendingRequiredIds: string[];
  totalRequired: number;
  totalCompleted: number;
}

export interface SurgeryService {
  listPreOpRequirements(req: PreOpRequirementsRequest): Promise<PreOpRequirementsResponse>;
  validatePreOp(req: PreOpValidationRequest): Promise<PreOpValidationResponse>;
  analyze(req: SurgeryAnalysisRequest): Promise<SurgeryAnalysisResponse>;
}
