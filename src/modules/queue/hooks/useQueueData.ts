'use client';

import { useState, useEffect, useMemo } from 'react';

import { type Pedido } from '@/types/pedido';

import { type QueueFilters } from './useQueueFilters';

interface UseQueueDataParams {
  filters: QueueFilters;
  pedidos: Pedido[];
}

function isParado12h(p: Pedido): boolean {
  const t = parseInt(p.tempoFila);
  return !isNaN(t) && t > 12;
}

export function useQueueData({ filters, pedidos }: UseQueueDataParams) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const {
    tabValue,
    devolutivasSubFilter,
    search,
    categoriaFilter,
    slaFilter,
    prestadorFilter,
    iaFilter,
    alertaFilter,
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
          if (devolutivasSubFilter === 'aguardando') return p.subStatus === 'PENDENTE_AGUARDANDO';
          if (devolutivasSubFilter === 'retorno') return p.subStatus === 'PENDENTE_RETORNO_RECEBIDO';
          return true;
        }
        if (tabValue === 3) return isParado12h(p);
        return true;
      }),
    [pedidos, tabValue, devolutivasSubFilter],
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
        const matchCat = categoriaFilter === 'Todas' || p.categoria === categoriaFilter;
        const matchSla =
          slaFilter === 'Todas' ||
          (slaFilter === 'No prazo' && p.slaStatus === 'ok') ||
          (slaFilter === 'Atenção' && p.slaStatus === 'warning') ||
          (slaFilter === 'Violado' && p.slaStatus === 'violated');
        const matchPrest = prestadorFilter === 'Todos' || p.prestador.hospital === prestadorFilter;
        const matchIA = iaFilter === 'Todas' || p.iaSugestao === iaFilter;
        const matchAlerta = alertaFilter === 'Todos' || p.alertas.includes(alertaFilter);
        const matchStatus =
          statusFilter === 'Todos' ||
          (statusFilter === 'retorno_recebido' &&
            (p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' || p.subStatus === 'JUNTA_PARECER_RECEBIDO')) ||
          (statusFilter === 'aguardando' &&
            (p.subStatus === 'PENDENTE_AGUARDANDO' || p.subStatus === 'JUNTA_AGUARDANDO'));
        return matchSearch && matchCat && matchSla && matchPrest && matchIA && matchAlerta && matchStatus;
      }),
    [filteredByTab, search, categoriaFilter, slaFilter, prestadorFilter, iaFilter, alertaFilter, statusFilter],
  );

  const pagedItems = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const urgEmergCount = useMemo(
    () => pedidos.filter((p) => p.categoria === 'Urgência/Emergência' || p.tipoGuia === 'Emergência').length,
    [pedidos],
  );

  const devolutivasCount = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva').length,
    [pedidos],
  );

  const devolutivasAguardando = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_AGUARDANDO').length,
    [pedidos],
  );

  const devolutivasRetorno = useMemo(
    () => pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_RETORNO_RECEBIDO').length,
    [pedidos],
  );

  const parados12h = useMemo(
    () => pedidos.filter(isParado12h).length,
    [pedidos],
  );

  return {
    loading,
    filteredByTab,
    filtered,
    pagedItems,
    urgEmergCount,
    devolutivasCount,
    devolutivasAguardando,
    devolutivasRetorno,
    parados12h,
  };
}
