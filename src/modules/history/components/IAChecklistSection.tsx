'use client';

import { useState } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type ChecklistItem } from '@/types/pedido';

import ChecklistFullModal from '@/modules/analysis/components/ChecklistFullModal';
import { rankChecklistItems } from '@/modules/analysis/utils/rank-checklist';

type ChecklistStatus = ChecklistItem['status'];

const STATUS_ICON_MAP: Record<ChecklistStatus, React.ReactNode> = {
  ok: (
    <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main', flexShrink: 0, mt: 0.15 }} />
  ),
  warning: (
    <WarningAmberIcon sx={{ fontSize: 15, color: 'warning.light', flexShrink: 0, mt: 0.15 }} />
  ),
  error: <CloseIcon sx={{ fontSize: 15, color: 'error.main', flexShrink: 0, mt: 0.15 }} />,
};

const STATUS_TEXT_COLOR: Record<ChecklistStatus, string> = {
  ok: 'text.primary',
  warning: 'warning.main',
  error: 'error.main',
};

interface IAChecklistSectionProps {
  iaChecklist: ChecklistItem[];
}

export default function IAChecklistSection({ iaChecklist }: IAChecklistSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  if (iaChecklist.length === 0) return null;

  const { visible, hidden, totalCount } = rankChecklistItems(iaChecklist);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 12,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1,
        }}
      >
        Checklist IA
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {visible.map((item, idx) => (
          <Box
            key={`${item.id ?? item.texto}-${String(idx)}`}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
          >
            {STATUS_ICON_MAP[item.status]}
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                fontWeight: item.status !== 'ok' ? 600 : 500,
                color: STATUS_TEXT_COLOR[item.status],
                lineHeight: 1.4,
              }}
            >
              {item.texto}
            </Typography>
          </Box>
        ))}
      </Box>
      {hidden.length > 0 ? (
        <Box
          component="button"
          onClick={() => {
            setModalOpen(true);
          }}
          sx={{
            mt: 1.5,
            p: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: 12,
            fontWeight: 600,
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Ver todas as {totalCount} análises
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      ) : null}
      <ChecklistFullModal
        open={modalOpen}
        items={iaChecklist}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
