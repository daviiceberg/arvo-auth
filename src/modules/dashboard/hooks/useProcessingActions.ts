'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { pedidosEmProcessamento } from '@/data/pedidos';
import { pushDynamicNotification } from '@/shared/notifications/notification-store';
import { type ProcessingRequest } from '@/types/pedido';

/* ─────────────────────────────────────────────────────────────────────────
 * Module-level in-memory store. Refresh wipes — same pattern as
 * `useM1RequestState`. Holds Partial<ProcessingRequest> patches keyed by id.
 * Consumed by `useProcessingQueue` to merge over the static seed.
 * ───────────────────────────────────────────────────────────────────────── */
const memoryStore = new Map<string, Partial<ProcessingRequest>>();
const subscribers = new Set<() => void>();
let cachedSnapshot: ReadonlyMap<string, Partial<ProcessingRequest>> = new Map();

function rebuildSnapshot() {
  cachedSnapshot = new Map(memoryStore);
}

function emit() {
  rebuildSnapshot();
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

function getSnapshot(): ReadonlyMap<string, Partial<ProcessingRequest>> {
  return cachedSnapshot;
}

function getServerSnapshot(): ReadonlyMap<string, Partial<ProcessingRequest>> {
  return cachedSnapshot;
}

function readRetryCount(id: string): number {
  const override = memoryStore.get(id);
  if (override?.retryCount !== undefined) return override.retryCount;
  const seed = pedidosEmProcessamento.find((p) => p.id === id);
  return seed?.retryCount ?? 0;
}

function applyPatch(id: string, patch: Partial<ProcessingRequest>) {
  const current = memoryStore.get(id) ?? {};
  memoryStore.set(id, { ...current, ...patch });
  emit();
}

export default function useProcessingActions() {
  const overrides = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const retry = useCallback((id: string) => {
    const next = readRetryCount(id) + 1;
    if (next >= 3) {
      applyPatch(id, { retryCount: 3, statusProcessamento: 'falhou_definitivamente' });
      pushDynamicNotification({
        id: `notif-proc-falhou-${id}-${String(Date.now())}`,
        type: 'processamento_falhou_definitivamente',
        title: 'Falha persistente no processamento',
        message: `Pedido ${id} falhou ao processar após várias tentativas — revisar manualmente.`,
        time: 'agora',
        read: false,
        href: '/dashboard',
      });
      return;
    }
    applyPatch(id, { retryCount: next });
  }, []);

  const discard = useCallback((id: string) => {
    applyPatch(id, { statusProcessamento: 'descartado' });
  }, []);

  const getOverrides = useCallback(() => overrides, [overrides]);

  return { retry, discard, getOverrides };
}
