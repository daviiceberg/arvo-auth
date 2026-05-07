'use client';

import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type InjunctionContext } from '@/types/pedido';

interface InjunctionAcknowledgmentDialogProps {
  open: boolean;
  injunction: InjunctionContext;
  acknowledgment: string;
  onAcknowledgmentChange: (value: string) => void;
  onContinue: () => void;
  onClose: () => void;
}

const INJUNCTION_PURPLE = '#5b21b6';
const MIN_LENGTH = 30;

export default function InjunctionAcknowledgmentDialog({
  open,
  injunction,
  acknowledgment,
  onAcknowledgmentChange,
  onContinue,
  onClose,
}: InjunctionAcknowledgmentDialogProps) {
  const isTooShort = acknowledgment.trim().length < MIN_LENGTH;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
          color: INJUNCTION_PURPLE,
        }}
      >
        <GavelOutlinedIcon sx={{ color: INJUNCTION_PURPLE }} fontSize="small" />
        Reconhecimento de Liminar Judicial
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Existe Liminar Judicial ativa para este pedido. Negativa requer justificativa explícita
          reconhecendo que a decisão judicial foi avaliada.
        </Typography>
        <Box
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(91,33,182,0.06)',
            borderRadius: 1,
            mb: 2,
            border: `1px solid rgba(91,33,182,0.2)`,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
            <strong>Processo:</strong> {injunction.processNumber}
            {injunction.court ? ` · ${injunction.court}` : ''}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            <strong>Escopo:</strong> {injunction.scope}
          </Typography>
        </Box>
        <TextField
          label="Justificativa de reconhecimento *"
          multiline
          rows={4}
          fullWidth
          size="small"
          placeholder="Descreva o motivo da negativa, considerando os termos da liminar..."
          value={acknowledgment}
          onChange={(e) => {
            onAcknowledgmentChange(e.target.value);
          }}
          error={isTooShort}
          helperText={
            isTooShort
              ? `Mínimo ${String(MIN_LENGTH)} caracteres (atual: ${String(acknowledgment.trim().length)})`
              : ''
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={() => {
            onClose();
            onAcknowledgmentChange('');
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={isTooShort}
          onClick={onContinue}
          sx={{
            backgroundColor: INJUNCTION_PURPLE,
            '&:hover': { backgroundColor: '#4c1d95' },
          }}
        >
          Reconhecer e prosseguir com negativa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
