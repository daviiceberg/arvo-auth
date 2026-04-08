'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SlaWidgetProps {
  slaOk: number;
  slaWarning: number;
  slaViolados: number;
}

export default function SlaWidget({ slaOk, slaWarning, slaViolados }: SlaWidgetProps) {
  const total = slaOk + slaWarning + slaViolados;
  const pctOk = (slaOk / total) * 100;
  const pctWarn = (slaWarning / total) * 100;
  const pctViol = (slaViolados / total) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        {[
          { label: 'No prazo', value: slaOk, color: '#16a34a' },
          { label: 'Atenção', value: slaWarning, color: '#f59e0b' },
          { label: 'Violados', value: slaViolados, color: '#d4183d' },
        ].map((s) => (
          <Box key={s.label} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: '2px' }}>
        <Box sx={{ width: `${pctOk}%`, backgroundColor: '#16a34a', borderRadius: '4px 0 0 4px' }} />
        <Box sx={{ width: `${pctWarn}%`, backgroundColor: '#f59e0b' }} />
        <Box sx={{ width: `${pctViol}%`, backgroundColor: '#d4183d', borderRadius: '0 4px 4px 0' }} />
      </Box>
      <Typography variant="caption" sx={{ fontSize: 12, color: '#6b7280', mt: 0.75, display: 'block' }}>
        {total} pedidos ativos · {slaViolados} violações de prazo
      </Typography>
    </Box>
  );
}
