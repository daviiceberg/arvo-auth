'use client';

import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface AdjustmentFieldManufacturerProps {
  currentManufacturer: string | undefined;
  newManufacturer: string;
  setNewManufacturer: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
}

export default function AdjustmentFieldManufacturer({
  currentManufacturer,
  newManufacturer,
  setNewManufacturer,
  errors,
  setErrors,
}: AdjustmentFieldManufacturerProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        label="Fabricante atual"
        value={currentManufacturer ?? '—'}
        disabled
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <TextField
        size="small"
        label="Novo fabricante *"
        value={newManufacturer}
        onChange={(e) => {
          setNewManufacturer(e.target.value);
          setErrors({ ...errors, newManufacturer: '' });
        }}
        placeholder="Nome do fabricante"
        error={!!errors.newManufacturer}
        helperText={errors.newManufacturer}
        fullWidth
      />
    </Box>
  );
}
