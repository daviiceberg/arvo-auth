'use client';

import { useSyncExternalStore } from 'react';

/**
 * Module-level open/close state for the global Help Drawer.
 *
 * Shared between AppShell (renders the drawer + sidebar trigger) and any
 * page-level shortcut handler (e.g. `?` on the analysis screen). Lives in
 * memory only — refresh resets to closed.
 */
let isOpen = false;
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

function getSnapshot(): boolean {
  return isOpen;
}

function getServerSnapshot(): boolean {
  return false;
}

export function openHelpDrawer(): void {
  if (isOpen) return;
  isOpen = true;
  emit();
}

export function closeHelpDrawer(): void {
  if (!isOpen) return;
  isOpen = false;
  emit();
}

export function toggleHelpDrawer(): void {
  isOpen = !isOpen;
  emit();
}

export function useHelpDrawer(): {
  open: boolean;
  open_: () => void;
  close: () => void;
  toggle: () => void;
} {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { open, open_: openHelpDrawer, close: closeHelpDrawer, toggle: toggleHelpDrawer };
}
