'use client';

import React from 'react';

import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Helpers ----
function completenessLabel(c: ConsolidatedHistory['completeness']): {
  label: string;
  color: string;
  bg: string;
} {
  switch (c) {
    case 'complete':
      return { label: 'Histórico Completo', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' };
    case 'partial':
      return { label: 'Histórico Parcial', color: '#b45309', bg: 'rgba(245,158,11,0.1)' };
    case 'limited':
      return { label: 'Histórico Limitado', color: '#ea580c', bg: 'rgba(234,88,12,0.1)' };
  }
}

// ---- Component ----
interface HistoryCompletenessProps {
  completeness: ConsolidatedHistory['completeness'];
}

export default function HistoryCompleteness({ completeness }: HistoryCompletenessProps) {
  const cp = completenessLabel(completeness);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <HistoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          Histórico Consolidado
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip
          label={cp.label}
          size="small"
          sx={{
            backgroundColor: cp.bg,
            color: cp.color,
            fontWeight: 700,
            height: 22,
            fontSize: 12,
          }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
        Resumo assistencial e regulatório para suporte à decisão
      </Typography>
    </>
  );
}
