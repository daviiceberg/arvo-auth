'use client';

import { useState, useMemo } from 'react';

import { historicoEntries } from '@/data/pedidos';
import { type HistoryEntry } from '@/types/pedido';

import {
  type DecisionAction,
  type SortDirection,
  type OriginFilter,
  type ActionFilter,
  type DivergenceFilter,
  type PassedThroughFilter,
} from '../types';

function matchesSearch(entry: HistoryEntry, search: string): boolean {
  if (search === '') return true;
  const lower = search.toLowerCase();
  return (
    entry.id.toLowerCase().includes(lower) ||
    entry.beneficiary.toLowerCase().includes(lower) ||
    entry.procedure.toLowerCase().includes(lower) ||
    entry.analyst.toLowerCase().includes(lower)
  );
}

function matchesAction(entry: HistoryEntry, filter: ActionFilter): boolean {
  if (filter === 'Todas') return true;
  if (filter === 'NegadoPendenciaTimeout') {
    return entry.action === 'Negado' && entry.pendencyTimeout === true;
  }
  return entry.action === filter;
}

function matchesPassedThrough(entry: HistoryEntry, filter: PassedThroughFilter): boolean {
  if (filter === 'Todos') return true;
  if (filter === 'pendencia') return entry.passedThroughPendency === true;
  if (filter === 'junta_medica') return entry.passedThroughJunta === true;
  return entry.passedThroughPendency !== true && entry.passedThroughJunta !== true;
}

export default function useHistoryList() {
  // -- Filter states -------------------------------------------------------
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('Todas');
  const [actionFilter, setActionFilter] = useState<ActionFilter>('Todas');
  const [divergenceFilter, setDivergenceFilter] = useState<DivergenceFilter>('Todas');
  const [passedThroughFilter, setPassedThroughFilter] = useState<PassedThroughFilter>('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // -- Sort state ----------------------------------------------------------
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // -- Pagination ----------------------------------------------------------
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // -- Derived: filtered + sorted entries ----------------------------------
  const filteredEntries = useMemo(() => {
    return historicoEntries
      .filter((e) => {
        const matchOrigin = originFilter === 'Todas' || e.origin === originFilter;
        const matchDivergence = divergenceFilter === 'Todas' || e.divergence;
        const matchCategory = categoryFilter === 'Todas' || e.category === categoryFilter;
        return (
          matchesSearch(e, search) &&
          matchOrigin &&
          matchesAction(e, actionFilter) &&
          matchDivergence &&
          matchesPassedThrough(e, passedThroughFilter) &&
          matchCategory
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.decisionDate.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.decisionDate.split('/').reverse().join('-')).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [
    search,
    originFilter,
    actionFilter,
    divergenceFilter,
    passedThroughFilter,
    categoryFilter,
    sortDirection,
  ]);

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
    divergenceFilter !== 'Todas' ||
    passedThroughFilter !== 'Todos' ||
    categoryFilter !== 'Todas';

  // -- Actions -------------------------------------------------------------
  const clearFilters = () => {
    setSearch('');
    setOriginFilter('Todas');
    setActionFilter('Todas');
    setDivergenceFilter('Todas');
    setPassedThroughFilter('Todos');
    setCategoryFilter('Todas');
  };

  const toggleSortDirection = () => {
    setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
  };

  // -- Aggregation counts --------------------------------------------------
  const totalEntries = historicoEntries.length;
  const totalIA = historicoEntries.filter((e) => e.origin === 'ia_automatica').length;
  const totalAnalyst = historicoEntries.filter((e) => e.origin === 'analista').length;
  const totalDivergences = historicoEntries.filter((e) => e.divergence).length;
  const totalViaPendencia = historicoEntries.filter((e) => e.passedThroughPendency === true).length;
  const totalViaJunta = historicoEntries.filter((e) => e.passedThroughJunta === true).length;
  const juntaParecerFavoravel = historicoEntries.filter(
    (e) =>
      e.passedThroughJunta === true &&
      (e.juntaParecer?.suggestedDecision === 'aprovado' ||
        e.juntaParecer?.suggestedDecision === 'aprovado_parcial'),
  ).length;
  const juntaParecerContrario = totalViaJunta - juntaParecerFavoravel;
  const pendenciaRetornadaTempo = historicoEntries.filter(
    (e) => e.passedThroughPendency === true && e.pendencyTimeout !== true,
  ).length;
  const pendenciaNaoRetornada = totalViaPendencia - pendenciaRetornadaTempo;

  // -- Active KPI filter (mutually exclusive shortcut to dropdown filters) --
  type KpiFilter = 'all' | 'pendency' | 'junta' | 'divergence';
  let activeKpiFilter: KpiFilter;
  if (passedThroughFilter === 'pendencia') {
    activeKpiFilter = 'pendency';
  } else if (passedThroughFilter === 'junta_medica') {
    activeKpiFilter = 'junta';
  } else if (divergenceFilter === 'divergiu') {
    activeKpiFilter = 'divergence';
  } else {
    activeKpiFilter = 'all';
  }

  const setActiveKpiFilter = (next: KpiFilter) => {
    setSearch('');
    setOriginFilter('Todas');
    setActionFilter('Todas');
    setPage(0);
    if (next === 'pendency') {
      setPassedThroughFilter('pendencia');
      setDivergenceFilter('Todas');
    } else if (next === 'junta') {
      setPassedThroughFilter('junta_medica');
      setDivergenceFilter('Todas');
    } else if (next === 'divergence') {
      setPassedThroughFilter('Todos');
      setDivergenceFilter('divergiu');
    } else {
      setPassedThroughFilter('Todos');
      setDivergenceFilter('Todas');
    }
  };

  return {
    // Filter state + setters
    search,
    setSearch,
    originFilter,
    setOriginFilter,
    actionFilter,
    setActionFilter: setActionFilter as (
      v: 'Todas' | DecisionAction | 'NegadoPendenciaTimeout',
    ) => void,
    divergenceFilter,
    setDivergenceFilter,
    passedThroughFilter,
    setPassedThroughFilter,
    categoryFilter,
    setCategoryFilter,

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
    totalDivergences,
    totalViaPendencia,
    totalViaJunta,
    juntaParecerFavoravel,
    juntaParecerContrario,
    pendenciaRetornadaTempo,
    pendenciaNaoRetornada,

    // KPI filter (mutually exclusive shortcut)
    activeKpiFilter,
    setActiveKpiFilter,
  };
}
