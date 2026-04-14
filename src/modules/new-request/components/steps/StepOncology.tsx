'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type GuiaProcedure } from '@/types/procedure-codes';

import { type FormData } from '@/modules/new-request/types';

import { ProceduresStepSection } from './ProceduresStepSection';

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

const inputSx = (validated?: boolean) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: validated ? '#f0fdf4' : '#fff',
    '& fieldset': {
      borderColor: validated ? '#16a34a' : undefined,
    },
  },
});

interface StepOncologyProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepOncology({
  form,
  set,
  setSelect,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepOncologyProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados Oncológicos
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Estadiamento (TNM)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.estadiamentoTNM}
            onChange={set('estadiamentoTNM')}
            placeholder="ex: T2 N0 M0"
            sx={inputSx(!!form.estadiamentoTNM)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Nº do Ciclo</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.numeroCiclo}
            onChange={set('numeroCiclo')}
            sx={inputSx(!!form.numeroCiclo)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Protocolo Quimioterápico</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.protocoloQuimio}
            onChange={set('protocoloQuimio')}
            placeholder="ex: FOLFOX, CHOP..."
            sx={inputSx(!!form.protocoloQuimio)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Tratamento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.tipoTratamento}
              onChange={(e) => {
                setSelect('tipoTratamento')(e.target.value);
              }}
            >
              <MenuItem value="Quimioterapia">Quimioterapia</MenuItem>
              <MenuItem value="Radioterapia">Radioterapia</MenuItem>
              <MenuItem value="Hormonioterapia">Hormonioterapia</MenuItem>
              <MenuItem value="Imunoterapia">Imunoterapia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Número de Ciclos Totais</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.totalCiclos}
            onChange={set('totalCiclos')}
          />
        </Grid>
      </Grid>

      <ProceduresStepSection
        guiaProcedures={guiaProcedures}
        onGuiaProceduresChange={onGuiaProceduresChange}
        showPeriod
        showQuantity
      />
    </Box>
  );
}
