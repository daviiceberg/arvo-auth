'use client';

import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { type Adjustment } from '@/types/pedido';

interface AdjustmentApprovalDialogProps {
  open: boolean;
  allAdjustments: Adjustment[];
  onReview: () => void;
  onConfirm: () => void;
}

export default function AdjustmentApprovalDialog({
  open,
  allAdjustments,
  onReview,
  onConfirm,
}: AdjustmentApprovalDialogProps) {
  return (
    <Dialog open={open} onClose={onReview} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 15 }}>
        Aprovação com ajustes registrados
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: 13 }}>
          Esta guia possui{' '}
          <strong>
            {allAdjustments.length} ajuste{allAdjustments.length > 1 ? 's' : ''} registrado
            {allAdjustments.length > 1 ? 's' : ''}
          </strong>
          :
        </Typography>
        {allAdjustments.map((aj) => (
          <Box key={aj.id} sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
            <EditIcon sx={{ fontSize: 13, color: 'warning.main', mt: 0.15, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: 12 }}>
              {aj.field === 'quantidade'
                ? `Quantidade reduzida de ${aj.previousValue} para ${aj.newValue}`
                : aj.field === 'prestador'
                  ? `Prestador alterado para ${aj.newValue}`
                  : `Código alterado para ${aj.newValue}`}
            </Typography>
          </Box>
        ))}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontSize: 13 }}>
          Confirma a aprovação com esses ajustes aplicados?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onReview} sx={{ fontWeight: 600 }}>
          Revisar
        </Button>
        <Button variant="contained" onClick={onConfirm} sx={{ fontWeight: 600 }}>
          Confirmar aprovação com ajustes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
