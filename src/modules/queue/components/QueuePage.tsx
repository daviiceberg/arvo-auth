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
    warningCount,
    violatedCount,
    devolutivasCount,
    liminaresCount,
    nipsCount,
    opmeCount,
  } = useQueueData({
    filters,
    pedidos,
  });
  const { scrollContainerRef, lastViewedId, saveScrollPosition } = useScrollRestoration();

  const handleRowClick = (requestId: string) => {
    saveScrollPosition(requestId);
    router.push(`/analise?id=${requestId}`);
  };

  const handleTabChange = (value: number) => {
    filters.setTabValue(value);
    filters.setPage(0);
  };

  const handleSearchChange = (value: string) => {
    filters.setSearch(value);
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

  const handleStageFilterChange = (value: string) => {
    filters.setStageFilter(value);
    filters.setPage(0);
  };

  const handleCategoryFilterChange = (value: string) => {
    filters.setCategoryFilter(value);
    filters.setPage(0);
  };

  return (
    <Box ref={scrollContainerRef} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}
      >
        <Typography variant="h4" fontWeight={700}>
          Fila Operacional
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            router.push('/nova-solicitacao');
          }}
          sx={{ mt: 0.5, minHeight: 44 }}
          aria-label="Nova solicitação"
        >
          Nova Solicitação
        </Button>
      </Box>

      {/* Table Card */}
      <Card>
        {/* Tabs */}
        <QueueTabBar
          tabValue={filters.tabValue}
          totalCount={pedidos.length}
          warningCount={warningCount}
          violatedCount={violatedCount}
          devolutivasCount={devolutivasCount}
          liminaresCount={liminaresCount}
          nipsCount={nipsCount}
          opmeCount={opmeCount}
          onTabChange={handleTabChange}
        />

        {/* Filter bar */}
        <QueueFilterBar
          search={filters.search}
          slaFilter={filters.slaFilter}
          providerFilter={filters.providerFilter}
          stageFilter={filters.stageFilter}
          categoryFilter={filters.categoryFilter}
          hasFilters={filters.hasFilters}
          onSearchChange={handleSearchChange}
          onSlaFilterChange={handleSlaFilterChange}
          onProviderFilterChange={handleProviderFilterChange}
          onStageFilterChange={handleStageFilterChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onClearFilters={filters.clearFilters}
        />

        {/* Table */}
        <QueueTable
          items={pagedItems}
          loading={loading}
          lastViewedId={lastViewedId}
          hasFilters={filters.hasFilters}
          activeCategory={filters.categoryFilter}
          onRowClick={handleRowClick}
          onClearFilters={filters.clearFilters}
          subGroups={
            filters.tabValue === 5
              ? [
                  {
                    label: 'Aguardando retorno do prestador',
                    items: pagedItems.filter(
                      (p) =>
                        p.subStatus === 'PENDENTE_AGUARDANDO' ||
                        p.subStatus === 'PENDENTE_RETORNO_RECEBIDO',
                    ),
                  },
                  {
                    label: 'Aguardando junta médica',
                    items: pagedItems.filter(
                      (p) =>
                        p.subStatus === 'JUNTA_AGUARDANDO' ||
                        p.subStatus === 'JUNTA_PARECER_RECEBIDO',
                    ),
                  },
                ]
              : undefined
          }
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
