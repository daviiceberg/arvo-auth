'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Helpers ----
function patternLabel(p: ConsolidatedHistory['linhaDoTempo']['padrao']): string {
  switch (p) {
    case 'first_time':
      return 'Primeira solicitação';
    case 'recurrent':
      return 'Uso recorrente (regular)';
    case 'frequent':
      return 'Uso frequente (acima da média)';
  }
}

// ---- Component ----
interface HistoryTimelineProps {
  timeline: ConsolidatedHistory['linhaDoTempo'];
  assistedReading: string;
}

export default function HistoryTimeline({ timeline, assistedReading }: HistoryTimelineProps) {
  return (
    <>
      {/* Linha do Tempo */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(37,99,235,0.04)',
          border: '1px solid rgba(37,99,235,0.12)',
          mb: 2,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{
            textTransform: 'uppercase',
            fontSize: 12,
            letterSpacing: 0.5,
            display: 'block',
            mb: 0.75,
          }}
        >
          Linha do Tempo
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Última solicitação similar
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
              {timeline.ultimaSolicitacaoSimilar ?? '— Nenhuma'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Padrão de uso
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
              {patternLabel(timeline.padrao)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Leitura Assistida */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(14,165,233,0.06)',
          border: '1px solid rgba(14,165,233,0.15)',
          mb: 2.5,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{
            textTransform: 'uppercase',
            fontSize: 12,
            letterSpacing: 0.5,
            display: 'block',
            mb: 0.5,
          }}
        >
          Leitura Assistida
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.6 }}>
          {assistedReading}
        </Typography>
      </Box>
    </>
  );
}
