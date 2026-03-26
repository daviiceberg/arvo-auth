'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import AssignmentIcon from '@mui/icons-material/Assignment'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ReplayIcon from '@mui/icons-material/Replay'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import EmergencyIcon from '@mui/icons-material/Emergency'
import BiotechIcon from '@mui/icons-material/Biotech'
import PsychologyIcon from '@mui/icons-material/Psychology'
import DevicesOtherIcon from '@mui/icons-material/DevicesOther'
import ScienceIcon from '@mui/icons-material/Science'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import HomeIcon from '@mui/icons-material/Home'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SpeedIcon from '@mui/icons-material/Speed'
import GavelIcon from '@mui/icons-material/Gavel'
import { dashboardMetrics, pedidos } from '@/data/pedidos'

// ── Status color map ──────────────────────────────────────────────────
const statusColorMap: Record<string, { bg: string; color: string }> = {
  'Em Análise': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Aprovado': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  'Negado': { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Pendente': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Devolutiva': { bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
  'Cancelado': { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
}

function StatusChip({ status }: { status: string }) {
  const { bg, color } = statusColorMap[status] || { bg: 'rgba(0,0,0,0.06)', color: '#5a6070' }
  return (
    <Chip
      label={status}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, height: 20, fontWeight: 700 }}
    />
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ReactNode
  iconBg: string
  value: string | number
  label: string
  sublabel?: string
  valueColor?: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  onClick?: () => void
}

function KpiCard({ icon, iconBg, value, label, sublabel, valueColor, trend, trendLabel, onClick }: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        '&:hover': onClick ? { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-1px)' } : {},
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Top row: label/sublabel left — icon right */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.3 }}>
              {label}
            </Typography>
            {sublabel && (
              <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', opacity: 0.75, lineHeight: 1.2, display: 'block', mt: 0.25 }}>
                {sublabel}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
        {/* Big number + trend */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, lineHeight: 1, color: valueColor || 'text.primary', fontSize: 26 }}
          >
            {value}
          </Typography>
          {trend && trendLabel && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 13, color: '#16a34a' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 13, color: '#d4183d' }} />
              )}
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: trend === 'up' ? '#16a34a' : '#d4183d' }}>
                {trendLabel}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

// ── Bar Chart — Distribuição por Categoria ────────────────────────────
const barData = dashboardMetrics.porCategoria.map((c) => ({
  label: c.categoria
    .replace('Urgência/Emergência', 'U/E')
    .replace('Exames Alta Complexidade', 'Exames')
    .replace('Cirurgias Eletivas', 'Cirurgias')
    .replace('Terapias Especiais', 'Terapias'),
  pendentes: c.pendentes,
  aprovados: c.total - c.pendentes,
  total: c.total,
  color: c.color,
}))
const maxBar = Math.max(...barData.map((d) => d.total), 1)

function CategoriaBarChart() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {barData.map((d) => (
          <Box
            key={d.label}
            onMouseEnter={() => setHovered(d.label)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: hovered && hovered !== d.label ? 0.5 : 1,
              transition: 'opacity 150ms ease',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', width: 68, flexShrink: 0, textAlign: 'right' }}>
              {d.label}
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Box sx={{ display: 'flex', gap: 0.25, height: 14, borderRadius: 1, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <Box
                  sx={{
                    width: `${(d.aprovados / maxBar) * 100}%`,
                    backgroundColor: '#16a34a',
                    transition: 'width 600ms ease',
                  }}
                  title={`Aprovados: ${d.aprovados}`}
                />
                <Box
                  sx={{
                    width: `${(d.pendentes / maxBar) * 100}%`,
                    backgroundColor: '#902B29',
                    transition: 'width 600ms ease',
                  }}
                  title={`Em análise: ${d.pendentes}`}
                />
              </Box>
            </Box>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: d.color, width: 20, textAlign: 'right', flexShrink: 0 }}>
              {d.total}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, pl: '84px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#16a34a' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Aprovados</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#902B29' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Em Análise</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── Monthly Trend Bar Chart ───────────────────────────────────────────
function TrendChart() {
  const data = dashboardMetrics.monthlyTrend
  const maxVal = Math.max(...data.map((d) => d.aprovados + d.negados), 1)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 0.75, minHeight: 160 }}>
        {data.map((d) => (
          <Box key={d.mes} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, height: '100%', justifyContent: 'flex-end' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'flex-end' }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${(d.negados / maxVal) * 140}px`,
                  minHeight: 3,
                  backgroundColor: '#d4183d',
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.8,
                }}
                title={`Negados: ${d.negados}`}
              />
              <Box
                sx={{
                  width: '100%',
                  height: `${(d.aprovados / maxVal) * 140}px`,
                  minHeight: 4,
                  backgroundColor: '#16a34a',
                  borderRadius: '2px 2px 0 0',
                }}
                title={`Aprovados: ${d.aprovados}`}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
              {d.mes}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#16a34a' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Aprovações</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#d4183d' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Negações</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── Donut Chart ───────────────────────────────────────────────────────
const donutData = [
  { label: 'Em Análise', value: dashboardMetrics.emAnalise, color: '#f59e0b' },
  { label: 'Aprovadas', value: dashboardMetrics.aprovados, color: '#16a34a' },
  { label: 'Negadas', value: dashboardMetrics.negados, color: '#d4183d' },
  { label: 'Devolutivas', value: dashboardMetrics.devolutivas, color: '#ea580c' },
  { label: 'Canceladas', value: dashboardMetrics.cancelados, color: '#9ca3af' },
]

function DonutChart() {
  const total = donutData.reduce((s, d) => s + d.value, 0)
  const r = 56
  const cx = 70
  const cy = 70
  const circumference = 2 * Math.PI * r
  let cumulative = 0
  const slices = donutData.filter((d) => d.value > 0).map((d) => {
    const pct = d.value / total
    const offset = circumference * (1 - cumulative)
    const dashLen = circumference * pct
    cumulative += pct
    return { ...d, dashLen, offset }
  })

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
      {/* Donut centrado */}
      <svg width="160" height="160" viewBox="0 0 140 140">
        {slices.map((s) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeDasharray={`${s.dashLen} ${circumference - s.dashLen}`}
            strokeDashoffset={s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1a1a1a">
          {total}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize="10" fill="#5a6070">
          pedidos
        </text>
      </svg>
      {/* Legenda em grade 2 colunas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', width: '100%' }}>
        {donutData.map((d) => (
          <Box key={d.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: d.color, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }} noWrap>
              {d.label}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {d.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ── SLA Status Mini Chart ─────────────────────────────────────────────
function SlaWidget() {
  const total = dashboardMetrics.slaOk + dashboardMetrics.slaWarning + dashboardMetrics.slaViolados
  const pctOk = (dashboardMetrics.slaOk / total) * 100
  const pctWarn = (dashboardMetrics.slaWarning / total) * 100
  const pctViol = (dashboardMetrics.slaViolados / total) * 100

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        {[
          { label: 'No prazo', value: dashboardMetrics.slaOk, color: '#16a34a' },
          { label: 'Atenção', value: dashboardMetrics.slaWarning, color: '#f59e0b' },
          { label: 'Violados', value: dashboardMetrics.slaViolados, color: '#d4183d' },
        ].map((s) => (
          <Box key={s.label} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: '2px' }}>
        <Box sx={{ width: `${pctOk}%`, backgroundColor: '#16a34a', borderRadius: '4px 0 0 4px' }} />
        <Box sx={{ width: `${pctWarn}%`, backgroundColor: '#f59e0b' }} />
        <Box sx={{ width: `${pctViol}%`, backgroundColor: '#d4183d', borderRadius: '0 4px 4px 0' }} />
      </Box>
      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 0.75, display: 'block' }}>
        {total} pedidos ativos · {dashboardMetrics.slaViolados} violações de prazo
      </Typography>
    </Box>
  )
}

// ── Category icon map ─────────────────────────────────────────────────
const categoryIcons: Record<string, React.ReactNode> = {
  'Internação': <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  'Urgência/Emergência': <EmergencyIcon sx={{ fontSize: 14 }} />,
  'Oncologia': <BiotechIcon sx={{ fontSize: 14 }} />,
  'Terapias Especiais': <PsychologyIcon sx={{ fontSize: 14 }} />,
  'OPME': <DevicesOtherIcon sx={{ fontSize: 14 }} />,
  'Exames Alta Complexidade': <ScienceIcon sx={{ fontSize: 14 }} />,
  'Cirurgias Eletivas': <ContentCutIcon sx={{ fontSize: 14 }} />,
  'Home Care': <HomeIcon sx={{ fontSize: 14 }} />,
}

// ── Skeletons ─────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <Card sx={{ height: 104 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Skeleton variant="rounded" width={38} height={38} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="55%" height={28} />
        <Skeleton variant="text" width="75%" height={14} />
      </CardContent>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            Gestão Inteligente de Pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visão geral das solicitações — terça-feira, 24 de março de 2026
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

      {/* Row 1 — 6 KPI Cards */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 2 }}>
              <CardSkeleton />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<AssignmentIcon sx={{ fontSize: 20, color: '#2563eb' }} />}
                iconBg="rgba(37,99,235,0.1)"
                value={dashboardMetrics.total}
                label="Total de Pedidos"
                sublabel="Mês atual"
                onClick={() => router.push('/fila')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<HourglassEmptyIcon sx={{ fontSize: 20, color: '#b45309' }} />}
                iconBg="rgba(245,158,11,0.12)"
                value={dashboardMetrics.emAnalise}
                label="Em Análise"
                sublabel={`${dashboardMetrics.urgencias} urgentes`}
                valueColor="#b45309"
                trend="up"
                trendLabel="+3"
                onClick={() => router.push('/fila')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />}
                iconBg="rgba(22,163,74,0.1)"
                value={dashboardMetrics.aprovados}
                label="Aprovadas"
                sublabel={`Taxa: ${dashboardMetrics.taxaAprovacao}%`}
                valueColor="#16a34a"
                trend="up"
                trendLabel="+2"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<CancelIcon sx={{ fontSize: 20, color: '#d4183d' }} />}
                iconBg="rgba(212,24,61,0.1)"
                value={dashboardMetrics.negados}
                label="Negadas"
                sublabel={`Taxa: ${dashboardMetrics.taxaNegacao}%`}
                valueColor="#d4183d"
                trend="down"
                trendLabel="-1"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<ReplayIcon sx={{ fontSize: 20, color: '#ea580c' }} />}
                iconBg="rgba(234,88,12,0.1)"
                value={dashboardMetrics.devolutivas}
                label="Devolutivas"
                sublabel="Aguard. complementação"
                valueColor="#ea580c"
                onClick={() => router.push('/fila?tab=2')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <KpiCard
                icon={<AttachMoneyIcon sx={{ fontSize: 20, color: '#7c3aed' }} />}
                iconBg="rgba(124,58,237,0.1)"
                value={dashboardMetrics.valorTotal}
                label="Valor Total Estimado"
                sublabel={`Aprovado: ${dashboardMetrics.valorAprovado}`}
                valueColor="#7c3aed"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Row 1.5 — Alertas críticos banner */}
      {!loading && dashboardMetrics.slaViolados > 0 && (
        <Alert
          severity="error"
          icon={<TimerOffIcon fontSize="small" />}
          sx={{ mb: 2.5, borderRadius: 2, alignItems: 'center', '& .MuiAlert-action': { alignItems: 'center', pt: 0, mr: 0, pr: 0 } }}
          action={
            <Button
              variant="contained"
              size="small"
              onClick={() => router.push('/fila?sla=Violado')}
              sx={{ backgroundColor: '#fff', color: '#d4183d', fontWeight: 700, px: 2, border: '1px solid #d4183d', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }, whiteSpace: 'nowrap' }}
            >
              Ver fila
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={700}>
            {dashboardMetrics.slaViolados} pedidos com SLA violado
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 12 }}>
            Inclui {dashboardMetrics.alertasAtivos.find(a => a.tipo === 'Liminar Judicial')?.count ?? 0} liminares judiciais e {dashboardMetrics.alertasAtivos.find(a => a.tipo === 'NIP Ativa')?.count ?? 0} NIP ativas que requerem atenção imediata.
          </Typography>
        </Alert>
      )}

      {/* Row 2 — Charts: Bar por categoria + Donut + SLA */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700, flexShrink: 0, mb: 2 }}>
                Distribuição por Categoria
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={18} sx={{ borderRadius: 1 }} />
                  ))}
                </Box>
              ) : (
                <CategoriaBarChart />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                Status Geral
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="circular" width={110} height={110} />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="text" height={14} />)}
                  </Box>
                </Box>
              ) : (
                <DonutChart />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {/* SLA Status */}
            <Card sx={{ flex: 1, minHeight: 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <SpeedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700 }}>
                    Status SLA
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                ) : (
                  <SlaWidget />
                )}
              </CardContent>
            </Card>

            {/* IA — sugestões */}
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <SmartToyIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700 }}>
                    Sugestões da IA
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { label: 'Aprovar', count: dashboardMetrics.iaSugestaoAprovar, color: '#16a34a' },
                      { label: 'Negar', count: dashboardMetrics.iaSugestaoNegar, color: '#d4183d' },
                      { label: 'Junta Médica', count: dashboardMetrics.iaSugestaoJunta, color: '#b45309' },
                    ].map((s) => (
                      <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '2px', backgroundColor: s.color, flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ flex: 1, fontSize: 12, color: 'text.secondary' }}>{s.label}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.count}</Typography>
                      </Box>
                    ))}
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>
                      Sugestões para pedidos em análise
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Row 3 — Trend + Alertas Ativos */}
      <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                Volume Mensal — Aprovações vs Negações
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: 120, borderRadius: 1 }} />
              ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <TrendChart />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningAmberIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700 }}>
                  Alertas Ativos
                </Typography>
                <Chip
                  label={dashboardMetrics.alertasAtivos.reduce((s, a) => s + a.count, 0)}
                  size="small"
                  sx={{ height: 20, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', ml: 'auto' }}
                />
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />)}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {dashboardMetrics.alertasAtivos.map((alerta) => (
                    <Box
                      key={alerta.tipo}
                      onClick={() => router.push('/fila')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${alerta.color}22`,
                        backgroundColor: `${alerta.color}08`,
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                        '&:hover': { backgroundColor: `${alerta.color}12` },
                      }}
                    >
                      {alerta.tipo === 'Liminar Judicial' ? (
                        <GavelIcon sx={{ fontSize: 16, color: alerta.color, flexShrink: 0 }} />
                      ) : (
                        <WarningAmberIcon sx={{ fontSize: 16, color: alerta.color, flexShrink: 0 }} />
                      )}
                      <Typography variant="body2" fontWeight={600} sx={{ flex: 1, fontSize: 12 }}>
                        {alerta.tipo}
                      </Typography>
                      <Chip
                        label={alerta.count}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: `${alerta.color}18`,
                          color: alerta.color,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                      <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 4 — Últimas Solicitações + Motivos de Negativa */}
      <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700 }}>
                  Últimas Solicitações
                </Typography>
                <Button
                  size="small"
                  endIcon={<ChevronRightIcon fontSize="small" />}
                  onClick={() => router.push('/fila')}
                  sx={{ fontSize: 12, color: 'primary.main' }}
                  aria-label="Ver todas as solicitações"
                >
                  Ver todas
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                  ))}
                </Box>
              ) : (
                <Table size="small" aria-label="Últimas solicitações">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: 0.5, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Beneficiário</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Procedimento</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Data</TableCell>
                      <TableCell sx={{ width: 90 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidos.slice(0, 7).map((pedido) => (
                      <TableRow
                        key={pedido.id}
                        sx={{ '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' } }}
                      >
                        <TableCell sx={{ pl: 0.5 }}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ color: 'primary.main', fontSize: 12 }}
                          >
                            {pedido.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={pedido.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={600} noWrap sx={{ fontSize: 12 }}>
                            {pedido.beneficiario.nome}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 12, maxWidth: 140, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {pedido.procedimentos[0]?.descricao || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                            {pedido.dataProtocolo.split(' ')[0]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => router.push(`/analise?id=${pedido.id}`)}
                            endIcon={<ChevronRightIcon sx={{ fontSize: 14 }} />}
                            sx={{ fontSize: 11, py: 0.25, px: 1, minHeight: 26, color: 'primary.main' }}
                          >
                            Analisar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {/* Motivos de Pendência */}
            <Card sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
                <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700, mb: 2, flexShrink: 0 }}>
                  Principais Motivos de Negativa
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={28} sx={{ borderRadius: 1 }} />)}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    {dashboardMetrics.topMotivosNegativa.map((motivo, idx) => {
                      const maxCount = dashboardMetrics.topMotivosNegativa[0].count
                      return (
                        <Box key={motivo.motivo} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', width: 14, flexShrink: 0, fontWeight: 700 }}>
                            {idx + 1}
                          </Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }} noWrap>
                                {motivo.motivo}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: motivo.color, ml: 1, flexShrink: 0 }}>
                                {motivo.count}
                              </Typography>
                            </Box>
                            <Box sx={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${(motivo.count / maxCount) * 100}%`,
                                  backgroundColor: motivo.color,
                                  borderRadius: 3,
                                  transition: 'width 600ms ease',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Categorias rápido */}
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700, mb: 1.5 }}>
                  Por Categoria
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="rounded" width={90} height={30} />)}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dashboardMetrics.porCategoria.map((cat) => (
                      <Box
                        key={cat.categoria}
                        onClick={() => router.push(`/fila?categoria=${encodeURIComponent(cat.categoria)}`)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          px: 1.25,
                          py: 0.5,
                          borderRadius: 2,
                          border: `1px solid ${cat.color}30`,
                          backgroundColor: `${cat.color}08`,
                          cursor: 'pointer',
                          transition: 'background-color 150ms ease',
                          '&:hover': { backgroundColor: `${cat.color}15` },
                        }}
                      >
                        <Box sx={{ color: cat.color, display: 'flex', alignItems: 'center' }}>
                          {categoryIcons[cat.categoria]}
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
                          {cat.categoria.replace('Urgência/Emergência', 'U/E').replace('Exames Alta Complexidade', 'Exames').replace('Cirurgias Eletivas', 'Cirurgias').replace('Terapias Especiais', 'Terapias')}
                        </Typography>
                        <Chip
                          label={cat.total}
                          size="small"
                          sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: `${cat.color}15`, color: cat.color, '& .MuiChip-label': { px: 0.5 } }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* IA Banner */}
      {!loading && (
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(144,43,41,0.04)',
            border: '1px solid rgba(144,43,41,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <SmartToyIcon sx={{ color: 'primary.main', fontSize: 20, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary' }}>
            <strong>Assistente de Decisão IA ativo</strong>
            {' · '}
            A IA analisa cada pedido e emite uma sugestão (Aprovar / Negar / Junta Médica). A decisão final é sempre do autorizador. {dashboardMetrics.emAnalise} pedidos aguardam revisão.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => router.push('/fila')}
            sx={{ ml: 'auto', flexShrink: 0, fontSize: 12, minHeight: 32 }}
            aria-label="Ver fila de análise"
          >
            Ver fila
          </Button>
        </Box>
      )}
    </Box>
  )
}
