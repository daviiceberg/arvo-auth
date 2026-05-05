'use client';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useHistoryList from '../hooks/useHistoryList';

import HistoryListFilterBar from './HistoryListFilterBar';
import HistoryListTable from './HistoryListTable';

export default function HistoryListPage() {
  const router = useRouter();
  const vm = useHistoryList();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Histórico
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
            Registro auditável de todas as decisões — somente leitura
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <HistoryListFilterBar
        search={vm.search}
        onSearchChange={vm.setSearch}
        originFilter={vm.originFilter}
        onOriginFilterChange={vm.setOriginFilter}
        actionFilter={vm.actionFilter}
        onActionFilterChange={vm.setActionFilter}
        divergenceFilter={vm.divergenceFilter}
        onDivergenceFilterChange={vm.setDivergenceFilter}
        passedThroughFilter={vm.passedThroughFilter}
        onPassedThroughFilterChange={vm.setPassedThroughFilter}
        categoryFilter={vm.categoryFilter}
        onCategoryFilterChange={vm.setCategoryFilter}
        hasFilters={vm.hasFilters}
        onClearFilters={vm.clearFilters}
        onResetPage={() => {
          vm.setPage(0);
        }}
      />

      {/* Table */}
      <HistoryListTable
        pagedEntries={vm.pagedEntries}
        filteredCount={vm.filteredEntries.length}
        page={vm.page}
        rowsPerPage={vm.rowsPerPage}
        sortDirection={vm.sortDirection}
        onToggleSort={vm.toggleSortDirection}
        onPageChange={vm.setPage}
        onNavigate={(id) => {
          router.push('/historico/' + id);
        }}
      />
    </Box>
  );
}
