'use client';

import { useCallback, useSyncExternalStore } from 'react';

import {
  type AuditLogEntry,
  type ChecklistItem,
  type Document,
  type GuideStatus,
  type IASuggestion,
  type JuntaMedicaContext,
  type OperatorLock,
  type PendencyContext,
  type PrestadorMessage,
  type Request,
  type SLASuspension,
  type SLASuspensionReason,
  type SubStatus,
} from '@/types/pedido';

import { PENDENCY_REASONS, type PendencyDeadlineDays } from '../constants/pendency-reasons';

interface M1RequestOverride {
  status?: GuideStatus;
  subStatus?: SubStatus;
  pendencyContext?: PendencyContext;
  juntaMedicaContext?: JuntaMedicaContext;
  slaSuspension?: SLASuspension;
  operatorLock?: OperatorLock | null;
  prestadorMessages?: PrestadorMessage[];
  extraAuditLog?: AuditLogEntry[];
  iaSuggestion?: IASuggestion;
  iaJustification?: string;
  iaChecklist?: ChecklistItem[];
  iaReprocessing?: boolean;
  documents?: Document[];
  alerts?: string[];
}

const REPROCESS_DELAY_MS = 4000;

/* ─────────────────────────────────────────────────────────────────────────
 * Module-level in-memory store (lives only while the JS bundle is loaded).
 *
 * Refresh wipes it. By design, simulações M1 não persistem entre sessões —
 * comportamento esperado em demos e QA.
 * ───────────────────────────────────────────────────────────────────────── */
const memoryStore = new Map<string, M1RequestOverride>();
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((cb) => {
    cb();
  });
}

function subscribe(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

function readSnapshot(requestId: string): M1RequestOverride {
  return memoryStore.get(requestId) ?? EMPTY_OVERRIDE;
}

const EMPTY_OVERRIDE: M1RequestOverride = {};

function writeSnapshot(requestId: string, next: M1RequestOverride) {
  memoryStore.set(requestId, next);
  emit();
}

/**
 * Reset all M1 simulation state for every request.
 * Used by the "Resetar simulação" debug button.
 */
export function resetAllM1State(): void {
  memoryStore.clear();
  emit();
}

const LEGACY_KEY_PREFIXES = ['arvo_m1_state', 'arvo_dev_user_profile'];

/**
 * One-time cleanup of legacy localStorage keys from earlier versions:
 * - `arvo_m1_state*` — antiga persistência de simulações M1.
 * - `arvo_dev_user_profile` — toggle de perfil debug (Auditor/Analista Sênior),
 *   descontinuado quando modelo unificou em Gestor/Autorizador/Auditor.
 * Safe to call repeatedly.
 */
export function cleanupLegacyM1State(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && LEGACY_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => {
    window.localStorage.removeItem(k);
  });
}

/* ─── Builders for prestador messages and audit entries ─────────────────── */

function nowDisplay(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${String(Date.now())}-${String(Math.random())}`;
}

function buildPrestadorMessageForPendency(payload: {
  reasons: string[];
  justification: string;
}): PrestadorMessage {
  const reasonLabels = payload.reasons
    .map((id) => PENDENCY_REASONS.find((r) => r.id === id)?.label ?? id)
    .join('; ');
  return {
    id: uuid(),
    channel: 'email',
    subject: 'Pendência em pedido de autorização — documentação solicitada',
    body: `Sua autorização foi pendenciada. Itens solicitados: ${reasonLabels}.\n\nObservação: ${payload.justification}`,
    sentAt: nowIso(),
    status: 'sent',
    triggerEvent: 'pendencia',
  };
}

function buildPrestadorMessageForJunta(payload: {
  reason: string;
  justification: string;
}): PrestadorMessage {
  return {
    id: uuid(),
    channel: 'email',
    subject: 'Pedido encaminhado para Junta Médica',
    body: `Pedido encaminhado para junta médica. Motivo: ${payload.reason}.\n\nJustificativa: ${payload.justification}`,
    sentAt: nowIso(),
    status: 'sent',
    triggerEvent: 'junta_encaminhada',
  };
}

function buildPrestadorMessageForReturnReceived(): PrestadorMessage {
  return {
    id: uuid(),
    channel: 'email',
    subject: 'Confirmação de recebimento da devolutiva',
    body: 'Confirmamos o recebimento da documentação enviada. O pedido voltará à análise em breve.',
    sentAt: nowIso(),
    status: 'sent',
    triggerEvent: 'devolutiva_recebida',
  };
}

/* ─── Hook ──────────────────────────────────────────────────────────────── */

export interface UseM1RequestStateResult {
  effectiveRequest: Request;
  applyPendency: (payload: {
    reasons: string[];
    justification: string;
    deadlineBusinessDays: PendencyDeadlineDays;
    actor: string;
  }) => void;
  simulateProviderReturn: (actor: string, onReprocessComplete?: () => void) => void;
  applyJuntaMedica: (payload: { reason: string; justification: string; actor: string }) => void;
  simulateJuntaParecer: (
    payload: {
      suggestedDecision: 'aprovado' | 'negado' | 'aprovado_parcial';
      text: string;
      actor: string;
    },
    onReprocessComplete?: () => void,
  ) => void;
  suspendSla: (payload: { reason: SLASuspensionReason; actor: string }) => boolean;
  forceUnlock: (actor: string) => void;
  reset: () => void;
}

// eslint-disable-next-line complexity -- pure data merge: many `??` fallbacks across optional override fields, no real branching logic
function mergeEffectiveRequest(initialRequest: Request, override: M1RequestOverride): Request {
  return {
    ...initialRequest,
    status: override.status ?? initialRequest.status,
    subStatus: override.subStatus ?? initialRequest.subStatus,
    pendencyContext: override.pendencyContext ?? initialRequest.pendencyContext,
    juntaMedicaContext: override.juntaMedicaContext ?? initialRequest.juntaMedicaContext,
    slaSuspension: override.slaSuspension ?? initialRequest.slaSuspension,
    operatorLock:
      override.operatorLock === null
        ? undefined
        : (override.operatorLock ?? initialRequest.operatorLock),
    prestadorMessages: [
      ...(initialRequest.prestadorMessages ?? []),
      ...(override.prestadorMessages ?? []),
    ],
    auditLog: [...(initialRequest.auditLog ?? []), ...(override.extraAuditLog ?? [])],
    iaSuggestion: override.iaSuggestion ?? initialRequest.iaSuggestion,
    iaJustification: override.iaJustification ?? initialRequest.iaJustification,
    iaChecklist: override.iaChecklist ?? initialRequest.iaChecklist,
    iaReprocessing: override.iaReprocessing ?? false,
    documents: override.documents ?? initialRequest.documents,
    alerts: override.alerts ?? initialRequest.alerts,
  };
}

function applyReprocessResult(initialRequest: Request): void {
  const current = readSnapshot(initialRequest.id);
  const newSuggestion = initialRequest.iaSuggestionAfterReprocess ?? initialRequest.iaSuggestion;
  const reprocCompleteAudit: AuditLogEntry = {
    action: 'Análise reprocessada',
    actor: 'Arvo IA',
    timestamp: nowDisplay(),
    details: `Nova recomendação: ${newSuggestion}`,
  };
  writeSnapshot(initialRequest.id, {
    ...current,
    iaReprocessing: false,
    iaSuggestion: newSuggestion,
    iaJustification: initialRequest.iaJustificationAfterReprocess ?? initialRequest.iaJustification,
    iaChecklist: initialRequest.iaChecklistAfterReprocess ?? initialRequest.iaChecklist,
    extraAuditLog: [...(current.extraAuditLog ?? []), reprocCompleteAudit],
  });
}

/**
 * M1 — in-memory state override per Request. Refresh wipes everything (mocks
 * voltam ao estado inicial definido em `src/data/pedidos.ts`).
 *
 * Persistência intencionalmente removida: simulações são para demo/QA.
 */
export function useM1RequestState(initialRequest: Request): UseM1RequestStateResult {
  const override = useSyncExternalStore(
    subscribe,
    () => readSnapshot(initialRequest.id),
    () => EMPTY_OVERRIDE,
  );

  const persist = useCallback(
    (next: M1RequestOverride) => {
      writeSnapshot(initialRequest.id, next);
    },
    [initialRequest.id],
  );

  const effectiveRequest = mergeEffectiveRequest(initialRequest, override);

  const applyPendency = useCallback(
    (payload: {
      reasons: string[];
      justification: string;
      deadlineBusinessDays: PendencyDeadlineDays;
      actor: string;
    }) => {
      const msg = buildPrestadorMessageForPendency(payload);
      const audit: AuditLogEntry = {
        action: 'Pedido pendenciado',
        actor: payload.actor,
        timestamp: nowDisplay(),
        details: `${String(payload.reasons.length)} item(ns) solicitado(s) — prazo ${String(payload.deadlineBusinessDays)} dias úteis`,
      };
      const auditMsg: AuditLogEntry = {
        action: 'Notificação enviada ao prestador (e-mail)',
        actor: 'Sistema',
        timestamp: nowDisplay(),
        details: msg.subject,
      };
      persist({
        ...override,
        status: 'Pendente',
        subStatus: 'PENDENTE_AGUARDANDO',
        pendencyContext: {
          reasons: payload.reasons,
          justification: payload.justification,
          requestedAt: nowDisplay(),
          deadlineBusinessDays: payload.deadlineBusinessDays,
        },
        prestadorMessages: [...(override.prestadorMessages ?? []), msg],
        extraAuditLog: [...(override.extraAuditLog ?? []), audit, auditMsg],
      });
    },
    [override, persist],
  );

  const simulateProviderReturn = useCallback(
    (actor: string, onReprocessComplete?: () => void) => {
      if (!override.pendencyContext && !initialRequest.pendencyContext) return;
      const ctx = override.pendencyContext ?? initialRequest.pendencyContext;
      if (!ctx) return;
      const msg = buildPrestadorMessageForReturnReceived();
      const audit: AuditLogEntry = {
        action: 'Retorno do prestador recebido',
        actor: 'Prestador (mock)',
        timestamp: nowDisplay(),
        details: 'Documentação complementar anexada — pedido pronto para revisão',
      };
      const reprocAudit: AuditLogEntry = {
        action: 'Reprocessamento da IA disparado',
        actor: 'Sistema',
        timestamp: nowDisplay(),
        details: 'Devolutiva é evento estrutural — pipelines de IA reanalisaram o pedido',
      };
      const ackAudit: AuditLogEntry = {
        action: 'Confirmação de recebimento enviada ao prestador',
        actor,
        timestamp: nowDisplay(),
      };
      const baseDocuments = override.documents ?? initialRequest.documents;
      const newDocs = initialRequest.documentsAddedOnDevolutiva ?? [];
      persist({
        ...override,
        status: 'Devolutiva',
        subStatus: 'PENDENTE_RETORNO_RECEBIDO',
        pendencyContext: { ...ctx, responseReceivedAt: nowDisplay() },
        prestadorMessages: [...(override.prestadorMessages ?? []), msg],
        extraAuditLog: [...(override.extraAuditLog ?? []), audit, reprocAudit, ackAudit],
        iaReprocessing: true,
        documents: [...baseDocuments, ...newDocs],
      });
      setTimeout(() => {
        applyReprocessResult(initialRequest);
        onReprocessComplete?.();
      }, REPROCESS_DELAY_MS);
    },
    [override, persist, initialRequest],
  );

  const applyJuntaMedica = useCallback(
    (payload: { reason: string; justification: string; actor: string }) => {
      const msg = buildPrestadorMessageForJunta(payload);
      const audit: AuditLogEntry = {
        action: 'Encaminhado para Junta Médica',
        actor: payload.actor,
        timestamp: nowDisplay(),
        details: `Motivo: ${payload.reason}`,
      };
      persist({
        ...override,
        status: 'Pendente',
        subStatus: 'JUNTA_AGUARDANDO',
        juntaMedicaContext: {
          reason: payload.reason,
          justification: payload.justification,
          forwardedAt: nowDisplay(),
          status: 'aguardando',
          desempatadorName: 'Dr. Roberto Mendes (mock)',
          desempatadorCrm: 'CRM/SP 123456',
          meetingDate: '—',
        },
        prestadorMessages: [...(override.prestadorMessages ?? []), msg],
        extraAuditLog: [...(override.extraAuditLog ?? []), audit],
      });
    },
    [override, persist],
  );

  const simulateJuntaParecer = useCallback(
    (
      payload: {
        suggestedDecision: 'aprovado' | 'negado' | 'aprovado_parcial';
        text: string;
        actor: string;
      },
      onReprocessComplete?: () => void,
    ) => {
      const ctx = override.juntaMedicaContext ?? initialRequest.juntaMedicaContext;
      if (!ctx) return;
      const audit: AuditLogEntry = {
        action: 'Parecer da Junta Médica recebido',
        actor: 'Junta Médica (mock)',
        timestamp: nowDisplay(),
        details: `Decisão sugerida: ${payload.suggestedDecision}`,
      };
      const reprocAudit: AuditLogEntry = {
        action: 'Reprocessamento da IA disparado',
        actor: 'Sistema',
        timestamp: nowDisplay(),
        details: 'Parecer da junta é evento estrutural — pipelines de IA reanalisaram o pedido',
      };
      const baseDocuments = override.documents ?? initialRequest.documents;
      const newDocs = initialRequest.documentsAddedOnDevolutiva ?? [];
      const baseAlerts = override.alerts ?? initialRequest.alerts;
      const cleanedAlerts =
        payload.suggestedDecision === 'aprovado'
          ? baseAlerts.filter((a) => a !== 'High-User')
          : baseAlerts;
      persist({
        ...override,
        status: 'Pendente',
        subStatus: 'JUNTA_PARECER_RECEBIDO',
        juntaMedicaContext: {
          ...ctx,
          status: 'parecer_recebido',
          parecer: {
            suggestedDecision: payload.suggestedDecision,
            text: payload.text,
            issuedAt: nowDisplay(),
            desempatadorName: ctx.desempatadorName ?? 'Dr. Roberto Mendes (mock)',
          },
        },
        extraAuditLog: [...(override.extraAuditLog ?? []), audit, reprocAudit],
        iaReprocessing: true,
        documents: [...baseDocuments, ...newDocs],
        alerts: cleanedAlerts,
      });
      setTimeout(() => {
        applyReprocessResult(initialRequest);
        onReprocessComplete?.();
      }, REPROCESS_DELAY_MS);
    },
    [override, persist, initialRequest],
  );

  const suspendSla = useCallback(
    (payload: { reason: SLASuspensionReason; actor: string }): boolean => {
      const existingSuspension = override.slaSuspension ?? initialRequest.slaSuspension;
      if (existingSuspension) return false;
      const audit: AuditLogEntry = {
        action: 'SLA suspenso por junta médica',
        actor: payload.actor,
        timestamp: nowDisplay(),
        details: `Motivo: ${payload.reason} — 3 dias úteis (1× por pedido, idempotente)`,
      };
      persist({
        ...override,
        slaSuspension: {
          reason: payload.reason,
          startedAt: nowDisplay(),
          durationBusinessDays: 3,
        },
        extraAuditLog: [...(override.extraAuditLog ?? []), audit],
      });
      return true;
    },
    [override, persist, initialRequest.slaSuspension],
  );

  const forceUnlock = useCallback(
    (actor: string) => {
      const audit: AuditLogEntry = {
        action: 'Lock destravado manualmente',
        actor,
        timestamp: nowDisplay(),
        details: 'Forçado por Analista Sênior',
      };
      persist({
        ...override,
        operatorLock: null,
        extraAuditLog: [...(override.extraAuditLog ?? []), audit],
      });
    },
    [override, persist],
  );

  const reset = useCallback(() => {
    persist({});
  }, [persist]);

  return {
    effectiveRequest,
    applyPendency,
    simulateProviderReturn,
    applyJuntaMedica,
    simulateJuntaParecer,
    suspendSla,
    forceUnlock,
    reset,
  };
}
