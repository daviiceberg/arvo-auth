'use client';

import Chip from '@mui/material/Chip';

type RequestType = 'continuidade' | 'primeira';

const requestTypeConfig: Record<RequestType, { label: string; bg: string; color: string }> = {
  continuidade: { label: 'Continuidade', bg: 'rgba(22,163,74,0.08)', color: '#16a34a' },
  primeira: { label: '1ª Solicitação', bg: 'rgba(37,99,235,0.08)', color: '#2563eb' },
};

interface RequestTypeChipProps {
  type: RequestType;
  size?: 'small' | 'medium';
}

export default function RequestTypeChip({ type, size = 'small' }: RequestTypeChipProps) {
  const config = requestTypeConfig[type];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: 10,
        height: 18,
      }}
    />
  );
}
