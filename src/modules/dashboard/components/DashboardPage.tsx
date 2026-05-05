'use client';

import { useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import useDashboardData from '../hooks/useDashboardData';

import CategoryBreakdownCard from './CategoryBreakdownCard';
import DashboardKpiStrip from './DashboardKpiStrip';
import ProcessingQueueTable from './ProcessingQueueTable';
import RecentRequestsTable from './RecentRequestsTable';

export default function DashboardPage() {
  const router = useRouter();
  const { loading, metrics, pedidos, categoryBreakdown } = useDashboardData();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            Gestão Inteligente de Pedidos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: 13 }}>
            Visão geral das solicitações —{' '}
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        </Box>
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

      {/* KPI strip */}
      <DashboardKpiStrip metrics={metrics} />

      {/* Processing Queue */}
      {!loading && <ProcessingQueueTable />}

      {/* Recent Requests + Category breakdown */}
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent
              sx={{
                p: 3,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                '&:last-child': { pb: 3 },
              }}
            >
              <RecentRequestsTable pedidos={pedidos} loading={loading} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CategoryBreakdownCard entries={categoryBreakdown} />
        </Grid>
      </Grid>
    </Box>
  );
}
