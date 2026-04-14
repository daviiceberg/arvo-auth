'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type Elegibilidade } from '../types';

const DEFAULT_COLOR = { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' };

const ELIGIBILITY_COLORS: Record<string, { bg: string; color: string }> = {
  ativo: DEFAULT_COLOR,
  suspenso: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
  carencia: { bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
};

const ELIGIBILITY_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  carencia: 'Em carência',
};

function getEligibilityColor(status: string): { bg: string; color: string } {
  return ELIGIBILITY_COLORS[status] ?? DEFAULT_COLOR;
}

interface EligibilitySectionProps {
  elegibilidade: Elegibilidade;
}

export default function EligibilitySection({ elegibilidade }: EligibilitySectionProps) {
  const statusColor = getEligibilityColor(elegibilidade.status);

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
        Elegibilidade e Regras
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {/* Status elegibilidade */}
        <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.75,
            }}
          >
            Status Elegibilidade
          </Typography>
          <Chip
            label={ELIGIBILITY_LABELS[elegibilidade.status] ?? elegibilidade.status}
            size="small"
            sx={{
              backgroundColor: statusColor.bg,
              color: statusColor.color,
              fontWeight: 700,
              height: 22,
              fontSize: 12,
            }}
          />
        </Box>
        {/* Carencias */}
        <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.5,
            }}
          >
            Carências
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
            {elegibilidade.carencias ? 'Sim' : 'Não'}
          </Typography>
          {elegibilidade.detalhesCarencia ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {elegibilidade.detalhesCarencia}
            </Typography>
          ) : null}
        </Box>
        {/* Limites contratuais */}
        <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.5,
            }}
          >
            Limites Contratuais
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
            {elegibilidade.limitesContratuais}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
