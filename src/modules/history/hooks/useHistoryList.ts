'use client';

import { useState, useMemo } from 'react';

import { historicoEntries } from '@/data/pedidos';

import {
  type DecisionAction,
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
  const [divergenceFilter, setDivergenceFilter] = useState<DivergenceFilter>('Todas');

  // -- Sort state ----------------------------------------------------------
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // -- Pagination ----------------------------------------------------------
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // -- Derived: filtered + sorted entries ----------------------------------
  const filteredEntries = useMemo(() => {
    return historicoEntries
      .filter((e) => {
        const lowerSearch = search.toLowerCase();
        const matchSearch =
          search === '' ||
          e.id.toLowerCase().includes(lowerSearch) ||
          e.beneficiary.toLowerCase().includes(lowerSearch) ||
          e.procedure.toLowerCase().includes(lowerSearch) ||
          e.analyst.toLowerCase().includes(lowerSearch);
        const matchOrigin = originFilter === 'Todas' || e.origin === originFilter;
        const matchAction = actionFilter === 'Todas' || e.action === actionFilter;
        const matchDivergence = divergenceFilter === 'Todas' || e.divergence;
        return matchSearch && matchOrigin && matchAction && matchDivergence;
      })
      .sort((a, b) => {
        const dateA = new Date(a.decisionDate.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.decisionDate.split('/').reverse().join('-')).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [search, originFilter, actionFilter, divergenceFilter, sortDirection]);

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
    divergenceFilter !== 'Todas';

  // -- Actions -------------------------------------------------------------
  const clearFilters = () => {
    setSearch('');
    setOriginFilter('Todas');
    setActionFilter('Todas');
    setDivergenceFilter('Todas');
  };

  const toggleSortDirection = () => {
    setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
  };

  // -- Aggregation counts --------------------------------------------------
  const totalEntries = historicoEntries.length;
  const totalIA = historicoEntries.filter((e) => e.origin === 'ia_automatica').length;
  const totalAnalyst = historicoEntries.filter((e) => e.origin === 'analista').length;
  const totalApproved = historicoEntries.filter((e) => e.action === 'Aprovado').length;
  const totalDivergences = historicoEntries.filter((e) => e.divergence).length;
  const approvalRate = totalEntries > 0 ? Math.round((totalApproved / totalEntries) * 100) : 0;

  return {
    // Filter state + setters
    search,
    setSearch,
    originFilter,
    setOriginFilter,
    actionFilter,
    setActionFilter: setActionFilter as (v: 'Todas' | DecisionAction) => void,
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
