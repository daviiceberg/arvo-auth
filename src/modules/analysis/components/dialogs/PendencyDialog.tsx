'use client';

import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  PENDENCY_DEADLINE_OPTIONS,
  PENDENCY_REASONS,
  type PendencyDeadlineDays,
} from '@/modules/analysis/constants/pendency-reasons';

interface PendencyDialogProps {
  open: boolean;
  requestId: string;
  onClose: () => void;
  onConfirm: (payload: {
    reasons: string[];
    justification: string;
    deadlineBusinessDays: PendencyDeadlineDays;
  }) => void;
}

export default function PendencyDialog({
  open,
  requestId,
  onClose,
  onConfirm,
}: PendencyDialogProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [justification, setJustification] = useState('');
  const [deadline, setDeadline] = useState<PendencyDeadlineDays>(7);

  const toggleReason = (id: string) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const reset = () => {
    setSelectedReasons([]);
    setJustification('');
    setDeadline(7);
  };

  const isValid = selectedReasons.length > 0 && justification.trim().length >= 10;

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
          Pendenciar pedido {requestId}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2, fontSize: 13 }}>
          <strong>Atenção:</strong> pendenciar <strong>NÃO interrompe</strong> o SLA regulatório (RN
          259/2011). O relógio da ANS continua rodando enquanto o prestador prepara a documentação.
        </Alert>

        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: 'text.secondary',
            display: 'block',
            mb: 1,
          }}
        >
          Motivos da pendência *
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          {PENDENCY_REASONS.map((reason) => (
            <FormControlLabel
              key={reason.id}
              control={
                <Checkbox
                  checked={selectedReasons.includes(reason.id)}
                  onChange={() => {
                    toggleReason(reason.id);
                  }}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                    {reason.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: 'text.secondary', display: 'block' }}
                  >
                    {reason.description}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 0.75 }}
            />
          ))}
        </Box>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Prazo para resposta do prestador</InputLabel>
          <Select
            value={deadline}
            label="Prazo para resposta do prestador"
            onChange={(e) => {
              setDeadline(e.target.value as PendencyDeadlineDays);
            }}
          >
            {PENDENCY_DEADLINE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Justificativa (mín. 10 caracteres) *"
          multiline
          rows={3}
          fullWidth
          size="small"
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
          }}
          helperText={
            justification.trim().length < 10 && justification.length > 0
              ? `Faltam ${String(10 - justification.trim().length)} caracteres`
              : 'Texto enviado ao prestador na notificação'
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
            onConfirm({
              reasons: selectedReasons,
              justification: justification.trim(),
              deadlineBusinessDays: deadline,
            });
            reset();
          }}
        >
          Pendenciar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
