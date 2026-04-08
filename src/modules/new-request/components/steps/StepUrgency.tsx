'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { type FormData } from '../../types'

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

interface StepUrgencyProps {
  form: FormData
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setSelect: (field: keyof FormData) => (value: string) => void
}

export function StepUrgency({ form, set, setSelect }: StepUrgencyProps) {
  return (
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
}
