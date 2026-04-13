'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type IASuggestion } from '@/types/pedido';

import { DENIAL_REASONS } from '@/modules/analysis/constants/denial-reasons';

interface DenialDialogProps {
  open: boolean;
  requestId: string;
  beneficiaryName: string;
  iaSuggestion: IASuggestion;
  denialReasonIdx: number;
  onDenialReasonChange: (idx: number) => void;
  denialJustification: string;
  onDenialJustificationChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DenialDialog({
  open,
  requestId,
  beneficiaryName,
  iaSuggestion,
  denialReasonIdx,
  onDenialReasonChange,
  denialJustification,
  onDenialJustificationChange,
  onConfirm,
  onClose,
}: DenialDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Registrar Negativa</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Solicitação <strong>{requestId}</strong> · {beneficiaryName}
        </Typography>
        {iaSuggestion !== 'Negar' && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
            A IA sugeriu <strong>{iaSuggestion}</strong> para este caso. Ao registrar negativa,
            justifique o motivo da divergência no campo abaixo.
          </Alert>
        )}
        <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>
          Selecione o motivo da negativa *
        </Typography>
        <RadioGroup
          value={denialReasonIdx === -1 ? '' : String(denialReasonIdx)}
          onChange={(e) => {
            const idx = Number(e.target.value);
            onDenialReasonChange(idx);
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
            {DENIAL_REASONS.map((m, idx) => (
              <Box
                key={idx}
                onClick={() => {
                  onDenialReasonChange(idx);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.25,
                  border:
                    denialReasonIdx === idx ? '2px solid #d4183d' : '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: denialReasonIdx === idx ? 'rgba(212,24,61,0.04)' : '#fff',
                  transition: 'all 0.12s ease',
                  '&:hover': { borderColor: 'error.main', backgroundColor: 'rgba(212,24,61,0.02)' },
                }}
              >
                <Radio
                  value={String(idx)}
                  size="small"
                  checked={denialReasonIdx === idx}
                  onChange={() => undefined}
                  sx={{
                    p: 0,
                    color: denialReasonIdx === idx ? 'error.main' : undefined,
                    '&.Mui-checked': { color: 'error.main' },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 12,
                    fontWeight: denialReasonIdx === idx ? 700 : 500,
                    lineHeight: 1.3,
                  }}
                >
                  {m.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </RadioGroup>
        <TextField
          label={`Justificativa técnica *${denialReasonIdx === DENIAL_REASONS.length - 1 ? '' : ' (editável)'}`}
          multiline
          rows={4}
          fullWidth
          size="small"
          placeholder="Descreva o motivo da negativa..."
          value={denialJustification}
          onChange={(e) => {
            onDenialJustificationChange(e.target.value);
          }}
          helperText={
            denialReasonIdx >= 0 && denialReasonIdx < DENIAL_REASONS.length - 1
              ? 'Texto preenchido automaticamente conforme o motivo. Edite se necessário.'
              : undefined
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="error"
          disabled={denialReasonIdx === -1 || !denialJustification.trim()}
          onClick={onConfirm}
        >
          Confirmar Negativa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
