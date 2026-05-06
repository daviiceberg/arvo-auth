'use client';

import { useSyncExternalStore } from 'react';

import { type Notification } from '@/types/notificacao';

/**
 * Dynamic in-memory notification store. Holds notifications added at runtime
 * (e.g., from M1 simulation handlers). Merged with the static NOTIFICACOES
 * mock at the read site. Refresh wipes — by design, simulações não persistem.
 *
 * Uses a deduplication key (id) to prevent duplicate notifications when
 * pushDynamicNotification is called multiple times with the same notification.
 */

interface StoredNotification {
  id: string;
  notification: Notification;
  timestamp: number;
}

const store = new Map<string, StoredNotification>();
const subscribers = new Set<() => void>();
let cachedSnapshot: readonly Notification[] = [];

function createSnapshot(): readonly Notification[] {
  // Convert map to sorted array (newest first by timestamp)
  return Array.from(store.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((item) => item.notification);
}

function emit() {
  cachedSnapshot = createSnapshot();
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

function readSnapshot(): readonly Notification[] {
  return cachedSnapshot;
}

const EMPTY: readonly Notification[] = [];

export function pushDynamicNotification(n: Notification): void {
  // Prevent duplicates: if notification with same ID already exists, update its timestamp
  store.set(n.id, {
    id: n.id,
    notification: n,
    timestamp: Date.now(),
  });
  emit();
}

export function clearDynamicNotifications(): void {
  store.clear();
  emit();
}

export function useDynamicNotifications(): readonly Notification[] {
  return useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);
}
