'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { subStatusConfigMap } from '@/shared/constants/sub-status-config';
import { type SubStatus } from '@/types/pedido';

interface SubStatusLabelProps {
  subStatus: SubStatus;
}

export default function SubStatusLabel({ subStatus }: SubStatusLabelProps) {
  const config = subStatusConfigMap[subStatus];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.color,
          flexShrink: 0,
          ...(config.pulsing && {
            '@keyframes subStatusPulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.2 },
            },
            animation: 'subStatusPulse 1.6s ease-in-out infinite',
          }),
        }}
      />
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: config.color,
          lineHeight: 1,
          letterSpacing: 0.2,
          whiteSpace: 'nowrap',
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
}
