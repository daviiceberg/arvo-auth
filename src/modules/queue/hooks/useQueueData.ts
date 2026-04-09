'use client';

import { useState, useEffect, useMemo } from 'react';

import { type Pedido } from '@/types/pedido';

import { type QueueFilters } from './useQueueFilters';

interface UseQueueDataParams {
  filters: QueueFilters;
  pedidos: Pedido[];
}

function isStalled12h(p: Pedido): boolean {
  const t = parseInt(p.tempoFila);
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
        if (tabValue === 1) return p.categoria === 'Urgência/Emergência' || p.tipoGuia === 'Emergência';
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
          p.beneficiario.carteirinha.includes(q) ||
          (p.procedimentos[0]?.descricao || '').toLowerCase().includes(q) ||
          words.every((w) => p.beneficiario.nome.toLowerCase().includes(w));
        const matchCat = categoryFilter === 'Todas' || p.categoria === categoryFilter;
        const matchSla =
          slaFilter === 'Todas' ||
          (slaFilter === 'No prazo' && p.slaStatus === 'ok') ||
          (slaFilter === 'Atenção' && p.slaStatus === 'warning') ||
          (slaFilter === 'Violado' && p.slaStatus === 'violated');
        const matchPrest = providerFilter === 'Todos' || p.prestador.hospital === providerFilter;
        const matchIA = iaSuggestionFilter === 'Todas' || p.iaSugestao === iaSuggestionFilter;
        const matchAlerta = alertFilter === 'Todos' || p.alertas.includes(alertFilter);
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
    () => pedidos.filter((p) => p.categoria === 'Urgência/Emergência' || p.tipoGuia === 'Emergência').length,
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
