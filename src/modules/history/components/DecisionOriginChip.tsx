'use client';

import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Chip from '@mui/material/Chip';

import { type DecisionOrigin } from '@/types/pedido';

interface DecisionOriginChipProps {
  origin: DecisionOrigin;
}

export default function DecisionOriginChip({ origin }: DecisionOriginChipProps) {
  if (origin === 'ia_automatica') {
    return (
      <Chip
        icon={<SmartToyIcon sx={{ fontSize: 13, color: 'info.main' }} />}
        label="IA Automática"
        size="small"
        sx={{
          backgroundColor: 'rgba(37,99,235,0.08)',
          color: 'info.main',
          fontSize: 12,
          fontWeight: 700,
          height: 22,
        }}
      />
    );
  }
  return (
    <Chip
      icon={<PersonIcon sx={{ fontSize: 13, color: '#5a6070 !important' }} />}
      label="Analista"
      size="small"
      sx={{
        backgroundColor: 'rgba(0,0,0,0.06)',
        color: '#374151',
        fontSize: 12,
        fontWeight: 700,
        height: 22,
      }}
    />
  );
}
