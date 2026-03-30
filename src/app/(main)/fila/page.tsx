'use client'
import React from 'react'
import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import CardContent from '@mui/material/CardContent'
import AddIcon from '@mui/icons-material/Add'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import EmergencyIcon from '@mui/icons-material/Emergency'
import ReplayIcon from '@mui/icons-material/Replay'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TablePagination from '@mui/material/TablePagination'
import Skeleton from '@mui/material/Skeleton'
import SearchIcon from '@mui/icons-material/Search'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'
import GavelIcon from '@mui/icons-material/Gavel'
import { pedidos, type SLAStatus, type IASugestao, type Categoria, type OrigemPedido, type SubStatus } from '@/data/pedidos'

// ── Continuidade / 1ª Solicitação mock map ────────────────────────────
const solicitacaoTipoMap: Record<string, 'continuidade' | 'primeira'> = {
  'REQ-2026-04797': 'continuidade',
  'REQ-2026-04801': 'continuidade',
  'REQ-2026-04812': 'continuidade',
  'REQ-2026-04820': 'primeira',
  'REQ-2026-04831': 'continuidade',
  'REQ-2026-04843': 'continuidade',
  'REQ-2026-04855': 'primeira',
  'REQ-2026-04790': 'continuidade',
  'REQ-2026-04795': 'primeira',
  'REQ-2026-04870': 'continuidade',
  'REQ-2026-04882': 'continuidade',
  'REQ-2026-04891': 'primeira',
  'REQ-2026-04905': 'continuidade',
  'REQ-2026-04868': 'primeira',
}

function SolicitacaoTipoChip({ id }: { id: string }) {
  const tipo = solicitacaoTipoMap[id] ?? 'primeira'
  if (tipo === 'continuidade') {
    return (
      <Chip
        label="Continuidade"
        size="small"
        icon={<span style={{ fontSize: 10, marginLeft: 6, fontWeight: 900 }}>↻</span>}
        sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#15803d', fontSize: 11, fontWeight: 700, height: 20 }}
      />
    )
  }
  return (
    <Chip
      label="1ª Solicitação"
      size="small"
      icon={<span style={{ fontSize: 9, marginLeft: 6, fontWeight: 900 }}>✦</span>}
      sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#1d4ed8', fontSize: 11, fontWeight: 700, height: 20 }}
    />
  )
}

// ── SLA Chip ──────────────────────────────────────────────────────────
function SLAChip({ status, texto }: { status: SLAStatus; texto: string }) {
  const colorMap: Record<SLAStatus, { bg: string; color: string }> = {
    ok: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
    warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
    violated: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  }
  const { bg, color } = colorMap[status]
  return (
    <Chip
      icon={<AccessTimeIcon style={{ fontSize: 12, color }} />}
      label={texto}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 22 }}
    />
  )
}

// ── IA Sugestão Chip ──────────────────────────────────────────────────
function IASugestaoChip({ sugestao }: { sugestao: IASugestao }) {
  const colorMap: Record<IASugestao, { bg: string; color: string }> = {
    Aprovar: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
    Negar: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
    'Junta Médica': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  }
  const { bg, color } = colorMap[sugestao]
  return (
    <Chip
      label={sugestao}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 22 }}
    />
  )
}

// ── SubStatus label (stacks above the Analisar button) ────────────────
const subStatusConfig: Record<SubStatus, { label: string; color: string; pulsing: boolean }> = {
  PENDENTE_AGUARDANDO:      { label: 'Aguardando',       color: '#b45309', pulsing: true  },
  PENDENTE_RETORNO_RECEBIDO:{ label: 'Retorno recebido', color: '#b45309', pulsing: false },
  JUNTA_AGUARDANDO:         { label: 'Ag. Junta Médica', color: '#2563eb', pulsing: true  },
  JUNTA_PARECER_RECEBIDO:   { label: 'Parecer recebido', color: '#2563eb', pulsing: false },
}

function RowStatusLabel({ subStatus }: { subStatus: SubStatus }) {
  const cfg = subStatusConfig[subStatus]
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: cfg.color,
          flexShrink: 0,
          ...(cfg.pulsing && {
            '@keyframes subStatusPulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.2 },
            },
            animation: 'subStatusPulse 1.6s ease-in-out infinite',
          }),
        }}
      />
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.color, lineHeight: 1, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
        {cfg.label}
      </Typography>
    </Box>
  )
}

// ── Categoria Chip ────────────────────────────────────────────────────
const catColorMap: Record<string, { bg: string; color: string }> = {
  'Internação': { bg: 'rgba(144,43,41,0.1)', color: '#902B29' },
  'Urgência/Emergência': { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  'Oncologia': { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
  'Terapias Especiais': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  'OPME': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Exames Alta Complexidade': { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  'Cirurgias Eletivas': { bg: 'rgba(5,150,105,0.1)', color: '#059669' },
  'Home Care': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  'SADT': { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
}

function CategoriaChip({ categoria }: { categoria: string }) {
  const { bg, color } = catColorMap[categoria] || { bg: 'rgba(0,0,0,0.06)', color: '#5a6070' }
  return (
    <Chip label={categoria} size="small" sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 600, height: 22 }} />
  )
}

// ── Tipo Guia Chip ────────────────────────────────────────────────────
function TipoGuiaChip({ tipo }: { tipo: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Eleitiva: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
    Urgente: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
    'Emergência': { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  }
  const { bg, color } = map[tipo] || { bg: 'rgba(0,0,0,0.06)', color: '#5a6070' }
  return (
    <Chip label={tipo} size="small" sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 20 }} />
  )
}

// ── Origem Chip ───────────────────────────────────────────────────────
const origemMap: Record<OrigemPedido, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  app:       { label: 'App Athena', bg: 'rgba(37,99,235,0.08)',   color: '#2563eb', icon: <PhoneAndroidIcon style={{ fontSize: 11 }} /> },
  whatsapp:  { label: 'WhatsApp',   bg: 'rgba(22,163,74,0.08)',   color: '#16a34a', icon: <WhatsAppIcon style={{ fontSize: 11 }} /> },
  email:     { label: 'E-mail',     bg: 'rgba(8,145,178,0.08)',   color: '#0891b2', icon: <EmailOutlinedIcon style={{ fontSize: 11 }} /> },
  prestador: { label: 'Prestador',  bg: 'rgba(144,43,41,0.08)',   color: '#902B29', icon: <LocalHospitalOutlinedIcon style={{ fontSize: 11 }} /> },
}
function OrigemChip({ origem }: { origem: OrigemPedido }) {
  const { label, bg, color, icon } = origemMap[origem]
  return (
    <Chip
      icon={<span style={{ display: 'flex', alignItems: 'center', marginLeft: 6, color }}>{icon}</span>}
      label={label}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 600, height: 22, '& .MuiChip-icon': { color } }}
    />
  )
}

// ── Priority Dot ──────────────────────────────────────────────────────
function PrioDot({ prio }: { prio: 'alta' | 'media' | 'baixa' }) {
  const color = prio === 'alta' ? '#d4183d' : prio === 'media' ? '#f59e0b' : '#16a34a'
  return (
    <Box
      sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, mx: 'auto' }}
      title={prio === 'alta' ? 'Alta prioridade' : prio === 'media' ? 'Média prioridade' : 'Baixa prioridade'}
    />
  )
}

// ── Metric Card ───────────────────────────────────────────────────────
function MetricCard({
  value,
  label,
  sublabel,
  linkLabel,
  onLinkClick,
  valueColor,
  icon,
  iconBg,
}: {
  value: number | string
  label: string
  sublabel?: string
  linkLabel: string
  onLinkClick: () => void
  valueColor?: string
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <Card
      onClick={onLinkClick}
      sx={{
        flex: 1,
        cursor: 'pointer',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-1px)' },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Top row: label left — icon right */}
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
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
        {/* Big number */}
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, color: valueColor || 'text.primary', fontSize: 26, mb: 0.75 }}>
          {value}
        </Typography>
        {/* Link */}
        <Typography
          variant="caption"
          sx={{ color: 'primary.main', fontWeight: 600, fontSize: 12, '&:hover': { textDecoration: 'underline' } }}
        >
          {linkLabel} →
        </Typography>
      </CardContent>
    </Card>
  )
}

// ── Main inner component ──────────────────────────────────────────────
function FilaInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialCategoria = searchParams.get('categoria') || 'Todas'

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('beneficiario') || '')
  const [categoriaFilter, setCategoriaFilter] = useState(initialCategoria)
  const [slaFilter, setSlaFilter] = useState(searchParams.get('sla') || 'Todas')
  const [alertaFilter, setAlertaFilter] = useState(searchParams.get('alerta') || 'Todos')
  const [prestadorFilter, setPrestadorFilter] = useState('Todos')
  const [iaFilter, setIaFilter] = useState('Todas')
  const [tabValue, setTabValue] = useState(parseInt(searchParams.get('tab') || '0', 10))
  const [devolutivasSubFilter, setDevolutivasSubFilter] = useState<'all' | 'aguardando' | 'retorno'>('all')
  const [page, setPage] = useState(0)
  const [lastViewedId, setLastViewedId] = useState<string | null>(null)
  const rowsPerPage = 10
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Restore scroll position on return from analise
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('fila_scroll') : null
    const savedId = typeof window !== 'undefined' ? sessionStorage.getItem('fila_last_id') : null
    if (saved && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(saved, 10)
    }
    if (savedId) {
      setLastViewedId(savedId)
      setTimeout(() => setLastViewedId(null), 2500)
    }
    sessionStorage.removeItem('fila_scroll')
    sessionStorage.removeItem('fila_last_id')
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  // Update filters when URL params change
  useEffect(() => {
    setCategoriaFilter(searchParams.get('categoria') || 'Todas')
    setSlaFilter(searchParams.get('sla') || 'Todas')
    setAlertaFilter(searchParams.get('alerta') || 'Todos')
  }, [searchParams])

  const hasFilters =
    search !== '' ||
    categoriaFilter !== 'Todas' ||
    slaFilter !== 'Todas' ||
    alertaFilter !== 'Todos' ||
    prestadorFilter !== 'Todos' ||
    iaFilter !== 'Todas'

  const isParado12h = (p: (typeof pedidos)[number]) => {
    const t = parseInt(p.tempoFila)
    return !isNaN(t) && t > 12
  }

  const filteredByTab = pedidos.filter((p) => {
    if (tabValue === 1) return p.categoria === 'Urgência/Emergência' || p.tipoGuia === 'Emergência'
    if (tabValue === 2) {
      if (p.status !== 'Devolutiva') return false
      if (devolutivasSubFilter === 'aguardando') return p.subStatus === 'PENDENTE_AGUARDANDO'
      if (devolutivasSubFilter === 'retorno') return p.subStatus === 'PENDENTE_RETORNO_RECEBIDO'
      return true
    }
    if (tabValue === 3) return isParado12h(p)
    return true
  })

  const filtered = filteredByTab.filter((p) => {
    const q = search.toLowerCase().trim()
    const words = q.split(/\s+/).filter(Boolean)
    const matchSearch =
      q === '' ||
      p.id.toLowerCase().includes(q) ||
      p.beneficiario.carteirinha.includes(q) ||
      (p.procedimentos[0]?.descricao || '').toLowerCase().includes(q) ||
      words.every(w => p.beneficiario.nome.toLowerCase().includes(w))
    const matchCat = categoriaFilter === 'Todas' || p.categoria === categoriaFilter
    const matchSla =
      slaFilter === 'Todas' ||
      (slaFilter === 'No prazo' && p.slaStatus === 'ok') ||
      (slaFilter === 'Atenção' && p.slaStatus === 'warning') ||
      (slaFilter === 'Violado' && p.slaStatus === 'violated')
    const matchPrest =
      prestadorFilter === 'Todos' || p.prestador.hospital === prestadorFilter
    const matchIA = iaFilter === 'Todas' || p.iaSugestao === iaFilter
    const matchAlerta = alertaFilter === 'Todos' || p.alertas.includes(alertaFilter)
    return matchSearch && matchCat && matchSla && matchPrest && matchIA && matchAlerta
  })

  const pagedItems = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const urgEmergCount = pedidos.filter((p) => p.categoria === 'Urgência/Emergência' || p.tipoGuia === 'Emergência').length
  const devolutivasCount = pedidos.filter((p) => p.status === 'Devolutiva').length
  const devolutivasAguardando = pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_AGUARDANDO').length
  const devolutivasRetorno = pedidos.filter((p) => p.status === 'Devolutiva' && p.subStatus === 'PENDENTE_RETORNO_RECEBIDO').length
  const parados12h = pedidos.filter(isParado12h).length

  return (
    <Box ref={scrollContainerRef} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {categoriaFilter === 'Todas' ? 'Fila Operacional' : categoriaFilter}
        </Typography>
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

      {/* Metric Cards Row — apenas na fila geral */}
      {categoriaFilter === 'Todas' && <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ flex: 1, minWidth: 140 }}>
              <Skeleton variant="rectangular" height={88} sx={{ borderRadius: 2 }} />
            </Box>
          ))
        ) : (
          <>
            <MetricCard
              value={pedidos.length}
              label="Na Fila de Análise"
              sublabel="Total de pedidos ativos"
              linkLabel="Ver todos os pedidos"
              onLinkClick={() => setTabValue(0)}
              icon={<FormatListBulletedIcon sx={{ fontSize: 18, color: '#902B29' }} />}
              iconBg="rgba(144,43,41,0.1)"
            />
            <MetricCard
              value={urgEmergCount}
              label="Urgência / Emergência"
              sublabel="Requerem atenção imediata"
              linkLabel="Ver pedidos em U/E"
              onLinkClick={() => setTabValue(1)}
              valueColor="#d4183d"
              icon={<EmergencyIcon sx={{ fontSize: 18, color: '#d4183d' }} />}
              iconBg="rgba(212,24,61,0.1)"
            />
            <MetricCard
              value={devolutivasCount}
              label="Devolutivas"
              sublabel="Aguardando complemento"
              linkLabel="Ver as devolutivas"
              onLinkClick={() => setTabValue(2)}
              valueColor="#b45309"
              icon={<ReplayIcon sx={{ fontSize: 18, color: '#b45309' }} />}
              iconBg="rgba(245,158,11,0.12)"
            />
            <MetricCard
              value={parados12h}
              label="Parados há mais de 12h"
              sublabel="SLA em risco"
              linkLabel="Ver pedidos"
              onLinkClick={() => setTabValue(3)}
              valueColor="#ea580c"
              icon={<TimerOffIcon sx={{ fontSize: 18, color: '#ea580c' }} />}
              iconBg="rgba(234,88,12,0.1)"
            />
          </>
        )}
      </Box>}

      {/* Table Card */}
      <Card>
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <Tabs
            value={tabValue}
            onChange={(_e, v) => { setTabValue(v); setPage(0) }}
            aria-label="Abas da fila"
            sx={{
              px: 2,
              '& .MuiTab-root': { minHeight: 48, fontSize: 13, fontWeight: 600 },
              '& .Mui-selected': { color: 'primary.main' },
              '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Fila Geral
                  <Chip label={pedidos.length} size="small" sx={{ height: 18, fontSize: 12, fontWeight: 700 }} />
                </Box>
              }
              aria-label="Fila Geral"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Urgência/Emergência
                  <Chip
                    label={urgEmergCount}
                    size="small"
                    sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d' }}
                  />
                </Box>
              }
              aria-label="Urgência/Emergência"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Devolutivas
                  <Chip
                    label={devolutivasCount}
                    size="small"
                    sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309' }}
                  />
                </Box>
              }
              aria-label="Devolutivas"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  SLA em Risco
                  <Chip
                    label={parados12h}
                    size="small"
                    sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(234,88,12,0.1)', color: '#ea580c' }}
                  />
                </Box>
              }
              aria-label="SLA em Risco"
            />
          </Tabs>
        </Box>

        {/* Devolutivas sub-filter chips */}
        {tabValue === 2 && (
          <Box sx={{ px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'rgba(245,158,11,0.03)' }}>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mr: 0.5 }}>
              Filtrar:
            </Typography>
            {([
              { key: 'all', label: `Todas (${devolutivasCount})`, icon: null },
              { key: 'aguardando', label: `Aguardando (${devolutivasAguardando})`, icon: <HourglassTopIcon sx={{ fontSize: 13 }} /> },
              { key: 'retorno', label: `Retorno recebido (${devolutivasRetorno})`, icon: <MoveToInboxIcon sx={{ fontSize: 13 }} /> },
            ] as const).map(({ key, label, icon }) => (
              <Chip
                key={key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {icon}
                    {label}
                  </Box>
                }
                size="small"
                onClick={() => { setDevolutivasSubFilter(key); setPage(0) }}
                sx={{
                  height: 24,
                  fontSize: 12,
                  fontWeight: devolutivasSubFilter === key ? 700 : 500,
                  backgroundColor: devolutivasSubFilter === key ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.05)',
                  color: devolutivasSubFilter === key ? '#b45309' : 'text.secondary',
                  border: devolutivasSubFilter === key ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        )}

        {/* Filter bar */}
        <Box
          sx={{
            px: 2,
            py: 1.75,
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
            gap: 1.5,
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <TextField
            placeholder="Buscar (ID, nome, carteirinha...)"
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': 'Buscar na fila' },
            }}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoriaFilter}
              label="Categoria"
              onChange={(e) => { setCategoriaFilter(e.target.value); setPage(0) }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="Internação">Internação</MenuItem>
              <MenuItem value="Urgência/Emergência">Urgência/Emergência</MenuItem>
              <MenuItem value="Oncologia">Oncologia</MenuItem>
              <MenuItem value="Terapias Especiais">Terapias Especiais</MenuItem>
              <MenuItem value="OPME">OPME</MenuItem>
              <MenuItem value="Exames Alta Complexidade">Exames Alta Complexidade</MenuItem>
              <MenuItem value="Cirurgias Eletivas">Cirurgias Eletivas</MenuItem>
              <MenuItem value="Home Care">Home Care</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Situação SLA</InputLabel>
            <Select
              value={slaFilter}
              label="Situação SLA"
              onChange={(e) => { setSlaFilter(e.target.value); setPage(0) }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="No prazo">No prazo</MenuItem>
              <MenuItem value="Atenção">Atenção</MenuItem>
              <MenuItem value="Violado">Violado</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Prestador</InputLabel>
            <Select
              value={prestadorFilter}
              label="Prestador"
              onChange={(e) => { setPrestadorFilter(e.target.value); setPage(0) }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Hospital São Lucas">Hospital São Lucas</MenuItem>
              <MenuItem value="Clínica Integrar TEA">Clínica Integrar TEA</MenuItem>
              <MenuItem value="Hospital Sírio-Libanês SP">Hospital Sírio-Libanês SP</MenuItem>
              <MenuItem value="Lab Diagnostium">Lab Diagnostium</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Sugestão IA</InputLabel>
            <Select
              value={iaFilter}
              label="Sugestão IA"
              onChange={(e) => { setIaFilter(e.target.value); setPage(0) }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="Aprovar">Aprovar</MenuItem>
              <MenuItem value="Negar">Negar</MenuItem>
              <MenuItem value="Junta Médica">Junta Médica</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="text"
            size="small"
            disabled={!hasFilters}
            onClick={() => {
              setSearch('')
              setCategoriaFilter('Todas')
              setSlaFilter('Todas')
              setPrestadorFilter('Todos')
              setIaFilter('Todas')
              setPage(0)
            }}
            sx={{ minHeight: 36, fontSize: 12, color: 'text.secondary' }}
          >
            Limpar
          </Button>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table aria-label="Tabela da fila operacional" size="small">
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary', px: 1.5 } }}>
                  <TableCell align="center" sx={{ width: 44 }}>Prio.</TableCell>
                  <TableCell sx={{ minWidth: 130 }}>ID</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>Origem</TableCell>
                  <TableCell sx={{ minWidth: 195 }}>Beneficiário</TableCell>
                  <TableCell sx={{ minWidth: 175 }}>Prestador</TableCell>
                  {categoriaFilter === 'Todas' && <TableCell sx={{ minWidth: 155 }}>Categoria</TableCell>}
                  <TableCell sx={{ minWidth: 220, maxWidth: 220 }}>Procedimento</TableCell>
                  <TableCell sx={{ minWidth: 85, whiteSpace: 'nowrap' }}>Em Fila</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>SLA</TableCell>
                  <TableCell sx={{ minWidth: 110 }}>IA</TableCell>
                  <TableCell sx={{ minWidth: 115 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ py: 6, border: 0 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <SearchIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
                        </Box>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          Nenhum pedido encontrado
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {hasFilters ? 'Tente ajustar ou limpar os filtros aplicados.' : 'A fila está vazia no momento.'}
                        </Typography>
                        {hasFilters && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            sx={{ mt: 0.5, fontSize: 12, borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary' }}
                            onClick={() => {
                              setSearch('')
                              setCategoriaFilter('Todas')
                              setSlaFilter('Todas')
                              setPrestadorFilter('Todos')
                              setIaFilter('Todas')
                              setPage(0)
                            }}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedItems.map((pedido) => (
                    <TableRow
                      key={pedido.id}
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          sessionStorage.setItem('fila_scroll', String(scrollContainerRef.current.scrollTop))
                        }
                        sessionStorage.setItem('fila_last_id', pedido.id)
                        router.push(`/analise?id=${pedido.id}`)
                      }}
                      aria-label={`Pedido ${pedido.id}`}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.25s ease',
                        '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' },
                        ...(pedido.id === lastViewedId && {
                          backgroundColor: 'rgba(144,43,41,0.06) !important',
                          outline: '1px solid rgba(144,43,41,0.2)',
                        }),
                        ...(pedido.status === 'Devolutiva' && {
                          borderLeft: '3px solid #f59e0b',
                        }),
                        ...(pedido.subStatus === 'PENDENTE_RETORNO_RECEBIDO' && {
                          backgroundColor: 'rgba(245,158,11,0.06) !important',
                        }),
                        ...(pedido.subStatus === 'JUNTA_PARECER_RECEBIDO' && {
                          backgroundColor: 'rgba(37,99,235,0.05) !important',
                          borderLeft: '3px solid #2563eb',
                        }),
                        ...(pedido.subStatus === 'JUNTA_AGUARDANDO' && {
                          borderLeft: '3px solid rgba(37,99,235,0.5)',
                        }),
                      }}
                    >
                      <TableCell align="center" sx={{ px: 1.5 }}>
                        <PrioDot prio={pedido.prioridade} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main', fontSize: 12 }}>
                          {pedido.id}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                          {`${pedido.dataProtocolo.slice(0, 5)} · ${pedido.dataProtocolo.split(' ')[1]}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <OrigemChip origem={pedido.origem} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
                          {pedido.beneficiario.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                          {pedido.beneficiario.plano}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          <SolicitacaoTipoChip id={pedido.id} />
                          <TipoGuiaChip tipo={pedido.tipoGuia} />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {pedido.prestador.hospital}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                          {pedido.prestador.medico}
                        </Typography>
                      </TableCell>
                      {categoriaFilter === 'Todas' && <TableCell sx={{ px: 1.5 }}>
                        <CategoriaChip categoria={pedido.categoria} />
                      </TableCell>}
                      <TableCell sx={{ maxWidth: 160, px: 1.5 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {pedido.procedimentos[0]?.tuss || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}>
                          {pedido.procedimentos[0]?.descricao || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                            {pedido.tempoFila}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <SLAChip status={pedido.slaStatus} texto={pedido.slaTexto} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }}>
                        <IASugestaoChip sugestao={pedido.iaSugestao} />
                      </TableCell>
                      <TableCell sx={{ px: 1.5 }} onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => router.push(`/analise?id=${pedido.id}`)}
                            aria-label={`Analisar pedido ${pedido.id}`}
                            sx={{ minHeight: 28, fontSize: 12, px: 1.5 }}
                          >
                            Analisar
                          </Button>
                          {pedido.subStatus && (
                            <Box sx={{ mt: 0.75 }}>
                              <RowStatusLabel subStatus={pedido.subStatus} />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        <Box
          sx={{
            px: 2,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, py: 1.5 }}>
            Exibindo {Math.min(page * rowsPerPage + 1, filtered.length)}–{Math.min((page + 1) * rowsPerPage, filtered.length)} de {filtered.length} solicitações
          </Typography>
          <TablePagination
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPageOptions={[rowsPerPage]}
            labelDisplayedRows={() => ''}
            sx={{
              '& .MuiTablePagination-toolbar': { minHeight: 40 },
              '& .MuiTablePagination-spacer': { display: 'none' },
              '& .MuiTablePagination-displayedRows': { display: 'none' },
            }}
          />
        </Box>
      </Card>
    </Box>
  )
}


export default function FilaPage() {
  return (
    <Suspense fallback={
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={88} sx={{ flex: 1, borderRadius: 2 }} />
          ))}
        </Box>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    }>
      <FilaInner />
    </Suspense>
  )
}
