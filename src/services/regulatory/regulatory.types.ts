/**
 * Contracts for the regulatory service layer (Liminar Judicial + NIP).
 *
 * The shapes here mirror the proposed back contract for endpoints that do NOT
 * yet exist in the Swagger (M3 — Hospitalares Críticos). The service layer
 * follows the Prototyping pattern documented in AGENTS.mode.prototype.md:
 * consumers import only from `regulatory.service.ts` and never reference the
 * fake or api modules directly.
 */

import { type InjunctionContext, type NipContext } from '@/types/pedido';

export interface RegisterInjunctionRequest {
  requestId: string;
  processNumber: string;
  scope: string;
  validUntil?: string;
  court?: string;
  notes?: string;
}

export interface RegisterInjunctionResponse {
  requestId: string;
  injunction: InjunctionContext;
  registeredAt: string;
}

export interface RegisterNipRequest {
  requestId: string;
  nipNumber: string;
  openedAt: string;
  deadline: string;
  reason?: string;
}

export interface RegisterNipResponse {
  requestId: string;
  nip: NipContext;
  registeredAt: string;
}

export interface ListActiveInjunctionsResponse {
  data: { requestId: string; injunction: InjunctionContext }[];
  total: number;
}

export interface ListOpenNipsResponse {
  data: { requestId: string; nip: NipContext }[];
  total: number;
}

export interface RegulatoryService {
  registerInjunction(req: RegisterInjunctionRequest): Promise<RegisterInjunctionResponse>;
  registerNip(req: RegisterNipRequest): Promise<RegisterNipResponse>;
  listActiveInjunctions(): Promise<ListActiveInjunctionsResponse>;
  listOpenNips(): Promise<ListOpenNipsResponse>;
}
