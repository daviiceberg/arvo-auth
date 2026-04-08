'use client';

import Chip from '@mui/material/Chip';

import { categoryColorMap } from '@/shared/constants';
import { type Categoria } from '@/types/pedido';

interface CategoryChipProps {
  category: Categoria;
  size?: 'small' | 'medium';
}

export default function CategoryChip({ category, size = 'small' }: CategoryChipProps) {
  const colors = categoryColorMap[category];

  return (
    <Chip
      label={category}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        height: 22,
      }}
    />
  );
}
