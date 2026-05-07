/**
 * @prototype
 * @status FAKE — awaiting real backend endpoints
 * @planned-endpoints
 *   POST /api/v1/regulatory/injunctions
 *   POST /api/v1/regulatory/nips
 *   GET  /api/v1/regulatory/injunctions
 *   GET  /api/v1/regulatory/nips
 * @tracking-issue (to be created when prototype is approved)
 */

import { FAKE_INJUNCTIONS, FAKE_NIPS } from './regulatory.fake-data';
import {
  type ListActiveInjunctionsResponse,
  type ListOpenNipsResponse,
  type RegisterInjunctionRequest,
  type RegisterInjunctionResponse,
  type RegisterNipRequest,
  type RegisterNipResponse,
  type RegulatoryService,
} from './regulatory.types';

const delay = (ms = 250): Promise<void> => new Promise((res) => setTimeout(res, ms));

const injunctions = [...FAKE_INJUNCTIONS];
const nips = [...FAKE_NIPS];

export const regulatoryFake: RegulatoryService = {
  async registerInjunction(req: RegisterInjunctionRequest): Promise<RegisterInjunctionResponse> {
    await delay();
    const record: RegisterInjunctionResponse = {
      requestId: req.requestId,
      injunction: {
        processNumber: req.processNumber,
        scope: req.scope,
        validUntil: req.validUntil,
        court: req.court,
        notes: req.notes,
      },
      registeredAt: new Date().toISOString(),
    };
    injunctions.push(record);
    return record;
  },

  async registerNip(req: RegisterNipRequest): Promise<RegisterNipResponse> {
    await delay();
    const record: RegisterNipResponse = {
      requestId: req.requestId,
      nip: {
        nipNumber: req.nipNumber,
        openedAt: req.openedAt,
        deadline: req.deadline,
        status: 'aberta',
        reason: req.reason,
      },
      registeredAt: new Date().toISOString(),
    };
    nips.push(record);
    return record;
  },

  async listActiveInjunctions(): Promise<ListActiveInjunctionsResponse> {
    await delay();
    return {
      data: injunctions.map((r) => ({ requestId: r.requestId, injunction: r.injunction })),
      total: injunctions.length,
    };
  },

  async listOpenNips(): Promise<ListOpenNipsResponse> {
    await delay();
    const open = nips.filter((r) => r.nip.status === 'aberta');
    return {
      data: open.map((r) => ({ requestId: r.requestId, nip: r.nip })),
      total: open.length,
    };
  },
};
