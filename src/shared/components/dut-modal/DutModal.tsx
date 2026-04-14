'use client';

import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { type DutEntry } from '@/types/dut';

interface DutModalProps {
  open: boolean;
  onClose: () => void;
  dutEntry: DutEntry | null;
}

export default function DutModal({ open, onClose, dutEntry }: DutModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, fontSize: 15, fontWeight: 700 }}>
        {dutEntry
          ? `DUT ${String(dutEntry.number)} — ${dutEntry.title}`
          : 'Diretriz não encontrada'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.7, mb: 2 }}>
          {dutEntry?.criteria ?? 'Consulte o Anexo II da RN 465/2021.'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Fonte: {dutEntry?.source ?? 'Anexo II — RN 465/2021'} (Diretrizes de Utilização para
          Cobertura de Procedimentos na Saúde Suplementar)
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
