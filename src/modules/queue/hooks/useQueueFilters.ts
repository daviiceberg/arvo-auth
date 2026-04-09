'use client';

import { useState, useCallback, useMemo } from 'react';

interface QueueFiltersParams {
  searchParams: URLSearchParams;
}

interface QueueFilterValues {
  search: string;
  categoryFilter: string;
  slaFilter: string;
  alertFilter: string;
  providerFilter: string;
  iaSuggestionFilter: string;
  statusFilter: string;
  tabValue: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
}

export interface QueueFilters {
  search: string;
  categoryFilter: string;
  slaFilter: string;
  alertFilter: string;
  providerFilter: string;
  iaSuggestionFilter: string;
  statusFilter: string;
  tabValue: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
  page: number;
  rowsPerPage: number;
}

export interface QueueFiltersActions {
  setSearch: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setSlaFilter: (value: string) => void;
  setAlertFilter: (value: string) => void;
  setProviderFilter: (value: string) => void;
  setIaSuggestionFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setTabValue: (value: number) => void;
  setReturnSubFilter: (value: 'all' | 'aguardando' | 'retorno') => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

const FILTER_DEFAULTS: Omit<
  QueueFilterValues,
  | 'search'
  | 'categoryFilter'
  | 'slaFilter'
  | 'alertFilter'
  | 'iaSuggestionFilter'
  | 'statusFilter'
  | 'tabValue'
> = {
  providerFilter: 'Todos',
  returnSubFilter: 'all',
};

function buildInitialFilters(searchParams: URLSearchParams): QueueFilterValues {
  return {
    search: searchParams.get('beneficiario') ?? '',
    categoryFilter: searchParams.get('categoria') ?? 'Todas',
    slaFilter: searchParams.get('sla') ?? 'Todas',
    alertFilter: searchParams.get('alerta') ?? 'Todos',
    providerFilter: FILTER_DEFAULTS.providerFilter,
    iaSuggestionFilter: searchParams.get('ia') ?? 'Todas',
    statusFilter: searchParams.get('status') ?? 'Todos',
    tabValue: Number(searchParams.get('tab')) || 0,
    returnSubFilter: FILTER_DEFAULTS.returnSubFilter,
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

  // Sync state when URL params change (e.g. sidebar navigation to /fila?categoria=X)
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
      filters.categoryFilter !== 'Todas' ||
      filters.slaFilter !== 'Todas' ||
      filters.alertFilter !== 'Todos' ||
      filters.providerFilter !== 'Todos' ||
      filters.iaSuggestionFilter !== 'Todas' ||
      filters.statusFilter !== 'Todos',
    [filters],
  );

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      categoryFilter: 'Todas',
      slaFilter: 'Todas',
      providerFilter: 'Todos',
      iaSuggestionFilter: 'Todas',
    }));
    setPage(0);
  }, []);

  return {
    ...filters,
    page,
    rowsPerPage,

    // Setters (same API as before)
    setSearch: (value: string) => {
      updateFilter('search', value);
    },
    setCategoryFilter: (value: string) => {
      updateFilter('categoryFilter', value);
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
    setIaSuggestionFilter: (value: string) => {
      updateFilter('iaSuggestionFilter', value);
    },
    setStatusFilter: (value: string) => {
      updateFilter('statusFilter', value);
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
