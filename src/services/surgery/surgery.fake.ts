/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/surgery/pre-op-requirements
 *                   POST /api/v1/surgery/pre-op/validate
 *                   POST /api/v1/surgery/analyze
 */

import { type ChecklistItem, type PreOpItem } from '@/types/pedido';

import { PRE_OP_BY_SURGERY_TYPE } from './surgery.fake-data';
import {
  type PreOpRequirementsRequest,
  type PreOpRequirementsResponse,
  type PreOpValidationRequest,
  type PreOpValidationResponse,
  type SurgeryAnalysisRequest,
  type SurgeryAnalysisResponse,
  type SurgeryService,
} from './surgery.types';

const delay = (ms = 300): Promise<void> => new Promise((res) => setTimeout(res, ms));

interface PreOpSummary {
  required: PreOpItem[];
  completed: PreOpItem[];
  pendingRequired: PreOpItem[];
}

function summarizePreOp(items: PreOpItem[]): PreOpSummary {
  const required = items.filter((i) => i.required);
  const completed = required.filter((i) => i.status === 'realizado');
  const pendingRequired = required.filter((i) => i.status === 'pendente');
  return { required, completed, pendingRequired };
}

function buildChecklist(req: SurgeryAnalysisRequest): ChecklistItem[] {
  const { pendingRequired, required, completed } = summarizePreOp(req.preOp);
  const items: ChecklistItem[] = [];
  items.push({
    id: 'PRE_OP_COMPLETUDE',
    texto:
      pendingRequired.length === 0
        ? `Pré-operatório completo (${String(completed.length)}/${String(required.length)})`
        : `Pré-operatório incompleto: ${String(pendingRequired.length)} item(ns) pendente(s)`,
    status: pendingRequired.length === 0 ? 'ok' : 'error',
    origin: 'dados',
    severity: pendingRequired.length === 0 ? 0 : 85,
    showWhenOk: true,
  });
  if (req.hasOpme) {
    items.push({
      id: 'OPME_INTEGRADO',
      texto: 'OPME vinculado — materiais com registro ANVISA e cotações na seção Materiais OPME',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
  }
  if (req.hasOncologyLink) {
    items.push({
      id: 'ONCOLOGIA_VINCULADA',
      texto: 'Cirurgia oncológica vinculada a protocolo oncológico',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
  }
  return items;
}

export const surgeryFake: SurgeryService = {
  async listPreOpRequirements(req: PreOpRequirementsRequest): Promise<PreOpRequirementsResponse> {
    await delay();
    return {
      surgeryType: req.surgeryType,
      items: PRE_OP_BY_SURGERY_TYPE[req.surgeryType],
    };
  },

  async validatePreOp(req: PreOpValidationRequest): Promise<PreOpValidationResponse> {
    await delay();
    const { required, completed, pendingRequired } = summarizePreOp(req.items);
    return {
      complete: pendingRequired.length === 0,
      pendingRequiredIds: pendingRequired.map((i) => i.id),
      totalRequired: required.length,
      totalCompleted: completed.length,
    };
  },

  async analyze(req: SurgeryAnalysisRequest): Promise<SurgeryAnalysisResponse> {
    await delay();
    const { pendingRequired } = summarizePreOp(req.preOp);
    const preOpComplete = pendingRequired.length === 0;
    return {
      requestId: req.requestId,
      recommendation: preOpComplete ? 'Aprovar' : 'Pendenciar',
      confidence: preOpComplete ? 84 : 58,
      checklist: buildChecklist(req),
      preOpComplete,
      preOpPendingCount: pendingRequired.length,
    };
  },
};
