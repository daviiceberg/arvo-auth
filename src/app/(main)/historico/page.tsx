'use client'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ReplayIcon from '@mui/icons-material/Replay'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ScienceIcon from '@mui/icons-material/Science'
import { historicoEntries, type DecisaoAcao, type DecisaoOrigem } from '@/data/pedidos'

// ── Categoria Chip ────────────────────────────────────────────────────
const catColorMap: Record<string, { bg: string; color: string }> = {
  'Internação':              { bg: 'rgba(144,43,41,0.1)',   color: '#902B29' },
  'Urgência/Emergência':     { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
  'Oncologia':               { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
  'Terapias Especiais':      { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'OPME':                    { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Exames Alta Complexidade':{ bg: 'rgba(8,145,178,0.1)',   color: '#0891b2' },
  'Cirurgias Eletivas':      { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  'Home Care':               { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'SADT':                    { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
}

const TRUNCATE_CATS = ['Exames Alta Complexidade', 'Cirurgias Eletivas', 'Terapias Especiais', 'Urgência/Emergência']
function CategoriaChip({ categoria }: { categoria: string }) {
  const { bg, color } = catColorMap[categoria] || { bg: 'rgba(0,0,0,0.06)', color: '#5a6070' }
  const needsTruncate = TRUNCATE_CATS.includes(categoria)
  const label = needsTruncate ? categoria.slice(0, 13) + '…' : categoria
  const chip = <Chip label={label} size="small" sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 600, height: 22 }} />
  return needsTruncate ? <Tooltip title={categoria} placement="top">{chip}</Tooltip> : chip
}

// ── Chips ──────────────────────────────────────────────────────────────
function AcaoChip({ acao }: { acao: DecisaoAcao }) {
  const map: Record<DecisaoAcao, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
    Aprovado:  { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a', icon: <CheckCircleIcon sx={{ fontSize: 13 }} />, label: 'Aprovado' },
    Negado:    { bg: 'rgba(212,24,61,0.1)',    color: '#d4183d', icon: <CancelIcon      sx={{ fontSize: 13 }} />, label: 'Negado' },
    Devolutiva:{ bg: 'rgba(245,158,11,0.12)',  color: '#b45309', icon: <ReplayIcon      sx={{ fontSize: 13 }} />, label: 'Devolutiva' },
  }
  const { bg, color, icon, label } = map[acao]
  return (
    <Chip
      icon={<Box sx={{ color, display: 'flex', '& svg': { color: `${color} !important` } }}>{icon}</Box>}
      label={label}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 22 }}
    />
  )
}

function OrigemChip({ origem }: { origem: DecisaoOrigem }) {
  if (origem === 'ia_automatica') {
    return (
      <Chip
        icon={<SmartToyIcon sx={{ fontSize: 13, color: '#2563eb !important' }} />}
        label="IA Automática"
        size="small"
        sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontSize: 12, fontWeight: 700, height: 22 }}
      />
    )
  }
  return (
    <Chip
      icon={<PersonIcon sx={{ fontSize: 13, color: '#5a6070 !important' }} />}
      label="Analista"
      size="small"
      sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#374151', fontSize: 12, fontWeight: 700, height: 22 }}
    />
  )
}

// ── Main page ─────────────────────────────────────────────────────────
export default function HistoricoPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [origemFilter, setOrigemFilter] = useState<'Todas' | 'ia_automatica' | 'analista'>('Todas')
  const [acaoFilter, setAcaoFilter] = useState<'Todas' | DecisaoAcao>('Todas')
  const [categoriaFilter, setCategoriaFilter] = useState('Todas')
  const [divergenciaFilter, setDivergenciaFilter] = useState<'Todas' | 'divergiu'>('Todas')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const categorias = ['Todas', ...Array.from(new Set(historicoEntries.map(e => e.categoria)))]

  const filtered = historicoEntries
    .filter(e => {
      const matchSearch = search === '' ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.beneficiario.toLowerCase().includes(search.toLowerCase()) ||
        e.procedimento.toLowerCase().includes(search.toLowerCase()) ||
        e.analista.toLowerCase().includes(search.toLowerCase())
      const matchOrigem = origemFilter === 'Todas' || e.origem === origemFilter
      const matchAcao = acaoFilter === 'Todas' || e.acao === acaoFilter
      const matchCat = categoriaFilter === 'Todas' || e.categoria === categoriaFilter
      const matchDiv = divergenciaFilter === 'Todas' || (divergenciaFilter === 'divergiu' && e.divergencia)
      return matchSearch && matchOrigem && matchAcao && matchCat && matchDiv
    })
    .sort((a, b) => {
      const da = new Date(a.dataDecisao.split('/').reverse().join('-')).getTime()
      const db = new Date(b.dataDecisao.split('/').reverse().join('-')).getTime()
      return sortDir === 'desc' ? db - da : da - db
    })

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const hasFilters = search !== '' || origemFilter !== 'Todas' || acaoFilter !== 'Todas' || categoriaFilter !== 'Todas' || divergenciaFilter !== 'Todas'

  const clearFilters = () => { setSearch(''); setOrigemFilter('Todas'); setAcaoFilter('Todas'); setCategoriaFilter('Todas'); setDivergenciaFilter('Todas') }

  // Summary counts
  const totalIA = historicoEntries.filter(e => e.origem === 'ia_automatica').length
  const totalAnalista = historicoEntries.filter(e => e.origem === 'analista').length
  const totalAprovados = historicoEntries.filter(e => e.acao === 'Aprovado').length
  const totalDivergencias = historicoEntries.filter(e => e.divergencia).length

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Histórico</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
            Registro auditável de todas as decisões — somente leitura
          </Typography>
        </Box>
      </Box>

      {/* Summary KPI strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total de Decisões', value: historicoEntries.length, color: 'text.primary', icon: <ScienceIcon sx={{ fontSize: 18, color: '#902B29' }} />, bg: 'rgba(144,43,41,0.1)' },
          { label: 'Processadas por IA', value: totalIA, color: '#2563eb', icon: <SmartToyIcon sx={{ fontSize: 18, color: '#2563eb' }} />, bg: 'rgba(37,99,235,0.1)' },
          { label: 'Decididas por Analista', value: totalAnalista, color: 'text.primary', icon: <PersonIcon sx={{ fontSize: 18, color: '#5a6070' }} />, bg: 'rgba(0,0,0,0.07)' },
          { label: 'Taxa de Aprovação', value: `${Math.round((totalAprovados / historicoEntries.length) * 100)}%`, color: '#16a34a', icon: <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />, bg: 'rgba(22,163,74,0.1)' },
          { label: 'Divergências IA/Analista', value: totalDivergencias, color: '#b45309', icon: <WarningAmberIcon sx={{ fontSize: 18, color: '#b45309' }} />, bg: 'rgba(245,158,11,0.12)' },
        ].map((kpi) => (
          <Card key={kpi.label} sx={{ flex: 1, minWidth: 140 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, transition: 'box-shadow 0.15s ease' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>
                  {kpi.label}
                </Typography>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, color: kpi.color, fontSize: 24 }}>
                {kpi.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Buscar por ID, beneficiário, procedimento ou analista..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              sx={{ flex: 2, minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Origem</InputLabel>
              <Select value={origemFilter} label="Origem" onChange={(e) => { setOrigemFilter(e.target.value as typeof origemFilter); setPage(0) }}>
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="ia_automatica">IA Automática</MenuItem>
                <MenuItem value="analista">Analista</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Decisão</InputLabel>
              <Select value={acaoFilter} label="Decisão" onChange={(e) => { setAcaoFilter(e.target.value as typeof acaoFilter); setPage(0) }}>
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="Aprovado">Aprovado</MenuItem>
                <MenuItem value="Negado">Negado</MenuItem>
                <MenuItem value="Devolutiva">Devolutiva</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Categoria</InputLabel>
              <Select value={categoriaFilter} label="Categoria" onChange={(e) => { setCategoriaFilter(e.target.value); setPage(0) }}>
                {categorias.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Divergência IA</InputLabel>
              <Select value={divergenciaFilter} label="Divergência IA" onChange={(e) => { setDivergenciaFilter(e.target.value as typeof divergenciaFilter); setPage(0) }}>
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="divergiu">Apenas divergências</MenuItem>
              </Select>
            </FormControl>
            {hasFilters && (
              <Button size="small" startIcon={<FilterListOffIcon />} onClick={clearFilters} color="inherit" sx={{ fontSize: 12 }}>
                Limpar filtros
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary', px: 1.5 } }}>
              <TableCell sx={{ minWidth: 130 }}>ID</TableCell>
              <TableCell sx={{ minWidth: 180 }}>Beneficiário</TableCell>
              <TableCell sx={{ minWidth: 175 }}>Categoria</TableCell>
              <TableCell sx={{ minWidth: 280, maxWidth: 280 }}>Procedimento</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Decisão</TableCell>
              <TableCell sx={{ minWidth: 185 }}>Origem / Responsável</TableCell>
              <TableCell sx={{ minWidth: 130 }}>IA</TableCell>
              <TableCell
                sx={{ minWidth: 135, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Data Decisão
                  {sortDir === 'desc' ? <ArrowDownwardIcon sx={{ fontSize: 14 }} /> : sortDir === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 14 }} /> : <UnfoldMoreIcon sx={{ fontSize: 14 }} />}
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: 125 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Nenhuma decisão encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : paged.map((entry) => (
              <TableRow
                key={entry.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { backgroundColor: 'rgba(144,43,41,0.03)' },
                  ...(entry.acao === 'Devolutiva' && {
                    borderLeft: '3px solid #f59e0b',
                  }),
                }}
                onClick={() => router.push('/historico/' + entry.id)}
              >
                <TableCell sx={{ px: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                    {entry.id}
                  </Typography>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>{entry.beneficiario}</Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace' }}>
                    …{entry.carteirinha.slice(-8)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}><CategoriaChip categoria={entry.categoria} /></TableCell>
                <TableCell sx={{ maxWidth: 210, px: 1.5 }}>
                  <Tooltip title={entry.procedimento} placement="top">
                    <Typography variant="body2" sx={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 210 }}>
                      {entry.procedimento}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}><AcaoChip acao={entry.acao} /></TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <OrigemChip origem={entry.origem} />
                  {entry.origem === 'analista' && (
                    <Typography variant="caption" sx={{ display: 'block', fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                      {entry.analista}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Chip
                    label={entry.iaSugestao}
                    size="small"
                    sx={{
                      fontSize: 12, fontWeight: 700, height: 20,
                      backgroundColor: entry.iaSugestao === 'Aprovar' ? 'rgba(22,163,74,0.1)' : entry.iaSugestao === 'Negar' ? 'rgba(212,24,61,0.1)' : 'rgba(245,158,11,0.12)',
                      color: entry.iaSugestao === 'Aprovar' ? '#16a34a' : entry.iaSugestao === 'Negar' ? '#d4183d' : '#b45309',
                    }}
                  />
                  {entry.divergencia ? (
                    <Typography variant="caption" sx={{ display: 'block', fontSize: 11, color: '#b45309', fontWeight: 600, mt: 0.4 }}>
                      ⚠ Divergiu
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ display: 'block', fontSize: 11, color: '#16a34a', fontWeight: 600, mt: 0.4 }}>
                      ✓ Alinhado
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {`${entry.dataDecisao.slice(0, 5)}/${entry.dataDecisao.slice(8, 10)} · ${entry.dataDecisao.split(' ')[1]}`}
                  </Typography>
                </TableCell>
                <TableCell sx={{ px: 1.5 }}>
                  <Button size="small" variant="outlined" sx={{ fontSize: 12, py: 0.25, px: 1.5, minHeight: 28 }}
                    onClick={(e) => { e.stopPropagation(); router.push('/historico/' + entry.id) }}>
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_e, p) => setPage(p)}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Card>

    </Box>
  )
}
