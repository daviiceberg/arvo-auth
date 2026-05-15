'use client';

import { useState } from 'react';

import HistoryIcon from '@mui/icons-material/History';
import QueueIcon from '@mui/icons-material/Queue';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { type EligibleParent } from '../hooks/useEligibleParentRequests';

interface ParentRequestSelectorDialogProps {
  open: boolean;
  eligible: EligibleParent[];
  onClose: () => void;
  onSelect: (parent: EligibleParent) => void;
}

function SourceBadge({ source }: { source: EligibleParent['source'] }) {
  const config =
    source === 'queue'
      ? { label: 'Em análise', icon: <QueueIcon sx={{ fontSize: 12 }} />, color: '#2563eb' }
      : { label: 'Histórico', icon: <HistoryIcon sx={{ fontSize: 12 }} />, color: '#6b7280' };
  return (
    <Chip
      label={config.label}
      icon={config.icon}
      size="small"
      sx={{
        fontSize: 11,
        height: 20,
        backgroundColor: `${config.color}15`,
        color: config.color,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}

interface ItemProps {
  parent: EligibleParent;
  selected: boolean;
  onClick: () => void;
}

function ParentItem({ parent, selected, onClick }: ItemProps) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'rgba(0,0,0,0.08)',
        borderRadius: 1.5,
        cursor: 'pointer',
        backgroundColor: selected ? 'rgba(144,43,41,0.04)' : 'transparent',
        transition: 'all 150ms ease',
        '&:hover': {
          backgroundColor: selected ? 'rgba(144,43,41,0.06)' : 'rgba(0,0,0,0.02)',
          borderColor: selected ? 'primary.main' : 'rgba(0,0,0,0.16)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'primary.main' }}
        >
          {parent.id}
        </Typography>
        <SourceBadge source={parent.source} />
        <Chip
          label={parent.status}
          size="small"
          sx={{ fontSize: 11, height: 20, backgroundColor: 'rgba(0,0,0,0.05)' }}
        />
      </Box>
      <Typography variant="body2" sx={{ fontSize: 12, mb: 0.25 }}>
        {parent.procedure}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {parent.category} · {parent.protocolDate}
      </Typography>
    </Box>
  );
}

export default function ParentRequestSelectorDialog({
  open,
  eligible,
  onClose,
  onSelect,
}: ParentRequestSelectorDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    const chosen = eligible.find((p) => p.id === selectedId);
    if (chosen) {
      onSelect(chosen);
      setSelectedId(null);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 700 }}>
        Selecionar pedido anterior para vincular
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 2 }}>
          {eligible.length} pedido(s) elegível(eis) do mesmo beneficiário e categoria. O pedido
          atual será vinculado como complementar.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {eligible.map((parent) => (
            <ParentItem
              key={parent.id}
              parent={parent}
              selected={selectedId === parent.id}
              onClick={() => {
                setSelectedId(parent.id);
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" size="small">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="small"
          disabled={selectedId === null}
        >
          Vincular pedido selecionado
        </Button>
      </DialogActions>
    </Dialog>
  );
}
