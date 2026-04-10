'use client';

import { useEffect } from 'react';

interface UseKeyboardNavigationParams {
  isAnyDialogOpen: boolean;
  isDrawerOpen: boolean;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onApprove: () => void;
  onDeny: () => void;
  onPendency: () => void;
  onShowShortcuts: () => void;
}

function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || (el as HTMLElement).isContentEditable;
}

export function useKeyboardNavigation({
  isAnyDialogOpen,
  isDrawerOpen,
  canNavigatePrev,
  canNavigateNext,
  onNavigatePrev,
  onNavigateNext,
  onApprove,
  onDeny,
  onPendency,
  onShowShortcuts,
}: UseKeyboardNavigationParams) {
  useEffect(() => {
    const anyOpen = isAnyDialogOpen || isDrawerOpen;
    const handler = (e: KeyboardEvent) => {
      if (isEditableElement(document.activeElement)) return;

      if (e.key === '?') {
        onShowShortcuts();
        return;
      }

      if (anyOpen) return;

      const keyActions: Record<string, (() => void) | undefined> = {
        ArrowRight: canNavigateNext ? onNavigateNext : undefined,
        j: canNavigateNext ? onNavigateNext : undefined,
        J: canNavigateNext ? onNavigateNext : undefined,
        ArrowLeft: canNavigatePrev ? onNavigatePrev : undefined,
        k: canNavigatePrev ? onNavigatePrev : undefined,
        K: canNavigatePrev ? onNavigatePrev : undefined,
        a: onApprove,
        A: onApprove,
        n: onDeny,
        N: onDeny,
        p: onPendency,
        P: onPendency,
      };

      const action = keyActions[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [
    isAnyDialogOpen,
    isDrawerOpen,
    canNavigatePrev,
    canNavigateNext,
    onNavigatePrev,
    onNavigateNext,
    onApprove,
    onDeny,
    onPendency,
    onShowShortcuts,
  ]);
}
