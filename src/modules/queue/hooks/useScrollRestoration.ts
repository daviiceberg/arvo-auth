'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useScrollRestoration() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastViewedId, setLastViewedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('fila_last_id');
  });

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('fila_scroll') : null;
    if (saved && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(saved, 10);
    }
    sessionStorage.removeItem('fila_scroll');
    sessionStorage.removeItem('fila_last_id');

    if (lastViewedId) {
      const timer = setTimeout(() => {
        setLastViewedId(null);
      }, 2500);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
