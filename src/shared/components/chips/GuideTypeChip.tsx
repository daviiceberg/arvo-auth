'use client';

import Chip from '@mui/material/Chip';

import { guideTypeColorMap } from '@/shared/constants';
import { type GuideType } from '@/types/pedido';

import { CHIP_BASE_SX } from './chip-styles';

interface GuideTypeChipProps {
  type: GuideType;
  size?: 'small' | 'medium';
}

export default function GuideTypeChip({ type, size = 'small' }: GuideTypeChipProps) {
  const colors = guideTypeColorMap[type];

  return (
    <Chip
      label={type}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    />
  );
}
