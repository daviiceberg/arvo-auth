'use client';

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
import Typography from '@mui/material/Typography';

import { APPROVAL_REASONS } from '@/modules/analysis/constants/approval-reasons';

interface ApprovalDialogProps {
  open: boolean;
  requestId: string;
  approvalReason: string;
  onApprovalReasonChange: (value: string) => void;
  approvalJustification: string;
  onApprovalJustificationChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ApprovalDialog({
  open,
  requestId,
  approvalReason,
  onApprovalReasonChange,
  approvalJustification,
  onApprovalJustificationChange,
  onConfirm,
  onClose,
}: ApprovalDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Aprovação</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Você está prestes a aprovar a solicitação <strong>{requestId}</strong>. Esta ação é
          irreversível.
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Motivo Estruturado *</InputLabel>
          <Select
            value={approvalReason}
            label="Motivo Estruturado *"
            onChange={(e) => {
              onApprovalReasonChange(e.target.value);
            }}
          >
            {APPROVAL_REASONS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Justificativa Técnica *"
          multiline
          rows={3}
          fullWidth
          size="small"
          value={approvalJustification}
          onChange={(e) => {
            onApprovalJustificationChange(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!approvalReason || !approvalJustification.trim()}
          onClick={onConfirm}
          sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
        >
          Confirmar Aprovação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
