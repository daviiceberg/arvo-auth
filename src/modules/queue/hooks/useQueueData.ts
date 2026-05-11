'use client';

import { useState, useEffect, useMemo } from 'react';

import { sortByPriority } from '@/shared/utils/priority-tier';
import { type Request } from '@/types/pedido';

import { getRequestStage } from '../utils/request-stage';

import { type QueueFilters } from './useQueueFilters';

interface UseQueueDataParams {
  filters: QueueFilters;
  pedidos: Request[];
}

function isInOperationalQueue(request: Request): boolean {
  if (request.routing?.outcome === 'queued_for_human_review') {
    return true;
  }

  // Backward compatibility while mock/API payloads are migrated.
  return request.status === 'Em Análise';
}

function isInDevolutivasQueue(request: Request): boolean {
  return (
    request.subStatus === 'PENDENTE_AGUARDANDO' ||
    request.subStatus === 'PENDENTE_RETORNO_RECEBIDO' ||
    request.subStatus === 'JUNTA_AGUARDANDO' ||
    request.subStatus === 'JUNTA_PARECER_RECEBIDO'
  );
}

function hasInjunction(request: Request): boolean {
  return request.injunction !== undefined;
}

function hasOpenNip(request: Request): boolean {
  return request.nip?.status === 'aberta';
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

function matchesStage(request: Request, stageFilter: string): boolean {
  return stageFilter === 'Todas' || getRequestStage(request) === stageFilter;
}

function matchesAlert(request: Request, alertFilter: string): boolean {
  return alertFilter === 'Todos' || request.alerts.includes(alertFilter);
}

function matchesStatus(request: Request, statusFilter: string): boolean {
  return statusFilter === 'Todos' || request.status === statusFilter;
}

function matchesCategory(request: Request, categoryFilter: string): boolean {
  return categoryFilter === 'Todas' || request.category === categoryFilter;
}

// Hierarquia de prioridade extraída para `@/shared/utils/priority-tier` —
// reutilizada no Dashboard (RecentRequestsTable).

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
    stageFilter,
    alertFilter,
    statusFilter,
    categoryFilter,
    page,
    rowsPerPage,
  } = filters;

  const filteredByTab = useMemo(() => {
    // Tabs alinhadas à hierarquia de prioridade da fila operacional:
    //   0 — Fila Geral
    //   1 — Liminares Judiciais
    //   2 — NIPs Abertas
    //   3 — SLA Violado
    //   4 — SLA em Risco
    //   5 — Devolutivas (Pendência + Junta Médica)
    if (tabValue === 1) {
      return pedidos.filter(hasInjunction);
    }
    if (tabValue === 2) {
      return pedidos.filter(hasOpenNip);
    }
    if (tabValue === 5) {
      return pedidos.filter(isInDevolutivasQueue);
    }
    return pedidos.filter(isInOperationalQueue).filter((p) => {
      if (tabValue === 3) return p.slaStatus === 'violated';
      if (tabValue === 4) return p.slaStatus === 'warning';
      return true;
    });
  }, [pedidos, tabValue]);

  const filtered = useMemo(
    () =>
      filteredByTab
        .filter(
          (p) =>
            matchesSearch(p, search) &&
            matchesSla(p, slaFilter) &&
            matchesProvider(p, providerFilter) &&
            matchesStage(p, stageFilter) &&
            matchesAlert(p, alertFilter) &&
            matchesStatus(p, statusFilter) &&
            matchesCategory(p, categoryFilter),
        )
        .sort(sortByPriority),
    [
      filteredByTab,
      search,
      slaFilter,
      providerFilter,
      stageFilter,
      alertFilter,
      statusFilter,
      categoryFilter,
    ],
  );

  const pagedItems = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const warningCount = useMemo(
    () => pedidos.filter(isInOperationalQueue).filter((p) => p.slaStatus === 'warning').length,
    [pedidos],
  );

  const violatedCount = useMemo(
    () => pedidos.filter(isInOperationalQueue).filter((p) => p.slaStatus === 'violated').length,
    [pedidos],
  );

  const devolutivasCount = useMemo(() => pedidos.filter(isInDevolutivasQueue).length, [pedidos]);

  const liminaresCount = useMemo(() => pedidos.filter(hasInjunction).length, [pedidos]);

  const nipsCount = useMemo(() => pedidos.filter(hasOpenNip).length, [pedidos]);

  return {
    loading,
    filteredByTab,
    filtered,
    pagedItems,
    warningCount,
    violatedCount,
    devolutivasCount,
    liminaresCount,
    nipsCount,
  };
}
