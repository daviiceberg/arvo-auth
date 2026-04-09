'use client';

import Chip from '@mui/material/Chip';

import { statusColorMap } from '@/shared/constants';
import { type GuideStatus } from '@/types/pedido';

interface StatusChipProps {
  status: GuideStatus;
  size?: 'small' | 'medium';
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const colors = statusColorMap[status];

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        height: 22,
      }}
    />
  );
}
