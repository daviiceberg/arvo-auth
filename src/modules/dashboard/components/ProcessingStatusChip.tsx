'use client';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Chip from '@mui/material/Chip';

import { type ProcessingRequest } from '@/types/pedido';

interface ProcessingStatusChipProps {
  status: ProcessingRequest['statusProcessamento'];
}

export default function ProcessingStatusChip({ status }: ProcessingStatusChipProps) {
  if (status === 'em_processamento') {
    return (
      <Chip
        icon={
          <AutorenewOutlinedIcon
            sx={{
              fontSize: 14,
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
              },
              animation: 'spin 1.5s linear infinite',
            }}
          />
        }
        label="Processando..."
        size="small"
        sx={{
          backgroundColor: 'rgba(25,118,210,0.1)',
          color: 'rgb(25,118,210)',
          fontWeight: 600,
          fontSize: 12,
        }}
      />
    );
  }

  return (
    <Chip
      icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} />}
      label="Erro — reprocessar"
      size="small"
      onClick={() => undefined}
      sx={{
        backgroundColor: 'rgba(211,47,47,0.1)',
        color: 'error.main',
        fontWeight: 600,
        fontSize: 12,
        cursor: 'pointer',
      }}
    />
  );
}
