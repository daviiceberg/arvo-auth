'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { type FormData, type ModuloType } from '../types'
import { moduloLabels } from '../constants/module-labels'

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

interface StepBeneficiaryProps {
  form: FormData
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setSelect: (field: keyof FormData) => (value: string) => void
}

export function StepBeneficiary({ form, set, setSelect }: StepBeneficiaryProps) {
  return (
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
}
