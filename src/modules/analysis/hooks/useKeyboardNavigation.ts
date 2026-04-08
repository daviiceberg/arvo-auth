'use client'

import { useEffect } from 'react'

interface UseKeyboardNavigationParams {
  isAnyDialogOpen: boolean
  isDrawerOpen: boolean
  canNavigatePrev: boolean
  canNavigateNext: boolean
  onNavigatePrev: () => void
  onNavigateNext: () => void
  onApprove: () => void
  onDeny: () => void
  onPendency: () => void
  onShowShortcuts: () => void
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
    const anyOpen = isAnyDialogOpen || isDrawerOpen
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (document.activeElement as HTMLElement | null)?.isContentEditable) return
      if (e.key === '?') {
        onShowShortcuts()
        return
      }
      if (anyOpen) return
      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        if (canNavigateNext) onNavigateNext()
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        if (canNavigatePrev) onNavigatePrev()
        return
      }
      if (e.key === 'a' || e.key === 'A') {
        onApprove()
        return
      }
      if (e.key === 'n' || e.key === 'N') {
        onDeny()
        return
      }
      if (e.key === 'p' || e.key === 'P') {
        onPendency()
        return
      }
    }
    window.addEventListener('keydown', handler)
    return () => { window.removeEventListener('keydown', handler); }
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
  ])
}
