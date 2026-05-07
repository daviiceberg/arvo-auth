'use client';

import Chip from '@mui/material/Chip';

import { iaSuggestionColorMap } from '@/shared/constants';
import { type IASuggestion } from '@/types/pedido';

import { CHIP_BASE_SX } from './chip-styles';

interface IASuggestionChipProps {
  suggestion: IASuggestion;
  size?: 'small' | 'medium';
}

export default function IASuggestionChip({ suggestion, size = 'small' }: IASuggestionChipProps) {
  const colors = iaSuggestionColorMap[suggestion];

  return (
    <Chip
      label={suggestion}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    />
  );
}
