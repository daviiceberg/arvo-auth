'use client'

import React from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type FormData } from '../types'

// ── Field helpers ─────────────────────────────────────────────────────
function FieldLabel({ children, validated, warning }: { children: React.ReactNode; validated?: boolean; warning?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} /> : null}
      {warning ? <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} /> : null}
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

interface StepClinicalProps {
  form: FormData
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setSelect: (field: keyof FormData) => (value: string) => void
  cidSecundarioInput: string
  setCidSecundarioInput: (v: string) => void
  addCidSecundario: (cid: string) => void
  removeCidSecundario: (index: number) => void
}

export function StepClinical({
  form, set, setSelect,
  cidSecundarioInput, setCidSecundarioInput, addCidSecundario, removeCidSecundario,
}: StepClinicalProps) {
  return (
    <Box>
      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
        Preenchido por IA — Revise os dados abaixo
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Dados Clínicos</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>CID Principal</FieldLabel>
          <TextField fullWidth size="small" value={form.cidPrincipal} onChange={set('cidPrincipal')} placeholder="Ex: Z32.1" sx={inputSx(true)} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>CIDs Secundários <Typography component="span" variant="caption" sx={{ color: '#64748b', fontWeight: 400 }}>(opcional)</Typography></FieldLabel>
          {form.cidsSecundarios.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {form.cidsSecundarios.map((cid, idx) => (
                <Chip
                  key={idx}
                  label={cid}
                  size="small"
                  onDelete={() => { removeCidSecundario(idx); }}
                  sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700, fontSize: 12 }}
                />
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              value={cidSecundarioInput}
              onChange={e => { setCidSecundarioInput(e.target.value.toUpperCase()); }}
              onKeyDown={e => {
                if (e.key === 'Enter' && cidSecundarioInput.trim()) {
                  e.preventDefault()
                  addCidSecundario(cidSecundarioInput)
                }
              }}
              placeholder="Ex: I10"
              sx={{ width: 160 }}
            />
            <Button
              size="small"
              variant="text"
              disabled={!cidSecundarioInput.trim()}
              onClick={() => { addCidSecundario(cidSecundarioInput); }}
              sx={{ color: '#902B29', textTransform: 'none', fontWeight: 600, fontSize: 13, px: 1 }}
            >
              + Adicionar
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: 11, mt: 0.5, display: 'block' }}>
            Informe CIDs relevantes para este atendimento. Pressione Enter ou clique em &quot;+ Adicionar&quot;.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel warning>Caráter do Atendimento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.caraterAtendimento} onChange={(e) => { setSelect('caraterAtendimento')(e.target.value); }} sx={{ backgroundColor: '#fffbeb', '& fieldset': { borderColor: '#f59e0b' } }}>
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

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Prestador / Clínica</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <FieldLabel>Nome do Prestador / Clínica</FieldLabel>
          <TextField fullWidth size="small" placeholder="Ex: Hospital Santa Cruz" value={form.prestador} onChange={set('prestador')} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FieldLabel>CNPJ do Prestador</FieldLabel>
          <TextField fullWidth size="small" placeholder="00.000.000/0001-00" value={form.cnpjPrestador} onChange={set('cnpjPrestador')} />
        </Grid>
      </Grid>
    </Box>
  )
}
