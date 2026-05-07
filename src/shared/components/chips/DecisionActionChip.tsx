'use client';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import ReplayIcon from '@mui/icons-material/Replay';
import Chip from '@mui/material/Chip';

import { decisionActionConfigMap } from '@/shared/constants/decision-action-colors';
import { type DecisionAction } from '@/types/pedido';

import { CHIP_BASE_SX, CHIP_ICON_FONT_SIZE } from './chip-styles';

const decisionIconMap: Record<DecisionAction, React.ReactNode> = {
  Aprovado: <CheckCircleIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  Negado: <CancelIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  'Aprovado Parcial': <CallSplitIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  Devolutiva: <ReplayIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  'Junta Médica': <GroupsIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
};

interface DecisionActionChipProps {
  action: DecisionAction;
  size?: 'small' | 'medium';
}

export default function DecisionActionChip({ action, size = 'small' }: DecisionActionChipProps) {
  const config = decisionActionConfigMap[action];
  const icon = decisionIconMap[action];

  return (
    <Chip
      icon={icon as React.ReactElement}
      label={config.label}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: config.bg,
        color: config.color,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}
