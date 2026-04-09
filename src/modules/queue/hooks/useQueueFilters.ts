'use client';

import { useState, useEffect, useCallback } from 'react';

interface QueueFiltersParams {
  searchParams: URLSearchParams;
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

export function useQueueFilters({ searchParams }: QueueFiltersParams): QueueFilters & QueueFiltersActions {
  const initialCategory = searchParams.get('categoria') ?? 'Todas';

  const [search, setSearch] = useState(searchParams.get('beneficiario') ?? '');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [slaFilter, setSlaFilter] = useState(searchParams.get('sla') ?? 'Todas');
  const [alertFilter, setAlertFilter] = useState(searchParams.get('alerta') ?? 'Todos');
  const [providerFilter, setProviderFilter] = useState('Todos');
  const [iaSuggestionFilter, setIaSuggestionFilter] = useState(searchParams.get('ia') ?? 'Todas');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'Todos');
  const [tabValue, setTabValue] = useState(parseInt(searchParams.get('tab') ?? '0', 10));
  const [returnSubFilter, setReturnSubFilter] = useState<'all' | 'aguardando' | 'retorno'>('all');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Sync filters when URL params change
  useEffect(() => {
    setCategoryFilter(searchParams.get('categoria') ?? 'Todas');
    setSlaFilter(searchParams.get('sla') ?? 'Todas');
    setAlertFilter(searchParams.get('alerta') ?? 'Todos');
    setIaSuggestionFilter(searchParams.get('ia') ?? 'Todas');
    setStatusFilter(searchParams.get('status') ?? 'Todos');
  }, [searchParams]);

  const hasFilters =
    search !== '' ||
    categoryFilter !== 'Todas' ||
    slaFilter !== 'Todas' ||
    alertFilter !== 'Todos' ||
    providerFilter !== 'Todos' ||
    iaSuggestionFilter !== 'Todas' ||
    statusFilter !== 'Todos';

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategoryFilter('Todas');
    setSlaFilter('Todas');
    setProviderFilter('Todos');
    setIaSuggestionFilter('Todas');
    setPage(0);
  }, []);

  return {
    search,
    categoryFilter,
    slaFilter,
    alertFilter,
    providerFilter,
    iaSuggestionFilter,
    statusFilter,
    tabValue,
    returnSubFilter,
    page,
    rowsPerPage,
    setSearch,
    setCategoryFilter,
    setSlaFilter,
    setAlertFilter,
    setProviderFilter,
    setIaSuggestionFilter,
    setStatusFilter,
    setTabValue,
    setReturnSubFilter,
    setPage,
    clearFilters,
    hasFilters,
  };
}
