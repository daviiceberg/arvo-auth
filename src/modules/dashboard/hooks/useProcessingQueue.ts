'use client';

import { useState, useMemo } from 'react';

import { pedidosEmProcessamento } from '@/data/pedidos';
import { type ProcessingRequest } from '@/types/pedido';

import useProcessingActions from './useProcessingActions';

const statusOrder: Record<string, number> = {
  erro_processamento: 0,
  em_processamento: 1,
  falhou_definitivamente: 2,
  descartado: 3,
};

function sortQueue(items: ProcessingRequest[]): ProcessingRequest[] {
  return [...items].sort((a, b) => {
    const sa = statusOrder[a.statusProcessamento] ?? 9;
    const sb = statusOrder[b.statusProcessamento] ?? 9;
    if (sa !== sb) return sa - sb;
    return b.entradaEm.getTime() - a.entradaEm.getTime();
  });
}

export default function useProcessingQueue() {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const { getOverrides } = useProcessingActions();
  const overrides = getOverrides();

  const merged = useMemo(
    () =>
      pedidosEmProcessamento.map((p) => {
        const ov = overrides.get(p.id);
        return ov ? { ...p, ...ov } : p;
      }),
    [overrides],
  );

  const sorted = useMemo(() => sortQueue(merged), [merged]);

  const pagedItems = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage],
  );

  const counts = useMemo(() => {
    const processing = merged.filter((p) => p.statusProcessamento === 'em_processamento').length;
    const error = merged.filter((p) => p.statusProcessamento === 'erro_processamento').length;
    return { processing, error };
  }, [merged]);

  return {
    page,
    setPage,
    rowsPerPage,
    pagedItems,
    sorted,
    counts,
    total: pedidosEmProcessamento.length,
  } as const;
}
