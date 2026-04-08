'use client';

import { useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SavingsIcon from '@mui/icons-material/Savings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { type Pedido, type PedidoEmProcessamento } from '@/types/pedido';

import { KpiCard } from '@/shared/components';

import { CardSkeleton } from './DashboardSkeleton';

interface DashboardKpiRowProps {
  loading: boolean;
  pedidos: Pedido[];
  pedidosEmProcessamento: PedidoEmProcessamento[];
  metrics: {
    slaViolados: number;
    slaWarning: number;
    slaOk: number;
    totalAlertasAtivos: number;
    alertasAtivos: { tipo: string; count: number; color: string }[];
    valorNegado: string;
    negados: number;
    taxaNegacao: number;
    taxaDeteccaoIA: number;
    iaSinalizouCriticos: number;
    totalCriticosHist: number;
    valorTotal: string;
  };
}

export default function DashboardKpiRow({ loading, pedidos, pedidosEmProcessamento, metrics }: DashboardKpiRowProps) {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            Gestão Inteligente de Pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visão geral das solicitações — segunda-feira, 30 de março de 2026
          </Typography>
        </Box>
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

      {/* Row 1 — 5 KPI Cards */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 'grow' }}>
              <CardSkeleton />
            </Grid>
          ))
        ) : (
          <>
            {/* Card 1 — Awaiting decision */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<FormatListBulletedIcon sx={{ fontSize: 20, color: '#902B29' }} />}
                iconBg="rgba(144,43,41,0.1)"
                value={pedidos.length}
                label="Aguardam Decisão"
                sublabel={
                  <>
                    <Box component="span" sx={{ color: '#d4183d', fontWeight: 700 }}>{metrics.slaViolados} violados</Box>
                    {` · ${metrics.slaWarning} atenção · ${metrics.slaOk} no prazo`}
                    {pedidosEmProcessamento.length > 0 && (
                      <>
                        <Divider sx={{ my: 0.5 }} />
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <AutorenewOutlinedIcon sx={{ fontSize: 12 }} />
                          + {pedidosEmProcessamento.length} chegando (em processamento)
                        </Box>
                      </>
                    )}
                  </>
                }
                onClick={() => router.push('/fila')}
              />
            </Grid>
            {/* Card 2 — Irregularities detected */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<WarningAmberIcon sx={{ fontSize: 20, color: '#b45309' }} />}
                iconBg="rgba(245,158,11,0.12)"
                value={metrics.totalAlertasAtivos}
                label="Irregularidades Detectadas"
                sublabel={`${metrics.alertasAtivos.slice(0, 2).map((a) => `${a.count} ${a.tipo === 'Liminar Judicial' ? 'liminares' : a.tipo === 'NIP Ativa' ? 'NIP ativas' : a.tipo.toLowerCase()}`).join(' · ')}`}
                valueColor="#b45309"
              />
            </Grid>
            {/* Card 3 — Savings generated */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<SavingsIcon sx={{ fontSize: 20, color: '#16a34a' }} />}
                iconBg="rgba(22,163,74,0.1)"
                value={metrics.valorNegado}
                label="Economia Gerada"
                sublabel={`${metrics.negados} negativas · taxa ${metrics.taxaNegacao}%`}
                valueColor="#16a34a"
              />
            </Grid>
            {/* Card 4 — AI effectiveness */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<SmartToyIcon sx={{ fontSize: 20, color: '#7c3aed' }} />}
                iconBg="rgba(124,58,237,0.1)"
                value={`${metrics.taxaDeteccaoIA}%`}
                label="Efetividade da IA"
                sublabel={`IA antecipou ${metrics.iaSinalizouCriticos} de ${metrics.totalCriticosHist} negativas`}
                valueColor="#7c3aed"
              />
            </Grid>
            {/* Card 5 — Value at risk */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<AttachMoneyIcon sx={{ fontSize: 20, color: '#2563eb' }} />}
                iconBg="rgba(37,99,235,0.1)"
                value={metrics.valorTotal}
                label="Valor em Risco"
                sublabel={`${pedidos.length} pedidos aguardam decisão`}
                valueColor="#2563eb"
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
