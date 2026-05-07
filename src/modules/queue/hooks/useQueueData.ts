'use client';

import { useState, useEffect, useMemo } from 'react';

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

/**
 * Critical-first sort: pedidos com SLA crítico (U/E flag ou categoria
 * Urgência/Emergência) sobem ao topo. Mantém estabilidade relativa entre
 * críticos e não-críticos.
 */
function sortCriticalFirst(a: Request, b: Request): number {
  const aCritical = a.slaCritical === true ? 1 : 0;
  const bCritical = b.slaCritical === true ? 1 : 0;
  return bCritical - aCritical;
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
    stageFilter,
    alertFilter,
    statusFilter,
    categoryFilter,
    page,
    rowsPerPage,
  } = filters;

  const filteredByTab = useMemo(() => {
    if (tabValue === 3) {
      // Devolutivas tab — independent set, includes pendência + junta médica
      return pedidos.filter(isInDevolutivasQueue);
    }
    if (tabValue === 4) {
      // Liminares Judiciais — pedidos com injunction registrada
      return pedidos.filter(hasInjunction);
    }
    if (tabValue === 5) {
      // NIPs Abertas — pedidos com NIP em status aberto
      return pedidos.filter(hasOpenNip);
    }
    return pedidos.filter(isInOperationalQueue).filter((p) => {
      if (tabValue === 1) return p.slaStatus === 'warning';
      if (tabValue === 2) return p.slaStatus === 'violated';
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
        .sort(sortCriticalFirst),
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
