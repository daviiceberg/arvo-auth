'use client'
import React from 'react'
import { useState, useEffect, Suspense } from 'react'
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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
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
import Drawer from '@mui/material/Drawer'
import EditIcon from '@mui/icons-material/Edit'
import { pedidos, Pedido, IASugestao, OrigemPedido, Ajuste } from '@/data/pedidos'

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
            mb: 0.75,
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

      {/* Row 2: hospital + entry date + origem | shortcuts hint (right) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
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

        {/* Keyboard shortcuts hint — aligned below navigator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {[['← →', 'Navegar'], ['A', 'Aprovar'], ['N', 'Negar'], ['P', 'Pendenciar'], ['?', 'Ajuda']].map(([key, label]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <Box sx={{ px: 0.6, py: 0.1, backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 0.75, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'text.secondary', lineHeight: '16px' }}>{key}</Box>
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Alerts banner ─────────────────────────────────────────────────────
function PendenciaBanner({ pedido }: { pedido: Pedido }) {
  if (pedido.status !== 'Devolutiva' || !pedido.pendenciaMotivos) return null
  return (
    <Box>
      <Alert
        severity="warning"
        icon={<ErrorOutlineIcon fontSize="small" />}
        sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(245,158,11,0.35)' }}
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
    <Box>
      <Alert
        severity={pedido.alertas.includes('Liminar Judicial') ? 'warning' : 'error'}
        icon={<WarningAmberIcon fontSize="small" />}
        sx={{ borderRadius: 2, border: pedido.alertas.includes('Liminar Judicial') ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(212,24,61,0.3)' }}
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

// ── Mock user profile (in a real app, from auth context) ──────────────
const USER_PERFIL: 'Autorizador' | 'Gestor' | 'Auditor' = 'Gestor'

const MOTIVOS_AJUSTE = [
  'Quantidade acima do protocolo clínico da operadora',
  'Quantidade acima da diretriz ANS (DUT)',
  'Prestador não credenciado para este procedimento',
  'Prestador solicitado indisponível — substituição por credenciado',
  'Código digitado incorretamente pelo operador',
  'Código incompatível com o CID informado',
  'Determinação de junta médica',
  'Outro (descrever na fundamentação)',
]

function formatAjusteTimestamp(ts: string): string {
  const d = new Date(ts)
  return `${d.toLocaleDateString('pt-BR')} · ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

// ── Ajuste Drawer ──────────────────────────────────────────────────────
interface AjusteDrawerProps {
  open: boolean
  pedidoId: string
  pedidoStatus: string
  proc: { codigo: string; descricao: string; qty: number; prestador: string } | null
  onClose: () => void
  onConfirm: (ajuste: Omit<Ajuste, 'id'>) => void
}

function AjusteDrawer({ open, pedidoId, pedidoStatus, proc, onClose, onConfirm }: AjusteDrawerProps) {
  const [campo, setCampo] = useState<'quantidade' | 'prestador' | 'codigo' | ''>('')
  const [novaQty, setNovaQty] = useState('')
  const [novoPrestador, setNovoPrestador] = useState('')
  const [novoCNES, setNovoCNES] = useState('')
  const [novoCodigo, setNovoCodigo] = useState('')
  const [novaDesc, setNovaDesc] = useState('')
  const [motivo, setMotivo] = useState('')
  const [fundamentacao, setFundamentacao] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const camposDisponiveis =
    USER_PERFIL === 'Gestor'
      ? [{ value: 'quantidade', label: 'Quantidade autorizada' }, { value: 'prestador', label: 'Prestador executante' }, { value: 'codigo', label: 'Código do procedimento' }]
      : [{ value: 'quantidade', label: 'Quantidade autorizada' }]

  const qtyNum = parseInt(novaQty, 10)
  const qtyStatus =
    !novaQty || isNaN(qtyNum) ? null
    : qtyNum < (proc?.qty ?? 0) ? 'below'
    : qtyNum === (proc?.qty ?? 0) ? 'equal'
    : 'above'

  // Reset when proc changes or drawer closes
  useEffect(() => {
    if (!open) return
    setCampo('')
    setNovaQty('')
    setNovoPrestador('')
    setNovoCNES('')
    setNovoCodigo('')
    setNovaDesc('')
    setMotivo('')
    setFundamentacao('')
    setErrors({})
  }, [open, proc?.codigo])

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!campo) errs.campo = 'Selecione o campo a ajustar'
    if (campo === 'quantidade') {
      if (!novaQty || isNaN(qtyNum) || qtyNum < 1) errs.novaQty = 'Informe uma quantidade válida (mín. 1)'
      if (qtyStatus === 'above') errs.novaQty = 'Não é possível autorizar mais que o solicitado'
    }
    if (campo === 'prestador' && !novoPrestador.trim()) errs.novoPrestador = 'Informe o novo prestador'
    if (campo === 'codigo') {
      if (!novoCodigo.trim()) errs.novoCodigo = 'Informe o novo código'
      if (!novaDesc.trim()) errs.novaDesc = 'Informe a nova descrição'
    }
    if (!motivo) errs.motivo = 'Selecione o motivo'
    if (motivo === 'Outro (descrever na fundamentação)' && !fundamentacao.trim()) errs.fundamentacao = 'Fundamentação obrigatória quando motivo é "Outro"'
    return errs
  }

  const handleConfirm = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!proc || !campo) return

    let valorAnterior = ''
    let valorNovo = ''
    if (campo === 'quantidade') { valorAnterior = String(proc.qty); valorNovo = novaQty }
    if (campo === 'prestador') { valorAnterior = proc.prestador; valorNovo = novoCNES ? `${novoPrestador} (CNES: ${novoCNES})` : novoPrestador }
    if (campo === 'codigo') { valorAnterior = proc.codigo; valorNovo = `${novoCodigo} — ${novaDesc}` }

    onConfirm({
      procedimentoCodigo: proc.codigo,
      procedimentoDescricao: proc.descricao,
      campo: campo as 'quantidade' | 'prestador' | 'codigo',
      valorAnterior,
      valorNovo,
      motivo,
      fundamentacao: fundamentacao.trim() || undefined,
      operador: 'Ana Paula Santos',
      perfil: USER_PERFIL,
      timestamp: new Date().toISOString(),
    })
  }

  const isGuiaFinalizada = ['Aprovado', 'Negado', 'Cancelado'].includes(pedidoStatus)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {/* overlay click does NOT close — only X or Cancelar */}}
      PaperProps={{
        role: 'dialog',
        'aria-label': 'Ajustar procedimento',
        sx: { width: 480, p: 0, display: 'flex', flexDirection: 'column' },
      }}
      ModalProps={{ keepMounted: false }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <EditIcon sx={{ fontSize: 16, color: '#b45309' }} />
            <Typography fontWeight={700} sx={{ fontSize: 15 }}>Ajustar Procedimento</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {pedidoId} · {proc?.codigo}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Valores atuais */}
        <Box sx={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 1.5, p: 2 }}>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', display: 'block', mb: 1.25 }}>
            Valores Atuais (somente leitura)
          </Typography>
          {[
            { label: 'Código', value: proc?.codigo },
            { label: 'Descrição', value: proc?.descricao },
            { label: 'Qtd. Solicitada', value: proc ? `${proc.qty} sessões` : '' },
            { label: 'Prestador', value: proc?.prestador },
          ].map((f) => (
            <Box key={f.label} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, width: 110, flexShrink: 0 }}>{f.label}:</Typography>
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>{f.value}</Typography>
            </Box>
          ))}
        </Box>

        {/* Ajuste proposto */}
        <Box>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Ajuste Proposto
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: errors.campo ? 0.5 : 2 }} error={!!errors.campo}>
            <InputLabel>Campo a ajustar *</InputLabel>
            <Select value={campo} label="Campo a ajustar *" onChange={e => { setCampo(e.target.value as typeof campo); setErrors(v => ({ ...v, campo: '' })) }} autoFocus>
              {camposDisponiveis.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
            </Select>
            {errors.campo && <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.campo}</Typography>}
          </FormControl>

          {/* Quantidade */}
          {campo === 'quantidade' && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField size="small" label="Qtd. solicitada" value={proc?.qty ?? ''} disabled sx={{ flex: 1 }} />
                <TextField
                  size="small"
                  label="Qtd. autorizada *"
                  value={novaQty}
                  onChange={e => { setNovaQty(e.target.value.replace(/\D/g, '')); setErrors(v => ({ ...v, novaQty: '' })) }}
                  inputProps={{ min: 1, inputMode: 'numeric' }}
                  placeholder="Ex: 20"
                  error={!!errors.novaQty}
                  sx={{ flex: 1 }}
                />
              </Box>
              {errors.novaQty && <Typography sx={{ fontSize: 11, color: 'error.main', mb: 0.75 }}>{errors.novaQty}</Typography>}
              {qtyStatus === 'below' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <WarningAmberIcon sx={{ fontSize: 14, color: '#b45309' }} />
                  <Typography sx={{ fontSize: 12, color: '#b45309' }}>Autorizando menos que o solicitado ({proc?.qty} → {novaQty})</Typography>
                </Box>
              )}
              {qtyStatus === 'equal' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                  <Typography sx={{ fontSize: 12, color: '#16a34a' }}>Mantendo a quantidade solicitada</Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Prestador */}
          {campo === 'prestador' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Prestador atual" value={proc?.prestador ?? ''} disabled fullWidth sx={{ mb: 1.5 }} />
              <TextField
                size="small"
                label="Novo prestador *"
                value={novoPrestador}
                onChange={e => { setNovoPrestador(e.target.value); setErrors(v => ({ ...v, novoPrestador: '' })) }}
                placeholder="Nome do prestador credenciado"
                error={!!errors.novoPrestador}
                helperText={errors.novoPrestador}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label="CNES (opcional)"
                value={novoCNES}
                onChange={e => setNovoCNES(e.target.value.replace(/\D/g, ''))}
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
              />
            </Box>
          )}

          {/* Código */}
          {campo === 'codigo' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Código atual" value={proc?.codigo ?? ''} disabled fullWidth sx={{ mb: 1.5 }} />
              <Alert severity="warning" sx={{ mb: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}>
                Alteração de código requer respaldo de junta médica ou diretriz ANS. Certifique-se de registrar a fundamentação abaixo.
              </Alert>
              <TextField
                size="small"
                label="Novo código TISS *"
                value={novoCodigo}
                onChange={e => { setNovoCodigo(e.target.value); setErrors(v => ({ ...v, novoCodigo: '' })) }}
                placeholder="Código TISS"
                error={!!errors.novoCodigo}
                helperText={errors.novoCodigo}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label="Nova descrição *"
                value={novaDesc}
                onChange={e => { setNovaDesc(e.target.value); setErrors(v => ({ ...v, novaDesc: '' })) }}
                error={!!errors.novaDesc}
                helperText={errors.novaDesc}
                fullWidth
              />
            </Box>
          )}

          {/* Motivo */}
          <FormControl fullWidth size="small" sx={{ mb: errors.motivo ? 0.5 : 2 }} error={!!errors.motivo}>
            <InputLabel>Motivo do ajuste *</InputLabel>
            <Select value={motivo} label="Motivo do ajuste *" onChange={e => { setMotivo(e.target.value); setErrors(v => ({ ...v, motivo: '' })) }}>
              {MOTIVOS_AJUSTE.map(m => <MenuItem key={m} value={m} sx={{ fontSize: 13, whiteSpace: 'normal' }}>{m}</MenuItem>)}
            </Select>
            {errors.motivo && <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.motivo}</Typography>}
          </FormControl>

          <TextField
            label={`Fundamentação clínica/regulatória${motivo === 'Outro (descrever na fundamentação)' ? ' *' : ' (opcional)'}`}
            multiline
            rows={3}
            size="small"
            fullWidth
            value={fundamentacao}
            onChange={e => { setFundamentacao(e.target.value); setErrors(v => ({ ...v, fundamentacao: '' })) }}
            error={!!errors.fundamentacao}
            helperText={errors.fundamentacao}
          />
        </Box>

        {/* Aviso auditoria */}
        <Alert severity="warning" icon={<WarningAmberIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}>
          Este ajuste será registrado no histórico da guia com seu nome e data/hora.
        </Alert>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: 1.5, flexShrink: 0 }}>
        <Button variant="outlined" fullWidth onClick={onClose} sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          disabled={isGuiaFinalizada}
          sx={{ fontWeight: 600, backgroundColor: '#b45309', '&:hover': { backgroundColor: '#92400e' } }}
        >
          Confirmar Ajuste
        </Button>
      </Box>
    </Drawer>
  )
}

// ── Procedimentos ─────────────────────────────────────────────────────
interface ProcedimentosSectionProps {
  pedido: Pedido
  allAjustes: Ajuste[]
  onAjustarClick: (proc: { codigo: string; descricao: string; qty: number; prestador: string }) => void
}

function ProcedimentosSection({ pedido, allAjustes, onAjustarClick }: ProcedimentosSectionProps) {
  const procs = pedido.procedimentos
  const p = pedido.prestador
  const isGuiaFinalizada = ['Aprovado', 'Negado', 'Cancelado'].includes(pedido.status)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {procs.map((proc) => {
              const ajuste = allAjustes.find(a => a.procedimentoCodigo === proc.codigo && a.campo === 'quantidade')
              const ajustePrestador = allAjustes.find(a => a.procedimentoCodigo === proc.codigo && a.campo === 'prestador')
              const ajusteCodigo = allAjustes.find(a => a.procedimentoCodigo === proc.codigo && a.campo === 'codigo')
              const hasAnyAjuste = allAjustes.some(a => a.procedimentoCodigo === proc.codigo)

              return (
                <TableRow key={proc.codigo}>
                  <TableCell sx={{ pl: 0, fontWeight: 700, fontSize: 13, width: 120, verticalAlign: 'top', pt: 1.5 }}>
                    {ajusteCodigo ? (
                      <Box>
                        <Typography sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}>{proc.codigo}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>{ajusteCodigo.valorNovo.split(' — ')[0]}</Typography>
                      </Box>
                    ) : proc.codigo}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, verticalAlign: 'top', pt: 1.5 }}>
                    {ajusteCodigo ? (
                      <Box>
                        <Typography sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}>{proc.descricao}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#b45309' }}>{ajusteCodigo.valorNovo.split(' — ')[1] ?? ajusteCodigo.valorNovo}</Typography>
                      </Box>
                    ) : proc.descricao}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
                    {ajuste ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: 12 }}>Qtd: {proc.qty} ·</Typography>
                        <Typography sx={{ fontSize: 12, color: '#b45309', fontWeight: 700 }}>Aut: {ajuste.valorNovo} ✏</Typography>
                      </Box>
                    ) : (
                      `Qtd: ${proc.qty}${proc.qtyAutorizada !== undefined ? ` · Aut: ${proc.qtyAutorizada}` : ''}`
                    )}
                    {ajustePrestador && (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography sx={{ fontSize: 11, color: 'text.disabled', textDecoration: 'line-through' }}>{ajustePrestador.valorAnterior}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>✏ {ajustePrestador.valorNovo}</Typography>
                      </Box>
                    )}
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
                      {hasAnyAjuste && !isGuiaFinalizada && (
                        <Chip
                          icon={<EditIcon sx={{ fontSize: 10, ml: '4px !important' }} />}
                          label="Ajustado"
                          size="small"
                          sx={{ backgroundColor: 'rgba(180,83,9,0.1)', color: '#b45309', fontWeight: 700, fontSize: 11, height: 20 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top', pt: 1, pr: 0 }}>
                    {USER_PERFIL !== 'Auditor' && (
                      isGuiaFinalizada ? (
                        <Tooltip title="Guia já finalizada — edição não permitida">
                          <span>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled
                              startIcon={<EditIcon sx={{ fontSize: 12 }} />}
                              sx={{ fontSize: 11, fontWeight: 600, borderColor: 'rgba(0,0,0,0.15)', color: 'text.disabled', py: 0.25, px: 1 }}
                            >
                              Ajustar
                            </Button>
                          </span>
                        </Tooltip>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon sx={{ fontSize: 12 }} />}
                          onClick={() => onAjustarClick({ codigo: proc.codigo, descricao: proc.descricao, qty: proc.qty, prestador: p.hospital })}
                          sx={{ fontSize: 11, fontWeight: 600, borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary', py: 0.25, px: 1, '&:hover': { borderColor: '#b45309', color: '#b45309', backgroundColor: 'rgba(180,83,9,0.04)' } }}
                        >
                          Ajustar
                        </Button>
                      )
                    )}
                    {USER_PERFIL === 'Auditor' && (
                      <Chip label="Somente leitura" size="small" sx={{ fontSize: 11, height: 20, backgroundColor: 'rgba(0,0,0,0.06)', color: 'text.secondary' }} />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, mx: -3, mb: -3, px: 3, py: 2, backgroundColor: 'rgba(0,0,0,0.03)', borderTop: 'none' }}>
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

// ── Ajustes Registrados Section ────────────────────────────────────────
function AjustesRegistradosSection({ ajustes }: { ajustes: Ajuste[] }) {
  const [collapsed, setCollapsed] = useState(true)
  if (ajustes.length === 0) return null

  const campoLabel: Record<Ajuste['campo'], string> = {
    quantidade: 'Qtd. autorizada alterada',
    prestador: 'Prestador executante alterado',
    codigo: 'Código do procedimento alterado',
  }

  return (
    <Card sx={{ border: '1px solid rgba(245,158,11,0.35) !important', backgroundColor: 'rgba(255,251,235,0.6)' }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          onClick={() => setCollapsed(v => !v)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25, cursor: 'pointer', userSelect: 'none' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ fontSize: 15, color: '#b45309' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>
              Ajustes Registrados ({ajustes.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>
              {collapsed ? 'ver todos' : 'recolher'}
            </Typography>
            <ExpandMoreIcon sx={{ fontSize: 16, color: '#b45309', transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 200ms' }} />
          </Box>
        </Box>
        <Collapse in={!collapsed}>
          <Box sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {ajustes.map((aj) => (
              <Box
                key={aj.id}
                sx={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 1.5, p: 1.75 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <EditIcon sx={{ fontSize: 13, color: '#b45309' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{campoLabel[aj.campo]}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, flexShrink: 0, ml: 1 }}>
                    {formatAjusteTimestamp(aj.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mb: 0.5 }}>
                  {aj.procedimentoCodigo} — {aj.procedimentoDescricao}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>De:</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{aj.valorAnterior}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>→ Para:</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>{aj.valorNovo}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mb: 0.25 }}>
                  Motivo: {aj.motivo}
                </Typography>
                {aj.fundamentacao && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mb: 0.25, fontStyle: 'italic' }}>
                    {aj.fundamentacao}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Por: {aj.operador} ({aj.perfil})
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
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
// ── IA extraction mock data ────────────────────────────────────────────
type IACampoStatus = 'ok' | 'warning' | 'error'
interface IAExtractionField { label: string; valor: string; status: IACampoStatus }

function getIAExtractionFields(docNome: string, docTipo: string): IAExtractionField[] {
  const tipo = (docNome + docTipo).toLowerCase()
  if (tipo.includes('pedido') || tipo.includes('médico') || tipo.includes('solicitação')) {
    return [
      { label: 'Médico solicitante', valor: 'Identificado com CRM legível', status: 'ok' },
      { label: 'CID principal', valor: 'Presente e compatível', status: 'ok' },
      { label: 'Procedimento', valor: 'Código TUSS identificado', status: 'ok' },
      { label: 'Data da solicitação', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura', valor: 'Presente', status: 'ok' },
      { label: 'Carimbo médico', valor: 'Não identificado', status: 'warning' },
    ]
  }
  if (tipo.includes('laudo') || tipo.includes('relatório')) {
    return [
      { label: 'Data do laudo', valor: 'Identificada', status: 'ok' },
      { label: 'Hipótese diagnóstica', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura e CRM', valor: 'Legíveis', status: 'ok' },
      { label: 'Carimbo médico', valor: 'Ausente', status: 'error' },
      { label: 'Justificativa clínica', valor: 'Incompleta — faltam dados de evolução', status: 'warning' },
    ]
  }
  if (tipo.includes('judicial') || tipo.includes('liminar') || tipo.includes('jurídico')) {
    return [
      { label: 'Número do processo', valor: 'Identificado', status: 'ok' },
      { label: 'Vara/Tribunal', valor: 'Identificado', status: 'ok' },
      { label: 'Data de emissão', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura digital', valor: 'Não verificável neste sistema', status: 'warning' },
    ]
  }
  if (tipo.includes('exame') || tipo.includes('imagem') || tipo.includes('ressonância') || tipo.includes('tomografia')) {
    return [
      { label: 'Tipo de exame', valor: 'Identificado', status: 'ok' },
      { label: 'Data de realização', valor: 'Presente', status: 'ok' },
      { label: 'Laudo médico', valor: 'Presente', status: 'ok' },
      { label: 'Conclusão diagnóstica', valor: 'Compatível com CID do pedido', status: 'ok' },
    ]
  }
  return [
    { label: 'Tipo de documento', valor: 'Identificado', status: 'ok' },
    { label: 'Data do documento', valor: 'Presente', status: 'ok' },
    { label: 'Autenticidade', valor: 'Não verificável automaticamente', status: 'warning' },
  ]
}

function IACampoIcon({ status }: { status: IACampoStatus }) {
  if (status === 'ok') return <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a', flexShrink: 0 }} />
  if (status === 'warning') return <WarningAmberIcon sx={{ fontSize: 14, color: '#b45309', flexShrink: 0 }} />
  return <ErrorOutlineIcon sx={{ fontSize: 14, color: '#d4183d', flexShrink: 0 }} />
}

function DocumentosSection({ pedido }: { pedido: Pedido }) {
  const docs = pedido.documentos
  const [viewDoc, setViewDoc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [expandedIA, setExpandedIA] = useState<Record<number, boolean>>({ 0: true })

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Documentos ({docs.length})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {docs.map((doc, idx) => {
            const iaFields = getIAExtractionFields(doc.nome, doc.tipo)
            const iaOpen = !!expandedIA[idx]
            return (
              <Box
                key={doc.nome}
                sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}
              >
                {/* Doc row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  {docIcon(doc.tipo)}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{doc.nome}</Typography>
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

                {/* IA Extraction toggle */}
                <Box
                  onClick={() => setExpandedIA(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 2,
                    py: 0.75,
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    backgroundColor: iaOpen ? 'rgba(37,99,235,0.03)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(37,99,235,0.05)' },
                    transition: 'background-color 0.12s ease',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 13, color: '#2563eb' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#2563eb', flex: 1 }}>
                    IA extraiu
                  </Typography>
                  <Box sx={{
                    transform: iaOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                    display: 'flex',
                    color: 'text.secondary',
                  }}>
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>

                {/* IA Extraction content */}
                <Collapse in={iaOpen}>
                  <Box sx={{ px: 2, pt: 1.5, pb: 2, backgroundColor: 'rgba(37,99,235,0.02)', borderTop: '1px solid rgba(37,99,235,0.08)' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.4, mb: 1.25 }}>
                      Leitura do documento pela IA
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {iaFields.map((field) => (
                        <Box key={field.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <IACampoIcon status={field.status} />
                          <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{field.label}:</Box>{' '}
                            {field.valor}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            )
          })}
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

  // Ajuste state
  const [ajusteDrawerOpen, setAjusteDrawerOpen] = useState(false)
  const [ajusteDrawerProc, setAjusteDrawerProc] = useState<{ codigo: string; descricao: string; qty: number; prestador: string } | null>(null)
  const [localAjustes, setLocalAjustes] = useState<Ajuste[]>([])
  const [showAjusteAprovarConfirm, setShowAjusteAprovarConfirm] = useState(false)

  const allAjustes: Ajuste[] = [...(pedido.ajustes ?? []), ...localAjustes]

  const handleAjustarClick = (proc: { codigo: string; descricao: string; qty: number; prestador: string }) => {
    setAjusteDrawerProc(proc)
    setAjusteDrawerOpen(true)
  }

  const handleAjusteConfirm = (ajuste: Omit<Ajuste, 'id'>) => {
    const newAjuste: Ajuste = { id: `ADJ-${Date.now()}`, ...ajuste }
    setLocalAjustes(prev => [...prev, newAjuste])
    setAjusteDrawerOpen(false)
    const campoLabel = ajuste.campo === 'quantidade' ? `Qtd. autorizada alterada de ${ajuste.valorAnterior} para ${ajuste.valorNovo}`
      : ajuste.campo === 'prestador' ? `Prestador alterado para ${ajuste.valorNovo}`
      : `Código alterado para ${ajuste.valorNovo}`
    setSnackbar({ open: true, msg: `✓ Ajuste registrado — ${campoLabel}`, severity: 'warning' })
  }

  // Dialog state
  const [showAprovarDialog, setShowAprovarDialog] = useState(false)
  const [showNegarDialog, setShowNegarDialog] = useState(false)
  const [showPendenciarDialog, setShowPendenciarDialog] = useState(false)
  const [showJuntaDialog, setShowJuntaDialog] = useState(false)
  const [showDivergenciaDialog, setShowDivergenciaDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'autorizar' | 'negar' | null>(null)

  const [aprovacaoMotivo, setAprovacaoMotivo] = useState('')
  const [aprovacaoJustificativa, setAprovacaoJustificativa] = useState('')
  const [negacaoMotivoIdx, setNegacaoMotivoIdx] = useState<number>(-1)
  const [negacaoJustificativa, setNegacaoJustificativa] = useState('')
  const [pendenciarItens, setPendenciarItens] = useState<string[]>([])
  const [pendenciarJustificativa, setPendenciarJustificativa] = useState('')
  const [juntaMotivo, setJuntaMotivo] = useState('')
  const [juntaObs, setJuntaObs] = useState('')
  const [divergenciaMotivo, setDivergenciaMotivo] = useState('')
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const isAnyDialogOpen = showAprovarDialog || showNegarDialog || showPendenciarDialog || showJuntaDialog || showDivergenciaDialog || showShortcutsHelp || showAjusteAprovarConfirm || ajusteDrawerOpen
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) return
      if (e.key === '?') { setShowShortcutsHelp(true); return }
      if (isAnyDialogOpen) return
      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') { if (currentIndex < total - 1) handleNavNext(); return }
      if (e.key === 'ArrowLeft'  || e.key === 'k' || e.key === 'K') { if (currentIndex > 0) handleNavPrev(); return }
      if (e.key === 'a' || e.key === 'A') { handleAprovarClick(); return }
      if (e.key === 'n' || e.key === 'N') { handleNegarClick(); return }
      if (e.key === 'p' || e.key === 'P') { setShowPendenciarDialog(true); return }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showAprovarDialog, showNegarDialog, showPendenciarDialog, showJuntaDialog, showDivergenciaDialog, showShortcutsHelp, showAjusteAprovarConfirm, ajusteDrawerOpen, currentIndex, total])

  // Lists for selects/checkboxes
  const motivosAprovacao = [
    'Indicação técnica adequada',
    'Cobertura contratual confirmada',
    'Documentação completa e correta',
    'Alinhado com protocolo clínico ANS',
    'Urgência/Emergência caracterizada',
  ]

  const motivosNegacao = [
    { label: 'Carência contratual', texto: 'Solicitação negada em razão de período de carência contratual não cumprido para o procedimento solicitado, conforme contrato do plano do beneficiário.' },
    { label: 'Fora do Rol ANS', texto: 'O procedimento solicitado não consta no Rol de Procedimentos e Eventos em Saúde da ANS (RN 465/2021 e atualizações), não sendo de cobertura obrigatória.' },
    { label: 'Documentação clínica incompleta', texto: 'Negativa por ausência ou incompletude da documentação clínica exigida para análise. O beneficiário poderá reapresentar o pedido com documentação completa.' },
    { label: 'Método/procedimento não coberto', texto: 'O método ou procedimento solicitado não está contemplado na cobertura contratual vigente e/ou no Rol de Procedimentos da ANS.' },
    { label: 'Prestador não credenciado para o procedimento', texto: 'O prestador indicado não possui credenciamento junto à operadora para a realização do procedimento solicitado na especialidade requerida.' },
    { label: 'Quantidade acima do protocolo clínico', texto: 'A quantidade solicitada excede o limite estabelecido pelo protocolo clínico e/ou pelas Diretrizes de Utilização (DUT) aplicáveis para este procedimento.' },
    { label: 'CID incompatível com o procedimento solicitado', texto: 'Há incompatibilidade clínica entre o CID informado e o procedimento solicitado, não havendo indicação reconhecida nos protocolos técnicos vigentes.' },
    { label: 'Outro motivo', texto: '' },
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
    if (allAjustes.length > 0) {
      setShowAjusteAprovarConfirm(true)
      return
    }
    doAprovar()
  }

  const doAprovar = () => {
    if (pedido.iaSugestao !== 'Aprovar') {
      setPendingAction('autorizar')
      setShowDivergenciaDialog(true)
    } else {
      setAprovacaoJustificativa(`Justificativa: ${pedido.iaJustificativa}`)
      setShowAprovarDialog(true)
    }
  }

  const handleNegarClick = () => {
    setNegacaoMotivoIdx(-1)
    setNegacaoJustificativa('')
    setShowNegarDialog(true)
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
    if (negacaoMotivoIdx === -1 || !negacaoJustificativa.trim()) return
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
      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2, overflow: 'hidden' }}>
        {/* Left content — scrolls independently */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <PendenciaBanner pedido={pedido} />
            <AlertasBanner pedido={pedido} />
            <BeneficiarioSection pedido={pedido} />
            <ProcedimentosSection pedido={pedido} allAjustes={allAjustes} onAjustarClick={handleAjustarClick} />
            <AjustesRegistradosSection ajustes={allAjustes} />
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ minWidth: 300 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>

      {/* Ajuste Drawer */}
      <AjusteDrawer
        open={ajusteDrawerOpen}
        pedidoId={pedido.id}
        pedidoStatus={pedido.status}
        proc={ajusteDrawerProc}
        onClose={() => setAjusteDrawerOpen(false)}
        onConfirm={handleAjusteConfirm}
      />

      {/* Confirmar aprovação com ajustes */}
      <Dialog open={showAjusteAprovarConfirm} onClose={() => setShowAjusteAprovarConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 15 }}>Aprovação com ajustes registrados</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
            Esta guia possui <strong>{allAjustes.length} ajuste{allAjustes.length > 1 ? 's' : ''} registrado{allAjustes.length > 1 ? 's' : ''}</strong>:
          </Typography>
          {allAjustes.map((aj) => (
            <Box key={aj.id} sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
              <EditIcon sx={{ fontSize: 13, color: '#b45309', mt: 0.15, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontSize: 12 }}>
                {aj.campo === 'quantidade' ? `Quantidade reduzida de ${aj.valorAnterior} para ${aj.valorNovo}`
                  : aj.campo === 'prestador' ? `Prestador alterado para ${aj.valorNovo}`
                  : `Código alterado para ${aj.valorNovo}`}
              </Typography>
            </Box>
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontSize: 13 }}>
            Confirma a aprovação com esses ajustes aplicados?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setShowAjusteAprovarConfirm(false)} sx={{ fontWeight: 600 }}>
            Revisar
          </Button>
          <Button variant="contained" onClick={() => { setShowAjusteAprovarConfirm(false); doAprovar() }} sx={{ fontWeight: 600 }}>
            Confirmar aprovação com ajustes
          </Button>
        </DialogActions>
      </Dialog>

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
      <Dialog open={showNegarDialog} onClose={() => setShowNegarDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Registrar Negativa</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Solicitação <strong>{pedido.id}</strong> · {pedido.beneficiario.nome}
          </Typography>
          {pedido.iaSugestao !== 'Negar' && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
              A IA sugeriu <strong>{pedido.iaSugestao}</strong> para este caso. Ao registrar negativa, justifique o motivo da divergência no campo abaixo.
            </Alert>
          )}
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>
            Selecione o motivo da negativa *
          </Typography>
          <RadioGroup
            value={negacaoMotivoIdx === -1 ? '' : String(negacaoMotivoIdx)}
            onChange={(e) => {
              const idx = Number(e.target.value)
              setNegacaoMotivoIdx(idx)
              setNegacaoJustificativa(motivosNegacao[idx].texto)
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
              {motivosNegacao.map((m, idx) => (
                <Box
                  key={idx}
                  onClick={() => {
                    setNegacaoMotivoIdx(idx)
                    setNegacaoJustificativa(m.texto)
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.25,
                    border: negacaoMotivoIdx === idx
                      ? '2px solid #d4183d'
                      : '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: negacaoMotivoIdx === idx ? 'rgba(212,24,61,0.04)' : '#fff',
                    transition: 'all 0.12s ease',
                    '&:hover': { borderColor: '#d4183d', backgroundColor: 'rgba(212,24,61,0.02)' },
                  }}
                >
                  <Radio
                    value={String(idx)}
                    size="small"
                    checked={negacaoMotivoIdx === idx}
                    onChange={() => {}}
                    sx={{ p: 0, color: negacaoMotivoIdx === idx ? '#d4183d' : undefined, '&.Mui-checked': { color: '#d4183d' } }}
                  />
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: negacaoMotivoIdx === idx ? 700 : 500, lineHeight: 1.3 }}>
                    {m.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </RadioGroup>
          <TextField
            label={`Justificativa técnica *${negacaoMotivoIdx === motivosNegacao.length - 1 ? '' : ' (editável)'}`}
            multiline rows={4} fullWidth size="small"
            placeholder="Descreva o motivo da negativa..."
            value={negacaoJustificativa}
            onChange={e => setNegacaoJustificativa(e.target.value)}
            helperText={negacaoMotivoIdx >= 0 && negacaoMotivoIdx < motivosNegacao.length - 1
              ? 'Texto preenchido automaticamente conforme o motivo. Edite se necessário.'
              : undefined}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setShowNegarDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            disabled={negacaoMotivoIdx === -1 || !negacaoJustificativa.trim()}
            onClick={confirmarNegacao}
          >
            Confirmar Negativa
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

      {/* Shortcuts Help Dialog */}
      <Dialog open={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: 18 }}>⌨️</Box> Atalhos de Teclado
        </DialogTitle>
        <DialogContent>
          {[
            { keys: '← / K', desc: 'Pedido anterior' },
            { keys: '→ / J', desc: 'Próximo pedido' },
            { keys: 'A', desc: 'Aprovar pedido' },
            { keys: 'N', desc: 'Negar pedido' },
            { keys: 'P', desc: 'Pendenciar pedido' },
            { keys: '?', desc: 'Mostrar esta ajuda' },
          ].map(({ keys, desc }) => (
            <Box key={keys} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="body2" color="text.secondary">{desc}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {keys.split(' / ').map(k => (
                  <Box key={k} sx={{ px: 1, py: 0.25, backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 1, fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>
                    {k}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Atalhos são desativados quando o foco está em campos de texto.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setShowShortcutsHelp(false)}>Fechar</Button>
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
