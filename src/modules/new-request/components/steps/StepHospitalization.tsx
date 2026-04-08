'use client'

import React from 'react'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type FormData } from '../../types'

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

interface StepHospitalizationProps {
  form: FormData
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setSelect: (field: keyof FormData) => (value: string) => void
}

export function StepHospitalization({ form, set, setSelect }: StepHospitalizationProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Acomodação e Diárias</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Acomodação</FieldLabel>
          <FormControl fullWidth size="small">
            <Select value={form.tipoAcomodacao} onChange={(e) => { setSelect('tipoAcomodacao')(e.target.value); }}>
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
            <Select value={form.regimeInternacao} onChange={(e) => { setSelect('regimeInternacao')(e.target.value); }}>
              <MenuItem value="Hospitalar">Hospitalar</MenuItem>
              <MenuItem value="Hospital Dia">Hospital Dia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}
