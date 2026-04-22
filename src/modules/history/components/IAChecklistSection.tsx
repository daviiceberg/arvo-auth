'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type ChecklistItem } from '@/types/pedido';

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
  if (iaChecklist.length === 0) return null;

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
        {iaChecklist.map((item) => (
          <Box key={item.texto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
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
    </Box>
  );
}
