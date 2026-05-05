'use client';

import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { JUNTA_REASONS } from '@/modules/analysis/constants/junta-reasons';

interface JuntaMedicaDialogProps {
  open: boolean;
  requestId: string;
  onClose: () => void;
  onConfirm: (payload: { reason: string; justification: string }) => void;
}

export default function JuntaMedicaDialog({
  open,
  requestId,
  onClose,
  onConfirm,
}: JuntaMedicaDialogProps) {
  const [reasonId, setReasonId] = useState('');
  const [justification, setJustification] = useState('');

  const reset = () => {
    setReasonId('');
    setJustification('');
  };

  const isValid = reasonId !== '' && justification.trim().length >= 20;
  const reasonLabel = JUNTA_REASONS.find((r) => r.id === reasonId)?.label ?? reasonId;

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box component="span" sx={{ display: 'block', fontSize: 18, fontWeight: 700 }}>
          Encaminhar {requestId} para Junta Médica
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 1.5, fontSize: 13 }}>
          <strong>SLA regulatório segue contando.</strong> Por padrão, a junta acontece dentro do
          prazo da RN 259/2011. Não há suspensão automática (RN 424/2017).
        </Alert>
        <Alert severity="info" sx={{ mb: 2, fontSize: 13 }}>
          O prazo pode ser <strong>suspenso por 3 dias úteis (1× por pedido)</strong> apenas se: (a)
          o desempatador pedir exames complementares, ou (b) o beneficiário faltar à junta
          presencial.
        </Alert>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Motivo do encaminhamento *</InputLabel>
          <Select
            value={reasonId}
            label="Motivo do encaminhamento *"
            onChange={(e) => {
              setReasonId(e.target.value);
            }}
          >
            {JUNTA_REASONS.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Justificativa técnica (mín. 20 caracteres) *"
          multiline
          rows={4}
          fullWidth
          size="small"
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
          }}
          helperText={
            justification.trim().length < 20 && justification.length > 0
              ? `Faltam ${String(20 - justification.trim().length)} caracteres`
              : 'Descreva o ponto de divergência ou complexidade que justifica a junta'
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={() => {
            onClose();
            reset();
          }}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!isValid}
          onClick={() => {
            onConfirm({ reason: reasonLabel, justification: justification.trim() });
            reset();
          }}
          sx={{ backgroundColor: '#6d28d9', '&:hover': { backgroundColor: '#5b21b6' } }}
        >
          Encaminhar para Junta
        </Button>
      </DialogActions>
    </Dialog>
  );
}
