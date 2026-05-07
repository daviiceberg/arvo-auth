/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint POST /api/v1/oncology/analyze
 */

import { buildOncologyChecklist } from '@/mocks/oncology-checklist-catalog';
import { getDutNumberForTuss } from '@/mocks/tuss-dut-mapping';

import { KNOWN_PROTOCOLS } from './oncology.fake-data';
import {
  type OncologyAnalysisRequest,
  type OncologyAnalysisResponse,
  type OncologyService,
} from './oncology.types';

const delay = (ms = 300): Promise<void> => new Promise((res) => setTimeout(res, ms));

export const oncologyFake: OncologyService = {
  async analyze(req: OncologyAnalysisRequest): Promise<OncologyAnalysisResponse> {
    await delay();
    const protocolRecognized = KNOWN_PROTOCOLS.has(req.protocol);
    const dutNumber = getDutNumberForTuss(req.tussCode);
    const checklist = buildOncologyChecklist({
      cid: req.cid,
      protocoloReconhecido: protocolRecognized,
      protocoloNome: req.protocol,
      cicloRegistrado: true,
      estadiamentoLaudo: true,
      dutAtende: dutNumber !== null,
    });
    return {
      requestId: req.requestId,
      recommendation: protocolRecognized ? 'Aprovar' : 'Junta Médica',
      confidence: protocolRecognized ? 88 : 55,
      checklist,
      rnApplicable: 'RN_566_2022',
      protocolRecognized,
      ...(dutNumber !== null && { dutNumber }),
    };
  },
};
