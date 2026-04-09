'use client'

import React from 'react'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GavelIcon from '@mui/icons-material/Gavel'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { type Request, type BudgetExtractedData } from '@/data/pedidos'

import { DOCUMENT_TYPES, DOCUMENT_REQUEST_TYPES } from '../constants/document-types'
import { useDocumentViewer } from '../hooks/useDocumentViewer'

// ---- docIcon helper ----
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

// ---- IA extraction mock data ----
type IACampoStatus = 'ok' | 'warning' | 'error'
interface IAExtractionField { label: string; valor: string; status: IACampoStatus }

function getIAExtractionFields(docNome: string, docTipo: string, dadosExtraidos?: BudgetExtractedData): IAExtractionField[] {
  const tipo = (docNome + docTipo).toLowerCase()
  if ((tipo.includes('orçamento') || tipo.includes('cotação')) && dadosExtraidos) {
    return [
      { label: 'Fabricante', valor: dadosExtraidos.fabricante, status: 'ok' },
      { label: 'Modelo do implante', valor: dadosExtraidos.modelo, status: 'ok' },
      { label: 'Valor unitário', valor: `R$ ${dadosExtraidos.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, status: 'ok' },
      { label: 'Registro ANVISA', valor: dadosExtraidos.registroANVISA, status: 'ok' },
      { label: 'Cotações apresentadas', valor: `${String(dadosExtraidos.numeroCotacoes)} de 3 exigidas`, status: dadosExtraidos.numeroCotacoes < 3 ? 'error' : 'ok' },
      { label: 'Observação', valor: dadosExtraidos.observacao, status: 'warning' },
    ]
  }
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

// ---- Component ----
interface DocumentsSectionProps {
  request: Request
}

export default function DocumentsSection({ request }: DocumentsSectionProps) {
  const doc = useDocumentViewer(request)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
            Documentos ({doc.allDocs.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
              onClick={() => { doc.setShowAddModal(true); }}
              sx={{ fontSize: 12, py: 0.4 }}
            >
              Adicionar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
              onClick={() => { doc.setShowSolicitarModal(true); }}
              sx={{ fontSize: 12, py: 0.4 }}
            >
              Solicitar complementar
            </Button>
          </Box>
        </Box>

        {/* Terapias Especiais -- missing mandatory doc warning */}
        {request.category === 'Terapias Especiais' && (() => {
          const isContinuidade = request.authorizationStage === 'continuidade'
          const mandatoryDocName = isContinuidade ? 'Relatório de Evolução Terapêutica' : 'Plano Terapêutico'
          const mandatoryDocKeywords = isContinuidade
            ? ['evolucao', 'evolução', 'relatório de evolução', 'relatorio de evolucao']
            : ['plano terapêutico', 'plano terapeutico', 'plano_terapeutico']
          const hasDoc = doc.allDocs.some(d =>
            mandatoryDocKeywords.some(kw => d.nome.toLowerCase().includes(kw) || d.tipo.toLowerCase().includes(kw))
          )
          if (hasDoc) return null
          return (
            <Box
              sx={{ border: '1px solid rgba(245,158,11,0.4)', borderRadius: 2, backgroundColor: 'rgba(255,251,235,0.7)', p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}
            >
              <WarningAmberIcon sx={{ fontSize: 20, color: '#f59e0b', flexShrink: 0, mt: 0.1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#b45309' }}>
                  Documento obrigatório ausente: {mandatoryDocName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mt: 0.25 }}>
                  {isContinuidade
                    ? 'Solicitações de continuidade exigem relatório de evolução terapêutica emitido pelo profissional executante.'
                    : 'Primeiras solicitações de terapia exigem plano terapêutico detalhado emitido pelo profissional responsável.'}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                onClick={() => { doc.setShowSolicitarModal(true); }}
                sx={{ fontSize: 12, py: 0.4, flexShrink: 0 }}
              >
                Solicitar complementar
              </Button>
            </Box>
          )
        })()}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {doc.allDocs.map((docItem) => {
            const docKey = docItem.id
            const iaOpen = !!doc.expandedIA[docKey]

            // Documento pendente -- visual diferenciado
            if (docItem.status === 'pendente') {
              return (
                <Box
                  key={docKey}
                  sx={{ border: '1px solid rgba(245,158,11,0.4)', borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,251,235,0.6)' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                    <WarningAmberIcon sx={{ fontSize: 20, color: '#f59e0b', flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>{docItem.nome}</Typography>
                        <Chip label="Documento pendente" size="small" sx={{ fontSize: 11, fontWeight: 700, backgroundColor: 'rgba(245,158,11,0.15)', color: '#b45309', height: 20 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {docItem.obrigatorio ? 'Obrigatório' : 'Opcional'} · Não enviado pelo solicitante
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                      onClick={() => { doc.setShowAddModal(true); }}
                      sx={{ fontSize: 12, borderColor: '#902B29', color: '#902B29', '&:hover': { borderColor: '#6e1f1d', backgroundColor: 'rgba(144,43,41,0.04)' } }}
                    >
                      Adicionar documento
                    </Button>
                  </Box>
                </Box>
              )
            }

            // Documento enviado -- visual padrão
            const iaFields = doc.processingId === docKey
              ? null
              : getIAExtractionFields(docItem.nome, docItem.tipo, docItem.dadosExtraidos)

            return (
              <Box
                key={docKey}
                sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}
              >
                {/* Doc row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  {docIcon(docItem.tipo)}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight={600}>{docItem.nome}</Typography>
                      {(docItem.tipo === 'Laudo Médico' || docItem.nome.toLowerCase().includes('laudo')) && (
                        <Chip
                          icon={<WarningAmberIcon sx={{ fontSize: 11, ml: '4px !important' }} />}
                          label="Validade: 6 meses"
                          size="small"
                          sx={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#b45309', fontWeight: 700, fontSize: 11, height: 20 }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      {docItem.tipo}{docItem.tamanho ? ` · ${String(docItem.tamanho)}` : ''}{docItem.enviadoEm ? ` · Enviado em ${String(docItem.enviadoEm)}` : ''}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon fontSize="small" />}
                    aria-label={`Visualizar ${docItem.nome}`}
                    onClick={() => { doc.setViewDoc(docItem.nome); doc.setZoom(100) }}
                  >
                    Visualizar
                  </Button>
                </Box>

                {/* IA Extraction toggle */}
                <Box
                  onClick={() => { doc.setExpandedIA(prev => ({ ...prev, [docKey]: !prev[docKey] })); }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.75,
                    px: 2, py: 0.75,
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    backgroundColor: iaOpen ? 'rgba(37,99,235,0.03)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(37,99,235,0.05)' },
                    transition: 'background-color 0.12s ease',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 13, color: '#2563eb' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#2563eb', flex: 1 }}>
                    {doc.processingId === docKey ? 'IA processando...' : 'IA extraiu'}
                  </Typography>
                  <Box sx={{ transform: iaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', display: 'flex', color: 'text.secondary' }}>
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>

                <Collapse in={iaOpen}>
                  <Box sx={{ px: 2, pt: 1.5, pb: 2, backgroundColor: 'rgba(37,99,235,0.02)', borderTop: '1px solid rgba(37,99,235,0.08)' }}>
                    {doc.processingId === docKey ? (
                      <Typography sx={{ fontSize: 12, color: '#2563eb', fontStyle: 'italic' }}>
                        Analisando documento... aguarde.
                      </Typography>
                    ) : (
                      <>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.4, mb: 1.25 }}>
                          Leitura do documento pela IA
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          {(iaFields ?? []).map((field) => (
                            <Box key={field.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <IACampoIcon status={field.status} />
                              <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{field.label}:</Box>{' '}
                                {field.valor}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </CardContent>

      {/* Modal Adicionar Documento */}
      <Dialog
        open={doc.showAddModal}
        onClose={doc.handleAddModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachFileIcon sx={{ fontSize: 18, color: '#902B29' }} />
            <Typography fontWeight={700} sx={{ fontSize: 15 }}>Adicionar Documento</Typography>
          </Box>
          <IconButton size="small" onClick={doc.handleAddModalClose}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {doc.addError ? <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>{doc.addError}</Alert> : null}

          {/* Tipo */}
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}>
            Tipo do documento <span style={{ color: '#C62828' }}>*</span>
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <Select value={doc.addTipo} displayEmpty onChange={(e) => { doc.setAddTipo(e.target.value); }}>
              <MenuItem value="" disabled><em>Selecione o tipo...</em></MenuItem>
              {DOCUMENT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Drop zone */}
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}>
            Arquivo <span style={{ color: '#C62828' }}>*</span>
          </Typography>
          <Box
            onDragOver={(e) => { e.preventDefault(); doc.setAddDragOver(true) }}
            onDragLeave={() => { doc.setAddDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault(); doc.setAddDragOver(false)
              const f = e.dataTransfer.files[0]
              if (f) doc.setAddFile(f)
            }}
            onClick={() => doc.fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${doc.addDragOver ? '#902B29' : doc.addFile ? '#16a34a' : 'rgba(0,0,0,0.2)'}`,
              borderRadius: 2,
              backgroundColor: doc.addDragOver ? 'rgba(144,43,41,0.04)' : doc.addFile ? 'rgba(22,163,74,0.04)' : '#fafafa',
              py: 3, px: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              mb: 2.5,
              '&:hover': { borderColor: '#902B29', backgroundColor: 'rgba(144,43,41,0.03)' },
            }}
          >
            <input ref={doc.fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) doc.setAddFile(f) }} />
            {doc.addFile ? (
              <>
                <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: '#15803d' }}>{doc.addFile.name}</Typography>
                <Typography variant="caption" color="text.secondary">Clique para trocar</Typography>
              </>
            ) : (
              <>
                <UploadFileIcon sx={{ fontSize: 32, color: 'rgba(0,0,0,0.3)' }} />
                <Typography variant="body2" fontWeight={600}>Arraste o arquivo aqui</Typography>
                <Typography variant="caption" color="text.secondary">ou clique para selecionar · PDF, JPG, PNG — até 10MB</Typography>
              </>
            )}
          </Box>

          {/* Descrição */}
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}>
            Descrição (opcional)
          </Typography>
          <TextField
            fullWidth size="small" multiline rows={2}
            placeholder="Descreva o conteúdo do documento..."
            value={doc.addDescricao}
            onChange={(e) => { doc.setAddDescricao(e.target.value); }}
            sx={{ mb: 2 }}
          />

          <Alert severity="info" icon={false} sx={{ fontSize: 12, py: 0.75 }}>
            O documento será vinculado a esta guia e ficará disponível para o analista responsável.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={doc.handleAddModalClose}>Cancelar</Button>
          <Button variant="contained" startIcon={<AttachFileIcon />} onClick={doc.handleAddConfirm}>
            Adicionar Documento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Solicitar Documentação Complementar Modal */}
      <Dialog open={doc.showSolicitarModal} onClose={() => { doc.setShowSolicitarModal(false); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography fontWeight={700} sx={{ fontSize: 15 }}>Solicitar Documentação Complementar</Typography>
          <IconButton size="small" onClick={() => { doc.setShowSolicitarModal(false); }}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontSize: 12 }}>
            Selecione os documentos necessários. O beneficiário será notificado e o pedido ficará em pendência até o envio.
          </Typography>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, display: 'block', mb: 1 }}>
            Documentos necessários *
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2.5 }}>
            {DOCUMENT_REQUEST_TYPES.map(tipo => (
              <FormControlLabel
                key={tipo}
                control={
                  <Checkbox
                    size="small"
                    checked={doc.solicitarDocs.includes(tipo)}
                    onChange={(e) => { doc.setSolicitarDocs(prev =>
                      e.target.checked ? [...prev, tipo] : prev.filter(d => d !== tipo)
                    ); }}
                    sx={{ py: 0.4, '&.Mui-checked': { color: 'primary.main' } }}
                  />
                }
                label={<Typography sx={{ fontSize: 13 }}>{tipo}</Typography>}
              />
            ))}
          </Box>
          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Prazo para envio</InputLabel>
            <Select value={doc.solicitarPrazo} label="Prazo para envio" onChange={e => { doc.setSolicitarPrazo(e.target.value); }}>
              {['3', '5', '7', '10', '15'].map(d => (
                <MenuItem key={d} value={d}>{d} dias úteis</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            label="Mensagem ao beneficiário (opcional)"
            placeholder="Ex: Para prosseguirmos com a análise, precisamos dos documentos acima dentro do prazo indicado."
            value={doc.solicitarMensagem}
            onChange={e => { doc.setSolicitarMensagem(e.target.value); }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => { doc.setShowSolicitarModal(false); }}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={doc.solicitarDocs.length === 0}
            onClick={doc.handleSolicitarConfirm}
            sx={{ backgroundColor: '#902B29', '&:hover': { backgroundColor: '#6e1f1d' } }}
          >
            Pendenciar e Notificar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={!!doc.toast}
        autoHideDuration={4000}
        onClose={() => { doc.setToast(''); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => { doc.setToast(''); }} sx={{ minWidth: 280 }}>
          {doc.toast}
        </Alert>
      </Snackbar>

      {/* Document Lightbox */}
      <Dialog
        open={!!doc.viewDoc}
        onClose={() => { doc.setViewDoc(null); doc.setZoom(100) }}
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
              {doc.viewDoc}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', ml: 0.5 }}>— Esc para fechar</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Reduzir zoom">
              <span>
                <IconButton
                  size="small"
                  aria-label="Reduzir zoom"
                  onClick={() => { doc.setZoom(z => Math.max(50, z - 10)); }}
                  disabled={doc.zoom <= 50}
                  sx={{ color: 'text.secondary' }}
                >
                  <ZoomOutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Box
              aria-live="polite"
              aria-label={`Zoom: ${String(doc.zoom)}%`}
              sx={{ px: 1.25, py: 0.25, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1, minWidth: 42, textAlign: 'center' }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>{doc.zoom}%</Typography>
            </Box>
            <Tooltip title="Ampliar zoom">
              <span>
                <IconButton
                  size="small"
                  aria-label="Ampliar zoom"
                  onClick={() => { doc.setZoom(z => Math.min(200, z + 10)); }}
                  disabled={doc.zoom >= 200}
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
                a.href = '/exemplo-request.png'
                a.download = doc.viewDoc ?? 'documento'
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
                onClick={() => { doc.setViewDoc(null); doc.setZoom(100) }}
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
            width: `${String(doc.zoom)}%`,
            maxWidth: 757,
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            <img
              src="/exemplo-request.png"
              alt={`Visualização do documento: ${doc.viewDoc ?? ''}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>
      </Dialog>
    </Card>
  )
}
