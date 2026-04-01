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
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import ReplayIcon from '@mui/icons-material/Replay'
import SecurityIcon from '@mui/icons-material/Security'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SavingsIcon from '@mui/icons-material/Savings'
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
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { dashboardMetrics, pedidos, type Pedido } from '@/data/pedidos'
import { classificarUrgencia } from '@/lib/urgencia'

// ── Status color map ──────────────────────────────────────────────────
const statusColorMap: Record<string, { bg: string; color: string }> = {
  'Em Análise': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Aprovado': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  'Negado': { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Pendente': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Devolutiva': { bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
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
  sublabel?: React.ReactNode
  sublabelColor?: string
  valueColor?: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  onClick?: () => void
}

function KpiCard({ icon, iconBg, value, label, sublabel, sublabelColor, valueColor, trend, trendLabel, onClick }: KpiCardProps) {
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
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        {/* Top row: label+sublabel left — icon right */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0 }}>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
              {label}
            </Typography>
            {sublabel && (
              <Typography variant="caption" sx={{ fontSize: 12, color: sublabelColor || 'text.secondary', lineHeight: 1.2, display: 'block', mt: 0.25, fontWeight: sublabelColor ? 600 : 400 }}>
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
        {/* Big number pinned to bottom */}
        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
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
  total: c.total,
  color: c.color,
  categoria: c.categoria,
}))
const maxBar = Math.max(...barData.map((d) => d.total), 1)

function CategoriaBarChart() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        {barData.map((d) => (
          <Box
            key={d.label}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/fila?categoria=${encodeURIComponent(d.categoria)}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?categoria=${encodeURIComponent(d.categoria)}`) } }}
            aria-label={`Ver ${d.total} pedidos de ${d.categoria}`}
            onMouseEnter={() => setHovered(d.label)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: hovered && hovered !== d.label ? 0.5 : 1,
              transition: 'opacity 150ms ease, background-color 150ms ease',
              cursor: 'pointer',
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              mx: -0.5,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
              '&:focus-visible': { outline: `2px solid ${d.color}`, outlineOffset: 2 },
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', width: 68, flexShrink: 0, textAlign: 'right' }}>
              {d.label}
            </Typography>
            <Box sx={{ flex: 1, height: 16, borderRadius: 1, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.04)' }}>
              <Box
                sx={{
                  width: `${(d.total / maxBar) * 100}%`,
                  height: '100%',
                  backgroundColor: d.color,
                  transition: 'width 600ms ease',
                }}
                title={`${d.label}: ${d.total} pedidos`}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', width: 20, textAlign: 'right', flexShrink: 0 }}>
              {d.total}
            </Typography>
            <ChevronRightIcon sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }} />
          </Box>
        ))}
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
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#16a34a' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Aprovações</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#d4183d' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>Negações</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── Urgência segments (computed from real pedidos) ────────────────────
const _urgenciaCounts = pedidos.reduce<Record<string, number>>((acc, p) => {
  const nivel = classificarUrgencia(p)
  acc[nivel] = (acc[nivel] ?? 0) + 1
  return acc
}, {})

const urgenciaSegments = [
  { label: 'Críticos',     key: 'critico',       color: '#E24B4A', count: _urgenciaCounts.critico      ?? 0, url: '/fila?sla=Violado' },
  { label: 'Atenção',      key: 'atencao',        color: '#EF9F27', count: _urgenciaCounts.atencao       ?? 0, url: '/fila?sla=Aten%C3%A7%C3%A3o' },
  { label: 'Em andamento', key: 'em_andamento',   color: '#639922', count: _urgenciaCounts.em_andamento  ?? 0, url: '/fila?sla=No%20prazo' },
  { label: 'Aguardando',   key: 'aguardando',     color: '#378ADD', count: _urgenciaCounts.aguardando    ?? 0, url: '/fila?status=aguardando' },
]

function DonutChart() {
  const router = useRouter()
  const total = urgenciaSegments.reduce((s, d) => s + d.count, 0)
  const r = 56
  const cx = 70
  const cy = 70
  const circumference = 2 * Math.PI * r
  let cumulative = 0
  const slices = urgenciaSegments.filter((d) => d.count > 0).map((d) => {
    const pct = d.count / total
    const offset = circumference * (1 - cumulative)
    const dashLen = circumference * pct
    cumulative += pct
    return { ...d, dashLen, offset }
  })

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 140 140" role="img" aria-label={`Urgência: ${urgenciaSegments.map(d => `${d.label} ${d.count}`).join(', ')}`}>
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
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fill="#5a6070">
            pedidos ativos
          </text>
        </svg>
      </Box>
      {/* Legenda — 4 itens clicáveis */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', width: '100%', mt: 1.5 }}>
        {urgenciaSegments.map((d) => (
          <Box
            key={d.key}
            role="button"
            tabIndex={0}
            onClick={() => router.push(d.url)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(d.url) } }}
            aria-label={`Ver ${d.count} pedidos ${d.label}`}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', borderRadius: 1, p: 0.25, '&:hover': { backgroundColor: `${d.color}12` }, '&:focus-visible': { outline: `2px solid ${d.color}`, outlineOffset: 1 } }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: d.color, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }} noWrap>
              {d.label}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', flexShrink: 0 }}>
              {d.count}
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
      <Typography variant="caption" sx={{ fontSize: 12, color: '#6b7280', mt: 0.75, display: 'block' }}>
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
            {/* Card 1 — Aguardam decisão */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<FormatListBulletedIcon sx={{ fontSize: 20, color: '#902B29' }} />}
                iconBg="rgba(144,43,41,0.1)"
                value={pedidos.length}
                label="Aguardam Decisão"
                sublabel={<><Box component="span" sx={{ color: '#d4183d', fontWeight: 700 }}>{dashboardMetrics.slaViolados} violados</Box>{` · ${dashboardMetrics.slaWarning} atenção · ${dashboardMetrics.slaOk} no prazo`}</>}
                onClick={() => router.push('/fila')}
              />
            </Grid>
            {/* Card 2 — Irregularidades detectadas */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<WarningAmberIcon sx={{ fontSize: 20, color: '#b45309' }} />}
                iconBg="rgba(245,158,11,0.12)"
                value={dashboardMetrics.totalAlertasAtivos}
                label="Irregularidades Detectadas"
                sublabel={`${dashboardMetrics.alertasAtivos.slice(0, 2).map(a => `${a.count} ${a.tipo === 'Liminar Judicial' ? 'liminares' : a.tipo === 'NIP Ativa' ? 'NIP ativas' : a.tipo.toLowerCase()}`).join(' · ')}`}
                valueColor="#b45309"
              />
            </Grid>
            {/* Card 3 — Economia gerada */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<SavingsIcon sx={{ fontSize: 20, color: '#16a34a' }} />}
                iconBg="rgba(22,163,74,0.1)"
                value={dashboardMetrics.valorNegado}
                label="Economia Gerada"
                sublabel={`${dashboardMetrics.negados} negativas · taxa ${dashboardMetrics.taxaNegacao}%`}
                valueColor="#16a34a"
              />
            </Grid>
            {/* Card 4 — Efetividade da IA */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<SmartToyIcon sx={{ fontSize: 20, color: '#7c3aed' }} />}
                iconBg="rgba(124,58,237,0.1)"
                value={`${dashboardMetrics.taxaDeteccaoIA}%`}
                label="Efetividade da IA"
                sublabel={`IA antecipou ${dashboardMetrics.iaSinalizouCriticos} de ${dashboardMetrics.totalCriticosHist} negativas`}
                valueColor="#7c3aed"
              />
            </Grid>
            {/* Card 5 — Valor em risco */}
            <Grid size={{ xs: 12, sm: 6, md: 'grow' }}>
              <KpiCard
                icon={<AttachMoneyIcon sx={{ fontSize: 20, color: '#2563eb' }} />}
                iconBg="rgba(37,99,235,0.1)"
                value={dashboardMetrics.valorTotal}
                label="Valor em Risco"
                sublabel={`${pedidos.length} pedidos aguardam decisão`}
                valueColor="#2563eb"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Alertas Ativos — card branco com itens lado a lado */}
      {!loading && dashboardMetrics.alertasAtivos.length > 0 && (() => {
        const getAlertaUrl = (tipo: string) => {
          if (tipo === 'SLA Violado') return '/fila?sla=Violado'
          if (tipo === 'Retornos recebidos') return '/fila?status=retorno_recebido'
          return `/fila?alerta=${encodeURIComponent(tipo)}`
        }
        const alertaIcon = (tipo: string, color: string) => {
          if (tipo === 'Liminar Judicial') return <GavelIcon sx={{ fontSize: 16, color }} />
          if (tipo === 'SLA Violado') return <TimerOffIcon sx={{ fontSize: 16, color }} />
          if (tipo === 'Retornos recebidos') return <AssignmentReturnIcon sx={{ fontSize: 16, color }} />
          return <WarningAmberIcon sx={{ fontSize: 16, color }} />
        }
        return (
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', flex: 1 }}>
                  Alertas que requerem atenção
                </Typography>
                <Chip
                  label={`${dashboardMetrics.alertasAtivos.reduce((s, a) => s + a.count, 0)} no total`}
                  size="small"
                  sx={{ height: 20, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(212,24,61,0.08)', color: '#d4183d', '& .MuiChip-label': { px: 1 } }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {dashboardMetrics.alertasAtivos.map((alerta) => {
                  const url = getAlertaUrl(alerta.tipo)
                  return (
                    <Box
                      key={alerta.tipo}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(url)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(url) } }}
                      aria-label={`Ver ${alerta.count} pedidos: ${alerta.tipo}`}
                      sx={{
                        flex: 1,
                        minWidth: 160,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${alerta.color}22`,
                        backgroundColor: `${alerta.color}07`,
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                        '&:hover': { backgroundColor: `${alerta.color}12` },
                        '&:focus-visible': { outline: `2px solid ${alerta.color}`, outlineOffset: 2 },
                      }}
                    >
                      <Box sx={{ color: alerta.color, flexShrink: 0 }}>{alertaIcon(alerta.tipo, alerta.color)}</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ fontSize: 12, color: alerta.color, fontWeight: 700, lineHeight: 1.2, display: 'block' }} noWrap>
                          {alerta.tipo}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: alerta.color, lineHeight: 1.1 }}>
                          {alerta.count}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 12, color: alerta.color, display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, fontWeight: 600 }}
                      >
                        Ver pedidos <ChevronRightIcon sx={{ fontSize: 14 }} />
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        )
      })()}

      {/* Row 2 — Charts: Bar por categoria + Donut + SLA */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>

        {/* Distribuição por Categoria — flex 5 */}
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
              <CategoriaBarChart />
            )}
          </CardContent>
        </Card>

        {/* Status Geral — flex 3 */}
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
              <DonutChart />
            )}
          </CardContent>
        </Card>

        {/* Sugestões IA — flex 4 */}
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
                  onClick={() => router.push('/fila')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push('/fila') } }}
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
                    { label: 'Negar',       count: dashboardMetrics.iaSugestaoNegar,   color: '#d4183d', textColor: '#d4183d', bg: 'rgba(212,24,61,0.08)',  hoverBg: 'rgba(212,24,61,0.13)',  icon: <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: '#d4183d' }} />, ia: 'Negar',        microcopy: 'com bloqueio identificado' },
                    { label: 'Junta Médica',count: dashboardMetrics.iaSugestaoJunta,   color: '#b45309', textColor: '#b45309', bg: 'rgba(180,83,9,0.08)',   hoverBg: 'rgba(180,83,9,0.13)',   icon: <GroupsOutlinedIcon      sx={{ fontSize: 16, color: '#b45309' }} />, ia: 'Junta Médica', microcopy: 'para revisão clínica' },
                    { label: 'Aprovar',     count: dashboardMetrics.iaSugestaoAprovar, color: '#16a34a', textColor: '#166534', bg: 'rgba(22,163,74,0.08)',  hoverBg: 'rgba(22,163,74,0.13)',  icon: <CheckCircleOutlineIcon  sx={{ fontSize: 16, color: '#16a34a' }} />, ia: 'Aprovar',      microcopy: 'com critérios atendidos' },
                  ] as Array<{ label: string; count: number; color: string; textColor: string; bg: string; hoverBg: string; icon: React.ReactNode; ia: string; microcopy: string }>).map((s) => (
                    <Box
                      key={s.label}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/fila?ia=${encodeURIComponent(s.ia)}`)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?ia=${encodeURIComponent(s.ia)}`) } }}
                      aria-label={`Ver ${s.count} pedidos com sugestão da IA: ${s.label}`}
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

      {/* Row 3 — Trend + Aprovadas (card de auditoria) */}
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
                  <TrendChart />
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
                      {dashboardMetrics.negados}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', display: 'block', mt: 0.75 }}>
                      negativas emitidas
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      Economia estimada: {dashboardMetrics.valorNegado}
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
                      {dashboardMetrics.iaSinalizouCriticos} de {dashboardMetrics.totalCriticosHist} com alerta da IA identificado
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#6b7280' }}>
                      IA antecipou {dashboardMetrics.taxaDeteccaoIA}% das negativas do período
                    </Typography>
                  </Box>
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
              {(() => {
                const criticalAlerts = ['Liminar Judicial', 'NIP Ativa']
                const urgencyScore = (p: Pedido) => {
                  const hasCritical = p.alertas.some(a => criticalAlerts.includes(a))
                  const hasAnyAlert = p.alertas.length > 0
                  if (p.slaStatus === 'violated' && hasCritical) return 0
                  if (p.slaStatus === 'violated') return 1
                  if (p.slaStatus === 'warning' && hasAnyAlert) return 2
                  if (p.slaStatus === 'warning') return 3
                  if (p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' || p.subStatus === 'JUNTA_PARECER_RECEBIDO') return 4
                  return 5
                }
                const urgentFirst = [...pedidos].sort((a, b) => {
                  const diff = urgencyScore(a) - urgencyScore(b)
                  if (diff !== 0) return diff
                  return a.dataProtocolo.localeCompare(b.dataProtocolo)
                }).slice(0, 7)
                const slaColorMap: Record<string, { bg: string; color: string }> = {
                  ok: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
                  warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
                  violated: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
                }
                return (<>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
                      Requerem atenção agora
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
                    <Table size="small" aria-label="Pedidos que requerem atenção">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ pl: 0.5, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>ID</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Beneficiário</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>SLA</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Data</TableCell>
                          <TableCell sx={{ width: 32 }} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {urgentFirst.map((pedido) => {
                          const slaStyle = slaColorMap[pedido.slaStatus] || slaColorMap.ok
                          return (
                            <TableRow
                              key={pedido.id}
                              tabIndex={0}
                              onClick={() => router.push(`/analise?id=${pedido.id}`)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/analise?id=${pedido.id}`) } }}
                              aria-label={`Abrir pedido ${pedido.id} — ${pedido.beneficiario.nome}`}
                              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' }, '&:focus-visible': { outline: '2px solid #902B29', outlineOffset: -2 } }}
                            >
                              <TableCell sx={{ pl: 0.5 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main', fontSize: 12 }}>
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
                                <Chip
                                  label={pedido.slaTexto}
                                  size="small"
                                  sx={{ backgroundColor: slaStyle.bg, color: slaStyle.color, fontSize: 11, fontWeight: 700, height: 20 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                  {pedido.dataProtocolo.split(' ')[0]}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary', verticalAlign: 'middle' }} />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </>)
              })()}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {/* Motivos de Pendência */}
            <Card sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 2, flexShrink: 0 }}>
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
                              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', ml: 1, flexShrink: 0 }}>
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
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 1.5 }}>
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
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/fila?categoria=${encodeURIComponent(cat.categoria)}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?categoria=${encodeURIComponent(cat.categoria)}`) } }}
                        aria-label={`Filtrar por categoria ${cat.categoria}: ${cat.total} pedidos`}
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
                          '&:focus-visible': { outline: `2px solid ${cat.color}`, outlineOffset: 2 },
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
                          sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: `${cat.color}20`, color: 'text.primary', '& .MuiChip-label': { px: 0.5 } }}
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

    </Box>
  )
}
