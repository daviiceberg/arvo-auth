/**
 * Contracts for the hospitalization analysis service (M4 — Prototyping Mode).
 *
 * Endpoints planejados (não existem ainda no Swagger):
 *   GET  /api/v1/hospitalization/taxes
 *   POST /api/v1/hospitalization/estimate
 *   POST /api/v1/hospitalization/analyze
 */

import {
  type AuditLevel,
  type ChecklistItem,
  type HospitalTax,
  type HospitalizationType,
} from '@/types/pedido';

export interface HospitalizationAnalysisRequest {
  requestId: string;
  type: HospitalizationType;
  auditLevel: AuditLevel;
  expectedDays: number;
  taxes: HospitalTax[];
  cid: string;
  utiJustification?: string;
}

export interface HospitalizationAnalysisResponse {
  requestId: string;
  recommendation: 'Aprovar' | 'Negar' | 'Junta Médica' | 'Pendenciar';
  confidence: number;
  checklist: ChecklistItem[];
  estimatedTotal: number;
  dailyRate: number;
}

export interface HospitalEstimateRequest {
  expectedDays: number;
  auditLevel: AuditLevel;
  taxes: HospitalTax[];
}

export interface HospitalEstimateResponse {
  expectedDays: number;
  dailyRate: number;
  daysSubtotal: number;
  taxesSubtotal: number;
  total: number;
  currency: 'BRL';
}

export interface HospitalizationService {
  listHospitalTaxes(): Promise<HospitalTax[]>;
  calculateEstimate(req: HospitalEstimateRequest): Promise<HospitalEstimateResponse>;
  analyze(req: HospitalizationAnalysisRequest): Promise<HospitalizationAnalysisResponse>;
}
