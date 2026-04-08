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

import { type Ajuste } from '@/data/pedidos'

import { ADJUSTMENT_REASONS, OPME_VALUE_REASONS } from '../constants/adjustment-reasons'
import { USER_PROFILE } from '../types'

interface AdjustmentDrawerProps {
  open: boolean
  pedidoId: string
  pedidoStatus: string
  existingAjustes?: Ajuste[]
  proc: { codigo: string; descricao: string; qty: number; prestador: string; fabricante?: string; valorUnitario?: number } | null
  onClose: () => void
  onConfirm: (ajuste: Omit<Ajuste, 'id'>) => void
}

export default function AdjustmentDrawer({ open, pedidoId, pedidoStatus, proc, onClose, onConfirm, existingAjustes = [] }: AdjustmentDrawerProps) {
  const [campo, setCampo] = useState<'quantidade' | 'prestador' | 'codigo' | 'fabricante' | 'valorUnitario' | ''>('')
  const [novaQty, setNovaQty] = useState('')
  const [novoPrestador, setNovoPrestador] = useState('')
  const [novoCNES, setNovoCNES] = useState('')
  const [novoCodigo, setNovoCodigo] = useState('')
  const [novaDesc, setNovaDesc] = useState('')
  const [novoFabricante, setNovoFabricante] = useState('')
  const [novoValor, setNovoValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [fundamentacao, setFundamentacao] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isOpme = proc?.fabricante !== undefined

  const camposBase = USER_PROFILE === 'Gestor'
    ? [{ value: 'quantidade', label: 'Quantidade autorizada' }, { value: 'prestador', label: 'Prestador executante' }, { value: 'codigo', label: 'Código do procedimento' }]
    : [{ value: 'quantidade', label: 'Quantidade autorizada' }]

  const camposDisponiveis = isOpme
    ? [...camposBase, { value: 'fabricante', label: 'Fabricante' }, { value: 'valorUnitario', label: 'Valor unitário' }]
    : camposBase

  const motivosDisponiveis = campo === 'valorUnitario'
    ? [...ADJUSTMENT_REASONS, ...OPME_VALUE_REASONS]
    : ADJUSTMENT_REASONS

  const qtyNum = parseInt(novaQty, 10)
  const qtyStatus =
    !novaQty || isNaN(qtyNum) ? null
    : qtyNum < (proc?.qty ?? 0) ? 'below'
    : qtyNum === (proc?.qty ?? 0) ? 'equal'
    : 'above'

  // Reset (or pre-fill from existing ajuste) when proc changes or drawer opens
  useEffect(() => {
    if (!open) return
    const lastQtyAjuste = existingAjustes.filter(a => a.procedimentoCodigo === proc?.codigo && a.campo === 'quantidade').slice(-1)[0]
    const lastPrestAjuste = existingAjustes.filter(a => a.procedimentoCodigo === proc?.codigo && a.campo === 'prestador').slice(-1)[0]
    const lastCodeAjuste = existingAjustes.filter(a => a.procedimentoCodigo === proc?.codigo && a.campo === 'codigo').slice(-1)[0]
    if (lastQtyAjuste) {
      setCampo('quantidade')
      setNovaQty(lastQtyAjuste.valorNovo)
    } else if (lastPrestAjuste) {
      setCampo('prestador')
      setNovoPrestador(lastPrestAjuste.valorNovo.replace(/ \(CNES: .+\)$/, ''))
      const cnesMatch = /CNES: (.+)\)$/.exec(lastPrestAjuste.valorNovo)
      setNovoCNES(cnesMatch?.[1] ?? '')
    } else if (lastCodeAjuste) {
      setCampo('codigo')
      setNovoCodigo(lastCodeAjuste.valorNovo.split(' — ')[0])
      setNovaDesc(lastCodeAjuste.valorNovo.split(' — ')[1] ?? '')
    } else {
      setCampo('')
      setNovaQty('')
      setNovoPrestador('')
      setNovoCNES('')
      setNovoCodigo('')
      setNovaDesc('')
    }
    setMotivo('')
    setFundamentacao('')
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
    if (campo === 'fabricante' && !novoFabricante.trim()) errs.novoFabricante = 'Informe o novo fabricante'
    if (campo === 'valorUnitario') {
      const v = parseFloat(novoValor)
      if (!novoValor || isNaN(v) || v <= 0) errs.novoValor = 'Informe um valor válido (> 0)'
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
    if (campo === 'fabricante') { valorAnterior = proc.fabricante ?? ''; valorNovo = novoFabricante }
    if (campo === 'valorUnitario') {
      valorAnterior = proc.valorUnitario ? proc.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'
      valorNovo = parseFloat(novoValor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    onConfirm({
      procedimentoCodigo: proc.codigo,
      procedimentoDescricao: proc.descricao,
      campo: campo,
      valorAnterior,
      valorNovo,
      motivo,
      fundamentacao: fundamentacao.trim() || undefined,
      operador: 'Ana Paula Santos',
      perfil: USER_PROFILE,
      timestamp: new Date().toISOString(),
    })
  }

  const isGuiaFinalizada = ['Aprovado', 'Negado'].includes(pedidoStatus)

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

          <FormControl fullWidth size="small" sx={{ mb: errors.campo ? 0.5 : 2 }} error={!!errors.campo}>
            <InputLabel>Campo a ajustar *</InputLabel>
            <Select value={campo} label="Campo a ajustar *" onChange={e => { setCampo(e.target.value as typeof campo); setErrors(v => ({ ...v, campo: '' })) }} autoFocus>
              {camposDisponiveis.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
            </Select>
            {errors.campo ? <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.campo}</Typography> : null}
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
              {errors.novaQty ? <Typography sx={{ fontSize: 11, color: 'error.main', mb: 0.75 }}>{errors.novaQty}</Typography> : null}
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
                onChange={e => { setNovoCNES(e.target.value.replace(/\D/g, '')); }}
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
                label="Novo código TUSS *"
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

          {/* Fabricante */}
          {campo === 'fabricante' && (
            <Box sx={{ mb: 2 }}>
              <TextField size="small" label="Fabricante atual" value={proc?.fabricante ?? '—'} disabled fullWidth sx={{ mb: 1.5 }} />
              <TextField
                size="small"
                label="Novo fabricante *"
                value={novoFabricante}
                onChange={e => { setNovoFabricante(e.target.value); setErrors(v => ({ ...v, novoFabricante: '' })) }}
                placeholder="Nome do fabricante"
                error={!!errors.novoFabricante}
                helperText={errors.novoFabricante}
                fullWidth
              />
            </Box>
          )}

          {/* Valor unitário */}
          {campo === 'valorUnitario' && (
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
                value={novoValor}
                onChange={e => { setNovoValor(e.target.value); setErrors(v => ({ ...v, novoValor: '' })) }}
                placeholder="0,00"
                error={!!errors.novoValor}
                helperText={errors.novoValor}
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
            <Select value={motivo} label="Motivo do ajuste *" onChange={e => { setMotivo(e.target.value); setErrors(v => ({ ...v, motivo: '' })) }}>
              {motivosDisponiveis.map(m => <MenuItem key={m} value={m} sx={{ fontSize: 13, whiteSpace: 'normal' }}>{m}</MenuItem>)}
            </Select>
            {errors.motivo ? <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>{errors.motivo}</Typography> : null}
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
        {campo === 'valorUnitario' ? (
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
          disabled={isGuiaFinalizada}
          sx={{ fontWeight: 600, backgroundColor: '#902B29', '&:hover': { backgroundColor: '#6e1f1d' } }}
        >
          Confirmar Ajuste
        </Button>
      </Box>
    </Drawer>
  )
}
