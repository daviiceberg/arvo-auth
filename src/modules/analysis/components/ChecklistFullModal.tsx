'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { type ChecklistItem, type ChecklistOrigin } from '@/types/pedido';

import {
  CHECKLIST_GROUP_LABELS,
  type ChecklistGroup,
  getChecklistGroup,
} from '@/mocks/tea-checklist-catalog';

interface ChecklistFullModalProps {
  open: boolean;
  items: ChecklistItem[];
  onClose: () => void;
}

const ORIGIN_LABEL: Record<ChecklistOrigin, string> = {
  ia: 'IA',
  dados: 'DADOS',
  engenharia: 'ENG',
};

const ORIGIN_COLOR: Record<ChecklistOrigin, { bg: string; color: string }> = {
  ia: { bg: 'rgba(37,99,235,0.1)', color: '#1d4ed8' },
  dados: { bg: 'rgba(22,163,74,0.12)', color: 'success.main' },
  engenharia: { bg: 'rgba(100,116,139,0.12)', color: '#475569' },
};

const STATUS_ICON: Record<ChecklistItem['status'], React.ReactNode> = {
  ok: <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.light' }} />,
  error: <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />,
};

const GROUP_ORDER: ChecklistGroup[] = [
  'identificacao',
  'diagnostico',
  'solicitante',
  'prestador',
  'procedimento',
  'historico',
  'regulatorio',
];

function groupItems(items: ChecklistItem[]): Map<ChecklistGroup, ChecklistItem[]> {
  const grouped = new Map<ChecklistGroup, ChecklistItem[]>();
  for (const group of GROUP_ORDER) grouped.set(group, []);
  for (const item of items) {
    const group = getChecklistGroup(item.id);
    grouped.get(group)?.push(item);
  }
  const statusOrder: Record<ChecklistItem['status'], number> = { error: 0, warning: 1, ok: 2 };
  for (const [, list] of grouped) {
    list.sort((a, b) => {
      const s = statusOrder[a.status] - statusOrder[b.status];
      if (s !== 0) return s;
      return (b.severity ?? 0) - (a.severity ?? 0);
    });
  }
  return grouped;
}

function OriginChip({ origin }: { origin: ChecklistOrigin }) {
  const style = ORIGIN_COLOR[origin];
  return (
    <Chip
      label={ORIGIN_LABEL[origin]}
      size="small"
      sx={{
        height: 18,
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.color,
        letterSpacing: 0.3,
      }}
    />
  );
}

function ChecklistFullRow({ item }: { item: ChecklistItem }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        py: 0.75,
        px: 0.5,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ mt: 0.25 }}>{STATUS_ICON[item.status]}</Box>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontSize: 13,
          color:
            item.status === 'error'
              ? 'error.main'
              : item.status === 'warning'
                ? 'warning.main'
                : 'text.primary',
          fontWeight: item.status !== 'ok' ? 600 : 500,
          lineHeight: 1.4,
        }}
      >
        {item.texto}
      </Typography>
      {item.origin ? <OriginChip origin={item.origin} /> : null}
    </Box>
  );
}

export default function ChecklistFullModal({ open, items, onClose }: ChecklistFullModalProps) {
  const grouped = groupItems(items);
  const negativeCount = items.filter((i) => i.status === 'error').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;
  const positiveCount = items.filter((i) => i.status === 'ok').length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, pb: 0.5 }}>
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
          Análises da IA — Visão completa
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
          {items.length} análises · {negativeCount} negativas · {warningCount} alertas ·{' '}
          {positiveCount} positivas
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          aria-label="Fechar"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        {GROUP_ORDER.map((group) => {
          const list = grouped.get(group) ?? [];
          if (list.length === 0) return null;
          return (
            <Box key={group} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  mb: 0.75,
                }}
              >
                {CHECKLIST_GROUP_LABELS[group]}
              </Typography>
              {list.map((item, idx) => (
                <ChecklistFullRow key={`${item.id ?? item.texto}-${String(idx)}`} item={item} />
              ))}
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
