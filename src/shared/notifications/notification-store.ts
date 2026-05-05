'use client';

import { useSyncExternalStore } from 'react';

import { type Notification } from '@/types/notificacao';

/**
 * Dynamic in-memory notification store. Holds notifications added at runtime
 * (e.g., from M1 simulation handlers). Merged with the static NOTIFICACOES
 * mock at the read site. Refresh wipes — by design, simulações não persistem.
 */
const dynamicNotifications: Notification[] = [];
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

let snapshotRef: readonly Notification[] = [];
function readSnapshot(): readonly Notification[] {
  return snapshotRef;
}

function refreshSnapshot() {
  snapshotRef = [...dynamicNotifications];
}

const EMPTY: readonly Notification[] = [];

export function pushDynamicNotification(n: Notification): void {
  dynamicNotifications.unshift(n);
  refreshSnapshot();
  emit();
}

export function clearDynamicNotifications(): void {
  dynamicNotifications.length = 0;
  refreshSnapshot();
  emit();
}

export function useDynamicNotifications(): readonly Notification[] {
  return useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);
}
