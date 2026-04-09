'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollRestoration() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastViewedId, setLastViewedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('fila_scroll') : null;
    const savedId = typeof window !== 'undefined' ? sessionStorage.getItem('fila_last_id') : null;
    if (saved && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(saved, 10);
    }
    if (savedId) {
      setLastViewedId(savedId);
      setTimeout(() => { setLastViewedId(null); }, 2500);
    }
    sessionStorage.removeItem('fila_scroll');
    sessionStorage.removeItem('fila_last_id');
  }, []);

  const saveScrollPosition = useCallback((requestId: string) => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem('fila_scroll', String(scrollContainerRef.current.scrollTop));
    }
    sessionStorage.setItem('fila_last_id', requestId);
  }, []);

  return {
    scrollContainerRef,
    lastViewedId,
    saveScrollPosition,
  };
}
