'use client';

import React from 'react';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface AdjustmentFieldValueProps {
  currentValue: number | undefined;
  newValue: string;
  setNewValue: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AdjustmentFieldValue({
  currentValue,
  newValue,
  setNewValue,
  errors,
  setErrors,
}: AdjustmentFieldValueProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        label="Valor atual"
        value={currentValue ? formatCurrency(currentValue) : '—'}
        disabled
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <TextField
        size="small"
        label="Novo valor unitário *"
        type="number"
        value={newValue}
        onChange={(e) => {
          setNewValue(e.target.value);
          setErrors({ ...errors, newValue: '' });
        }}
        placeholder="0,00"
        error={!!errors.newValue}
        helperText={errors.newValue}
        fullWidth
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
          htmlInput: { min: 0.01, step: '0.01' },
        }}
      />
    </Box>
  );
}
