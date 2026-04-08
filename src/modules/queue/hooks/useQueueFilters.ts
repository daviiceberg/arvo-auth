'use client';

import { useState, useEffect, useCallback } from 'react';

interface QueueFiltersParams {
  searchParams: URLSearchParams;
}

export interface QueueFilters {
  search: string;
  categoriaFilter: string;
  slaFilter: string;
  alertaFilter: string;
  prestadorFilter: string;
  iaFilter: string;
  statusFilter: string;
  tabValue: number;
  devolutivasSubFilter: 'all' | 'aguardando' | 'retorno';
  page: number;
  rowsPerPage: number;
}

export interface QueueFiltersActions {
  setSearch: (value: string) => void;
  setCategoriaFilter: (value: string) => void;
  setSlaFilter: (value: string) => void;
  setAlertaFilter: (value: string) => void;
  setPrestadorFilter: (value: string) => void;
  setIaFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setTabValue: (value: number) => void;
  setDevolutivasSubFilter: (value: 'all' | 'aguardando' | 'retorno') => void;
  setPage: (value: number) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

export function useQueueFilters({ searchParams }: QueueFiltersParams): QueueFilters & QueueFiltersActions {
  const initialCategoria = searchParams.get('categoria') || 'Todas';

  const [search, setSearch] = useState(searchParams.get('beneficiario') || '');
  const [categoriaFilter, setCategoriaFilter] = useState(initialCategoria);
  const [slaFilter, setSlaFilter] = useState(searchParams.get('sla') || 'Todas');
  const [alertaFilter, setAlertaFilter] = useState(searchParams.get('alerta') || 'Todos');
  const [prestadorFilter, setPrestadorFilter] = useState('Todos');
  const [iaFilter, setIaFilter] = useState(searchParams.get('ia') || 'Todas');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'Todos');
  const [tabValue, setTabValue] = useState(parseInt(searchParams.get('tab') || '0', 10));
  const [devolutivasSubFilter, setDevolutivasSubFilter] = useState<'all' | 'aguardando' | 'retorno'>('all');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Sync filters when URL params change
  useEffect(() => {
    setCategoriaFilter(searchParams.get('categoria') || 'Todas');
    setSlaFilter(searchParams.get('sla') || 'Todas');
    setAlertaFilter(searchParams.get('alerta') || 'Todos');
    setIaFilter(searchParams.get('ia') || 'Todas');
    setStatusFilter(searchParams.get('status') || 'Todos');
  }, [searchParams]);

  const hasFilters =
    search !== '' ||
    categoriaFilter !== 'Todas' ||
    slaFilter !== 'Todas' ||
    alertaFilter !== 'Todos' ||
    prestadorFilter !== 'Todos' ||
    iaFilter !== 'Todas' ||
    statusFilter !== 'Todos';

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategoriaFilter('Todas');
    setSlaFilter('Todas');
    setPrestadorFilter('Todos');
    setIaFilter('Todas');
    setPage(0);
  }, []);

  return {
    search,
    categoriaFilter,
    slaFilter,
    alertaFilter,
    prestadorFilter,
    iaFilter,
    statusFilter,
    tabValue,
    devolutivasSubFilter,
    page,
    rowsPerPage,
    setSearch,
    setCategoriaFilter,
    setSlaFilter,
    setAlertaFilter,
    setPrestadorFilter,
    setIaFilter,
    setStatusFilter,
    setTabValue,
    setDevolutivasSubFilter,
    setPage,
    clearFilters,
    hasFilters,
  };
}
