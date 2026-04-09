'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type SinalAtencao } from '../types';

function getAlertSeverityColor(severity: 'low' | 'medium' | 'high'): 'info' | 'warning' | 'error' {
  if (severity === 'low') return 'info';
  if (severity === 'medium') return 'warning';
  return 'error';
}

interface AttentionSignalsSectionProps {
  sinaisAtencao: SinalAtencao[];
}

export default function AttentionSignalsSection({ sinaisAtencao }: AttentionSignalsSectionProps) {
  if (sinaisAtencao.length === 0) return null;

  return (
    <>
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
        {sinaisAtencao.map((sinal) => (
          <Alert
            key={sinal.id}
            severity={getAlertSeverityColor(sinal.severidade)}
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
