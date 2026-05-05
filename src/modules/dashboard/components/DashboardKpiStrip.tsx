'use client';

import { useRouter } from 'next/navigation';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface KpiMetrics {
  emAnalise: number;
  slaViolados: number;
  slaEmRisco: number;
  aprovadosMes: number;
  negadosMes: number;
  devolutivasAtivas?: number;
}

interface DashboardKpiStripProps {
  metrics: KpiMetrics;
}

interface KpiDefinition {
  label: string;
  icon: React.ReactNode;
  bg: string;
  color: string;
  href?: string;
  value: React.ReactNode;
}

function KpiIconBox({ bg, icon }: { bg: string; icon: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '8px',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
  );
}

/**
 * Preservado para reuso futuro em outro card do Dashboard.
 * Removido do KPI Strip do topo no M1 — substituído por "Devolutivas".
 */
export function buildAprovacoesNegacoesKpi(metrics: KpiMetrics): KpiDefinition {
  const totalMes = metrics.aprovadosMes + metrics.negadosMes;
  const pctAprovados = totalMes > 0 ? Math.round((metrics.aprovadosMes / totalMes) * 100) : 0;
  const pctNegados = totalMes > 0 ? 100 - pctAprovados : 0;

  return {
    label: 'Aprovações × Negações (mensal)',
    icon: <CompareArrowsIcon sx={{ fontSize: 18, color: 'info.main' }} />,
    bg: 'rgba(37,99,235,0.1)',
    color: 'text.primary',
    value: (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 24, color: 'success.main', lineHeight: 1 }}>
            {metrics.aprovadosMes} ✓
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.4 }}>
            {pctAprovados}%
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 24, color: 'text.disabled', lineHeight: 1 }}>
          /
        </Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 24, color: 'error.main', lineHeight: 1 }}>
            {metrics.negadosMes} ✗
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.4 }}>
            {pctNegados}%
          </Typography>
        </Box>
      </Box>
    ),
  };
}

function KpiLink({ href, onNavigate }: { href: string; onNavigate: (href: string) => void }) {
  return (
    <Box
      component="a"
      href={href}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNavigate(href);
      }}
      sx={{
        mt: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        fontSize: 12,
        fontWeight: 600,
        color: 'primary.main',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      ver todos
      <ArrowForwardIcon sx={{ fontSize: 14 }} />
    </Box>
  );
}

export default function DashboardKpiStrip({ metrics }: DashboardKpiStripProps) {
  const router = useRouter();
  const onNavigate = (href: string) => {
    router.push(href);
  };

  const kpis: KpiDefinition[] = [
    {
      label: 'Total de Pedidos na Fila',
      icon: <InboxOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
      bg: 'rgba(144,43,41,0.1)',
      color: 'text.primary',
      href: '/fila',
      value: metrics.emAnalise,
    },
    {
      label: 'SLA Violado',
      icon: <ErrorOutlineIcon sx={{ fontSize: 18, color: 'error.main' }} />,
      bg: 'rgba(212,24,61,0.1)',
      color: 'error.main',
      href: '/fila?sla=Violado',
      value: metrics.slaViolados,
    },
    {
      label: 'SLA em Risco',
      icon: <WarningAmberIcon sx={{ fontSize: 18, color: 'warning.main' }} />,
      bg: 'rgba(245,158,11,0.12)',
      color: 'warning.main',
      href: '/fila?sla=Atenção',
      value: metrics.slaEmRisco,
    },
  ];

  // M1 — Devolutivas substitui "Aprovações × Negações" no topo. O componente
  // de comparação Aprovações × Negações fica preservado em
  // `buildAprovacoesNegacoesKpi` para reaproveitar em outra parte do Dashboard
  // se necessário (não excluído conforme decisão de produto).
  kpis.push({
    label: 'Devolutivas',
    icon: <AssignmentReturnIcon sx={{ fontSize: 18, color: '#d97706' }} />,
    bg: 'rgba(245,158,11,0.18)',
    color: '#d97706',
    href: '/fila?tab=devolutivas',
    value: metrics.devolutivasAtivas ?? 0,
  });

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {kpis.map((kpi) => (
        <Card key={kpi.label} sx={{ flex: 1, minWidth: 180, display: 'flex' }}>
          <CardContent
            sx={{
              p: 1.75,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:last-child': { pb: 1.75 },
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  mb: 0.75,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}
                >
                  {kpi.label}
                </Typography>
                <KpiIconBox bg={kpi.bg} icon={kpi.icon} />
              </Box>
              {typeof kpi.value === 'number' ? (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, lineHeight: 1, color: kpi.color, fontSize: 24 }}
                >
                  {kpi.value}
                </Typography>
              ) : (
                kpi.value
              )}
            </Box>
            {kpi.href ? <KpiLink href={kpi.href} onNavigate={onNavigate} /> : null}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
