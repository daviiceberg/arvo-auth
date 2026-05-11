'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type OpmeFormMaterial, materialTotalValue } from '@/modules/new-request/types/opme';

interface OpmeFinancialSummaryProps {
  materials: OpmeFormMaterial[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function OpmeFinancialSummary({ materials }: OpmeFinancialSummaryProps) {
  const total = materials.reduce((sum, m) => sum + materialTotalValue(m), 0);

  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '16px',
        p: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, mb: 1.5 }}>
        Resumo Financeiro
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {materials.map((m, index) => {
          const lineTotal = materialTotalValue(m);
          const label = m.materialDescription.trim() || `Material ${String(index + 1)}`;
          return (
            <Box key={m.id} sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                {label}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
                {lineTotal > 0 ? formatCurrency(lineTotal) : '—'}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          Total estimado
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 16, color: 'primary.main' }}>
          {formatCurrency(total)}
        </Typography>
      </Box>
    </Box>
  );
}
