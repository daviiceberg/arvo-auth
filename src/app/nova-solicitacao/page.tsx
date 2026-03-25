'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CheckIcon from '@mui/icons-material/Check'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'

// ── Types ────────────────────────────────────────────────────────────
type ModuloType = 'internacao' | 'urgencia' | 'oncologia' | 'terapias' | 'opme' | 'exames' | 'cirurgias' | 'homecare'

interface ProcedimentoItem { codigoTUSS: string; descricao: string; qtd: string }
interface OpmeItem { codigoTUSS: string; descricao: string; fabricante: string; qtd: string; valorUnit: string }
interface ExameItem { codigoTUSS: string; descricao: string; tipo: string; qtd: string }
interface MaterialItem { codigo: string; descricao: string; fabricante: string; qtd: string; valor: string }
interface Cotacao { fornecedor: string; valor: string }

interface FormData {
  // Step 1
  tipoSolicitacao: ModuloType | ''
  nomeBeneficiario: string
  carteirinha: string
  dataNascimento: string
  cpf: string
  operadora: string
  validadeCarteirinha: string
  // Step 2
  cidPrincipal: string
  caraterAtendimento: string
  medicoSolicitante: string
  crm: string
  indicacaoClinica: string
  // Internação
  tipoAcomodacao: string
  qtdDiarias: string
  dataInternacao: string
  regimeInternacao: string
  // Urgência
  classificacaoRisco: string
  tipoAtendimento: string
  queixaPrincipal: string
  // Oncologia
  estadiamentoTNM: string
  numeroCiclo: string
  protocoloQuimio: string
  tipoTratamento: string
  totalCiclos: string
  // Terapias
  tipoTerapia: string
  numSessoes: string
  frequenciaSemanal: string
  duracaoSessao: string
  // OPME
  materiais: MaterialItem[]
  registroAnvisa: string
  fabricanteMaterial: string
  justificativaTecnica: string
  cotacoes: Cotacao[]
  // Exames
  exames: ExameItem[]
  // Cirurgias
  procedimentos: ProcedimentoItem[]
  opme: OpmeItem[]
  // Home Care
  modalidadeHomeCare: string
  periodoSolicitado: string
  cuidadosNecessarios: string
}

const moduloLabels: Record<ModuloType, string> = {
  internacao: 'Internação Hospitalar',
  urgencia: 'Urgência/Emergência',
  oncologia: 'Oncologia',
  terapias: 'Terapias Especiais',
  opme: 'OPME',
  exames: 'Exames de Alta Complexidade',
  cirurgias: 'Cirurgia Eletiva',
  homecare: 'Home Care',
}

const getStep3Label = (modulo: ModuloType | ''): string => {
  switch (modulo) {
    case 'cirurgias': return 'Procedimentos e OPME'
    case 'internacao': return 'Acomodação e Diárias'
    case 'urgencia': return 'Classificação de Risco'
    case 'oncologia': return 'Protocolo Oncológico'
    case 'terapias': return 'Sessões de Terapia'
    case 'opme': return 'Materiais e OPME'
    case 'exames': return 'Exames Solicitados'
    case 'homecare': return 'Cuidados Domiciliares'
    default: return 'Procedimentos'
  }
}

const initialForm: FormData = {
  tipoSolicitacao: '',
  nomeBeneficiario: 'Maria Silva Santos',
  carteirinha: '1234567890123456',
  dataNascimento: '1956-03-15',
  cpf: '',
  operadora: 'Bradesco Saúde',
  validadeCarteirinha: '',
  cidPrincipal: 'M17.1 - Gonartrose primária bilateral',
  caraterAtendimento: 'Eletivo',
  medicoSolicitante: 'Dr. João Oliveira',
  crm: 'CRM/SP 123456',
  indicacaoClinica: 'Paciente com gonartrose primária bilateral com indicação funcional e dor intensa ao deambular e repouso, sem resposta ao tratamento conservador.',
  tipoAcomodacao: 'Apartamento',
  qtdDiarias: '3',
  dataInternacao: '',
  regimeInternacao: 'Hospitalar',
  classificacaoRisco: 'amarelo',
  tipoAtendimento: 'Urgência',
  queixaPrincipal: '',
  estadiamentoTNM: '',
  numeroCiclo: '',
  protocoloQuimio: '',
  tipoTratamento: 'Quimioterapia',
  totalCiclos: '',
  tipoTerapia: 'Fisioterapia',
  numSessoes: '',
  frequenciaSemanal: '3x por semana',
  duracaoSessao: '50',
  materiais: [{ codigo: '', descricao: '', fabricante: '', qtd: '1', valor: '' }],
  registroAnvisa: '',
  fabricanteMaterial: '',
  justificativaTecnica: '',
  cotacoes: [{ fornecedor: '', valor: '' }, { fornecedor: '', valor: '' }, { fornecedor: '', valor: '' }],
  exames: [{ codigoTUSS: '', descricao: '', tipo: '', qtd: '1' }],
  procedimentos: [{ codigoTUSS: '30719138', descricao: 'Artroplastia total do joelho', qtd: '1' }],
  opme: [{ codigoTUSS: '93000007', descricao: 'Prótese total joelho, não cimentada', fabricante: '', qtd: '1', valorUnit: '' }],
  modalidadeHomeCare: 'AD2',
  periodoSolicitado: '',
  cuidadosNecessarios: '',
}

// ── Field helpers ─────────────────────────────────────────────────────
function FieldLabel({ children, validated, warning }: { children: React.ReactNode; validated?: boolean; warning?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated && <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} />}
      {warning && <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} />}
    </Box>
  )
}

const inputSx = (validated?: boolean, warning?: boolean) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: validated ? '#f0fdf4' : warning ? '#fffbeb' : '#fff',
    '& fieldset': {
      borderColor: validated ? '#16a34a' : warning ? '#f59e0b' : undefined,
    },
  },
})

// ── TISS Document Preview ─────────────────────────────────────────────
const ts = { fontSize: 9, fontFamily: '"Space Grotesk", sans-serif' } as const
const tsBold = { ...ts, fontWeight: 700 } as const
const tsLabel = { ...ts, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: 0.3, fontWeight: 600 }
const tsValue = { ...ts, color: '#111827', fontWeight: 500 }
const tsHighlight = { ...tsValue, backgroundColor: '#fef9c3' }

function TissCell({ label, value, highlight, span }: { label: string; value: string; highlight?: boolean; span?: boolean }) {
  return (
    <Box sx={{
      border: '1px solid #d1d5db',
      borderRadius: 0,
      px: 1,
      py: 0.5,
      gridColumn: span ? '1 / -1' : undefined,
      minHeight: 34,
    }}>
      <Typography sx={tsLabel}>{label}</Typography>
      <Typography sx={highlight ? tsHighlight : tsValue}>{value}</Typography>
    </Box>
  )
}

function TissDocPreview({ zoom, rotation }: { zoom: number; rotation: number }) {
  return (
    <Box sx={{
      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
      transformOrigin: 'top center',
      transition: 'transform 200ms ease',
      width: '100%',
      maxWidth: 620,
      backgroundColor: '#fff',
      border: '1px solid #d1d5db',
      fontFamily: '"Space Grotesk", sans-serif',
      mx: 'auto',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}>
      {/* Header faixa */}
      <Box sx={{ backgroundColor: '#902B29', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ ...tsBold, fontSize: 10, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Guia de Solicitação / Autorização de Procedimentos — TISS 3.06
        </Typography>
        <Box sx={{ backgroundColor: '#fef9c3', px: 1, py: 0.25, borderRadius: 0.5 }}>
          <Typography sx={{ ...tsBold, fontSize: 9, color: '#b45309' }}>ATIVO</Typography>
        </Box>
      </Box>

      {/* Linha 1: identificação da guia */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr 1fr', borderBottom: '1px solid #d1d5db' }}>
        <TissCell label="Nº Guia / Senha" value="38697095" />
        <TissCell label="Dt. Emissão" value="24/03/2026" />
        <TissCell label="Auditoria / Operadora" value="LMGRIGOLETTO" highlight />
        <TissCell label="Emitida Por" value="LMGRIGOLETTO" highlight />
      </Box>

      {/* Linha 2: beneficiário */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography sx={{ ...tsBold, fontSize: 9, color: '#902B29', textTransform: 'uppercase', letterSpacing: 0.5 }}>Beneficiário</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', borderBottom: '1px solid #e5e7eb' }}>
          <TissCell label="Nome Completo" value="ANA CLARA BRUDER DA SILVA" highlight />
          <TissCell label="Nº Carteirinha" value="294999110 / 471" highlight />
          <TissCell label="Data de Nascimento" value="08/06/1980" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr' }}>
          <TissCell label="Unidade" value="AMBULATORIAL" />
          <TissCell label="Plano / Operadora" value="SAÚDE PLENA 1 — AMHC/OP (PB) — 471" highlight />
          <TissCell label="Val. Carteirinha" value="31/12/2026" />
        </Box>
      </Box>

      {/* Linha 3: prestador + médico */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography sx={{ ...tsBold, fontSize: 9, color: '#902B29', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prestador / Médico Solicitante</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid #e5e7eb' }}>
          <TissCell label="Hospital / Prestador" value="CIN — CENTRO INTEGRADO DE NEURODESENVO..." highlight />
          <TissCell label="CNES" value="2749109" />
          <TissCell label="Contato" value="(44) 00076-7731" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
          <TissCell label="Médico Assistente" value="NEANDER CUELLAR OLIVEIRA" highlight />
          <TissCell label="CRM" value="CRM/PR 19485" highlight />
          <TissCell label="Autorização de Origem" value="—" />
        </Box>
      </Box>

      {/* Linha 4: dados clínicos */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography sx={{ ...tsBold, fontSize: 9, color: '#902B29', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dados Clínicos</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', borderBottom: '1px solid #e5e7eb' }}>
          <TissCell label="Procedimento Solicitado" value="PSICOLOGIA" highlight />
          <TissCell label="Caráter Atendimento" value="ELETIVA" />
          <TissCell label="Dt. Solicitação" value="08/05/2026" />
          <TissCell label="Regime" value="AMBULATORIAL" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ border: '1px solid #d1d5db', px: 1, py: 0.5, gridColumn: '1 / -1' }}>
            <Typography sx={tsLabel}>CID Principal</Typography>
            <Typography sx={{ ...tsValue, backgroundColor: '#fef9c3' }}>F84.0 — Autismo infantil</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <TissCell label="Tipo/Subtipo" value="E3 - OUTRAS TERAPIAS" />
          <TissCell label="Nº Sessões" value="—" />
          <TissCell label="Dt. Atendimento" value="24/03/2026" />
          <TissCell label="Cidade" value="MARINGÁ" />
        </Box>
      </Box>

      {/* Linha 5: recebimento + status */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr' }}>
        <TissCell label="Dt. Recebimento" value="24/03/2026 10:42:31" />
        <TissCell label="Médico Resp. pela Guia" value="LMGRIGOLETTO" />
        <Box sx={{ border: '1px solid #d1d5db', px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={tsLabel}>Status Geral da Guia</Typography>
          <Box sx={{ backgroundColor: '#fef9c3', border: '1px solid #fde047', px: 0.75, py: 0.25, borderRadius: 0.5, ml: 0.5 }}>
            <Typography sx={{ ...tsBold, fontSize: 9, color: '#b45309' }}>PROCEDIMENTO NÃO REALIZADO</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Step custom icon ──────────────────────────────────────────────────
function StepIcon({ active, completed, index }: { active: boolean; completed: boolean; index: number }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed ? '#16a34a' : active ? '#902B29' : '#e5e7eb',
        color: completed || active ? '#fff' : '#6b7280',
        fontSize: 12,
        fontWeight: 700,
        transition: 'all 200ms ease',
        flexShrink: 0,
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
    </Box>
  )
}

// ── Main inner component ──────────────────────────────────────────────
function NovaSolicitacaoInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduloParam = (searchParams.get('modulo') || '') as ModuloType | ''

  const [currentStep, setCurrentStep] = useState(0)
  const [uploadState, setUploadState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    tipoSolicitacao: moduloParam || '',
  })

  const activeModulo = form.tipoSolicitacao

  const steps = [
    { label: 'Upload' },
    { label: 'Dados do Beneficiário' },
    { label: 'Dados Clínicos' },
    { label: getStep3Label(activeModulo) },
    { label: 'Revisão' },
  ]

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const setSelect = (field: keyof FormData) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
      router.back()
    }
  }

  const handleUpload = () => {
    setUploadState('loading')
    setTimeout(() => {
      setUploadState('done')
      setTimeout(() => setCurrentStep(1), 400)
    }, 2000)
  }

  const handleNext = () => {
    if (currentStep === 1 && !form.tipoSolicitacao) {
      alert('Por favor, selecione o tipo de solicitação antes de continuar.')
      return
    }
    if (currentStep < 4) setCurrentStep((s) => s + 1)
    else {
      alert('Solicitação enviada com sucesso!')
      router.back()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
    else if (currentStep === 1) setCurrentStep(0)
  }

  // ── Step 0: Upload ─────────────────────────────────────────────────
  const renderStep0 = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3, px: 4 }}>
      <Box sx={{ textAlign: 'center', maxWidth: 520 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
          Nova Solicitação de Autorização
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Envie o pedido médico para que a IA preencha automaticamente os dados, ou preencha manualmente.
        </Typography>
      </Box>

      {/* Drop zone */}
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload() }}
        onClick={() => uploadState === 'idle' && handleUpload()}
        sx={{
          width: '100%',
          maxWidth: 480,
          border: `2px dashed ${dragOver ? '#902B29' : 'rgba(0,0,0,0.2)'}`,
          borderRadius: 3,
          backgroundColor: dragOver ? 'rgba(144,43,41,0.04)' : uploadState === 'loading' ? 'rgba(37,99,235,0.03)' : '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 5,
          px: 3,
          cursor: uploadState === 'idle' ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          '&:hover': uploadState === 'idle' ? { borderColor: '#902B29', backgroundColor: 'rgba(144,43,41,0.03)' } : {},
        }}
      >
        {uploadState === 'idle' && (
          <>
            <UploadFileIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.25)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5 }}>
                Arraste o pedido médico aqui
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou clique para selecionar o arquivo
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              PDF, JPG, PNG — até 10MB
            </Typography>
          </>
        )}
        {uploadState === 'loading' && (
          <>
            <Box sx={{ fontSize: 36 }}>🔍</Box>
            <Typography variant="body1" fontWeight={700} sx={{ color: '#2563eb' }}>
              Lendo documento com IA...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Extraindo dados automaticamente
            </Typography>
          </>
        )}
        {uploadState === 'done' && (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: '#16a34a' }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: '#16a34a' }}>
              Documento processado!
            </Typography>
          </>
        )}
      </Box>

      <Button
        variant="text"
        size="small"
        endIcon={<ChevronRightIcon />}
        onClick={() => { setForm({ ...initialForm, tipoSolicitacao: '' }); setCurrentStep(1) }}
        sx={{ color: 'text.secondary', fontSize: 13 }}
      >
        Preencher manualmente sem upload
      </Button>
    </Box>
  )

  // ── Step 1: Dados do Beneficiário ──────────────────────────────────
  const renderStep1 = () => (
    <Box>
      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
        Preenchido por IA — Revise os dados abaixo
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Dados do Beneficiário</Typography>
      <Grid container spacing={2}>
        {/* Tipo de Solicitação — always shown */}
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Tipo de Solicitação <span style={{ color: '#C62828' }}>*</span></FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.tipoSolicitacao}
              displayEmpty
              onChange={(e) => setSelect('tipoSolicitacao')(e.target.value)}
              sx={{ backgroundColor: form.tipoSolicitacao ? '#f0fdf4' : '#fff' }}
            >
              <MenuItem value="" disabled><em>Selecione o tipo de solicitação...</em></MenuItem>
              {(Object.entries(moduloLabels) as [ModuloType, string][]).map(([k, v]) => (
                <MenuItem key={k} value={k}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Nome Completo</FieldLabel>
          <TextField fullWidth size="small" value={form.nomeBeneficiario} onChange={set('nomeBeneficiario')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Carteirinha</FieldLabel>
          <TextField fullWidth size="small" value={form.carteirinha} onChange={set('carteirinha')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel warning>Data de Nascimento</FieldLabel>
          <TextField fullWidth size="small" type="date" value={form.dataNascimento} onChange={set('dataNascimento')} InputLabelProps={{ shrink: true }} sx={inputSx(false, true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>CPF</FieldLabel>
          <TextField fullWidth size="small" placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Operadora / Plano</FieldLabel>
          <TextField fullWidth size="small" value={form.operadora} onChange={set('operadora')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Validade da Carteirinha</FieldLabel>
          <TextField fullWidth size="small" type="date" value={form.validadeCarteirinha} onChange={set('validadeCarteirinha')} InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>
    </Box>
  )

  // ── Step 2: Dados Clínicos ─────────────────────────────────────────
  const renderStep2 = () => (
    <Box>
      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
        Preenchido por IA — Revise os dados abaixo
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Dados Clínicos</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>CID Principal</FieldLabel>
          <TextField fullWidth size="small" value={form.cidPrincipal} onChange={set('cidPrincipal')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel warning>Caráter do Atendimento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.caraterAtendimento} onChange={(e) => setSelect('caraterAtendimento')(e.target.value)} sx={{ backgroundColor: '#fffbeb', '& fieldset': { borderColor: '#f59e0b' } }}>
              <MenuItem value="Eletivo">Eletivo</MenuItem>
              <MenuItem value="Urgência">Urgência</MenuItem>
              <MenuItem value="Emergência">Emergência</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Médico Solicitante</FieldLabel>
          <TextField fullWidth size="small" value={form.medicoSolicitante} onChange={set('medicoSolicitante')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>CRM</FieldLabel>
          <TextField fullWidth size="small" value={form.crm} onChange={set('crm')} sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel validated>Indicação Clínica</FieldLabel>
          <TextField
            fullWidth multiline rows={4} size="small"
            value={form.indicacaoClinica} onChange={set('indicacaoClinica')}
            sx={inputSx(true)}
          />
        </Grid>
      </Grid>
    </Box>
  )

  // ── Step 3: Category-specific ─────────────────────────────────────
  const renderStep3 = () => {
    switch (form.tipoSolicitacao) {
      case 'cirurgias': return renderCirurgiasStep3()
      case 'internacao': return renderInternacaoStep3()
      case 'urgencia': return renderUrgenciaStep3()
      case 'oncologia': return renderOncologiaStep3()
      case 'terapias': return renderTerapiasStep3()
      case 'opme': return renderOpmeStep3()
      case 'exames': return renderExamesStep3()
      case 'homecare': return renderHomeCareStep3()
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography>Selecione um tipo de solicitação na Etapa 1 para continuar.</Typography>
          </Box>
        )
    }
  }

  // Cirurgias
  const renderCirurgiasStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Procedimentos Cirúrgicos</Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 80 }}>Qtd</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.procedimentos.map((p, i) => (
              <TableRow key={i}>
                <TableCell><TextField size="small" value={p.codigoTUSS} onChange={(e) => setForm(f => { const a = [...f.procedimentos]; a[i] = { ...a[i], codigoTUSS: e.target.value }; return { ...f, procedimentos: a } })} sx={{ width: 110 }} /></TableCell>
                <TableCell><TextField size="small" value={p.descricao} onChange={(e) => setForm(f => { const a = [...f.procedimentos]; a[i] = { ...a[i], descricao: e.target.value }; return { ...f, procedimentos: a } })} fullWidth /></TableCell>
                <TableCell><TextField size="small" type="number" value={p.qtd} onChange={(e) => setForm(f => { const a = [...f.procedimentos]; a[i] = { ...a[i], qtd: e.target.value }; return { ...f, procedimentos: a } })} /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => setForm(f => ({ ...f, procedimentos: f.procedimentos.filter((_, j) => j !== i) }))}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button size="small" startIcon={<AddIcon />} onClick={() => setForm(f => ({ ...f, procedimentos: [...f.procedimentos, { codigoTUSS: '', descricao: '', qtd: '1' }] }))}>
        Adicionar Procedimento
      </Button>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Materiais e OPME</Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Fabricante</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 70 }}>Qtd</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 100 }}>Valor Unit.</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.opme.map((o, i) => (
              <TableRow key={i}>
                <TableCell><TextField size="small" value={o.codigoTUSS} onChange={(e) => setForm(f => { const a = [...f.opme]; a[i] = { ...a[i], codigoTUSS: e.target.value }; return { ...f, opme: a } })} sx={{ width: 100 }} /></TableCell>
                <TableCell><TextField size="small" value={o.descricao} onChange={(e) => setForm(f => { const a = [...f.opme]; a[i] = { ...a[i], descricao: e.target.value }; return { ...f, opme: a } })} fullWidth /></TableCell>
                <TableCell><TextField size="small" value={o.fabricante} onChange={(e) => setForm(f => { const a = [...f.opme]; a[i] = { ...a[i], fabricante: e.target.value }; return { ...f, opme: a } })} /></TableCell>
                <TableCell><TextField size="small" type="number" value={o.qtd} onChange={(e) => setForm(f => { const a = [...f.opme]; a[i] = { ...a[i], qtd: e.target.value }; return { ...f, opme: a } })} /></TableCell>
                <TableCell><TextField size="small" value={o.valorUnit} onChange={(e) => setForm(f => { const a = [...f.opme]; a[i] = { ...a[i], valorUnit: e.target.value }; return { ...f, opme: a } })} placeholder="R$ 0,00" /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => setForm(f => ({ ...f, opme: f.opme.filter((_, j) => j !== i) }))}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button size="small" startIcon={<AddIcon />} onClick={() => setForm(f => ({ ...f, opme: [...f.opme, { codigoTUSS: '', descricao: '', fabricante: '', qtd: '1', valorUnit: '' }] }))}>
        Adicionar Material / OPME
      </Button>
    </Box>
  )

  // Internação
  const renderInternacaoStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Acomodação e Diárias</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Acomodação</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.tipoAcomodacao} onChange={(e) => setSelect('tipoAcomodacao')(e.target.value)}>
              <MenuItem value="Enfermaria">Enfermaria</MenuItem>
              <MenuItem value="Apartamento">Apartamento</MenuItem>
              <MenuItem value="UTI">UTI</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Qtd. de Diárias Solicitadas</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.qtdDiarias} onChange={set('qtdDiarias')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Data Prevista de Internação</FieldLabel>
          <TextField fullWidth size="small" type="date" value={form.dataInternacao} onChange={set('dataInternacao')} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Regime de Internação</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.regimeInternacao} onChange={(e) => setSelect('regimeInternacao')(e.target.value)}>
              <MenuItem value="Hospitalar">Hospitalar</MenuItem>
              <MenuItem value="Hospital Dia">Hospital Dia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )

  // Urgência
  const renderUrgenciaStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Classificação de Risco</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Classificação de Risco (Manchester)</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.classificacaoRisco} onChange={(e) => setSelect('classificacaoRisco')(e.target.value)}>
              <MenuItem value="vermelho">Vermelho — Emergência</MenuItem>
              <MenuItem value="laranja">Laranja — Muito Urgente</MenuItem>
              <MenuItem value="amarelo">Amarelo — Urgente</MenuItem>
              <MenuItem value="verde">Verde — Pouco Urgente</MenuItem>
              <MenuItem value="azul">Azul — Não Urgente</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Atendimento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.tipoAtendimento} onChange={(e) => setSelect('tipoAtendimento')(e.target.value)}>
              <MenuItem value="Emergência">Emergência</MenuItem>
              <MenuItem value="Urgência">Urgência</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Queixa Principal</FieldLabel>
          <TextField fullWidth multiline rows={3} size="small" placeholder="Descreva a queixa principal do paciente..." value={form.queixaPrincipal} onChange={set('queixaPrincipal')} />
        </Grid>
      </Grid>
    </Box>
  )

  // Oncologia
  const renderOncologiaStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Dados Oncológicos</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Estadiamento (TNM)</FieldLabel>
          <TextField fullWidth size="small" value={form.estadiamentoTNM} onChange={set('estadiamentoTNM')} placeholder="ex: T2 N0 M0" sx={inputSx(!!form.estadiamentoTNM)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Nº do Ciclo</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.numeroCiclo} onChange={set('numeroCiclo')} sx={inputSx(!!form.numeroCiclo)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Protocolo Quimioterápico</FieldLabel>
          <TextField fullWidth size="small" value={form.protocoloQuimio} onChange={set('protocoloQuimio')} placeholder="ex: FOLFOX, CHOP..." sx={inputSx(!!form.protocoloQuimio)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Tratamento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.tipoTratamento} onChange={(e) => setSelect('tipoTratamento')(e.target.value)}>
              <MenuItem value="Quimioterapia">Quimioterapia</MenuItem>
              <MenuItem value="Radioterapia">Radioterapia</MenuItem>
              <MenuItem value="Hormonioterapia">Hormonioterapia</MenuItem>
              <MenuItem value="Imunoterapia">Imunoterapia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Número de Ciclos Totais</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.totalCiclos} onChange={set('totalCiclos')} />
        </Grid>
      </Grid>
    </Box>
  )

  // Terapias
  const renderTerapiasStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Sessões de Terapia</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Terapia</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.tipoTerapia} onChange={(e) => setSelect('tipoTerapia')(e.target.value)}>
              <MenuItem value="Fisioterapia">Fisioterapia</MenuItem>
              <MenuItem value="Fonoaudiologia">Fonoaudiologia</MenuItem>
              <MenuItem value="Psicologia">Psicologia</MenuItem>
              <MenuItem value="Terapia Ocupacional">Terapia Ocupacional</MenuItem>
              <MenuItem value="Nutrição">Nutrição</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Número de Sessões Solicitadas</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.numSessoes} onChange={set('numSessoes')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Frequência Semanal</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.frequenciaSemanal} onChange={(e) => setSelect('frequenciaSemanal')(e.target.value)}>
              <MenuItem value="1x por semana">1x por semana</MenuItem>
              <MenuItem value="2x por semana">2x por semana</MenuItem>
              <MenuItem value="3x por semana">3x por semana</MenuItem>
              <MenuItem value="5x por semana">5x por semana</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Duração da Sessão (min)</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.duracaoSessao} onChange={set('duracaoSessao')} />
        </Grid>
      </Grid>
    </Box>
  )

  // OPME
  const renderOpmeStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Materiais e OPME</Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Fabricante</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 70 }}>Qtd</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 100 }}>Valor</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.materiais.map((m, i) => (
              <TableRow key={i}>
                <TableCell><TextField size="small" value={m.codigo} onChange={(e) => setForm(f => { const a = [...f.materiais]; a[i] = { ...a[i], codigo: e.target.value }; return { ...f, materiais: a } })} sx={{ width: 100 }} /></TableCell>
                <TableCell><TextField size="small" value={m.descricao} onChange={(e) => setForm(f => { const a = [...f.materiais]; a[i] = { ...a[i], descricao: e.target.value }; return { ...f, materiais: a } })} fullWidth /></TableCell>
                <TableCell><TextField size="small" value={m.fabricante} onChange={(e) => setForm(f => { const a = [...f.materiais]; a[i] = { ...a[i], fabricante: e.target.value }; return { ...f, materiais: a } })} /></TableCell>
                <TableCell><TextField size="small" type="number" value={m.qtd} onChange={(e) => setForm(f => { const a = [...f.materiais]; a[i] = { ...a[i], qtd: e.target.value }; return { ...f, materiais: a } })} /></TableCell>
                <TableCell><TextField size="small" value={m.valor} onChange={(e) => setForm(f => { const a = [...f.materiais]; a[i] = { ...a[i], valor: e.target.value }; return { ...f, materiais: a } })} placeholder="R$ 0,00" /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => setForm(f => ({ ...f, materiais: f.materiais.filter((_, j) => j !== i) }))}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button size="small" startIcon={<AddIcon />} onClick={() => setForm(f => ({ ...f, materiais: [...f.materiais, { codigo: '', descricao: '', fabricante: '', qtd: '1', valor: '' }] }))} sx={{ mb: 3 }}>
        Adicionar Material
      </Button>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Registro ANVISA</FieldLabel>
          <TextField fullWidth size="small" value={form.registroAnvisa} onChange={set('registroAnvisa')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Fabricante do Material</FieldLabel>
          <TextField fullWidth size="small" value={form.fabricanteMaterial} onChange={set('fabricanteMaterial')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Justificativa Técnica para Marca</FieldLabel>
          <TextField fullWidth multiline rows={3} size="small" value={form.justificativaTecnica} onChange={set('justificativaTecnica')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5, fontSize: 13 }}>3 Cotações de Preço</Typography>
          {form.cotacoes.map((c, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
              <TextField size="small" label={`Fornecedor ${i + 1}`} value={c.fornecedor} onChange={(e) => setForm(f => { const a = [...f.cotacoes]; a[i] = { ...a[i], fornecedor: e.target.value }; return { ...f, cotacoes: a } })} sx={{ flex: 1 }} />
              <TextField size="small" label="Valor (R$)" value={c.valor} onChange={(e) => setForm(f => { const a = [...f.cotacoes]; a[i] = { ...a[i], valor: e.target.value }; return { ...f, cotacoes: a } })} sx={{ width: 140 }} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  )

  // Exames
  const renderExamesStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Exames Solicitados</Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 80 }}>Qtd</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.exames.map((ex, i) => (
              <TableRow key={i}>
                <TableCell><TextField size="small" value={ex.codigoTUSS} onChange={(e) => setForm(f => { const a = [...f.exames]; a[i] = { ...a[i], codigoTUSS: e.target.value }; return { ...f, exames: a } })} sx={{ width: 110 }} /></TableCell>
                <TableCell><TextField size="small" value={ex.descricao} onChange={(e) => setForm(f => { const a = [...f.exames]; a[i] = { ...a[i], descricao: e.target.value }; return { ...f, exames: a } })} fullWidth /></TableCell>
                <TableCell><TextField size="small" value={ex.tipo} onChange={(e) => setForm(f => { const a = [...f.exames]; a[i] = { ...a[i], tipo: e.target.value }; return { ...f, exames: a } })} placeholder="Lab, Imagem..." /></TableCell>
                <TableCell><TextField size="small" type="number" value={ex.qtd} onChange={(e) => setForm(f => { const a = [...f.exames]; a[i] = { ...a[i], qtd: e.target.value }; return { ...f, exames: a } })} /></TableCell>
                <TableCell><IconButton size="small" color="error" onClick={() => setForm(f => ({ ...f, exames: f.exames.filter((_, j) => j !== i) }))}><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button size="small" startIcon={<AddIcon />} onClick={() => setForm(f => ({ ...f, exames: [...f.exames, { codigoTUSS: '', descricao: '', tipo: '', qtd: '1' }] }))}>
        Adicionar Exame
      </Button>
    </Box>
  )

  // Home Care
  const renderHomeCareStep3 = () => (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Cuidados Domiciliares</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Modalidade Home Care</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.modalidadeHomeCare} onChange={(e) => setSelect('modalidadeHomeCare')(e.target.value)}>
              <MenuItem value="AD1">AD1 — Tipo 1 (menor complexidade)</MenuItem>
              <MenuItem value="AD2">AD2 — Tipo 2</MenuItem>
              <MenuItem value="AD3">AD3 — Tipo 3 (maior complexidade)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Período Solicitado (dias)</FieldLabel>
          <TextField fullWidth size="small" type="number" value={form.periodoSolicitado} onChange={set('periodoSolicitado')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Cuidados Necessários</FieldLabel>
          <TextField fullWidth multiline rows={4} size="small" placeholder="Descreva os cuidados e procedimentos necessários no domicílio..." value={form.cuidadosNecessarios} onChange={set('cuidadosNecessarios')} />
        </Grid>
      </Grid>
    </Box>
  )

  // ── Step 4: Revisão ────────────────────────────────────────────────
  const renderStep4 = () => {
    const rows = (label: string, value: string) => (
      <Box key={label} sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="caption" sx={{ width: 180, flexShrink: 0, fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{label}</Typography>
        <Typography variant="caption" sx={{ fontSize: 12 }}>{value || '—'}</Typography>
      </Box>
    )
    return (
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Revisão da Solicitação</Typography>
        <Box sx={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
            Revise as informações antes de enviar. Após o envio a solicitação entrará na fila de análise.
          </Typography>
        </Box>
        {/* Beneficiário */}
        <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>Dados do Beneficiário</Typography>
        <Box sx={{ mb: 3 }}>
          {rows('Tipo de Solicitação', form.tipoSolicitacao ? moduloLabels[form.tipoSolicitacao] : '')}
          {rows('Nome', form.nomeBeneficiario)}
          {rows('Carteirinha', form.carteirinha)}
          {rows('Data de Nascimento', form.dataNascimento)}
          {rows('CPF', form.cpf)}
          {rows('Operadora / Plano', form.operadora)}
          {rows('Validade da Carteirinha', form.validadeCarteirinha)}
        </Box>
        {/* Dados Clínicos */}
        <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>Dados Clínicos</Typography>
        <Box sx={{ mb: 3 }}>
          {rows('CID Principal', form.cidPrincipal)}
          {rows('Caráter do Atendimento', form.caraterAtendimento)}
          {rows('Médico Solicitante', form.medicoSolicitante)}
          {rows('CRM', form.crm)}
          {rows('Indicação Clínica', form.indicacaoClinica)}
        </Box>
        {/* Step 3 summary */}
        {form.tipoSolicitacao && (
          <>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
              {getStep3Label(form.tipoSolicitacao)}
            </Typography>
            <Box sx={{ mb: 3 }}>
              {form.tipoSolicitacao === 'internacao' && <>
                {rows('Tipo de Acomodação', form.tipoAcomodacao)}
                {rows('Qtd. de Diárias', form.qtdDiarias)}
                {rows('Data Prevista', form.dataInternacao)}
                {rows('Regime', form.regimeInternacao)}
              </>}
              {form.tipoSolicitacao === 'urgencia' && <>
                {rows('Classificação de Risco', form.classificacaoRisco)}
                {rows('Tipo de Atendimento', form.tipoAtendimento)}
                {rows('Queixa Principal', form.queixaPrincipal)}
              </>}
              {form.tipoSolicitacao === 'oncologia' && <>
                {rows('Estadiamento TNM', form.estadiamentoTNM)}
                {rows('Nº do Ciclo', form.numeroCiclo)}
                {rows('Protocolo', form.protocoloQuimio)}
                {rows('Tipo de Tratamento', form.tipoTratamento)}
                {rows('Total de Ciclos', form.totalCiclos)}
              </>}
              {form.tipoSolicitacao === 'terapias' && <>
                {rows('Tipo de Terapia', form.tipoTerapia)}
                {rows('Nº de Sessões', form.numSessoes)}
                {rows('Frequência Semanal', form.frequenciaSemanal)}
                {rows('Duração da Sessão', `${form.duracaoSessao} min`)}
              </>}
              {form.tipoSolicitacao === 'homecare' && <>
                {rows('Modalidade', form.modalidadeHomeCare)}
                {rows('Período (dias)', form.periodoSolicitado)}
                {rows('Cuidados Necessários', form.cuidadosNecessarios)}
              </>}
              {(form.tipoSolicitacao === 'cirurgias' || form.tipoSolicitacao === 'exames' || form.tipoSolicitacao === 'opme') && (
                <Box sx={{ py: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {form.tipoSolicitacao === 'cirurgias' && `${form.procedimentos.length} procedimento(s) e ${form.opme.length} material(is) OPME cadastrado(s).`}
                    {form.tipoSolicitacao === 'exames' && `${form.exames.length} exame(s) solicitado(s).`}
                    {form.tipoSolicitacao === 'opme' && `${form.materiais.length} material(is) cadastrado(s).`}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    )
  }

  // ── Layout ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#faf6f2', fontFamily: '"Space Grotesk", sans-serif' }}>

      {/* ── Top bar ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 1.5,
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        flexShrink: 0,
        minHeight: 60,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/logo-arvo.svg" alt="Arvo" style={{ height: 26 }} />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>
            Nova Solicitação: Pré-Autorização
          </Typography>
          {form.tipoSolicitacao && (
            <Chip
              label={moduloLabels[form.tipoSolicitacao]}
              size="small"
              sx={{ fontWeight: 600, fontSize: 11, backgroundColor: 'rgba(144,43,41,0.08)', color: '#902B29' }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SaveOutlinedIcon />}
            sx={{ minHeight: 36 }}
            onClick={() => alert('Rascunho salvo!')}
          >
            Salvar Rascunho
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            sx={{ minHeight: 36 }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Box>
      </Box>

      {/* ── Stepper ── */}
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', px: 4, py: 1.5, flexShrink: 0 }}>
        <Stepper activeStep={currentStep} alternativeLabel connector={null}
          sx={{
            maxWidth: 700, mx: 'auto',
            '& .MuiStepLabel-label': { fontSize: 11, mt: 0.5, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500 },
            '& .MuiStepLabel-label.Mui-active': { fontWeight: 700, color: '#902B29' },
            '& .MuiStepLabel-label.Mui-completed': { color: '#16a34a' },
          }}
        >
          {steps.map((step, i) => (
            <Step key={step.label} completed={i < currentStep}>
              <StepLabel
                StepIconComponent={() => <StepIcon active={i === currentStep} completed={i < currentStep} index={i} />}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: document viewer — hidden on step 0 */}
        {currentStep > 0 && (
          <Box sx={{
            width: '45%',
            flexShrink: 0,
            backgroundColor: '#f3f4f6',
            borderRight: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Viewer toolbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff', flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => setZoom(z => Math.max(50, z - 10))} disabled={zoom <= 50}><ZoomOutIcon fontSize="small" /></IconButton>
                <Typography variant="caption" sx={{ fontSize: 11, minWidth: 36, textAlign: 'center' }}>{zoom}%</Typography>
                <IconButton size="small" onClick={() => setZoom(z => Math.min(200, z + 10))} disabled={zoom >= 200}><ZoomInIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => setRotation(r => (r + 90) % 360)}><RotateRightIcon fontSize="small" /></IconButton>
              </Box>
              <Button size="small" startIcon={<UploadFileIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11 }}>
                Novo Arquivo
              </Button>
            </Box>

            {/* Document */}
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <TissDocPreview zoom={zoom} rotation={rotation} />
            </Box>
          </Box>
        )}

        {/* Right: form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Form content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: currentStep === 0 ? 0 : 4 }}>
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </Box>

          {/* Navigation footer */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 4, py: 2,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
              {currentStep === 0 ? 'Etapa inicial' : `Etapa ${currentStep} de ${steps.length - 1}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<ChevronLeftIcon />}
                onClick={handleBack}
                disabled={currentStep === 0}
                sx={{ minHeight: 44 }}
              >
                Voltar
              </Button>
              {currentStep > 0 && (
                <Button
                  variant="contained"
                  endIcon={currentStep < 4 ? <ChevronRightIcon /> : undefined}
                  onClick={handleNext}
                  sx={{ minHeight: 44, px: 3 }}
                >
                  {currentStep < 4 ? 'Próxima Etapa' : 'Enviar Solicitação'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Page export (Suspense boundary for useSearchParams) ───────────────
export default function NovaSolicitacaoPage() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <NovaSolicitacaoInner />
      </Suspense>
    </ThemeProvider>
  )
}
