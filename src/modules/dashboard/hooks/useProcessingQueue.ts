'use client';

import { useState, useMemo } from 'react';

import { pedidosEmProcessamento } from '@/data/pedidos';
import { type ProcessingRequest } from '@/types/pedido';

const statusOrder: Record<string, number> = {
  em_processamento: 0,
  aguardando_processamento: 1,
  erro_processamento: 2,
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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sorted = useMemo(() => sortQueue(pedidosEmProcessamento), []);

  const pagedItems = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage],
  );

  const counts = useMemo(() => {
    const processing = pedidosEmProcessamento.filter(
      (p) => p.statusProcessamento === 'em_processamento',
    ).length;
    const waiting = pedidosEmProcessamento.filter(
      (p) => p.statusProcessamento === 'aguardando_processamento',
    ).length;
    const error = pedidosEmProcessamento.filter(
      (p) => p.statusProcessamento === 'erro_processamento',
    ).length;
    return { processing, waiting, error };
  }, []);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    pagedItems,
    sorted,
    counts,
    total: pedidosEmProcessamento.length,
    handlePageChange,
    handleRowsPerPageChange,
  } as const;
}
