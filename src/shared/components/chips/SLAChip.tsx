'use client';

import Chip from '@mui/material/Chip';

import { slaColorMap } from '@/shared/constants';
import { type SLAStatus } from '@/types/pedido';

interface SLAChipProps {
  status: SLAStatus;
  label: string;
  size?: 'small' | 'medium';
}

export default function SLAChip({ status, label, size = 'small' }: SLAChipProps) {
  const colors = slaColorMap[status];

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        fontSize: 12,
        height: 22,
      }}
    />
  );
}
