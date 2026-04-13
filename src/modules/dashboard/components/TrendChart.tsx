'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type MonthlyTrendItem } from '../types';

interface TrendChartProps {
  data: MonthlyTrendItem[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const maxVal = Math.max(...data.map((d) => d.aprovados + d.negados), 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 0.75, minHeight: 160 }}>
        {data.map((d) => (
          <Box
            key={d.mes}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.25,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                justifyContent: 'flex-end',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: `${String((d.negados / maxVal) * 140)}px`,
                  minHeight: 3,
                  backgroundColor: 'error.main',
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.8,
                }}
                title={`Negados: ${String(d.negados)}`}
              />
              <Box
                sx={{
                  width: '100%',
                  height: `${String((d.aprovados / maxVal) * 140)}px`,
                  minHeight: 4,
                  backgroundColor: 'success.main',
                  borderRadius: '2px 2px 0 0',
                }}
                title={`Aprovados: ${String(d.aprovados)}`}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
              {d.mes}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: 'success.main' }}
          />
          <Typography variant="caption" sx={{ fontSize: 12 }}>
            Aprovações
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: 'error.main' }} />
          <Typography variant="caption" sx={{ fontSize: 12 }}>
            Negações
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
