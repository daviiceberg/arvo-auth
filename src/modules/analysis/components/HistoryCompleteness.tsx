'use client';

import React from 'react';

import Chip from '@mui/material/Chip';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

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

interface HistoryCompletenessProps {
  completeness: ConsolidatedHistory['completeness'];
}

export default function HistoryCompleteness({ completeness }: HistoryCompletenessProps) {
  const cp = completenessLabel(completeness);
  return (
    <Chip
      label={cp.label}
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: cp.bg,
        color: cp.color,
      }}
    />
  );
}
