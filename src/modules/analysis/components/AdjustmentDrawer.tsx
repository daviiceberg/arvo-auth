'use client'

import { useState, useEffect } from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type Adjustment } from '@/data/pedidos'

import { ADJUSTMENT_REASONS, OPME_VALUE_REASONS } from '../constants/adjustment-reasons'
import { USER_PROFILE } from '../types'

interface AdjustmentDrawerProps {
  open: boolean
  requestId: string
  requestStatus: string
  existingAdjustments?: Adjustment[]
  proc: { codigo: string; descricao: string; qty: number; prestador: string; fabricante?: string; valorUnitario?: number } | null
  onClose: () => void
  onConfirm: (adjustment: Omit<Adjustment, 'id'>) => void
}

export default function AdjustmentDrawer({ open, requestId, requestStatus, proc, onClose, onConfirm, existingAdjustments = [] }: AdjustmentDrawerProps) {
  const [field, setField] = useState<'quantidade' | 'prestador' | 'codigo' | 'fabricante' | 'valorUnitario' | ''>('')
  const [newQty, setNewQty] = useState('')
  const [newProvider, setNewProvider] = useState('')
  const [newCNES, setNewCNES] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newManufacturer, setNewManufacturer] = useState('')
  const [newValue, setNewValue] = useState('')
  const [reason, setReason] = useState('')
  const [justification, setJustification] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isOpme = proc?.fabricante !== undefined

  const fieldsBase = USER_PROFILE === 'Gestor'
    ? [{ value: 'quantidade', label: 'Quantidade autorizada' }, { value: 'prestador', label: 'Prestador executante' }, { value: 'codigo', label: 'Código do procedimento' }]
    : [{ value: 'quantidade', label: 'Quantidade autorizada' }]

  const availableFields = isOpme
    ? [...fieldsBase, { value: 'fabricante', label: 'Fabricante' }, { value: 'valorUnitario', label: 'Valor unitário' }]
    : fieldsBase

  const availableReasons = field === 'valorUnitario'
    ? [...ADJUSTMENT_REASONS, ...OPME_VALUE_REASONS]
    : ADJUSTMENT_REASONS

  const qtyNum = parseInt(newQty, 10)
  const qtyStatus =
    !newQty || isNaN(qtyNum) ? null
    : qtyNum < (proc?.qty ?? 0) ? 'below'
    : qtyNum === (proc?.qty ?? 0) ? 'equal'
    : 'above'

  // Reset (or pre-fill from existing adjustment) when proc changes or drawer opens
  useEffect(() => {
    if (!open) return
    const lastQtyAdj = existingAdjustments.filter(a => a.procedureCode === proc?.codigo && a.field === 'quantidade').slice(-1)[0]
    const lastProviderAdj = existingAdjustments.filter(a => a.procedureCode === proc?.codigo && a.field === 'prestador').slice(-1)[0]
    const lastCodeAdj = existingAdjustments.filter(a => a.procedureCode === proc?.codigo && a.field === 'codigo').slice(-1)[0]
    if (lastQtyAdj) {
      setField('quantidade')
      setNewQty(lastQtyAdj.newValue)
    } else if (lastProviderAdj) {
      setField('prestador')
      setNewProvider(lastProviderAdj.newValue.replace(/ \(CNES: .+\)$/, ''))
      const cnesMatch = /CNES: (.+)\)$/.exec(lastProviderAdj.newValue)
      setNewCNES(cnesMatch?.[1] ?? '')
    } else if (lastCodeAdj) {
      setField('codigo')
      setNewCode(lastCodeAdj.newValue.split(' — ')[0] ?? '')
      setNewDesc(lastCodeAdj.newValue.split(' — ')[1] ?? '')
    } else {
      setField('')
      setNewQty('')
      setNewProvider('')
      setNewCNES('')
      setNewCode('')
      setNewDesc('')
    }
    setReason('')
    setJustification('')
    setErrors({})
  }, [open, proc?.codigo]) // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => { window.removeEventListener('keydown', handler); }
  }, [open, onClose])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!field) errs.field = 'Selecione o campo a ajustar'
    if (field === 'quantidade') {
      if (!newQty || isNaN(qtyNum) || qtyNum < 1) errs.newQty = 'Informe uma quantidade válida (mín. 1)'
      if (qtyStatus === 'above') errs.newQty = 'Não é possível autorizar mais que o solicitado'
    }
    if (field === 'prestador' && !newProvider.trim()) errs.newProvider = 'Informe o novo prestador'
    if (field === 'codigo') {
      if (!newCode.trim()) errs.newCode = 'Informe o novo código'
      if (!newDesc.trim()) errs.newDesc = 'Informe a nova descrição'
    }
    if (field === 'fabricante' && !newManufacturer.trim()) errs.newManufacturer = 'Informe o novo fabricante'
    if (field === 'valorUnitario') {
      const v = parseFloat(newValue)
      if (!newValue || isNaN(v) || v <= 0) errs.newValue = 'Informe um valor válido (> 0)'
    }
    if (!reason) errs.motivo = 'Selecione o motivo'
    if (reason === 'Outro (descrever na fundamentação)' && !justification.trim()) errs.justification = 'Fundamentação obrigatória quando motivo é "Outro"'
    return errs
  }

  const handleConfirm = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!proc || !field) return

    let prevValue = ''
    let newVal = ''
    if (field === 'quantidade') { prevValue = String(proc.qty); newVal = newQty }
    if (field === 'prestador') { prevValue = proc.prestador; newVal = newCNES ? `${newProvider} (CNES: ${newCNES})` : newProvider }
    if (field === 'codigo') { prevValue = proc.codigo; newVal = `${newCode} — ${newDesc}` }
    if (field === 'fabricante') { prevValue = proc.fabricante ?? ''; newVal = newManufacturer }
    if (field === 'valorUnitario') {
      prevValue = proc.valorUnitario ? proc.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'
      newVal = parseFloat(newValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    onConfirm({
      procedureCode: proc.codigo,
      procedureDescription: proc.descricao,
      field,
      previousValue: prevValue,
      newValue: newVal,
      reason,
      justification: justification.trim() || undefined,
      operator: 'Ana Paula Santos',
      profile: USER_PROFILE,
      timestamp: new Date().toISOString(),
    })
  }

  const isGuideFinalized = ['Aprovado', 'Negado'].includes(requestStatus)

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {/* overlay click does NOT close -- only X or Cancelar */}}
      PaperProps={{
        role: 'dialog',
        'aria-label': 'Ajustar procedimento',
        sx: { width: 480, p: 0, display: 'flex', flexDirection: 'column' },
      }}
      ModalProps={{ keepMounted: false, sx: { zIndex: 1300 } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <EditIcon sx={{ fontSize: 16, color: '#b45309' }} />
            <Typography fontWeight={700} sx={{ fontSize: 15 }}>Ajustar Procedimento</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {requestId} · {proc?.codigo}
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
            { label: 'Qtd. Solicitada', value: proc ? `${String(proc.qty)}${isOpme ? ' unidade' : ' sessões'}` : '' },
            { label: 'Prestador', value: proc?.prestador },
            ...(isOpme ? [
              { label: 'Fabricante', value: proc?.fabricante ?? '—' },
              { label: 'Valor Unitário', value: proc?.valorUnitario ? proc.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—' },
            ] : []),
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

          <FormControl fullWidth size="small" sx={{ mb: errors.field ? 0.5 : 2 }} error={!!errors.field}>
            <InputLabel>Campo a ajustar *</InputLabel>
            <Select value={field} label="Campo a ajustar *" onChange={e => { setField(e.target.value as typeof field); setErrors(v => ({ ...v, campo: '' })) }} autoFocus>
              {availableFields.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
            </Select>
            {errors.field ? <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.field}</Typography> : null}
          </FormControl>

          {/* Quantidade */}
          {field === 'quantidade' && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField size="small" label="Qtd. solicitada" value={proc?.qty ?? ''} disabled sx={{ flex: 1 }} />
                <TextField
                  size="small"
                  label="Qtd. autorizada *"
                  value={newQty}
                  onChange={e => { setNewQty(e.target.value.replace(/\D/g, '')); setErrors(v => ({ ...v, newQty: '' })) }}
                  inputProps={{ min: 1, inputMode: 'numeric' }}
                  placeholder="Ex: 20"
                  error={!!errors.newQty}
                  sx={{ flex: 1 }}
                />
              </Box>
              {errors.newQty ? <Typography sx={{ fontSize: 11, color: 'error.main', mb: 0.75 }}>{errors.newQty}</Typography> : null}
              {qtyStatus === 'below' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <WarningAmberIcon sx={{ fontSize: 14, color: '#b45309' }} />
                  <Typography sx={{ fontSize: 12, color: '#b45309' }}>Autorizando menos que o solicitado ({proc?.qty} → {newQty})</Typography>
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
          {field === 'prestador' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Prestador atual" value={proc?.prestador ?? ''} disabled fullWidth sx={{ mb: 1.5 }} />
              <TextField
                size="small"
                label="Novo prestador *"
                value={newProvider}
                onChange={e => { setNewProvider(e.target.value); setErrors(v => ({ ...v, newProvider: '' })) }}
                placeholder="Nome do prestador credenciado"
                error={!!errors.newProvider}
                helperText={errors.newProvider}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label="CNES (opcional)"
                value={newCNES}
                onChange={e => { setNewCNES(e.target.value.replace(/\D/g, '')); }}
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
              />
            </Box>
          )}

          {/* Código */}
          {field === 'codigo' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Código atual" value={proc?.codigo ?? ''} disabled fullWidth sx={{ mb: 1.5 }} />
              <Alert severity="warning" sx={{ mb: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}>
                Alteração de código requer respaldo de junta médica ou diretriz ANS. Certifique-se de registrar a fundamentação abaixo.
              </Alert>
              <TextField
                size="small"
                label="Novo código TUSS *"
                value={newCode}
                onChange={e => { setNewCode(e.target.value); setErrors(v => ({ ...v, newCode: '' })) }}
                placeholder="Código TISS"
                error={!!errors.newCode}
                helperText={errors.newCode}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label="Nova descrição *"
                value={newDesc}
                onChange={e => { setNewDesc(e.target.value); setErrors(v => ({ ...v, newDesc: '' })) }}
                error={!!errors.newDesc}
                helperText={errors.newDesc}
                fullWidth
              />
            </Box>
          )}

          {/* Fabricante */}
          {field === 'fabricante' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Fabricante atual" value={proc?.fabricante ?? '—'} disabled fullWidth sx={{ mb: 1.5 }} />
              <TextField
                size="small"
                label="Novo fabricante *"
                value={newManufacturer}
                onChange={e => { setNewManufacturer(e.target.value); setErrors(v => ({ ...v, newManufacturer: '' })) }}
                placeholder="Nome do fabricante"
                error={!!errors.newManufacturer}
                helperText={errors.newManufacturer}
                fullWidth
              />
            </Box>
          )}

          {/* Valor unitário */}
          {field === 'valorUnitario' && (
            <Box sx={{ mb: 2 }}>
              <TextField
                size="small"
                label="Valor atual"
                value={proc?.valorUnitario ? proc.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
                disabled
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <TextField
                size="small"
                label="Novo valor unitário *"
                type="number"
                value={newValue}
                onChange={e => { setNewValue(e.target.value); setErrors(v => ({ ...v, newValue: '' })) }}
                placeholder="0,00"
                error={!!errors.newValue}
                helperText={errors.newValue}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  inputProps: { min: 0.01, step: '0.01' },
                }}
              />
            </Box>
          )}

          {/* Motivo */}
          <FormControl fullWidth size="small" sx={{ mb: errors.motivo ? 0.5 : 2 }} error={!!errors.motivo}>
            <InputLabel>Motivo do ajuste *</InputLabel>
            <Select value={reason} label="Motivo do ajuste *" onChange={e => { setReason(e.target.value); setErrors(v => ({ ...v, motivo: '' })) }}>
              {availableReasons.map(m => <MenuItem key={m} value={m} sx={{ fontSize: 13, whiteSpace: 'normal' }}>{m}</MenuItem>)}
            </Select>
            {errors.motivo ? <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.motivo}</Typography> : null}
          </FormControl>

          <TextField
            label={`Fundamentação clínica/regulatória${reason === 'Outro (descrever na fundamentação)' ? ' *' : ' (opcional)'}`}
            multiline
            rows={3}
            size="small"
            fullWidth
            value={justification}
            onChange={e => { setJustification(e.target.value); setErrors(v => ({ ...v, justification: '' })) }}
            error={!!errors.justification}
            helperText={errors.justification}
          />
        </Box>

        {/* Aviso auditoria */}
        {field === 'valorUnitario' ? (
          <Alert severity="warning" icon={<WarningAmberIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}>
            Ajustes de valor OPME são auditáveis e exigem fundamentação. O novo valor será registrado com seu nome, data/hora e motivo.
          </Alert>
        ) : (
          <Alert severity="warning" icon={<WarningAmberIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}>
            Este ajuste será registrado no histórico da guia com seu nome e data/hora.
          </Alert>
        )}
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
          disabled={isGuideFinalized}
          sx={{ fontWeight: 600, backgroundColor: '#902B29', '&:hover': { backgroundColor: '#6e1f1d' } }}
        >
          Confirmar Ajuste
        </Button>
      </Box>
    </Drawer>
  )
}
