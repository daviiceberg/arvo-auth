'use client';

import { useState, useEffect, useMemo } from 'react';

import { type Request } from '@/types/pedido';

import { type QueueFilters } from './useQueueFilters';

interface UseQueueDataParams {
  filters: QueueFilters;
  pedidos: Request[];
}

function isStalled12h(p: Request): boolean {
  const t = parseInt(p.queueTime);
  return !isNaN(t) && t > 12;
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
  return providerFilter === 'Todos' || request.provider.hospital === providerFilter;
}

function matchesIaSuggestion(request: Request, iaSuggestionFilter: string): boolean {
  return iaSuggestionFilter === 'Todas' || request.iaSuggestion === iaSuggestionFilter;
}

function matchesAlert(request: Request, alertFilter: string): boolean {
  return alertFilter === 'Todos' || request.alerts.includes(alertFilter);
}

function matchesStatus(request: Request, statusFilter: string): boolean {
  return (
    statusFilter === 'Todos' ||
    (statusFilter === 'retorno_recebido' &&
      (request.subStatus === 'PENDENTE_RETORNO_RECEBIDO' ||
        request.subStatus === 'JUNTA_PARECER_RECEBIDO')) ||
    (statusFilter === 'aguardando' &&
      (request.subStatus === 'PENDENTE_AGUARDANDO' || request.subStatus === 'JUNTA_AGUARDANDO'))
  );
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
    returnSubFilter,
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
      pedidos.filter((p) => {
        if (tabValue === 1) return p.guideType === 'Urgente' || p.guideType === 'Emergência';
        if (tabValue === 2) {
          if (p.status !== 'Devolutiva') return false;
          if (returnSubFilter === 'aguardando') return p.subStatus === 'PENDENTE_AGUARDANDO';
          if (returnSubFilter === 'retorno') return p.subStatus === 'PENDENTE_RETORNO_RECEBIDO';
          return true;
        }
        if (tabValue === 3) return isStalled12h(p);
        return true;
      }),
    [pedidos, tabValue, returnSubFilter],
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

  const urgEmergCount = useMemo(
    () => pedidos.filter((p) => p.guideType === 'Urgente' || p.guideType === 'Emergência').length,
    [pedidos],
  );

  const returnsCount = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva').length,
    [pedidos],
  );

  const returnsWaiting = useMemo(
    () =>
      pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_AGUARDANDO')
        .length,
    [pedidos],
  );

  const returnsReceived = useMemo(
    () =>
      pedidos.filter(
        (p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_RETORNO_RECEBIDO',
      ).length,
    [pedidos],
  );

  const stalled12h = useMemo(() => pedidos.filter(isStalled12h).length, [pedidos]);

  return {
    loading,
    filteredByTab,
    filtered,
    pagedItems,
    urgEmergCount,
    returnsCount,
    returnsWaiting,
    returnsReceived,
    stalled12h,
  };
}
