'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { type DenialReason } from '../types';

interface TopDenialReasonsProps {
  reasons: DenialReason[];
  loading: boolean;
}

export default function TopDenialReasons({ reasons, loading }: TopDenialReasonsProps) {
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={28} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  const maxCount = reasons[0]?.count ?? 1;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}
    >
      {reasons.map((motivo, idx) => (
        <Box key={motivo.motivo} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: 'text.secondary',
              width: 14,
              flexShrink: 0,
              fontWeight: 700,
            }}
          >
            {idx + 1}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.25,
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }} noWrap>
                {motivo.motivo}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', ml: 1, flexShrink: 0 }}
              >
                {motivo.count}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${String((motivo.count / maxCount) * 100)}%`,
                  backgroundColor: motivo.color,
                  borderRadius: 5,
                  transition: 'width 600ms ease',
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
