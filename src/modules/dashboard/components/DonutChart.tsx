'use client';

import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type UrgencySegment } from '../types';

interface DonutChartProps {
  segments: UrgencySegment[];
}

export default function DonutChart({ segments }: DonutChartProps) {
  const router = useRouter();
  const total = segments.reduce((s, d) => s + d.count, 0);
  const r = 56;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = segments
    .filter((d) => d.count > 0)
    .map((d) => {
      const pct = d.count / total;
      const offset = circumference * (1 - cumulative);
      const dashLen = circumference * pct;
      cumulative += pct;
      return { ...d, dashLen, offset };
    });

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 140 140" role="img" aria-label={`Urgência: ${segments.map((d) => `${d.label} ${String(d.count)}`).join(', ')}`}>
          {slices.map((s) => (
            <circle
              key={s.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${String(s.dashLen)} ${String(circumference - s.dashLen)}`}
              strokeDashoffset={s.offset}
              transform={`rotate(-90 ${String(cx)} ${String(cy)})`}
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1a1a1a">
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fill="#5a6070">
            pedidos ativos
          </text>
        </svg>
      </Box>
      {/* Legend — 4 clickable items */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', width: '100%', mt: 1.5 }}>
        {segments.map((d) => (
          <Box
            key={d.key}
            role="button"
            tabIndex={0}
            onClick={() => { router.push(d.url); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(d.url); } }}
            aria-label={`Ver ${String(d.count)} pedidos ${d.label}`}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', borderRadius: 1, p: 0.25, '&:hover': { backgroundColor: `${d.color}12` }, '&:focus-visible': { outline: `2px solid ${d.color}`, outlineOffset: 1 } }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: d.color, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', flex: 1 }} noWrap>
              {d.label}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary', flexShrink: 0 }}>
              {d.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
