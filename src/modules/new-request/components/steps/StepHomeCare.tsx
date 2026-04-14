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

interface StepHomeCareProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepHomeCare({
  form,
  set,
  setSelect,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepHomeCareProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Cuidados Domiciliares
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Modalidade Home Care</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.modalidadeHomeCare}
              onChange={(e) => {
                setSelect('modalidadeHomeCare')(e.target.value);
              }}
            >
              <MenuItem value="AD1">AD1 — Tipo 1 (menor complexidade)</MenuItem>
              <MenuItem value="AD2">AD2 — Tipo 2</MenuItem>
              <MenuItem value="AD3">AD3 — Tipo 3 (maior complexidade)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Período Solicitado (dias)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.periodoSolicitado}
            onChange={set('periodoSolicitado')}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Cuidados Necessários</FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            placeholder="Descreva os cuidados e procedimentos necessários no domicílio..."
            value={form.cuidadosNecessarios}
            onChange={set('cuidadosNecessarios')}
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
