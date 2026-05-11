/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/hospitalization/taxes
 *                   POST /api/v1/hospitalization/estimate
 *                   POST /api/v1/hospitalization/analyze
 */

import { type ChecklistItem, type HospitalTax } from '@/types/pedido';

import {
  FAKE_DAILY_RATE_BY_LEVEL,
  FAKE_HOSPITAL_TAXES,
  UTI_MIN_JUSTIFICATION_CHARS,
} from './hospitalization.fake-data';
import {
  type HospitalEstimateRequest,
  type HospitalEstimateResponse,
  type HospitalizationAnalysisRequest,
  type HospitalizationAnalysisResponse,
  type HospitalizationService,
} from './hospitalization.types';

const delay = (ms = 300): Promise<void> => new Promise((res) => setTimeout(res, ms));

function sumTaxes(taxes: HospitalTax[]): number {
  return taxes.reduce((acc, t) => acc + t.estimatedValue * t.quantity, 0);
}

function buildChecklist(req: HospitalizationAnalysisRequest): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const utiNeedsJustification = req.auditLevel === 'UTI';
  const justOk =
    !utiNeedsJustification ||
    (req.utiJustification ?? '').trim().length >= UTI_MIN_JUSTIFICATION_CHARS;
  if (utiNeedsJustification) {
    items.push({
      id: 'UTI_JUSTIFICATIVA',
      texto: justOk
        ? 'Justificativa de UTI atende ao mínimo'
        : `Justificativa de UTI insuficiente (mínimo ${String(UTI_MIN_JUSTIFICATION_CHARS)} caracteres)`,
      status: justOk ? 'ok' : 'error',
      origin: 'engenharia',
      severity: justOk ? 0 : 90,
      showWhenOk: true,
    });
  }
  items.push({
    id: 'PLANO_CUIDADOS',
    texto: 'Plano de cuidados hospitalares enviado',
    status: 'ok',
    origin: 'dados',
    showWhenOk: true,
  });
  items.push({
    id: 'EXPECTED_DAYS',
    texto:
      req.expectedDays > 0
        ? 'Estimativa de diárias informada'
        : 'Estimativa de diárias não informada',
    status: req.expectedDays > 0 ? 'ok' : 'warning',
    origin: 'dados',
    severity: req.expectedDays > 0 ? 0 : 60,
    showWhenOk: false,
  });
  return items;
}

export const hospitalizationFake: HospitalizationService = {
  async listHospitalTaxes() {
    await delay();
    return FAKE_HOSPITAL_TAXES;
  },

  async calculateEstimate(req: HospitalEstimateRequest): Promise<HospitalEstimateResponse> {
    await delay();
    const dailyRate = FAKE_DAILY_RATE_BY_LEVEL[req.auditLevel];
    const daysSubtotal = req.expectedDays * dailyRate;
    const taxesSubtotal = sumTaxes(req.taxes);
    return {
      expectedDays: req.expectedDays,
      dailyRate,
      daysSubtotal,
      taxesSubtotal,
      total: daysSubtotal + taxesSubtotal,
      currency: 'BRL',
    };
  },

  async analyze(req: HospitalizationAnalysisRequest): Promise<HospitalizationAnalysisResponse> {
    await delay();
    const dailyRate = FAKE_DAILY_RATE_BY_LEVEL[req.auditLevel];
    const taxesSubtotal = sumTaxes(req.taxes);
    const total = req.expectedDays * dailyRate + taxesSubtotal;
    const utiOk =
      req.auditLevel !== 'UTI' ||
      (req.utiJustification ?? '').trim().length >= UTI_MIN_JUSTIFICATION_CHARS;
    return {
      requestId: req.requestId,
      recommendation: utiOk ? 'Aprovar' : 'Pendenciar',
      confidence: utiOk ? 86 : 60,
      checklist: buildChecklist(req),
      estimatedTotal: total,
      dailyRate,
    };
  },
};
