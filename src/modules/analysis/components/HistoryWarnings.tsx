'use client';

import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Helpers ----
function alertSeverityColor(s: 'low' | 'medium' | 'high'): 'info' | 'warning' | 'error' {
  if (s === 'low') return 'info';
  if (s === 'medium') return 'warning';
  return 'error';
}

const SUPPRESSED_F84_KEYWORDS = [
  'alto volume',
  'limite de sessões',
  'quantidade acima',
  'alta utilização',
];

// ---- Component ----
interface HistoryWarningsProps {
  warnings: ConsolidatedHistory['sinaisAtencao'];
  request: Request;
}

export default function HistoryWarnings({ warnings, request }: HistoryWarningsProps) {
  const isF84 = request.procedures.some((p) => p.cid.startsWith('F84'));
  const isTerapias = request.category === 'Terapias Especiais';
  const filteredWarnings =
    isTerapias && isF84
      ? warnings.filter(
          (s) => !SUPPRESSED_F84_KEYWORDS.some((k) => s.mensagem.toLowerCase().includes(k)),
        )
      : warnings;
  const hasHighUseF84 =
    isTerapias &&
    isF84 &&
    warnings.some((s) => SUPPRESSED_F84_KEYWORDS.some((k) => s.mensagem.toLowerCase().includes(k)));

  if (filteredWarnings.length === 0 && !hasHighUseF84) return null;

  return (
    <>
      <Divider sx={{ mb: 2.5 }} />
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 12,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1.5,
        }}
      >
        Sinais de Atenção
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
        {hasHighUseF84 ? (
          <Alert
            severity="info"
            icon={<InfoOutlinedIcon fontSize="small" />}
            sx={{ borderRadius: 1.5, py: 0.5 }}
          >
            <Typography variant="caption" fontWeight={700} display="block">
              Alta frequência de sessões identificada
            </Typography>
            <Typography variant="caption">
              Para CID F84, RN 539/2022 garante cobertura ilimitada — volume elevado não é
              fundamento para negativa.
            </Typography>
          </Alert>
        ) : null}
        {filteredWarnings.map((sinal) => (
          <Alert
            key={sinal.id}
            severity={alertSeverityColor(sinal.severidade)}
            sx={{ borderRadius: 1.5, py: 0.5 }}
          >
            <Typography variant="caption" fontWeight={700} display="block">
              {sinal.mensagem}
            </Typography>
            {sinal.detalhes ? <Typography variant="caption">{sinal.detalhes}</Typography> : null}
          </Alert>
        ))}
      </Box>
    </>
  );
}
