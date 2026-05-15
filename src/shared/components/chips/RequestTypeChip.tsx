'use client';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { CHIP_BASE_SX } from './chip-styles';

type RequestType = 'continuidade' | 'primeira';

const requestTypeConfig: Record<RequestType, { label: string; bg: string; color: string }> = {
  continuidade: { label: 'Continuidade', bg: 'rgba(22,163,74,0.08)', color: '#16a34a' },
  primeira: { label: '1ª Solicitação', bg: 'rgba(37,99,235,0.08)', color: '#2563eb' },
};

interface RequestTypeChipProps {
  type: RequestType;
  parentRequestId?: string;
  size?: 'small' | 'medium';
}

export default function RequestTypeChip({
  type,
  parentRequestId,
  size = 'small',
}: RequestTypeChipProps) {
  // Exclusão mútua: pedidos complementares (com parentRequestId) substituem
  // o chip de Continuidade/1ª Solicitação. Complementar é a informação mais
  // acionável quando existe (leva ao pai) — evita poluir a coluna ID com
  // dois chips lado a lado.
  if (parentRequestId) {
    return (
      <Tooltip title={`Complementar a ${parentRequestId}`} placement="top">
        <Chip
          label="Complementar"
          size={size}
          sx={{
            ...CHIP_BASE_SX,
            backgroundColor: 'rgba(13,148,136,0.1)',
            color: '#0d9488',
          }}
        />
      </Tooltip>
    );
  }

  const config = requestTypeConfig[type];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        ...CHIP_BASE_SX,
        backgroundColor: config.bg,
        color: config.color,
      }}
    />
  );
}
