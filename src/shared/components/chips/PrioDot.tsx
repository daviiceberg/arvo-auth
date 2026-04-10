'use client';

import Box from '@mui/material/Box';

const prioColorMap: Record<string, string> = {
  alta: '#d4183d',
  media: '#b45309',
  baixa: '#16a34a',
};

interface PrioDotProps {
  prioridade: 'alta' | 'media' | 'baixa';
}

export default function PrioDot({ prioridade }: PrioDotProps) {
  const color = prioColorMap[prioridade] ?? '#6b7280';

  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}
