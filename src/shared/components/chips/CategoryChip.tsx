'use client';

import Chip from '@mui/material/Chip';

import { categoryColorMap } from '@/shared/constants';
import { type Category } from '@/types/pedido';

import { CHIP_BASE_SX } from './chip-styles';

/**
 * Rótulos compactos para chips de categoria. Tipo Category preserva o nome
 * completo (compatibilidade com mocks/filtros/contratos); apenas o display
 * visual é abreviado quando necessário pra economizar largura.
 */
const CATEGORY_DISPLAY_LABEL: Record<Category, string> = {
  'Urgência/Emergência': 'Urgência/Emergência',
  Oncologia: 'Oncologia',
  Internação: 'Internação',
  'Cirurgias Eletivas': 'Cirurgias Eletivas',
  'Terapias Especiais': 'Terapias Especiais',
  SADT: 'SADT',
  'Exames Alta Complexidade': 'Exames AC',
  'Home Care': 'Home Care',
  OPME: 'OPME',
};

interface CategoryChipProps {
  category: Category;
  size?: 'small' | 'medium';
}

export default function CategoryChip({ category, size = 'small' }: CategoryChipProps) {
  const colors = categoryColorMap[category];

  return (
    <Chip
      label={CATEGORY_DISPLAY_LABEL[category]}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        height: 'auto',
        minHeight: CHIP_BASE_SX.height,
        width: 'fit-content',
        maxWidth: '100%',
        backgroundColor: colors.bg,
        color: colors.color,
        '& .MuiChip-label': {
          whiteSpace: 'normal',
          lineHeight: 1.15,
          py: 0.25,
          textAlign: 'left',
          display: 'inline-block',
        },
      }}
    />
  );
}
