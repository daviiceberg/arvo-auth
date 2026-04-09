'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { pedidos } from '@/data/pedidos';

import { useQueueData } from '../hooks/useQueueData';
import { useQueueFilters } from '../hooks/useQueueFilters';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

import QueueFilterBar from './QueueFilterBar';
import QueueMetricsRow from './QueueMetricsRow';
import QueuePagination from './QueuePagination';
import QueueTabBar from './QueueTabBar';
import QueueTable from './QueueTable';

export default function QueuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useQueueFilters({ searchParams });
  const {
    loading,
    filtered,
    pagedItems,
    urgEmergCount,
    returnsCount,
    returnsWaiting,
    returnsReceived,
    stalled12h,
  } = useQueueData({ filters, pedidos });
  const { scrollContainerRef, lastViewedId, saveScrollPosition } = useScrollRestoration();

  const handleRowClick = (requestId: string) => {
    saveScrollPosition(requestId);
    router.push(`/analise?id=${requestId}`);
  };

  const handleTabChange = (value: number) => {
    filters.setTabValue(value);
    filters.setPage(0);
  };

  const handleReturnSubFilterChange = (value: 'all' | 'aguardando' | 'retorno') => {
    filters.setReturnSubFilter(value);
    filters.setPage(0);
  };

  const handleSearchChange = (value: string) => {
    filters.setSearch(value);
    filters.setPage(0);
  };

  const handleCategoryFilterChange = (value: string) => {
    filters.setCategoryFilter(value);
    filters.setPage(0);
  };

  const handleSlaFilterChange = (value: string) => {
    filters.setSlaFilter(value);
    filters.setPage(0);
  };

  const handleProviderFilterChange = (value: string) => {
    filters.setProviderFilter(value);
    filters.setPage(0);
  };

  const handleIaSuggestionFilterChange = (value: string) => {
    filters.setIaSuggestionFilter(value);
    filters.setPage(0);
  };

  return (
    <Box ref={scrollContainerRef} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {filters.categoryFilter === 'Todas' ? 'Fila Operacional' : filters.categoryFilter}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { router.push('/nova-solicitacao'); }}
          sx={{ mt: 0.5, minHeight: 44 }}
          aria-label="Nova solicitação"
        >
          Nova Solicitação
        </Button>
      </Box>

      {/* Metric Cards Row — only on general queue */}
      {filters.categoryFilter === 'Todas' && (
        <QueueMetricsRow
          totalCount={pedidos.length}
          urgEmergCount={urgEmergCount}
          returnsCount={returnsCount}
          stalled12h={stalled12h}
          loading={loading}
          onTabChange={handleTabChange}
        />
      )}

      {/* Table Card */}
      <Card>
        {/* Tabs */}
        <QueueTabBar
          tabValue={filters.tabValue}
          totalCount={pedidos.length}
          urgEmergCount={urgEmergCount}
          returnsCount={returnsCount}
          returnsWaiting={returnsWaiting}
          returnsReceived={returnsReceived}
          stalled12h={stalled12h}
          returnSubFilter={filters.returnSubFilter}
          onTabChange={handleTabChange}
          onReturnSubFilterChange={handleReturnSubFilterChange}
        />

        {/* Filter bar */}
        <QueueFilterBar
          search={filters.search}
          categoryFilter={filters.categoryFilter}
          slaFilter={filters.slaFilter}
          providerFilter={filters.providerFilter}
          iaSuggestionFilter={filters.iaSuggestionFilter}
          hasFilters={filters.hasFilters}
          onSearchChange={handleSearchChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onSlaFilterChange={handleSlaFilterChange}
          onProviderFilterChange={handleProviderFilterChange}
          onIaSuggestionFilterChange={handleIaSuggestionFilterChange}
          onClearFilters={filters.clearFilters}
        />

        {/* Table */}
        <QueueTable
          items={pagedItems}
          categoryFilter={filters.categoryFilter}
          loading={loading}
          lastViewedId={lastViewedId}
          hasFilters={filters.hasFilters}
          onRowClick={handleRowClick}
          onClearFilters={filters.clearFilters}
        />

        {/* Pagination */}
        <QueuePagination
          filteredCount={filtered.length}
          page={filters.page}
          rowsPerPage={filters.rowsPerPage}
          onPageChange={filters.setPage}
        />
      </Card>
    </Box>
  );
}
