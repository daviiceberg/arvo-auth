'use client';

import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface AdjustmentFieldProviderProps {
  currentProvider: string | undefined;
  newProvider: string;
  setNewProvider: (value: string) => void;
  newCNES: string;
  setNewCNES: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
}

export default function AdjustmentFieldProvider({
  currentProvider,
  newProvider,
  setNewProvider,
  newCNES,
  setNewCNES,
  errors,
  setErrors,
}: AdjustmentFieldProviderProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        label="Prestador atual"
        value={currentProvider ?? ''}
        disabled
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <TextField
        size="small"
        label="Novo prestador *"
        value={newProvider}
        onChange={(e) => {
          setNewProvider(e.target.value);
          setErrors({ ...errors, newProvider: '' });
        }}
        placeholder="Nome do prestador credenciado"
        error={!!errors.newProvider}
        helperText={errors.newProvider}
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <TextField
        size="small"
        label="CNES (opcional)"
        value={newCNES}
        onChange={(e) => {
          setNewCNES(e.target.value.replace(/\D/g, ''));
        }}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        fullWidth
      />
    </Box>
  );
}
