/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint POST /api/v1/urgency/analyze
 */

import { buildUrgencyChecklist } from '@/mocks/urgency-checklist-catalog';

import { FAKE_URGENCY_DEFAULT_CONFIDENCE } from './urgency.fake-data';
import {
  type UrgencyAnalysisRequest,
  type UrgencyAnalysisResponse,
  type UrgencyService,
} from './urgency.types';

const delay = (ms = 300): Promise<void> => new Promise((res) => setTimeout(res, ms));

export const urgencyFake: UrgencyService = {
  async analyze(req: UrgencyAnalysisRequest): Promise<UrgencyAnalysisResponse> {
    await delay();
    const checklist = buildUrgencyChecklist({
      cid: req.cid,
      cidObrigatorioAusente: req.cid.trim() === '',
      justificativaInsuficiente: req.justification.trim().length < 20,
      protocoloUrgenciaAplicavel: true,
      bypassCarencia: req.urgencyType !== 'ambulatorial',
    });
    return {
      requestId: req.requestId,
      recommendation: req.cid.trim() === '' ? 'Pendenciar' : 'Aprovar',
      confidence: FAKE_URGENCY_DEFAULT_CONFIDENCE,
      checklist,
      rnApplicable: 'RN_566_2022_ART_3',
      fastTrackEligible: req.urgencyType === 'emergencia' || req.urgencyType === 'trauma',
    };
  },
};
