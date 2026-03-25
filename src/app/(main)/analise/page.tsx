'use client'
import React from 'react'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GavelIcon from '@mui/icons-material/Gavel'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HistoryIcon from '@mui/icons-material/History'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import PrintIcon from '@mui/icons-material/Print'
import DownloadIcon from '@mui/icons-material/Download'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { pedidos, Pedido, IASugestao, OrigemPedido } from '@/data/pedidos'

// ── Helpers ──────────────────────────────────────────────────────────
function statusColor(status: string): { bg: string; color: string } {
  switch (status) {
    case 'Em Análise': return { bg: 'rgba(245,158,11,0.12)', color: '#b45309' }
    case 'Aprovado': return { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' }
    case 'Negado': return { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' }
    case 'Pendente': return { bg: 'rgba(37,99,235,0.08)', color: '#2563eb' }
    case 'Devolutiva': return { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' }
    default: return { bg: 'rgba(0,0,0,0.06)', color: '#6b7280' }
  }
}

function tipoColor(tipo: string): { bg: string; color: string } {
  switch (tipo) {
    case 'Urgente': return { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' }
    case 'Emergência': return { bg: 'rgba(144,43,41,0.12)', color: '#902B29' }
    default: return { bg: 'rgba(37,99,235,0.08)', color: '#2563eb' }
  }
}

function iaSugestaoColor(sugestao: IASugestao): { bg: string; color: string } {
  switch (sugestao) {
    case 'Aprovar': return { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' }
    case 'Negar': return { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' }
    case 'Junta Médica': return { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' }
  }
}

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

function divergenceMessage(iaSugestao: IASugestao): string {
  return `A IA sugere "${iaSugestao}". Por favor, justifique o motivo desta divergência.`
}

// ── Origem Label ──────────────────────────────────────────────────────
const origemConfig: Record<OrigemPedido, { label: string; color: string; icon: React.ReactNode }> = {
  app:       { label: 'App Athena', color: '#2563eb', icon: <PhoneAndroidIcon sx={{ fontSize: 13 }} /> },
  whatsapp:  { label: 'WhatsApp',   color: '#16a34a', icon: <WhatsAppIcon sx={{ fontSize: 13 }} /> },
  email:     { label: 'E-mail',     color: '#0891b2', icon: <EmailOutlinedIcon sx={{ fontSize: 13 }} /> },
  prestador: { label: 'Prestador',  color: '#902B29', icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 13 }} /> },
}
function OrigemLabel({ origem }: { origem: OrigemPedido }) {
  const { label, color, icon } = origemConfig[origem]
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ color, display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography variant="caption" sx={{ fontSize: 12, color, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────
function PageHeader({
  pedido,
  onBack,
  currentIndex,
  total,
  onPrev,
  onNext,
}: {
  pedido: Pedido
  onBack: () => void
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const sc = statusColor(pedido.status)
  const tc = tipoColor(pedido.tipoGuia)
  return (
    <Box
      sx={{
        px: 3,
        py: 1.75,
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        flexShrink: 0,
      }}
    >
      {/* Back link */}
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: 13 }} />}
        size="small"
        onClick={onBack}
        sx={{ color: 'text.secondary', mb: 0.75, p: 0, minHeight: 'auto', fontSize: 12, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
      >
        Fila de Análise
      </Button>

      {/* Row 1: ID + chips + navigator */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {pedido.id}
          </Typography>
          <Chip
            label={pedido.tipoGuia}
            size="small"
            sx={{ backgroundColor: tc.bg, color: tc.color, fontWeight: 700, height: 22 }}
          />
          <Chip
            label={pedido.status}
            size="small"
            sx={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700, height: 22 }}
          />
          {pedido.slaStatus === 'violated' && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
              label="SLA Violado"
              size="small"
              sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontWeight: 700, height: 22 }}
            />
          )}
          {pedido.slaStatus === 'warning' && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
              label="SLA em Risco"
              size="small"
              sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontWeight: 700, height: 22 }}
            />
          )}
          {pedido.alertas.includes('Liminar Judicial') && (
            <Chip
              icon={<GavelIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
              label="Liminar Judicial"
              size="small"
              sx={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontWeight: 700, height: 22 }}
            />
          )}
        </Box>

        {/* Navigator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.13)',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <IconButton
            size="small"
            onClick={onPrev}
            disabled={currentIndex === 0}
            sx={{
              borderRadius: 0,
              px: 1,
              py: 0.75,
              color: 'text.secondary',
              '&:not(:disabled):hover': { backgroundColor: 'rgba(144,43,41,0.06)', color: 'primary.main' },
              '&:disabled': { opacity: 0.35 },
            }}
          >
            <NavigateBeforeIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box
            sx={{
              px: 1.5,
              borderLeft: '1px solid rgba(0,0,0,0.1)',
              borderRight: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', lineHeight: '30px' }}>
              {currentIndex + 1}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}> de {total}</Box>
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onNext}
            disabled={currentIndex === total - 1}
            sx={{
              borderRadius: 0,
              px: 1,
              py: 0.75,
              color: 'text.secondary',
              '&:not(:disabled):hover': { backgroundColor: 'rgba(144,43,41,0.06)', color: 'primary.main' },
              '&:disabled': { opacity: 0.35 },
            }}
          >
            <NavigateNextIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Row 2: hospital + entry date + origem */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <LocalHospitalOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {pedido.prestador.hospital}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Entrada: {pedido.dataProtocolo}
          </Typography>
        </Box>
        <OrigemLabel origem={pedido.origem} />
      </Box>
    </Box>
  )
}

// ── Alerts banner ─────────────────────────────────────────────────────
function PendenciaBanner({ pedido }: { pedido: Pedido }) {
  if (pedido.status !== 'Devolutiva' || !pedido.pendenciaMotivos) return null
  return (
    <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
      <Alert
        severity="warning"
        icon={<ErrorOutlineIcon fontSize="small" />}
        sx={{ borderRadius: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
          Pedido em pendência — aguardando documentação complementar
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          Pendenciado por <strong>{pedido.pendenciaResponsavel}</strong> em {pedido.pendenciaData}
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {pedido.pendenciaMotivos.map((m) => (
            <Typography key={m} component="li" variant="caption" sx={{ display: 'list-item' }}>{m}</Typography>
          ))}
        </Box>
      </Alert>
    </Box>
  )
}

function AlertasBanner({ pedido }: { pedido: Pedido }) {
  if (pedido.alertas.length === 0) return null
  const alertCount = pedido.alertas.length
  return (
    <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
      <Alert
        severity={pedido.alertas.includes('Liminar Judicial') ? 'warning' : 'error'}
        icon={<WarningAmberIcon fontSize="small" />}
        sx={{ borderRadius: 2 }}
      >
        <Typography variant="body2" fontWeight={600}>
          {alertCount} alerta{alertCount > 1 ? 's' : ''} identificado{alertCount > 1 ? 's' : ''} neste pedido.
        </Typography>
        <Typography variant="caption">
          {pedido.alertas.join(' · ')}
        </Typography>
      </Alert>
    </Box>
  )
}

// ── Beneficiário ──────────────────────────────────────────────────────
function BeneficiarioSection({ pedido }: { pedido: Pedido }) {
  const b = pedido.beneficiario
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Beneficiário
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
              {b.nome}
            </Typography>
            {/* Sexo and idade chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Chip
                label={`${b.idade} anos`}
                size="small"
                sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#6b7280', fontWeight: 600, height: 22, fontSize: 12 }}
              />
              <Chip
                icon={b.sexo === 'M'
                  ? <MaleIcon sx={{ fontSize: 14, color: b.sexo === 'M' ? '#1d4ed8' : '#be185d' }} />
                  : <FemaleIcon sx={{ fontSize: 14, color: '#be185d' }} />
                }
                label={b.sexo === 'M' ? 'Masculino' : 'Feminino'}
                size="small"
                sx={{
                  backgroundColor: b.sexo === 'M' ? 'rgba(29,78,216,0.08)' : 'rgba(190,24,93,0.08)',
                  color: b.sexo === 'M' ? '#1d4ed8' : '#be185d',
                  fontWeight: 600,
                  height: 22,
                  fontSize: 12,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Carteirinha: <strong>{b.carteirinha}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CPF: <strong>{b.cpf}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nascimento: <strong>{b.dataNascimento}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Plano: <strong>{b.plano}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Typography variant="body2" color="text.secondary">Carência:</Typography>
              {b.carencia ? (
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

// ── Histórico Consolidado ─────────────────────────────────────────────
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

function getHistoricoKey(pedidoId: string): string {
  if (pedidoId === 'REQ-2026-04797') return 'high_use'
  if (pedidoId === 'REQ-2026-04801') return 'primeira_vez'
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

function HistoricoConsolidadoSection({ pedido }: { pedido: Pedido }) {
  const key = getHistoricoKey(pedido.id)
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

// ── Procedimentos ─────────────────────────────────────────────────────
function ProcedimentosSection({ pedido }: { pedido: Pedido }) {
  const procs = pedido.procedimentos
  const p = pedido.prestador
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {procs.map((proc) => (
              <TableRow key={proc.codigo}>
                <TableCell sx={{ pl: 0, fontWeight: 700, fontSize: 13, width: 120 }}>{proc.codigo}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{proc.descricao}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                  Qtd: {proc.qty}{proc.qtyAutorizada !== undefined ? ` · Aut: ${proc.qtyAutorizada}` : ''}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                  {proc.dataInicio} → {proc.dataFim}
                </TableCell>
                <TableCell>
                  {proc.cid && (
                    <Chip
                      label={`CID ${proc.cid}`}
                      size="small"
                      sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700, fontSize: 12, height: 20 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Hospital / Clínica', value: p.hospital },
              { label: 'Médico Solicitante', value: p.medico },
              { label: 'CRM', value: p.crm },
              { label: 'Especialidade', value: p.especialidade },
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

// ── Observações ───────────────────────────────────────────────────────
function ObservacoesSection({ pedido }: { pedido: Pedido }) {
  if (!pedido.observacoes) return null
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Observações do Solicitante
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {pedido.observacoes}
        </Typography>
      </CardContent>
    </Card>
  )
}

// ── Documentos ────────────────────────────────────────────────────────
function DocumentosSection({ pedido }: { pedido: Pedido }) {
  const docs = pedido.documentos
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
        PaperProps={{
          sx: {
            width: 820, maxWidth: '95vw',
            height: '90vh', maxHeight: '90vh',
            backgroundColor: '#101828',
            borderRadius: 2,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            m: 0,
          }
        }}
      >
        {/* Toolbar */}
        <Box sx={{
          height: 56, flexShrink: 0,
          backgroundColor: '#1e2939',
          borderBottom: '1px solid #364153',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DescriptionOutlinedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
            <Typography sx={{ color: '#f1f5f9', fontSize: 14, fontWeight: 500 }}>{viewDoc}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setZoom(z => Math.max(50, z - 10))} disabled={zoom <= 50} sx={{ color: '#94a3b8' }}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
            <Box sx={{ px: 1.5, py: 0.25, backgroundColor: '#364153', borderRadius: 1 }}>
              <Typography sx={{ color: '#f1f5f9', fontSize: 12 }}>{zoom}%</Typography>
            </Box>
            <IconButton size="small" onClick={() => setZoom(z => Math.min(200, z + 10))} disabled={zoom >= 200} sx={{ color: '#94a3b8' }}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#4a5565', mx: 1 }} />
            <Button size="small" startIcon={<PrintIcon sx={{ fontSize: 14 }} />} onClick={() => window.print()} sx={{ color: '#94a3b8', fontSize: 12, textTransform: 'none' }}>
              Imprimir
            </Button>
            <Button
              size="small"
              startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
              onClick={() => {
                const a = document.createElement('a')
                a.href = '/exemplo-pedido.png'
                a.download = viewDoc || 'documento'
                a.click()
              }}
              sx={{ color: '#94a3b8', fontSize: 12, textTransform: 'none' }}
            >
              Baixar
            </Button>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#4a5565', mx: 1 }} />
            <IconButton size="small" onClick={() => { setViewDoc(null); setZoom(100) }} sx={{ color: '#94a3b8' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        {/* Document area */}
        <Box sx={{ flex: 1, overflowY: 'auto', backgroundColor: '#101828', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 3, px: 2 }}>
          <Box sx={{ backgroundColor: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.5)', width: `${zoom}%`, maxWidth: 757 }}>
            <img src="/exemplo-pedido.png" alt={viewDoc || 'Documento'} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        </Box>
      </Dialog>
    </Card>
  )
}

// ── Assistente Sidebar ────────────────────────────────────────────────
interface SidebarProps {
  pedido: Pedido
  onAprovarClick: () => void
  onNegarClick: () => void
  onPendenciarClick: () => void
  onJuntaClick: () => void
}

function AssistenteSidebar({ pedido, onAprovarClick, onNegarClick, onPendenciarClick, onJuntaClick }: SidebarProps) {
  const { iaSugestao, iaJustificativa, iaChecklist } = pedido
  const sc = iaSugestaoColor(iaSugestao)

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(144,43,41,0.03)',
        }}
      >
        <SmartToyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="body2" fontWeight={700} color="primary.main">
          Assistente de Decisão
        </Typography>
      </Box>

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Recommendation */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: sc.bg,
            border: `1px solid ${sc.color}33`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: 12 }}>
            Recomendação da IA
          </Typography>
          <Chip
            label={iaSugestao}
            size="small"
            sx={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700, mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 12, lineHeight: 1.5 }}>
            {iaJustificativa}
          </Typography>
        </Box>

        {/* Checklist */}
        <Box>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1 }}>
            Checklist
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {iaChecklist.map((item) => (
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

        {/* Alertas especiais */}
        {pedido.alertas.includes('Liminar Judicial') && (
          <Alert severity="warning" icon={<GavelIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
            <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
              Liminar Judicial Ativa
            </Typography>
            <Typography variant="caption">
              A autorização pode ser mandatória por determinação judicial. Consulte o jurídico antes de negar.
            </Typography>
          </Alert>
        )}

        {pedido.alertas.includes('Fora do Rol ANS') && (
          <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
            <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
              Fora do Rol ANS
            </Typography>
            <Typography variant="caption">
              Procedimento fora da cobertura obrigatória. Avaliação crítica necessária.
            </Typography>
          </Alert>
        )}

        <Box sx={{ flex: 1 }} />
      </Box>

      {/* Action buttons */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onAprovarClick}
          sx={{ minHeight: 40, backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
        >
          Aprovar
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={onNegarClick}
          sx={{ minHeight: 40 }}
        >
          Negar
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" fullWidth onClick={onPendenciarClick} sx={{ minHeight: 36, fontSize: 12 }}>
            Pendenciar
          </Button>
          <Button variant="outlined" fullWidth onClick={onJuntaClick} sx={{ minHeight: 36, fontSize: 12 }}>
            Junta Médica
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

// ── Inner component (uses useSearchParams) ────────────────────────────
function AnaliseInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const pedido = pedidos.find((p) => p.id === id) ?? pedidos[0]
  const currentIndex = pedidos.findIndex((p) => p.id === pedido.id)
  const total = pedidos.length
  const handleNavPrev = () => { if (currentIndex > 0) router.push(`/analise?id=${pedidos[currentIndex - 1].id}`) }
  const handleNavNext = () => { if (currentIndex < total - 1) router.push(`/analise?id=${pedidos[currentIndex + 1].id}`) }

  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false, msg: '', severity: 'success',
  })

  // Dialog state
  const [showAprovarDialog, setShowAprovarDialog] = useState(false)
  const [showNegarDialog, setShowNegarDialog] = useState(false)
  const [showPendenciarDialog, setShowPendenciarDialog] = useState(false)
  const [showJuntaDialog, setShowJuntaDialog] = useState(false)
  const [showDivergenciaDialog, setShowDivergenciaDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'autorizar' | 'negar' | null>(null)

  const [aprovacaoMotivo, setAprovacaoMotivo] = useState('')
  const [aprovacaoJustificativa, setAprovacaoJustificativa] = useState('')
  const [negacaoMotivo, setNegacaoMotivo] = useState('')
  const [negacaoJustificativa, setNegacaoJustificativa] = useState('')
  const [pendenciarItens, setPendenciarItens] = useState<string[]>([])
  const [pendenciarJustificativa, setPendenciarJustificativa] = useState('')
  const [juntaMotivo, setJuntaMotivo] = useState('')
  const [juntaObs, setJuntaObs] = useState('')
  const [divergenciaMotivo, setDivergenciaMotivo] = useState('')

  // Lists for selects/checkboxes
  const motivosAprovacao = [
    'Indicação técnica adequada',
    'Cobertura contratual confirmada',
    'Documentação completa e correta',
    'Alinhado com protocolo clínico ANS',
    'Urgência/Emergência caracterizada',
  ]

  const motivosNegacao = [
    'Fora da cobertura contratual',
    'Documentação insuficiente',
    'Não atende critérios clínicos',
    'Procedimento experimental / não contemplado no Rol',
    'Carência não cumprida',
  ]

  const motivosPendenciar = [
    'Aguardando retorno de junta médica',
    'Aguardando parecer de especialista',
    'Análise técnica em andamento',
    'Verificação de cobertura contratual',
    'Pedido médico atualizado ausente',
    'Exames laboratoriais ausentes',
    'Exames de imagem ausentes',
    'Relatório médico detalhado ausente',
  ]

  const motivosJunta = [
    'Caso de alta complexidade clínica',
    'Divergência técnica requer parecer especializado',
    'Oncologia — protocolo oncológico em avaliação',
    'Procedimento experimental sob análise',
    'Solicitação de segunda opinião médica',
  ]

  // Decision handlers
  const handleAprovarClick = () => {
    if (pedido.iaSugestao !== 'Aprovar') {
      setPendingAction('autorizar')
      setShowDivergenciaDialog(true)
    } else {
      setAprovacaoJustificativa(`Justificativa: ${pedido.iaJustificativa}`)
      setShowAprovarDialog(true)
    }
  }

  const handleNegarClick = () => {
    if (pedido.iaSugestao !== 'Negar') {
      setPendingAction('negar')
      setShowDivergenciaDialog(true)
    } else {
      setNegacaoJustificativa(`Justificativa: ${pedido.iaJustificativa}`)
      setShowNegarDialog(true)
    }
  }

  const handleDivergenciaContinuar = () => {
    if (!divergenciaMotivo.trim()) return
    setShowDivergenciaDialog(false)
    if (pendingAction === 'autorizar') {
      setAprovacaoJustificativa(`Justificativa: ${pedido.iaJustificativa}`)
      setShowAprovarDialog(true)
    } else {
      setNegacaoJustificativa(`Justificativa: ${pedido.iaJustificativa}`)
      setShowNegarDialog(true)
    }
  }

  const confirmarAprovacao = () => {
    if (!aprovacaoMotivo) return
    setShowAprovarDialog(false)
    setSnackbar({ open: true, msg: `Pedido ${pedido.id} aprovado com sucesso`, severity: 'success' })
  }

  const confirmarNegacao = () => {
    if (!negacaoMotivo) return
    setShowNegarDialog(false)
    setSnackbar({ open: true, msg: `Pedido ${pedido.id} negado`, severity: 'error' })
  }

  const confirmarPendenciar = () => {
    if (pendenciarItens.length === 0) return
    setShowPendenciarDialog(false)
    router.push('/fila?tab=devolutivas&pendenciado=' + pedido.id)
  }

  const confirmarJunta = () => {
    if (!juntaMotivo) return
    setShowJuntaDialog(false)
    setSnackbar({ open: true, msg: 'Encaminhado para Junta Médica', severity: 'info' })
  }

  return (
    <Box sx={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'background.default' }}>
      <PageHeader
        pedido={pedido}
        onBack={() => router.push('/fila')}
        currentIndex={currentIndex}
        total={total}
        onPrev={handleNavPrev}
        onNext={handleNavNext}
      />
      <PendenciaBanner pedido={pedido} />
      <AlertasBanner pedido={pedido} />

      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2, overflow: 'hidden' }}>
        {/* Left content — scrolls independently */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <BeneficiarioSection pedido={pedido} />
            <ProcedimentosSection pedido={pedido} />
            <HistoricoConsolidadoSection pedido={pedido} />
            <ObservacoesSection pedido={pedido} />
            <DocumentosSection pedido={pedido} />
          </Box>
        </Box>

        {/* Right sidebar — always fully visible, own scroll if needed */}
        <Box sx={{ width: 400, flexShrink: 0, overflowY: 'auto', pb: 2 }}>
          <AssistenteSidebar
            pedido={pedido}
            onAprovarClick={handleAprovarClick}
            onNegarClick={handleNegarClick}
            onPendenciarClick={() => setShowPendenciarDialog(true)}
            onJuntaClick={() => setShowJuntaDialog(true)}
          />
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ minWidth: 300 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>

      {/* Aprovar Dialog */}
      <Dialog open={showAprovarDialog} onClose={() => setShowAprovarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Aprovação</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Você está prestes a aprovar a solicitação <strong>{pedido.id}</strong>. Esta ação é irreversível.
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Motivo Estruturado *</InputLabel>
            <Select value={aprovacaoMotivo} label="Motivo Estruturado *" onChange={e => setAprovacaoMotivo(e.target.value)}>
              {motivosAprovacao.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Justificativa Técnica *"
            multiline rows={3} fullWidth size="small"
            value={aprovacaoJustificativa}
            onChange={e => setAprovacaoJustificativa(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowAprovarDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!aprovacaoMotivo || !aprovacaoJustificativa.trim()}
            onClick={confirmarAprovacao}
            sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
          >
            Confirmar Aprovação
          </Button>
        </DialogActions>
      </Dialog>

      {/* Negar Dialog */}
      <Dialog open={showNegarDialog} onClose={() => setShowNegarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Reprovação</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Você está prestes a negar a solicitação <strong>{pedido.id}</strong>. Esta ação é irreversível.
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Motivo Estruturado *</InputLabel>
            <Select value={negacaoMotivo} label="Motivo Estruturado *" onChange={e => setNegacaoMotivo(e.target.value)}>
              {motivosNegacao.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Justificativa Técnica *"
            multiline rows={3} fullWidth size="small"
            value={negacaoJustificativa}
            onChange={e => setNegacaoJustificativa(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowNegarDialog(false)}>Cancelar</Button>
          <Button
            variant="contained" color="error"
            disabled={!negacaoMotivo || !negacaoJustificativa.trim()}
            onClick={confirmarNegacao}
          >
            Confirmar Reprovação
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pendenciar Dialog */}
      <Dialog open={showPendenciarDialog} onClose={() => setShowPendenciarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Pendenciar Solicitação</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
            Pendenciar NÃO interrompe o contador de SLA
          </Alert>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Motivos para pendenciar *</Typography>
          <FormGroup sx={{ mb: 2, maxHeight: 220, overflowY: 'auto' }}>
            {motivosPendenciar.map(item => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    size="small"
                    checked={pendenciarItens.includes(item)}
                    onChange={e => setPendenciarItens(prev => e.target.checked ? [...prev, item] : prev.filter(i => i !== item))}
                  />
                }
                label={<Typography variant="body2">{item}</Typography>}
              />
            ))}
          </FormGroup>
          <TextField
            label="Justificativa Adicional *"
            multiline rows={3} fullWidth size="small"
            placeholder="Descreva o motivo..."
            value={pendenciarJustificativa}
            onChange={e => setPendenciarJustificativa(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowPendenciarDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={pendenciarItens.length === 0}
            onClick={confirmarPendenciar}
            sx={{ backgroundColor: '#ea580c', '&:hover': { backgroundColor: '#c2410c' } }}
          >
            Confirmar Pendenciamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Junta Médica Dialog */}
      <Dialog open={showJuntaDialog} onClose={() => setShowJuntaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Encaminhar para Junta Médica</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A solicitação será encaminhada para avaliação de especialistas antes da decisão final.
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Motivo do Encaminhamento *</InputLabel>
            <Select value={juntaMotivo} label="Motivo do Encaminhamento *" onChange={e => setJuntaMotivo(e.target.value)}>
              {motivosJunta.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Observações para a Junta (opcional)"
            multiline rows={3} fullWidth size="small"
            value={juntaObs}
            onChange={e => setJuntaObs(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowJuntaDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!juntaMotivo}
            onClick={confirmarJunta}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
          >
            Encaminhar para Junta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Divergência Dialog */}
      <Dialog open={showDivergenciaDialog} onClose={() => setShowDivergenciaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <SmartToyIcon color="primary" fontSize="small" />
          Divergência com a IA
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sua decisão difere da sugestão da IA. Por favor, justifique o motivo desta divergência.
          </Typography>
          <Box sx={{ p: 1.5, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2">
              <strong>Sugestão da IA:</strong> {pedido.iaSugestao}
            </Typography>
          </Box>
          <TextField
            label="Motivo da Divergência *"
            multiline rows={4} fullWidth size="small"
            placeholder="Explique por que você está tomando uma decisão diferente da IA..."
            value={divergenciaMotivo}
            onChange={e => setDivergenciaMotivo(e.target.value)}
            error={divergenciaMotivo.trim() === ''}
            helperText={divergenciaMotivo.trim() === '' ? 'Campo obrigatório' : ''}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => { setShowDivergenciaDialog(false); setDivergenciaMotivo('') }}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!divergenciaMotivo.trim()}
            onClick={handleDivergenciaContinuar}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// ── Skeleton fallback ─────────────────────────────────────────────────
function AnaliseSkeleton() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="text" width={300} height={32} />
      <Skeleton variant="rounded" height={80} />
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={200} />
    </Box>
  )
}

// ── Default export wrapped in Suspense ────────────────────────────────
export default function AnalisePage() {
  return (
    <Suspense fallback={<AnaliseSkeleton />}>
      <AnaliseInner />
    </Suspense>
  )
}
