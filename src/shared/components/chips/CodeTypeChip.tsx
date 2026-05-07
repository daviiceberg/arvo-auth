'use client';

import Chip from '@mui/material/Chip';

import { codeTypeColorMap } from '@/shared/constants';
import { type CodeType } from '@/types/procedure-codes';

import { CHIP_BASE_SX } from './chip-styles';

const LABEL_MAP: Record<CodeType, string> = {
  TUSS: 'TUSS',
  PACKAGE: 'Pacote',
};

interface CodeTypeChipProps {
  codeType: CodeType;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

export default function CodeTypeChip({ codeType, size = 'small', onClick }: CodeTypeChipProps) {
  const colors = codeTypeColorMap[codeType];

  return (
    <Chip
      label={LABEL_MAP[codeType]}
      size={size}
      onClick={onClick}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: colors.bg,
        color: colors.text,
        cursor: onClick ? 'pointer' : 'default',
      }}
    />
  );
}
