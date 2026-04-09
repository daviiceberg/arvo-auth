'use client';

import React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface AdjustmentFieldCodeProps {
  currentCode: string | undefined;
  newCode: string;
  setNewCode: (value: string) => void;
  newDesc: string;
  setNewDesc: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
}

export default function AdjustmentFieldCode({
  currentCode,
  newCode,
  setNewCode,
  newDesc,
  setNewDesc,
  errors,
  setErrors,
}: AdjustmentFieldCodeProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        label="Código atual"
        value={currentCode ?? ''}
        disabled
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <Alert
        severity="warning"
        sx={{ mb: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}
      >
        Alteração de código requer respaldo de junta médica ou diretriz ANS. Certifique-se de
        registrar a fundamentação abaixo.
      </Alert>
      <TextField
        size="small"
        label="Novo código TUSS *"
        value={newCode}
        onChange={(e) => {
          setNewCode(e.target.value);
          setErrors({ ...errors, newCode: '' });
        }}
        placeholder="Código TISS"
        error={!!errors.newCode}
        helperText={errors.newCode}
        fullWidth
        sx={{ mb: 1.5 }}
      />
      <TextField
        size="small"
        label="Nova descrição *"
        value={newDesc}
        onChange={(e) => {
          setNewDesc(e.target.value);
          setErrors({ ...errors, newDesc: '' });
        }}
        error={!!errors.newDesc}
        helperText={errors.newDesc}
        fullWidth
      />
    </Box>
  );
}
