'use client';

import Chip from '@mui/material/Chip';

import { iaSuggestionColorMap } from '@/shared/constants';
import { type IASugestao } from '@/types/pedido';

interface IASuggestionChipProps {
  suggestion: IASugestao;
  size?: 'small' | 'medium';
}

export default function IASuggestionChip({ suggestion, size = 'small' }: IASuggestionChipProps) {
  const colors = iaSuggestionColorMap[suggestion];

  return (
    <Chip
      label={suggestion}
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
