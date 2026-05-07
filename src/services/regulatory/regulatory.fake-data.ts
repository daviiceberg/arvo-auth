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

import { type InjunctionContext, type NipContext } from '@/types/pedido';

export interface InjunctionRecord {
  requestId: string;
  injunction: InjunctionContext;
  registeredAt: string;
}

export interface NipRecord {
  requestId: string;
  nip: NipContext;
  registeredAt: string;
}

export const FAKE_INJUNCTIONS: InjunctionRecord[] = [];
export const FAKE_NIPS: NipRecord[] = [];
