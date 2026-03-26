'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import DownloadIcon from '@mui/icons-material/Download'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import ReplayIcon from '@mui/icons-material/Replay'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import GroupsIcon from '@mui/icons-material/Groups'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import HistoryIcon from '@mui/icons-material/History'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import GavelIcon from '@mui/icons-material/Gavel'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import PrintIcon from '@mui/icons-material/Print'
import EditIcon from '@mui/icons-material/Edit'
import { historicoEntries, type DecisaoAcao, type HistoricoEntry, type Ajuste } from '@/data/pedidos'

// ── Sorted list (same default order as list page) ─────────────────────
const sortedEntries = [...historicoEntries].sort((a, b) => {
  const parse = (d: string) => new Date(d.split('/').reverse().join('-')).getTime()
  return parse(b.dataDecisao) - parse(a.dataDecisao)
})

// ── Categoria color map ────────────────────────────────────────────────
const catColorMap: Record<string, { bg: string; color: string }> = {
  'Internação':               { bg: 'rgba(144,43,41,0.1)',   color: '#902B29' },
  'Urgência/Emergência':      { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
  'Oncologia':                { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
  'Terapias Especiais':       { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  'OPME':                     { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  'Exames Alta Complexidade': { bg: 'rgba(8,145,178,0.1)',   color: '#0891b2' },
  'Cirurgias Eletivas':       { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  'Home Care':                { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'SADT':                     { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
}

// ── Acao chip ─────────────────────────────────────────────────────────
const acaoConfig: Record<DecisaoAcao, { bg: string; color: string; icon: React.ReactNode }> = {
  Aprovado:   { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a', icon: <CheckCircleIcon sx={{ fontSize: 13 }} /> },
  Negado:     { bg: 'rgba(212,24,61,0.1)',    color: '#d4183d', icon: <CancelIcon sx={{ fontSize: 13 }} /> },
  Devolutiva: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', icon: <ReplayIcon sx={{ fontSize: 13 }} /> },
}

function AcaoChip({ acao }: { acao: DecisaoAcao }) {
  const { bg, color, icon } = acaoConfig[acao]
  return (
    <Chip
      icon={<Box sx={{ color, display: 'flex', '& svg': { color: `${color} !important` } }}>{icon}</Box>}
      label={acao} size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 22 }}
    />
  )
}

// ── Document icon ─────────────────────────────────────────────────────
function docIcon(tipo: string) {
  if (tipo.toLowerCase().includes('pdf') || tipo.toLowerCase().includes('médico') || tipo.toLowerCase().includes('laudo')) {
    return <PictureAsPdfIcon sx={{ color: '#d4183d', fontSize: 28 }} />
  }
  if (tipo.toLowerCase().includes('judicial') || tipo.toLowerCase().includes('jurídico')) {
    return <GavelIcon sx={{ color: '#7c3aed', fontSize: 28 }} />
  }
  if (tipo.toLowerCase().includes('imagem') || tipo.toLowerCase().includes('exame')) {
    return <ImageOutlinedIcon sx={{ color: '#2563eb', fontSize: 28 }} />
  }
  return <DescriptionOutlinedIcon sx={{ color: '#6b7280', fontSize: 28 }} />
}

// ── Histórico Consolidado types & mock data ───────────────────────────
interface HistoricoConsolidado {
  completeness: 'complete' | 'partial' | 'limited'
  linhaDoTempo: { ultimaSolicitacaoSimilar: string | null; padrao: 'first_time' | 'recurrent' | 'frequent' }
  leituraAssistida: string
  consultasRecentes: { count: number; periodo: string; especialidades: string[] }
  procedimentosRelacionados: string
  internacoes: { count: number; periodo: string; detalhes?: string }
  cidRecorrente: { cid: string; count: number; descricao: string } | null
  autorizacoesAnteriores: Array<{
    id: string; procedimento: string; codigo: string; cid: string
    data: string; decisao: 'aprovado' | 'negado' | 'ajustado'; motivo: string; destaque?: boolean
  }>
  sinaisAtencao: Array<{ id: string; mensagem: string; detalhes?: string; severidade: 'low' | 'medium' | 'high' }>
  elegibilidade: {
    status: 'ativo' | 'suspenso' | 'carencia'
    carencias: boolean; detalhesCarencia?: string
    limitesContratuais: string
    dutRelevantes: string[]
  }
}

const mockHistorico: Record<string, HistoricoConsolidado> = {
  default: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Dez/2025', padrao: 'recurrent' },
    leituraAssistida: 'Beneficiário com histórico regular de uso assistencial. Padrão de consultas dentro da média esperada para o perfil. Sem intercorrências relevantes nos últimos 12 meses.',
    consultasRecentes: { count: 4, periodo: 'últimos 6 meses', especialidades: ['Cardiologia', 'Clínica Geral'] },
    procedimentosRelacionados: 'Exames laboratoriais de rotina e consultas ambulatoriais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'Z00.0', count: 2, descricao: 'Exame geral de rotina' },
    autorizacoesAnteriores: [
      { id: 'REQ-2025-09821', procedimento: 'Consulta Cardiologista', codigo: '10101012', cid: 'Z00.0', data: 'Dez/2025', decisao: 'aprovado', motivo: 'Indicação clínica adequada' },
      { id: 'REQ-2025-07634', procedimento: 'Hemograma Completo', codigo: '40302605', cid: 'Z00.0', data: 'Set/2025', decisao: 'aprovado', motivo: 'Exame de rotina' },
      { id: 'REQ-2025-05112', procedimento: 'Eletrocardiograma', codigo: '20101010', cid: 'I10', data: 'Jun/2025', decisao: 'negado', motivo: 'Ausência de pedido médico' },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais identificadas.',
      dutRelevantes: ['DUT 1 — Exames de rotina', 'DUT 12 — Consultas ambulatoriais'],
    },
  },
  high_use: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida: 'Beneficiário com padrão de uso elevado e frequente. Volume de consultas e procedimentos significativamente acima da média. Múltiplas especialidades envolvidas nos últimos 6 meses. Recomenda-se avaliação cuidadosa da pertinência clínica.',
    consultasRecentes: { count: 12, periodo: 'últimos 6 meses', especialidades: ['Reumatologia', 'Ortopedia', 'Clínica Geral', 'Fisioterapia', 'Psicologia'] },
    procedimentosRelacionados: 'Múltiplos procedimentos de reabilitação, exames de imagem e consultas especializadas recorrentes.',
    internacoes: { count: 2, periodo: 'últimos 12 meses', detalhes: 'Jan/2026 — Clínica Médica (3 dias); Out/2025 — Ortopedia (2 dias)' },
    cidRecorrente: { cid: 'M79.3', count: 4, descricao: 'Fibromialgia' },
    autorizacoesAnteriores: [
      { id: 'REQ-2026-03801', procedimento: 'Sessão de Fisioterapia', codigo: '50000470', cid: 'M79.3', data: 'Mar/2026', decisao: 'aprovado', motivo: 'Indicação clínica adequada', destaque: true },
      { id: 'REQ-2026-02654', procedimento: 'RNM de Coluna Lombar', codigo: '40901010', cid: 'M51.1', data: 'Fev/2026', decisao: 'aprovado', motivo: 'Solicitação médica com justificativa' },
      { id: 'REQ-2026-01423', procedimento: 'Consulta Reumatologia', codigo: '10101012', cid: 'M79.3', data: 'Jan/2026', decisao: 'ajustado', motivo: 'Quantidade reduzida conforme protocolo' },
      { id: 'REQ-2025-11209', procedimento: 'Internação Clínica', codigo: '40301010', cid: 'M79.3', data: 'Jan/2026', decisao: 'aprovado', motivo: 'Agudização com indicação clínica' },
      { id: 'REQ-2025-09876', procedimento: 'Exames Laboratoriais Múltiplos', codigo: '40302605', cid: 'M79.3', data: 'Nov/2025', decisao: 'aprovado', motivo: 'Protocolo de investigação' },
    ],
    sinaisAtencao: [
      { id: 'sa1', mensagem: 'Alto volume de uso — beneficiário entre os top 5% de utilizadores', detalhes: '12 consultas e 2 internações nos últimos 6 meses.', severidade: 'high' },
      { id: 'sa2', mensagem: 'Múltiplas especialidades simultâneas — possível fragmentação do cuidado', severidade: 'medium' },
      { id: 'sa3', mensagem: 'CID M79.3 recorrente em 4 autorizações — avaliar adesão ao tratamento', severidade: 'low' },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Limite de sessões de fisioterapia atingido (24/24). Internações dentro do limite contratual.',
      dutRelevantes: ['DUT 30 — Fisioterapia', 'DUT 33 — Internação clínica', 'DUT 18 — Exames de imagem'],
    },
  },
  primeira_vez: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida: 'Beneficiário sem histórico anterior de solicitações similares. Esta é a primeira autorização registrada para este tipo de procedimento. Histórico assistencial limpo e sem ocorrências relevantes.',
    consultasRecentes: { count: 1, periodo: 'últimos 12 meses', especialidades: ['Clínica Geral'] },
    procedimentosRelacionados: 'Nenhum procedimento relacionado anterior identificado.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais identificadas.',
      dutRelevantes: ['DUT 1 — Exames de rotina'],
    },
  },
}

function getHistoricoProfile(entry: HistoricoEntry): 'high_use' | 'primeira_vez' | 'default' {
  if (entry.divergencia && (entry.categoria === 'Oncologia' || entry.categoria === 'Internação')) return 'high_use'
  if (entry.carencia) return 'primeira_vez'
  return 'default'
}

function completenessLabel(c: HistoricoConsolidado['completeness']): { label: string; color: string; bg: string } {
  switch (c) {
    case 'complete': return { label: 'Histórico Completo', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' }
    case 'partial': return { label: 'Histórico Parcial', color: '#b45309', bg: 'rgba(245,158,11,0.1)' }
    case 'limited': return { label: 'Histórico Limitado', color: '#ea580c', bg: 'rgba(234,88,12,0.1)' }
  }
}

function padraoLabel(p: HistoricoConsolidado['linhaDoTempo']['padrao']): string {
  switch (p) {
    case 'first_time': return 'Primeira solicitação'
    case 'recurrent': return 'Uso recorrente (regular)'
    case 'frequent': return 'Uso frequente (acima da média)'
  }
}

function decisaoIcon(d: 'aprovado' | 'negado' | 'ajustado') {
  if (d === 'aprovado') return <CheckIcon sx={{ fontSize: 14, color: '#16a34a' }} />
  if (d === 'negado') return <CloseIcon sx={{ fontSize: 14, color: '#d4183d' }} />
  return <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
}

function decisaoChipColor(d: 'aprovado' | 'negado' | 'ajustado') {
  if (d === 'aprovado') return { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' }
  if (d === 'negado') return { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' }
  return { bg: 'rgba(245,158,11,0.1)', color: '#b45309' }
}

function sinaisAtencaoColor(s: 'low' | 'medium' | 'high'): 'info' | 'warning' | 'error' {
  if (s === 'low') return 'info'
  if (s === 'medium') return 'warning'
  return 'error'
}

// ── BeneficiarioSection ───────────────────────────────────────────────
function BeneficiarioSection({ entry }: { entry: HistoricoEntry }) {
  const sexo = entry.sexo ?? 'M'
  const idade = entry.idade ?? 45
  const carencia = entry.carencia ?? false
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Beneficiário
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
              {entry.beneficiario}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Chip
                label={`${idade} anos`}
                size="small"
                sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#6b7280', fontWeight: 600, height: 22, fontSize: 12 }}
              />
              <Chip
                icon={sexo === 'M'
                  ? <MaleIcon sx={{ fontSize: 14, color: '#1d4ed8' }} />
                  : <FemaleIcon sx={{ fontSize: 14, color: '#be185d' }} />
                }
                label={sexo === 'M' ? 'Masculino' : 'Feminino'}
                size="small"
                sx={{
                  backgroundColor: sexo === 'M' ? 'rgba(29,78,216,0.08)' : 'rgba(190,24,93,0.08)',
                  color: sexo === 'M' ? '#1d4ed8' : '#be185d',
                  fontWeight: 600,
                  height: 22,
                  fontSize: 12,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Carteirinha: <strong>{entry.carteirinha}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CPF: <strong>{entry.cpf ?? '—'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nascimento: <strong>{entry.dataNascimento ?? '—'}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Plano: <strong>{entry.plano}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Typography variant="body2" color="text.secondary">Carência:</Typography>
              {carencia ? (
                <Chip
                  icon={<WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} />}
                  label="Em carência"
                  size="small"
                  sx={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#b45309', fontWeight: 700, height: 22, fontSize: 12 }}
                />
              ) : (
                <Chip
                  icon={<CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} />}
                  label="Sem carência"
                  size="small"
                  sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 700, height: 22, fontSize: 12 }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// ── ProcedimentosSection ──────────────────────────────────────────────
function ProcedimentosSection({ entry }: { entry: HistoricoEntry }) {
  const procs = entry.procedimentosDetalhados ?? [
    {
      codigo: '00000000',
      tuss: '00000000',
      descricao: entry.procedimento,
      qty: 1,
      qtyAutorizada: entry.acao !== 'Negado' ? 1 : undefined,
      dataInicio: entry.dataDecisao,
      dataFim: entry.dataDecisao,
      cid: entry.cid,
      nivelAud: (entry.categoria === 'Internação' || entry.categoria === 'Urgência/Emergência' || entry.categoria === 'Oncologia') ? 'HOSPITALAR' as const : 'AMBULATORIAL' as const,
    },
  ]
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {procs.map((proc, idx) => (
              <TableRow
                key={proc.codigo + idx}
                sx={{ '& td': { borderBottom: idx < procs.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }, '&:not(:first-of-type) td': { pt: 2 } }}
              >
                <TableCell sx={{ pl: 0, fontWeight: 700, fontSize: 13, width: 120, verticalAlign: 'top', pt: 1.5 }}>{proc.tuss}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 13, verticalAlign: 'top', pt: 1.5 }}>{proc.descricao}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
                  Qtd: {proc.qty}{proc.qtyAutorizada !== undefined ? ` · Aut: ${proc.qtyAutorizada}` : ''}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
                  {proc.dataInicio} → {proc.dataFim}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                    {proc.cid && (
                      <Chip
                        label={`CID ${proc.cid}`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700, fontSize: 12, height: 20 }}
                      />
                    )}
                    <Chip
                      label={proc.nivelAud}
                      size="small"
                      sx={{ backgroundColor: 'rgba(0,0,0,0.05)', color: '#6b7280', fontWeight: 600, fontSize: 11, height: 20 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, mx: -3, mb: -3, px: 3, py: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Prestador', value: entry.prestador },
              { label: 'Médico Solicitante', value: entry.medicoSolicitante },
              { label: 'Tipo de Guia', value: entry.tipoGuia },
              { label: 'Categoria', value: entry.categoria },
            ].map((f) => (
              <Box key={f.label}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 12 }}>
                  {f.label}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                  {f.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// ── HistoricoConsolidadoSection ───────────────────────────────────────
function HistoricoConsolidadoSection({ entry }: { entry: HistoricoEntry }) {
  const key = getHistoricoProfile(entry)
  const h = mockHistorico[key]
  const cp = completenessLabel(h.completeness)
  const [showAllAuth, setShowAllAuth] = useState(false)
  const visibleAuth = showAllAuth ? h.autorizacoesAnteriores : h.autorizacoesAnteriores.slice(0, 3)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <HistoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
            Histórico Consolidado
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            label={cp.label}
            size="small"
            sx={{ backgroundColor: cp.bg, color: cp.color, fontWeight: 700, height: 22, fontSize: 12 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
          Resumo assistencial e regulatório para suporte à decisão
        </Typography>

        {/* Linha do Tempo */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', mb: 2 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 0.75 }}>
            Linha do Tempo
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Última solicitação similar</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {h.linhaDoTempo.ultimaSolicitacaoSimilar ?? '— Nenhuma'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Padrão de uso</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {padraoLabel(h.linhaDoTempo.padrao)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Leitura Assistida */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', mb: 2.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
            Leitura Assistida
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.6 }}>
            {h.leituraAssistida}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Resumo Assistencial */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Resumo Assistencial
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
          {/* Consultas recentes */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Consultas Recentes
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}>
              {h.consultasRecentes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.consultasRecentes.periodo}
            </Typography>
            {h.consultasRecentes.especialidades.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
                {h.consultasRecentes.especialidades.join(', ')}
              </Typography>
            )}
          </Box>
          {/* Procedimentos relacionados */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Procedimentos Relacionados
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.5, color: '#374151' }}>
              {h.procedimentosRelacionados}
            </Typography>
          </Box>
          {/* Internações */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Internações
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}>
              {h.internacoes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.internacoes.periodo}
            </Typography>
            {h.internacoes.detalhes && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
                {h.internacoes.detalhes}
              </Typography>
            )}
          </Box>
          {/* CID recorrente */}
          <Box sx={{
            p: 1.5,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 2,
            backgroundColor: h.cidRecorrente ? 'rgba(245,158,11,0.06)' : 'transparent',
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              CID Recorrente
            </Typography>
            {h.cidRecorrente ? (
              <>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#92400e' }}>
                  {h.cidRecorrente.cid} ({h.cidRecorrente.count}x)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {h.cidRecorrente.descricao}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                Primeira ocorrência
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Autorizações Anteriores */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Autorizações Anteriores
        </Typography>
        {h.autorizacoesAnteriores.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 2 }}>
            Nenhuma autorização anterior registrada.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
            {visibleAuth.map((auth) => {
              const dc = decisaoChipColor(auth.decisao)
              return (
                <Box
                  key={auth.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.25,
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 1.5,
                    backgroundColor: auth.destaque ? 'rgba(245,158,11,0.04)' : 'transparent',
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>{decisaoIcon(auth.decisao)}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, mb: 0.25 }}>
                      {auth.procedimento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      {auth.data} · CID {auth.cid} · {auth.motivo}
                    </Typography>
                  </Box>
                  <Chip
                    label={auth.decisao}
                    size="small"
                    sx={{ backgroundColor: dc.bg, color: dc.color, fontWeight: 700, height: 20, fontSize: 12 }}
                  />
                </Box>
              )
            })}
          </Box>
        )}
        {h.autorizacoesAnteriores.length > 3 && (
          <Button
            size="small"
            onClick={() => setShowAllAuth(!showAllAuth)}
            endIcon={<ExpandMoreIcon sx={{ transform: showAllAuth ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: 16 }} />}
            sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'none', mb: 1.5 }}
          >
            {showAllAuth ? 'Mostrar menos' : `Ver mais ${h.autorizacoesAnteriores.length - 3} registros`}
          </Button>
        )}

        {/* Sinais de Atenção */}
        {h.sinaisAtencao.length > 0 && (
          <>
            <Divider sx={{ mb: 2.5 }} />
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
              Sinais de Atenção
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
              {h.sinaisAtencao.map((sinal) => (
                <Alert key={sinal.id} severity={sinaisAtencaoColor(sinal.severidade)} sx={{ borderRadius: 1.5, py: 0.5 }}>
                  <Typography variant="caption" fontWeight={700} display="block">
                    {sinal.mensagem}
                  </Typography>
                  {sinal.detalhes && (
                    <Typography variant="caption">{sinal.detalhes}</Typography>
                  )}
                </Alert>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ mb: 2.5 }} />

        {/* Elegibilidade e Regras */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Elegibilidade e Regras
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {/* Status elegibilidade */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.75 }}>
              Status Elegibilidade
            </Typography>
            <Chip
              label={h.elegibilidade.status === 'ativo' ? 'Ativo' : h.elegibilidade.status === 'suspenso' ? 'Suspenso' : 'Em carência'}
              size="small"
              sx={{
                backgroundColor: h.elegibilidade.status === 'ativo' ? 'rgba(22,163,74,0.1)' : h.elegibilidade.status === 'suspenso' ? 'rgba(212,24,61,0.1)' : 'rgba(245,158,11,0.1)',
                color: h.elegibilidade.status === 'ativo' ? '#16a34a' : h.elegibilidade.status === 'suspenso' ? '#d4183d' : '#b45309',
                fontWeight: 700,
                height: 22,
                fontSize: 12,
              }}
            />
          </Box>
          {/* Carências */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Carências
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
              {h.elegibilidade.carencias ? 'Sim' : 'Não'}
            </Typography>
            {h.elegibilidade.detalhesCarencia && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {h.elegibilidade.detalhesCarencia}
              </Typography>
            )}
          </Box>
          {/* Limites contratuais */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Limites Contratuais
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
              {h.elegibilidade.limitesContratuais}
            </Typography>
          </Box>
          {/* DUTs */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              DUTs Relevantes
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {h.elegibilidade.dutRelevantes.map((dut) => (
                <Typography component="li" key={dut} variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {dut}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// ── ObservacoesSection ────────────────────────────────────────────────
function ObservacoesSection({ entry }: { entry: HistoricoEntry }) {
  if (!entry.observacoes) return null
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Observações
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {entry.observacoes}
        </Typography>
      </CardContent>
    </Card>
  )
}

// ── DocumentosSection ─────────────────────────────────────────────────
function DocumentosSection({ entry }: { entry: HistoricoEntry }) {
  const docs = entry.documentos ?? [
    { nome: `Laudo — ${entry.id}.pdf`, tipo: 'Laudo Médico', data: entry.dataProtocolo },
  ]
  const [viewDoc, setViewDoc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Documentos ({docs.length})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {docs.map((doc) => (
            <Box
              key={doc.nome}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.01)',
              }}
            >
              {docIcon(doc.tipo)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {doc.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {doc.tipo} · Enviado em {doc.data}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon fontSize="small" />}
                aria-label={`Visualizar ${doc.nome}`}
                onClick={() => { setViewDoc(doc.nome); setZoom(100) }}
              >
                Visualizar
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* Document Lightbox */}
      <Dialog
        open={!!viewDoc}
        onClose={() => { setViewDoc(null); setZoom(100) }}
        maxWidth={false}
        aria-labelledby="doc-viewer-title"
        PaperProps={{
          sx: {
            width: 860, maxWidth: '95vw',
            height: '90vh', maxHeight: '90vh',
            backgroundColor: '#fff',
            borderRadius: 2,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            m: 0,
            border: '1px solid rgba(0,0,0,0.08)',
          }
        }}
      >
        {/* Toolbar */}
        <Box sx={{
          height: 52, flexShrink: 0,
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionOutlinedIcon sx={{ color: 'text.secondary', fontSize: 17 }} />
            <Typography id="doc-viewer-title" sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {viewDoc}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', ml: 0.5 }}>— Esc para fechar</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Reduzir zoom">
              <span>
                <IconButton
                  size="small"
                  aria-label="Reduzir zoom"
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                  disabled={zoom <= 50}
                  sx={{ color: 'text.secondary' }}
                >
                  <ZoomOutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Box
              aria-live="polite"
              aria-label={`Zoom: ${zoom}%`}
              sx={{ px: 1.25, py: 0.25, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1, minWidth: 42, textAlign: 'center' }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>{zoom}%</Typography>
            </Box>
            <Tooltip title="Ampliar zoom">
              <span>
                <IconButton
                  size="small"
                  aria-label="Ampliar zoom"
                  onClick={() => setZoom(z => Math.min(200, z + 10))}
                  disabled={zoom >= 200}
                  sx={{ color: 'text.secondary' }}
                >
                  <ZoomInIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
            <Button
              size="small"
              startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
              onClick={() => {
                const a = document.createElement('a')
                a.href = '/exemplo-pedido.png'
                a.download = viewDoc || 'documento'
                a.click()
              }}
              sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'text.primary', backgroundColor: 'rgba(0,0,0,0.04)' } }}
            >
              Baixar
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
            <Tooltip title="Fechar (Esc)">
              <IconButton
                size="small"
                aria-label="Fechar visualizador"
                onClick={() => { setViewDoc(null); setZoom(100) }}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', backgroundColor: 'rgba(0,0,0,0.06)' } }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Document area */}
        <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 3, px: 3 }}>
          <Box sx={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            width: `${zoom}%`,
            maxWidth: 757,
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            <img
              src="/exemplo-pedido.png"
              alt={`Visualização do documento: ${viewDoc}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>
      </Dialog>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────
export default function HistoricoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyCanal, setNotifyCanal] = useState<'app' | 'whatsapp' | 'email'>('app')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const id = params?.id as string
  const entry = historicoEntries.find(e => e.id === id)
  const currentIndex = sortedEntries.findIndex(e => e.id === id)
  const total = sortedEntries.length

  if (!entry) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">Pedido não encontrado.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/historico')} sx={{ mt: 2 }}>
          Voltar ao Histórico
        </Button>
      </Box>
    )
  }

  const catStyle = catColorMap[entry.categoria] || { bg: 'rgba(0,0,0,0.06)', color: '#5a6070' }

  const handlePrev = () => {
    if (currentIndex > 0) router.push('/historico/' + sortedEntries[currentIndex - 1].id)
  }
  const handleNext = () => {
    if (currentIndex < total - 1) router.push('/historico/' + sortedEntries[currentIndex + 1].id)
  }

  const handleDownloadPDF = () => {
    const a = document.createElement('a')
    a.href = '/exemplo-pedido.png'
    a.download = `autorizacao-${entry.id}.pdf`
    a.click()
  }

  const handleNotify = () => {
    setNotifyOpen(false)
    const labels = { app: 'App Athena', whatsapp: 'WhatsApp', email: 'E-mail' }
    setSnackbar({ open: true, message: `Decisão informada ao beneficiário via ${labels[notifyCanal]}.` })
  }

  return (
    <Box sx={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'background.default' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{ px: 3, py: 1.75, backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 13 }} />}
          size="small"
          onClick={() => router.push('/historico')}
          sx={{ color: 'text.secondary', mb: 0.75, p: 0, minHeight: 'auto', fontSize: 12, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
        >
          Histórico
        </Button>

        {/* Row 1: ID + chips + navigator */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>{entry.id}</Typography>
            <AcaoChip acao={entry.acao} />
            <Chip
              label={entry.tipoGuia} size="small"
              sx={{
                backgroundColor: entry.tipoGuia === 'Emergência' ? 'rgba(212,24,61,0.1)' : entry.tipoGuia === 'Urgente' ? 'rgba(245,158,11,0.12)' : 'rgba(37,99,235,0.1)',
                color: entry.tipoGuia === 'Emergência' ? '#d4183d' : entry.tipoGuia === 'Urgente' ? '#b45309' : '#2563eb',
                fontWeight: 700, height: 22,
              }}
            />
            <Chip label={entry.categoria} size="small" sx={{ backgroundColor: catStyle.bg, color: catStyle.color, fontWeight: 600, height: 22 }} />
            {entry.alertas && entry.alertas.length > 0 && entry.alertas.map((alerta) => (
              <Chip
                key={alerta}
                icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
                label={alerta}
                size="small"
                sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontWeight: 700, height: 22 }}
              />
            ))}
          </Box>

          {/* Navigator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0, border: '1px solid rgba(0,0,0,0.13)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <IconButton size="small" onClick={handlePrev} disabled={currentIndex === 0}
              sx={{ borderRadius: 0, px: 1, py: 0.75, color: 'text.secondary', '&:not(:disabled):hover': { backgroundColor: 'rgba(144,43,41,0.06)', color: 'primary.main' }, '&:disabled': { opacity: 0.35 } }}>
              <NavigateBeforeIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box sx={{ px: 1.5, borderLeft: '1px solid rgba(0,0,0,0.1)', borderRight: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', lineHeight: '30px' }}>
                {currentIndex + 1}
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}> de {total}</Box>
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleNext} disabled={currentIndex === total - 1}
              sx={{ borderRadius: 0, px: 1, py: 0.75, color: 'text.secondary', '&:not(:disabled):hover': { backgroundColor: 'rgba(144,43,41,0.06)', color: 'primary.main' }, '&:disabled': { opacity: 0.35 } }}>
              <NavigateNextIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Row 2: meta info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 0.75, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocalHospitalOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>{entry.prestador}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Protocolo: {entry.dataProtocolo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Decisão: {entry.dataDecisao}</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2, overflow: 'hidden' }}>

        {/* Left column — scrolls independently */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <BeneficiarioSection entry={entry} />
            <ProcedimentosSection entry={entry} />
            <HistoricoConsolidadoSection entry={entry} />
            <ObservacoesSection entry={entry} />
            <DocumentosSection entry={entry} />
          </Box>
        </Box>

        {/* Right column — always fully visible, own scroll if needed */}
        <Box sx={{ width: 400, flexShrink: 0, overflowY: 'auto', pb: 2 }}>
          <Card sx={{ overflow: 'visible' }}>
            <CardContent sx={{ p: 0 }}>

              {/* Decision header */}
              <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.6, mb: 1.5 }}>
                  Decisão Registrada
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <AcaoChip acao={entry.acao} />
                  {entry.origem === 'ia_automatica' ? (
                    <Chip icon={<SmartToyIcon sx={{ fontSize: 13, color: '#2563eb !important' }} />} label="IA Automática" size="small"
                      sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontSize: 12, fontWeight: 700, height: 22 }} />
                  ) : (
                    <Chip icon={<PersonIcon sx={{ fontSize: 13, color: '#5a6070 !important' }} />} label="Analista" size="small"
                      sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#374151', fontSize: 12, fontWeight: 700, height: 22 }} />
                  )}
                </Box>
              </Box>

              <Divider />

              <Box sx={{ px: 2.5, py: 2 }}>

                {/* IA automática */}
                {entry.origem === 'ia_automatica' && (
                  <Box sx={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 2, p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SmartToyIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#2563eb' }}>
                        {entry.acao === 'Aprovado' ? 'Aprovado automaticamente pela IA' : 'Negado automaticamente pela IA'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.6, display: 'block' }}>
                      {entry.motivoDecisao}
                    </Typography>
                    <Alert severity="info" sx={{ mt: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }} icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}>
                      Decisão automática registrada para fins de auditoria.
                    </Alert>
                  </Box>
                )}

                {/* Analista */}
                {entry.origem === 'analista' && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2.5, mb: 1.5, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Responsável</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{entry.analista}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Data da decisão</Typography>
                        <Typography variant="body2" sx={{ fontSize: 13 }}>{entry.dataDecisao}</Typography>
                      </Box>
                    </Box>
                    {entry.tempoAnaliseMin > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                          Tempo de análise: <strong>{entry.tempoAnaliseMin} min</strong>
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, p: 2 }}>
                      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.75 }}>Motivo da Decisão</Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>{entry.motivoDecisao}</Typography>
                      {entry.textoLivre && (
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 1, display: 'block', lineHeight: 1.5 }}>
                          {entry.textoLivre}
                        </Typography>
                      )}
                    </Box>

                    {/* Ajustes aplicados */}
                    {entry.ajustes && entry.ajustes.length > 0 && (
                      <Box sx={{ backgroundColor: 'rgba(255,251,235,0.8)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 2, p: 2, mt: 1.5 }}>
                        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.25 }}>
                          Ajustes Aplicados
                        </Typography>
                        <Divider sx={{ mb: 1.25, borderColor: 'rgba(245,158,11,0.2)' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {(entry.ajustes as Ajuste[]).map((aj) => {
                            const campoLabel = aj.campo === 'quantidade' ? 'Quantidade autorizada'
                              : aj.campo === 'prestador' ? 'Prestador executante'
                              : 'Código do procedimento'
                            return (
                              <Box key={aj.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                  <EditIcon sx={{ fontSize: 13, color: '#b45309', flexShrink: 0 }} />
                                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{campoLabel}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25, flexWrap: 'wrap' }}>
                                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Solicitado:</Typography>
                                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{aj.valorAnterior}</Typography>
                                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>→ Autorizado:</Typography>
                                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>{aj.valorNovo}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', mb: 0.25 }}>
                                  Motivo: {aj.motivo}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                                  Por: {aj.operador} · {new Date(aj.timestamp).toLocaleDateString('pt-BR')} {new Date(aj.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Checklist IA */}
                {entry.iaChecklist && entry.iaChecklist.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1 }}>
                      Checklist IA
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {entry.iaChecklist.map((item) => (
                        <Box key={item.texto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {item.status === 'ok' ? (
                            <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0, mt: 0.15 }} />
                          ) : item.status === 'warning' ? (
                            <WarningAmberIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0, mt: 0.15 }} />
                          ) : (
                            <CloseIcon sx={{ fontSize: 15, color: '#d4183d', flexShrink: 0, mt: 0.15 }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              fontWeight: item.status !== 'ok' ? 600 : 500,
                              color: item.status === 'error' ? '#d4183d' : item.status === 'warning' ? '#b45309' : 'text.primary',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.texto}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Sugestão da IA */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>Sugestão da IA</Typography>
                  <Chip
                    label={entry.iaSugestao} size="small"
                    sx={{
                      fontSize: 12, fontWeight: 700, height: 22,
                      backgroundColor: entry.iaSugestao === 'Aprovar' ? 'rgba(22,163,74,0.1)' : entry.iaSugestao === 'Negar' ? 'rgba(212,24,61,0.1)' : 'rgba(245,158,11,0.12)',
                      color: entry.iaSugestao === 'Aprovar' ? '#16a34a' : entry.iaSugestao === 'Negar' ? '#d4183d' : '#b45309',
                    }}
                  />
                </Box>

                {/* Divergência */}
                {entry.divergencia ? (
                  <Alert severity="warning" icon={<WarningAmberIcon sx={{ fontSize: 16 }} />} sx={{ mb: 2, '& .MuiAlert-message': { fontSize: 12 } }}>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: 12, display: 'block', mb: 0.5 }}>Divergência com a IA</Typography>
                    <Typography variant="caption" sx={{ fontSize: 12 }}>{entry.divergenciaMotivo}</Typography>
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                      Decisão alinhada com a sugestão da IA
                    </Typography>
                  </Box>
                )}

                {/* Junta Médica */}
                {entry.juntaMedica && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ backgroundColor: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 2, p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <GroupsIcon sx={{ fontSize: 17, color: '#7c3aed' }} />
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#7c3aed' }}>
                          Junta Médica Realizada
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>Data da reunião</Typography>
                          <Typography variant="body2" sx={{ fontSize: 13 }}>{entry.juntaMedica.dataReuniao}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>N° da ata</Typography>
                          <Typography variant="body2" sx={{ fontSize: 13, fontFamily: 'monospace' }}>{entry.juntaMedica.numeroAta}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.75 }}>Membros</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                        {entry.juntaMedica.membros.map((m, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <PersonIcon sx={{ fontSize: 13, color: '#7c3aed', flexShrink: 0 }} />
                            <Typography variant="caption" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                              <strong>{m.nome}</strong> — {m.especialidade}
                              <Box component="span" sx={{ color: 'text.secondary' }}> ({m.crm})</Box>
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>Parecer da Junta</Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>{entry.juntaMedica.parecer}</Typography>
                    </Box>
                  </>
                )}

              </Box>

              <Divider />

              {/* Action buttons */}
              <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  startIcon={<DownloadIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                  onClick={handleDownloadPDF}
                  sx={{ fontWeight: 600, justifyContent: 'flex-start', px: 2, borderColor: 'rgba(0,0,0,0.2)', color: 'text.primary' }}
                >
                  Baixar PDF da Autorização
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SendIcon />}
                  onClick={() => setNotifyOpen(true)}
                  sx={{ fontWeight: 600, justifyContent: 'flex-start', px: 2 }}
                >
                  Informar Decisão ao Beneficiário
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ── Modal: Informar Decisão ─────────────────────────────────── */}
      <Dialog open={notifyOpen} onClose={() => setNotifyOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
          Informar Decisão ao Beneficiário
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2.5 }}>
            Selecione o canal para comunicar a decisão do pedido{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{entry.id}</Box>{' '}
            a <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{entry.beneficiario}</Box>.
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Canal de envio</InputLabel>
            <Select
              label="Canal de envio"
              value={notifyCanal}
              onChange={(e) => setNotifyCanal(e.target.value as typeof notifyCanal)}
            >
              <MenuItem value="app">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneAndroidIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                  App Athena
                </Box>
              </MenuItem>
              <MenuItem value="whatsapp">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                  WhatsApp
                </Box>
              </MenuItem>
              <MenuItem value="email">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlinedIcon sx={{ fontSize: 16, color: '#0891b2' }} />
                  E-mail
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info" sx={{ mt: 2, '& .MuiAlert-message': { fontSize: 12 } }} icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}>
            A mensagem incluirá o resultado ({entry.acao}), o número do protocolo e instruções ao beneficiário.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setNotifyOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleNotify} startIcon={<SendIcon />} sx={{ fontWeight: 600 }}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  )
}
