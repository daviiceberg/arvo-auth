'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type FormData } from '../types';

// ── Field helpers ─────────────────────────────────────────────────────
function FieldLabel({
  children,
  validated,
  warning,
}: {
  children: React.ReactNode;
  validated?: boolean;
  warning?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} /> : null}
      {warning ? <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} /> : null}
    </Box>
  );
}

const inputSx = (validated?: boolean, warning?: boolean) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: validated ? '#f0fdf4' : warning ? '#fffbeb' : '#fff',
    '& fieldset': {
      borderColor: validated ? '#16a34a' : warning ? '#f59e0b' : undefined,
    },
  },
});

interface StepBeneficiaryProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function StepBeneficiary({ form, set }: StepBeneficiaryProps) {
  return (
    <Box>
      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
        Preenchido por IA — Revise os dados abaixo
      </Alert>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados do Beneficiário
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Nome Completo</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.nomeBeneficiario}
            onChange={set('nomeBeneficiario')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Carteirinha</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.carteirinha}
            onChange={set('carteirinha')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel warning>Data de Nascimento</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={form.dataNascimento}
            onChange={set('dataNascimento')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={inputSx(false, true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>CPF</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={set('cpf')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Operadora / Plano</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.operadora}
            onChange={set('operadora')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Validade da Carteirinha</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={form.validadeCarteirinha}
            onChange={set('validadeCarteirinha')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Telefone de Contato</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="(11) 99999-9999"
            value={form.telefoneContato}
            onChange={set('telefoneContato')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Data de Inclusão no Plano</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={form.dataInclusaoPlano}
            onChange={set('dataInclusaoPlano')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
