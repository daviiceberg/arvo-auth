'use client';

import { useState, useEffect, useMemo } from 'react';

import { type Request } from '@/types/pedido';

import { type QueueFilters } from './useQueueFilters';

interface UseQueueDataParams {
  filters: QueueFilters;
  pedidos: Request[];
}

function matchesSearch(request: Request, search: string): boolean {
  const q = search.toLowerCase().trim();
  if (q === '') return true;
  const words = q.split(/\s+/).filter(Boolean);
  return (
    request.id.toLowerCase().includes(q) ||
    request.beneficiary.cardNumber.includes(q) ||
    (request.procedures[0]?.description ?? '').toLowerCase().includes(q) ||
    words.every((w) => request.beneficiary.name.toLowerCase().includes(w))
  );
}

function matchesSla(request: Request, slaFilter: string): boolean {
  return (
    slaFilter === 'Todas' ||
    (slaFilter === 'No prazo' && request.slaStatus === 'ok') ||
    (slaFilter === 'Atenção' && request.slaStatus === 'warning') ||
    (slaFilter === 'Violado' && request.slaStatus === 'violated')
  );
}

function matchesProvider(request: Request, providerFilter: string): boolean {
  return providerFilter === 'Todos' || request.executingProvider.name === providerFilter;
}

function matchesIaSuggestion(request: Request, iaSuggestionFilter: string): boolean {
  return iaSuggestionFilter === 'Todas' || request.iaSuggestion === iaSuggestionFilter;
}

function matchesAlert(request: Request, alertFilter: string): boolean {
  return alertFilter === 'Todos' || request.alerts.includes(alertFilter);
}

function matchesStatus(request: Request, statusFilter: string): boolean {
  return statusFilter === 'Todos' || request.status === statusFilter;
}

export function useQueueData({ filters, pedidos }: UseQueueDataParams) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => {
      clearTimeout(t);
    };
  }, []);

  const {
    tabValue,
    search,
    slaFilter,
    providerFilter,
    iaSuggestionFilter,
    alertFilter,
    statusFilter,
    page,
    rowsPerPage,
  } = filters;

  const filteredByTab = useMemo(
    () =>
      pedidos
        .filter((p) => p.status === 'Em Análise')
        .filter((p) => {
          if (tabValue === 1) return p.slaStatus === 'warning';
          if (tabValue === 2) return p.slaStatus === 'violated';
          return true;
        }),
    [pedidos, tabValue],
  );

  const filtered = useMemo(
    () =>
      filteredByTab.filter(
        (p) =>
          matchesSearch(p, search) &&
          matchesSla(p, slaFilter) &&
          matchesProvider(p, providerFilter) &&
          matchesIaSuggestion(p, iaSuggestionFilter) &&
          matchesAlert(p, alertFilter) &&
          matchesStatus(p, statusFilter),
      ),
    [
      filteredByTab,
      search,
      slaFilter,
      providerFilter,
      iaSuggestionFilter,
      alertFilter,
      statusFilter,
    ],
  );

  const pagedItems = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const warningCount = useMemo(
    () => pedidos.filter((p) => p.slaStatus === 'warning').length,
    [pedidos],
  );

  const violatedCount = useMemo(
    () => pedidos.filter((p) => p.slaStatus === 'violated').length,
    [pedidos],
  );

  return {
    loading,
    filteredByTab,
    filtered,
    pagedItems,
    warningCount,
    violatedCount,
  };
}
