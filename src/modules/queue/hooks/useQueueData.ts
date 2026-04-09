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

export function useQueueData({ filters, pedidos }: UseQueueDataParams) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false); }, 800);
    return () => { clearTimeout(t); };
  }, []);

  const {
    tabValue,
    returnSubFilter,
    search,
    categoryFilter,
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
        if (tabValue === 1) return p.category === 'Urgência/Emergência' || p.guideType === 'Emergência';
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
      filteredByTab.filter((p) => {
        const q = search.toLowerCase().trim();
        const words = q.split(/\s+/).filter(Boolean);
        const matchSearch =
          q === '' ||
          p.id.toLowerCase().includes(q) ||
          p.beneficiary.cardNumber.includes(q) ||
          (p.procedures[0]?.description || '').toLowerCase().includes(q) ||
          words.every((w) => p.beneficiary.name.toLowerCase().includes(w));
        const matchCat = categoryFilter === 'Todas' || p.category === categoryFilter;
        const matchSla =
          slaFilter === 'Todas' ||
          (slaFilter === 'No prazo' && p.slaStatus === 'ok') ||
          (slaFilter === 'Atenção' && p.slaStatus === 'warning') ||
          (slaFilter === 'Violado' && p.slaStatus === 'violated');
        const matchPrest = providerFilter === 'Todos' || p.provider.hospital === providerFilter;
        const matchIA = iaSuggestionFilter === 'Todas' || p.iaSuggestion === iaSuggestionFilter;
        const matchAlerta = alertFilter === 'Todos' || p.alerts.includes(alertFilter);
        const matchStatus =
          statusFilter === 'Todos' ||
          (statusFilter === 'retorno_recebido' &&
            (p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' || p.subStatus === 'JUNTA_PARECER_RECEBIDO')) ||
          (statusFilter === 'aguardando' &&
            (p.subStatus === 'PENDENTE_AGUARDANDO' || p.subStatus === 'JUNTA_AGUARDANDO'));
        return matchSearch && matchCat && matchSla && matchPrest && matchIA && matchAlerta && matchStatus;
      }),
    [filteredByTab, search, categoryFilter, slaFilter, providerFilter, iaSuggestionFilter, alertFilter, statusFilter],
  );

  const pagedItems = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const urgEmergCount = useMemo(
    () => pedidos.filter((p) => p.category === 'Urgência/Emergência' || p.guideType === 'Emergência').length,
    [pedidos],
  );

  const returnsCount = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva').length,
    [pedidos],
  );

  const returnsWaiting = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_AGUARDANDO').length,
    [pedidos],
  );

  const returnsReceived = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_RETORNO_RECEBIDO').length,
    [pedidos],
  );

  const stalled12h = useMemo(
    () => pedidos.filter(isStalled12h).length,
    [pedidos],
  );

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
