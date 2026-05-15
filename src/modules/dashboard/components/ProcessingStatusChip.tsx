'use client';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Chip from '@mui/material/Chip';

import { type ProcessingRequest } from '@/types/pedido';

interface ProcessingStatusChipProps {
  status: ProcessingRequest['statusProcessamento'];
}

const spinKeyframes = {
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  animation: 'spin 1.5s linear infinite',
};

const chipConfig: Record<
  ProcessingRequest['statusProcessamento'],
  { label: string; icon: React.ReactNode; bg: string; color: string }
> = {
  em_processamento: {
    label: 'Processando...',
    icon: <AutorenewOutlinedIcon sx={{ fontSize: 14, ...spinKeyframes }} />,
    bg: 'rgba(25,118,210,0.1)',
    color: 'rgb(25,118,210)',
  },
  erro_processamento: {
    label: 'Erro no processamento',
    icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
    bg: 'rgba(212,24,61,0.1)',
    color: '#d4183d',
  },
  falhou_definitivamente: {
    label: 'Falhou definitivamente',
    icon: <BlockOutlinedIcon sx={{ fontSize: 14 }} />,
    bg: 'rgba(212,24,61,0.18)',
    color: '#7f1d1d',
  },
  descartado: {
    label: 'Descartado',
    icon: <CancelOutlinedIcon sx={{ fontSize: 14 }} />,
    bg: 'rgba(0,0,0,0.06)',
    color: '#5a6070',
  },
};

export default function ProcessingStatusChip({ status }: ProcessingStatusChipProps) {
  const { label, icon, bg, color } = chipConfig[status];
  return (
    <Chip
      icon={icon as React.ReactElement}
      label={label}
      size="small"
      sx={{
        backgroundColor: bg,
        color,
        fontWeight: 700,
        fontSize: 12,
        height: 22,
      }}
    />
  );
}
