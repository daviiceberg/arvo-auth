'use client';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';

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
    devolutivasCount,
    devolutivasAguardando,
    devolutivasRetorno,
    parados12h,
  } = useQueueData({ filters, pedidos });
  const { scrollContainerRef, lastViewedId, saveScrollPosition } = useScrollRestoration();

  const handleRowClick = (pedidoId: string) => {
    saveScrollPosition(pedidoId);
    router.push(`/analise?id=${pedidoId}`);
  };

  const handleTabChange = (value: number) => {
    filters.setTabValue(value);
    filters.setPage(0);
  };

  const handleDevolutivasSubFilterChange = (value: 'all' | 'aguardando' | 'retorno') => {
    filters.setDevolutivasSubFilter(value);
    filters.setPage(0);
  };

  const handleSearchChange = (value: string) => {
    filters.setSearch(value);
    filters.setPage(0);
  };

  const handleCategoriaFilterChange = (value: string) => {
    filters.setCategoriaFilter(value);
    filters.setPage(0);
  };

  const handleSlaFilterChange = (value: string) => {
    filters.setSlaFilter(value);
    filters.setPage(0);
  };

  const handlePrestadorFilterChange = (value: string) => {
    filters.setPrestadorFilter(value);
    filters.setPage(0);
  };

  const handleIaFilterChange = (value: string) => {
    filters.setIaFilter(value);
    filters.setPage(0);
  };

  return (
    <Box ref={scrollContainerRef} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {filters.categoriaFilter === 'Todas' ? 'Fila Operacional' : filters.categoriaFilter}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/nova-solicitacao')}
          sx={{ mt: 0.5, minHeight: 44 }}
          aria-label="Nova solicitação"
        >
          Nova Solicitação
        </Button>
      </Box>

      {/* Metric Cards Row — only on general queue */}
      {filters.categoriaFilter === 'Todas' && (
        <QueueMetricsRow
          totalCount={pedidos.length}
          urgEmergCount={urgEmergCount}
          devolutivasCount={devolutivasCount}
          parados12h={parados12h}
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
          devolutivasCount={devolutivasCount}
          devolutivasAguardando={devolutivasAguardando}
          devolutivasRetorno={devolutivasRetorno}
          parados12h={parados12h}
          devolutivasSubFilter={filters.devolutivasSubFilter}
          onTabChange={handleTabChange}
          onDevolutivasSubFilterChange={handleDevolutivasSubFilterChange}
        />

        {/* Filter bar */}
        <QueueFilterBar
          search={filters.search}
          categoriaFilter={filters.categoriaFilter}
          slaFilter={filters.slaFilter}
          prestadorFilter={filters.prestadorFilter}
          iaFilter={filters.iaFilter}
          hasFilters={filters.hasFilters}
          onSearchChange={handleSearchChange}
          onCategoriaFilterChange={handleCategoriaFilterChange}
          onSlaFilterChange={handleSlaFilterChange}
          onPrestadorFilterChange={handlePrestadorFilterChange}
          onIaFilterChange={handleIaFilterChange}
          onClearFilters={filters.clearFilters}
        />

        {/* Table */}
        <QueueTable
          items={pagedItems}
          categoriaFilter={filters.categoriaFilter}
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
