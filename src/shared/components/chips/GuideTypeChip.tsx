'use client';

import Chip from '@mui/material/Chip';

import { guideTypeColorMap } from '@/shared/constants';
import { type TipoGuia } from '@/types/pedido';

interface GuideTypeChipProps {
  type: TipoGuia;
  size?: 'small' | 'medium';
}

export default function GuideTypeChip({ type, size = 'small' }: GuideTypeChipProps) {
  const colors = guideTypeColorMap[type];

  return (
    <Chip
      label={type}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        fontSize: 12,
        height: 20,
      }}
    />
  );
}
