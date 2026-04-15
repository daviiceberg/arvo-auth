'use client';

import { useRouter } from 'next/navigation';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import useHistoryList from '../hooks/useHistoryList';

import HistoryListFilterBar from './HistoryListFilterBar';
import HistoryListTable from './HistoryListTable';

export default function HistoryListPage() {
  const router = useRouter();
  const vm = useHistoryList();

  const kpis = [
    {
      label: 'Total de Solicitações',
      value: vm.totalEntries,
      color: 'text.primary',
      icon: <ScienceIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
      bg: 'rgba(144,43,41,0.1)',
    },
    {
      label: 'Processadas por IA',
      value: vm.totalIA,
      color: 'info.main',
      icon: <SmartToyIcon sx={{ fontSize: 18, color: 'info.main' }} />,
      bg: 'rgba(37,99,235,0.1)',
    },
    {
      label: 'Decididas por Analista',
      value: vm.totalAnalyst,
      color: 'text.primary',
      icon: <PersonIcon sx={{ fontSize: 18, color: '#5a6070' }} />,
      bg: 'rgba(0,0,0,0.07)',
    },
    {
      label: 'Taxa de Aprovação',
      value: `${String(vm.approvalRate)}%`,
      color: 'success.main',
      icon: <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />,
      bg: 'rgba(22,163,74,0.1)',
    },
    {
      label: 'Analista divergiu da sugestão',
      value: vm.totalDivergences,
      color: 'warning.main',
      icon: <WarningAmberIcon sx={{ fontSize: 18, color: 'warning.main' }} />,
      bg: 'rgba(245,158,11,0.12)',
    },
  ];

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

      {/* Summary KPI strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {kpis.map((kpi) => (
          <Card key={kpi.label} sx={{ flex: 1, minWidth: 140 }}>
            <CardContent
              sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, transition: 'box-shadow 0.15s ease' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}
                >
                  {kpi.label}
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: kpi.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {kpi.icon}
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, lineHeight: 1, color: kpi.color, fontSize: 24 }}
              >
                {kpi.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
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
