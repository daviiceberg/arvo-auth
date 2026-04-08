'use client';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import Chip from '@mui/material/Chip';

import { decisionActionConfigMap } from '@/shared/constants/decision-action-colors';
import { type DecisaoAcao } from '@/types/pedido';

const decisionIconMap: Record<DecisaoAcao, React.ReactNode> = {
  Aprovado: <CheckCircleIcon sx={{ fontSize: 13 }} />,
  Negado: <CancelIcon sx={{ fontSize: 13 }} />,
  'Aprovado Parcial': <CallSplitIcon sx={{ fontSize: 13 }} />,
  Devolutiva: <ReplayIcon sx={{ fontSize: 13 }} />,
};

interface DecisionActionChipProps {
  action: DecisaoAcao;
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
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 700,
        fontSize: 12,
        height: 22,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}
