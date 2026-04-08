'use client';

import { useState, useMemo } from 'react';

import { historicoEntries } from '@/data/pedidos';

import {
  type DecisaoAcao,
  type SortDirection,
  type OriginFilter,
  type ActionFilter,
  type DivergenceFilter,
} from '../types';

export default function useHistoryList() {
  // -- Filter states -------------------------------------------------------
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('Todas');
  const [actionFilter, setActionFilter] = useState<ActionFilter>('Todas');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [divergenceFilter, setDivergenceFilter] = useState<DivergenceFilter>('Todas');

  // -- Sort state ----------------------------------------------------------
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // -- Pagination ----------------------------------------------------------
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // -- Derived: available categories ---------------------------------------
  const categories = useMemo(
    () => ['Todas', ...Array.from(new Set(historicoEntries.map((e) => e.categoria)))],
    [],
  );

  // -- Derived: filtered + sorted entries ----------------------------------
  const filteredEntries = useMemo(() => {
    return historicoEntries
      .filter((e) => {
        const lowerSearch = search.toLowerCase();
        const matchSearch =
          search === '' ||
          e.id.toLowerCase().includes(lowerSearch) ||
          e.beneficiario.toLowerCase().includes(lowerSearch) ||
          e.procedimento.toLowerCase().includes(lowerSearch) ||
          e.analista.toLowerCase().includes(lowerSearch);
        const matchOrigin = originFilter === 'Todas' || e.origem === originFilter;
        const matchAction = actionFilter === 'Todas' || e.acao === actionFilter;
        const matchCategory = categoryFilter === 'Todas' || e.categoria === categoryFilter;
        const matchDivergence =
          divergenceFilter === 'Todas' || (divergenceFilter === 'divergiu' && e.divergencia);
        return matchSearch && matchOrigin && matchAction && matchCategory && matchDivergence;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dataDecisao.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.dataDecisao.split('/').reverse().join('-')).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [search, originFilter, actionFilter, categoryFilter, divergenceFilter, sortDirection]);

  // -- Derived: paged entries ----------------------------------------------
  const pagedEntries = useMemo(
    () => filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredEntries, page, rowsPerPage],
  );

  // -- Derived: filter active check ----------------------------------------
  const hasFilters =
    search !== '' ||
    originFilter !== 'Todas' ||
    actionFilter !== 'Todas' ||
    categoryFilter !== 'Todas' ||
    divergenceFilter !== 'Todas';

  // -- Actions -------------------------------------------------------------
  const clearFilters = () => {
    setSearch('');
    setOriginFilter('Todas');
    setActionFilter('Todas');
    setCategoryFilter('Todas');
    setDivergenceFilter('Todas');
  };

  const toggleSortDirection = () => {
    setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
  };

  // -- Aggregation counts --------------------------------------------------
  const totalEntries = historicoEntries.length;
  const totalIA = historicoEntries.filter((e) => e.origem === 'ia_automatica').length;
  const totalAnalyst = historicoEntries.filter((e) => e.origem === 'analista').length;
  const totalApproved = historicoEntries.filter((e) => e.acao === 'Aprovado').length;
  const totalDivergences = historicoEntries.filter((e) => e.divergencia).length;
  const approvalRate = Math.round((totalApproved / totalEntries) * 100);

  return {
    // Filter state + setters
    search,
    setSearch,
    originFilter,
    setOriginFilter,
    actionFilter,
    setActionFilter: setActionFilter as (v: 'Todas' | DecisaoAcao) => void,
    categoryFilter,
    setCategoryFilter,
    divergenceFilter,
    setDivergenceFilter,

    // Sort
    sortDirection,
    toggleSortDirection,

    // Pagination
    page,
    setPage,
    rowsPerPage,

    // Computed
    categories,
    filteredEntries,
    pagedEntries,
    hasFilters,
    clearFilters,

    // Aggregation
    totalEntries,
    totalIA,
    totalAnalyst,
    totalApproved,
    totalDivergences,
    approvalRate,
  };
}
