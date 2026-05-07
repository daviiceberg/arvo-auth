'use client';

import Chip from '@mui/material/Chip';

import { categoryColorMap } from '@/shared/constants';
import { type Category } from '@/types/pedido';

import { CHIP_BASE_SX } from './chip-styles';

interface CategoryChipProps {
  category: Category;
  size?: 'small' | 'medium';
}

export default function CategoryChip({ category, size = 'small' }: CategoryChipProps) {
  const colors = categoryColorMap[category];

  return (
    <Chip
      label={category}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    />
  );
}
