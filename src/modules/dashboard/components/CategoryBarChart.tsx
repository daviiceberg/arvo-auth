'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type BarDataItem } from '../types';

interface CategoryBarChartProps {
  barData: BarDataItem[];
  maxBar: number;
}

export default function CategoryBarChart({ barData, maxBar }: CategoryBarChartProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        {barData.map((d) => (
          <Box
            key={d.label}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/fila?categoria=${encodeURIComponent(d.categoria)}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?categoria=${encodeURIComponent(d.categoria)}`); } }}
            aria-label={`Ver ${d.total} pedidos de ${d.categoria}`}
            onMouseEnter={() => setHovered(d.label)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: hovered && hovered !== d.label ? 0.5 : 1,
              transition: 'opacity 150ms ease, background-color 150ms ease',
              cursor: 'pointer',
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              mx: -0.5,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
              '&:focus-visible': { outline: `2px solid ${d.color}`, outlineOffset: 2 },
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', width: 68, flexShrink: 0, textAlign: 'right' }}>
              {d.label}
            </Typography>
            <Box sx={{ flex: 1, height: 16, borderRadius: 1, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.04)' }}>
              <Box
                sx={{
                  width: `${(d.total / maxBar) * 100}%`,
                  height: '100%',
                  backgroundColor: d.color,
                  transition: 'width 600ms ease',
                }}
                title={`${d.label}: ${d.total} pedidos`}
              />
            </Box>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', width: 20, textAlign: 'right', flexShrink: 0 }}>
              {d.total}
            </Typography>
            <ChevronRightIcon sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
