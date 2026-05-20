'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useUserPermissions } from '@/shared/hooks/useUserPermissions';

import useDashboardData from '../hooks/useDashboardData';

import CategoryBreakdownCard from './CategoryBreakdownCard';
import DashboardKpiStrip from './DashboardKpiStrip';
import ProcessingQueueTable from './ProcessingQueueTable';
import RecentRequestsTable from './RecentRequestsTable';
import SlaPredictiveCard from './SlaPredictiveCard';

const HIGHLIGHT_SCROLL_DELAY_MS = 250;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const { loading, metrics, pedidos, categoryBreakdown, hasOpmeTotal } = useDashboardData();
  const permissions = useUserPermissions();

  const processingQueueRef = useRef<HTMLDivElement>(null);
  const [dismissedHighlight, setDismissedHighlight] = useState(false);
  const showHighlightBanner = Boolean(highlightId) && !dismissedHighlight;

  // After landing from a fresh submission, smooth-scroll the user to the
  // "Entrando no sistema" section so they see the request entering the queue
  // (P2.5 deep-link). Delay lets the layout settle before scrollIntoView.
  useEffect(() => {
    if (!showHighlightBanner) return;
    const timer = window.setTimeout(() => {
      processingQueueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, HIGHLIGHT_SCROLL_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [showHighlightBanner]);

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

      {showHighlightBanner ? (
        <Alert
          severity="success"
          sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}
          onClose={() => {
            setDismissedHighlight(true);
          }}
        >
          <AlertTitle sx={{ fontSize: 13, fontWeight: 700 }}>
            Pedido {highlightId} protocolado com sucesso
          </AlertTitle>
          A IA está processando agora. Acompanhe abaixo em &quot;Entrando no sistema&quot;.
        </Alert>
      ) : null}

      {/* KPI strip */}
      <DashboardKpiStrip metrics={metrics} />

      {/* SLA predictive — manager-only */}
      {permissions.profile === 'gestor' ? <SlaPredictiveCard /> : null}

      {/* Processing Queue */}
      <Box ref={processingQueueRef}>{!loading && <ProcessingQueueTable />}</Box>

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
          <CategoryBreakdownCard entries={categoryBreakdown} hasOpmeTotal={hasOpmeTotal} />
        </Grid>
      </Grid>
    </Box>
  );
}
