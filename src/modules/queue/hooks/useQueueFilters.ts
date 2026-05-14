'use client';

import { useState, useCallback, useMemo } from 'react';

interface QueueFiltersParams {
  searchParams: URLSearchParams;
}

interface QueueFilterValues {
  search: string;
  slaFilter: string;
  alertFilter: string;
  providerFilter: string;
  stageFilter: string;
  statusFilter: string;
  categoryFilter: string;
  tabValue: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
}

export interface QueueFilters {
  search: string;
  slaFilter: string;
  alertFilter: string;
  providerFilter: string;
  stageFilter: string;
  statusFilter: string;
  categoryFilter: string;
  tabValue: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
  page: number;
  rowsPerPage: number;
}

export interface QueueFiltersActions {
  setSearch: (value: string) => void;
  setSlaFilter: (value: string) => void;
  setAlertFilter: (value: string) => void;
  setProviderFilter: (value: string) => void;
  setStageFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setTabValue: (value: number) => void;
  setReturnSubFilter: (value: 'all' | 'aguardando' | 'retorno') => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

const TAB_BY_NAME: Record<string, number> = {
  geral: 0,
  liminares: 1,
  nips: 2,
  violado: 3,
  risco: 4,
  devolutivas: 5,
  opme: 6,
};

function parseTabParam(raw: string | null): number {
  if (raw === null) return 0;
  const named = TAB_BY_NAME[raw.toLowerCase()];
  if (named !== undefined) return named;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildInitialFilters(searchParams: URLSearchParams): QueueFilterValues {
  return {
    search: searchParams.get('beneficiario') ?? '',
    slaFilter: searchParams.get('sla') ?? 'Todas',
    alertFilter: searchParams.get('alerta') ?? 'Todos',
    providerFilter: 'Todos',
    stageFilter: searchParams.get('stage') ?? 'Todas',
    statusFilter: searchParams.get('status') ?? 'Todos',
    categoryFilter: searchParams.get('categoria') ?? 'Todas',
    tabValue: parseTabParam(searchParams.get('tab')),
    returnSubFilter: 'all',
  };
}

export function useQueueFilters({
  searchParams,
}: QueueFiltersParams): QueueFilters & QueueFiltersActions {
  const [filters, setFilters] = useState<QueueFilterValues>(() =>
    buildInitialFilters(searchParams),
  );
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Sync state when URL params change
  const searchParamsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(searchParamsKey);
  if (searchParamsKey !== prevParamsKey) {
    setPrevParamsKey(searchParamsKey);
    setFilters(buildInitialFilters(searchParams));
    setPage(0);
  }

  const updateFilter = useCallback(
    <K extends keyof QueueFilterValues>(key: K, value: QueueFilterValues[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(0);
    },
    [],
  );

  const hasFilters = useMemo(
    () =>
      filters.search !== '' ||
      filters.slaFilter !== 'Todas' ||
      filters.alertFilter !== 'Todos' ||
      filters.providerFilter !== 'Todos' ||
      filters.stageFilter !== 'Todas' ||
      filters.statusFilter !== 'Todos' ||
      filters.categoryFilter !== 'Todas',
    [filters],
  );

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      slaFilter: 'Todas',
      providerFilter: 'Todos',
      stageFilter: 'Todas',
      categoryFilter: 'Todas',
    }));
    setPage(0);
  }, []);

  return {
    ...filters,
    page,
    rowsPerPage,

    setSearch: (value: string) => {
      updateFilter('search', value);
    },
    setSlaFilter: (value: string) => {
      updateFilter('slaFilter', value);
    },
    setAlertFilter: (value: string) => {
      updateFilter('alertFilter', value);
    },
    setProviderFilter: (value: string) => {
      updateFilter('providerFilter', value);
    },
    setStageFilter: (value: string) => {
      updateFilter('stageFilter', value);
    },
    setStatusFilter: (value: string) => {
      updateFilter('statusFilter', value);
    },
    setCategoryFilter: (value: string) => {
      updateFilter('categoryFilter', value);
    },
    setTabValue: (value: number) => {
      updateFilter('tabValue', value);
    },
    setReturnSubFilter: (value: 'all' | 'aguardando' | 'retorno') => {
      updateFilter('returnSubFilter', value);
    },
    setPage,
    clearFilters,
    hasFilters,
  };
}
