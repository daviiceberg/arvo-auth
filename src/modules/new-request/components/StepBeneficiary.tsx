'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type Category } from '@/types/pedido';

import { type FormData } from '../types';

const CATEGORY_OPTIONS: Category[] = [
  'Terapias Especiais',
  'SADT',
  'Exames Alta Complexidade',
  'Home Care',
];

function inputSx(validated = false) {
  return validated
    ? {
        backgroundColor: 'rgba(22,163,74,0.04)',
        borderColor: 'rgba(22,163,74,0.3)',
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(22,163,74,0.5)',
        },
      }
    : undefined;
}

// ── Field helpers ─────────────────────────────────────────────────────
function FieldLabel({ children, validated }: { children: React.ReactNode; validated?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, fontWeight: 600, color: '#333', display: 'block' }}
      >
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#166534' }} /> : null}
    </Box>
  );
}

interface BeneficiaryFieldsProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCategory: (next: FormData['category']) => void;
  isManualEntry: boolean;
}

// eslint-disable-next-line complexity
function BeneficiaryFields({ form, set, setCategory, isManualEntry }: BeneficiaryFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FieldLabel>Tipo de Solicitação *</FieldLabel>
        <FormControl fullWidth size="small">
          <Select<FormData['category']>
            value={form.category}
            displayEmpty
            onChange={(e) => {
              setCategory(e.target.value as FormData['category']);
            }}
            renderValue={(selected) =>
              selected === '' ? (
                <Box component="em" sx={{ color: 'text.disabled' }}>
                  Selecione o tipo de solicitação...
                </Box>
              ) : (
                selected
              )
            }
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.nomeBeneficiario}>
          Nome Completo *
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.nomeBeneficiario}
          onChange={set('nomeBeneficiario')}
          sx={!isManualEntry && form.nomeBeneficiario ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.carteirinha}>Carteirinha *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.carteirinha}
          onChange={set('carteirinha')}
          sx={!isManualEntry && form.carteirinha ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.dataNascimento}>
          Data de Nascimento *
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.dataNascimento}
          onChange={set('dataNascimento')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.dataNascimento ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.cpf}>CPF</FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="000.000.000-00"
          value={form.cpf}
          onChange={set('cpf')}
          sx={!isManualEntry && form.cpf ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.operadora}>Operadora / Plano *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.operadora}
          onChange={set('operadora')}
          sx={!isManualEntry && form.operadora ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.validadeCarteirinha}>
          Validade da Carteirinha
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.validadeCarteirinha}
          onChange={set('validadeCarteirinha')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.validadeCarteirinha ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.telefoneContato}>
          Telefone de Contato
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="(11) 99999-9999"
          value={form.telefoneContato}
          onChange={set('telefoneContato')}
          sx={!isManualEntry && form.telefoneContato ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.dataInclusaoPlano}>
          Data de Inclusão no Plano
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.dataInclusaoPlano}
          onChange={set('dataInclusaoPlano')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.dataInclusaoPlano ? inputSx(true) : undefined}
        />
      </Grid>
    </Grid>
  );
}

interface StepBeneficiaryProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCategory: (next: FormData['category']) => void;
  isManualEntry: boolean;
}

export function StepBeneficiary({ form, set, setCategory, isManualEntry }: StepBeneficiaryProps) {
  const hasAiData = !isManualEntry && form.nomeBeneficiario && form.nomeBeneficiario !== '';

  return (
    <Box>
      {hasAiData ? (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
          Preenchido por IA — Revise os dados abaixo
        </Alert>
      ) : null}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados do Beneficiário
      </Typography>
      <BeneficiaryFields
        form={form}
        set={set}
        setCategory={setCategory}
        isManualEntry={isManualEntry}
      />
    </Box>
  );
}
