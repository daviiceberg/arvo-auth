'use client';

import { useRouter } from 'next/navigation';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import useDashboardData from '../hooks/useDashboardData';

import CategoryBarChart from './CategoryBarChart';
import CategorySummary from './CategorySummary';
import DashboardAlerts from './DashboardAlerts';
import DashboardKpiRow from './DashboardKpiRow';
import DonutChart from './DonutChart';
import ProcessingQueueTable from './ProcessingQueueTable';
import RecentRequestsTable from './RecentRequestsTable';
import TopDenialReasons from './TopDenialReasons';
import TrendChart from './TrendChart';

export default function DashboardPage() {
  const router = useRouter();
  const { loading, metrics, pedidos, pedidosEmProcessamento, barData, maxBar, urgencySegments } = useDashboardData();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + KPI Row */}
      <DashboardKpiRow
        loading={loading}
        pedidos={pedidos}
        pedidosEmProcessamento={pedidosEmProcessamento}
        metrics={metrics}
      />

      {/* Alerts */}
      <DashboardAlerts alertas={metrics.alertasAtivos} loading={loading} />

      {/* Processing Queue */}
      {!loading && <ProcessingQueueTable />}

      {/* Row 2 — Charts: Bar + Donut + AI Suggestion */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        {/* Category Distribution — flex 5 */}
        <Card sx={{ flex: 5, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2 } }}>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1.5 }}>
              Distribuição por Categoria
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={18} sx={{ borderRadius: 1 }} />
                ))}
              </Box>
            ) : (
              <CategoryBarChart barData={barData} maxBar={maxBar} />
            )}
          </CardContent>
        </Card>

        {/* General Status — flex 3 */}
        <Card sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2 } }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
                Status Geral
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                composição por urgência
              </Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="circular" width={110} height={110} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="text" height={14} />)}
                </Box>
              </Box>
            ) : (
              <DonutChart segments={urgencySegments} />
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions — flex 4 */}
        <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
                  Sugestão da IA
                </Typography>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => { router.push('/fila'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push('/fila'); } }}
                  sx={{ cursor: 'pointer', '&:focus-visible': { outline: '2px solid #902B29', outlineOffset: 2, borderRadius: '4px' } }}
                >
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Ver todos ›
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  {([
                    { label: 'Negar', count: metrics.iaSugestaoNegar, color: '#d4183d', textColor: '#d4183d', bg: 'rgba(212,24,61,0.08)', hoverBg: 'rgba(212,24,61,0.13)', icon: <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: '#d4183d' }} />, ia: 'Negar', microcopy: 'com bloqueio identificado' },
                    { label: 'Junta Médica', count: metrics.iaSugestaoJunta, color: '#b45309', textColor: '#b45309', bg: 'rgba(180,83,9,0.08)', hoverBg: 'rgba(180,83,9,0.13)', icon: <GroupsOutlinedIcon sx={{ fontSize: 16, color: '#b45309' }} />, ia: 'Junta Médica', microcopy: 'para revisão clínica' },
                    { label: 'Aprovar', count: metrics.iaSugestaoAprovar, color: '#16a34a', textColor: '#166534', bg: 'rgba(22,163,74,0.08)', hoverBg: 'rgba(22,163,74,0.13)', icon: <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#16a34a' }} />, ia: 'Aprovar', microcopy: 'com critérios atendidos' },
                  ] as { label: string; count: number; color: string; textColor: string; bg: string; hoverBg: string; icon: React.ReactNode; ia: string; microcopy: string }[]).map((s) => (
                    <Box
                      key={s.label}
                      role="button"
                      tabIndex={0}
                      onClick={() => { router.push(`/fila?ia=${encodeURIComponent(s.ia)}`); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?ia=${encodeURIComponent(s.ia)}`); } }}
                      aria-label={`Ver ${String(s.count)} pedidos com sugestão da IA: ${s.label}`}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderRadius: 2, p: '10px 12px', cursor: 'pointer', flex: 1,
                        backgroundColor: s.bg,
                        transition: 'background-color 150ms ease',
                        '&:hover': { backgroundColor: s.hoverBg },
                        '&:focus-visible': { outline: '2px solid #902B29', outlineOffset: 1 },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {s.icon}
                        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: s.textColor }}>
                          {s.label}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: s.textColor, lineHeight: 1 }}>
                          {s.count}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, color: s.textColor, opacity: 0.7, lineHeight: 1.2, display: 'block' }}>
                          {s.count === 1 ? 'pedido' : 'pedidos'} {s.microcopy}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 'auto', pt: 0.5, display: 'block' }}>
                    Pedidos ativos em análise
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Row 3 — Trend + Denial audit card */}
      <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', flexShrink: 0, mb: 1 }}>
                Volume Mensal — Aprovações vs Negações
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: 120, borderRadius: 1 }} />
              ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <TrendChart data={metrics.monthlyTrend} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
                  Negativas fundamentadas
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 12, color: '#6b7280' }}>Mês atual</Typography>
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
              ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" fontWeight={800} sx={{ fontSize: 40, color: '#902B29', lineHeight: 1 }}>
                      {metrics.negados}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', display: 'block', mt: 0.75 }}>
                      negativas emitidas
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      Economia estimada: {metrics.valorNegado}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.25,
                      borderRadius: 1.5,
                      backgroundColor: 'rgba(144,43,41,0.05)',
                      border: '1px solid rgba(144,43,41,0.15)',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#902B29', fontWeight: 600, display: 'block' }}>
                      {metrics.iaSinalizouCriticos} de {metrics.totalCriticosHist} com alerta da IA identificado
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#6b7280' }}>
                      IA antecipou {String(metrics.taxaDeteccaoIA)}% das negativas do período
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 4 — Recent Requests + Denial Reasons + Category Summary */}
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <RecentRequestsTable pedidos={pedidos} loading={loading} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {/* Top Denial Reasons */}
            <Card sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 2, flexShrink: 0 }}>
                  Principais Motivos de Negativa
                </Typography>
                <TopDenialReasons reasons={metrics.topMotivosNegativa} loading={loading} />
              </CardContent>
            </Card>

            {/* Category Summary */}
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1.5 }}>
                  Por Categoria
                </Typography>
                <CategorySummary categories={metrics.porCategoria} loading={loading} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
