'use client';

import Chip from '@mui/material/Chip';

import { slaColorMap } from '@/shared/constants';
import { type SLAStatus } from '@/types/pedido';

import { CHIP_BASE_SX } from './chip-styles';

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
        ...CHIP_BASE_SX,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    />
  );
}
