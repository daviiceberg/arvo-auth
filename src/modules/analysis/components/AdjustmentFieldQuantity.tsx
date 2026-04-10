'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface AdjustmentFieldQuantityProps {
  currentQty: number | undefined;
  newQty: string;
  setNewQty: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
  qtyStatus: string | null;
}

export default function AdjustmentFieldQuantity({
  currentQty,
  newQty,
  setNewQty,
  errors,
  setErrors,
  qtyStatus,
}: AdjustmentFieldQuantityProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <TextField
          size="small"
          label="Qtd. solicitada"
          value={currentQty ?? ''}
          disabled
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          label="Qtd. autorizada *"
          value={newQty}
          onChange={(e) => {
            setNewQty(e.target.value.replace(/\D/g, ''));
            setErrors({ ...errors, newQty: '' });
          }}
          slotProps={{ htmlInput: { min: 1, inputMode: 'numeric' } }}
          placeholder="Ex: 20"
          error={!!errors.newQty}
          sx={{ flex: 1 }}
        />
      </Box>
      {errors.newQty ? (
        <Typography sx={{ fontSize: 11, color: 'error.main', mb: 0.75 }}>
          {errors.newQty}
        </Typography>
      ) : null}
      {qtyStatus === 'below' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <WarningAmberIcon sx={{ fontSize: 14, color: '#b45309' }} />
          <Typography sx={{ fontSize: 12, color: '#b45309' }}>
            Autorizando menos que o solicitado ({currentQty} → {newQty})
          </Typography>
        </Box>
      )}
      {qtyStatus === 'equal' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} />
          <Typography sx={{ fontSize: 12, color: '#16a34a' }}>
            Mantendo a quantidade solicitada
          </Typography>
        </Box>
      )}
    </Box>
  );
}
