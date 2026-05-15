'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useSlaPredictiveScore, { type SlaPredictiveScore } from '../hooks/useSlaPredictiveScore';

type StatusGeral = SlaPredictiveScore['statusGeral'];

const STATUS_COLOR: Record<StatusGeral, string> = {
  ok: 'success.main',
  atencao: 'warning.main',
  critico: 'error.main',
};

const STATUS_CHIP_CONFIG: Record<StatusGeral, { label: string; bg: string; color: string }> = {
  ok: {
    label: 'Fila sob controle',
    bg: 'rgba(22,163,74,0.12)',
    color: '#15803d',
  },
  atencao: {
    label: 'Considerar reforço',
    bg: 'rgba(245,158,11,0.14)',
    color: '#a16207',
  },
  critico: {
    label: 'Reforço necessário',
    bg: 'rgba(212,24,61,0.12)',
    color: '#d4183d',
  },
};

interface PredictiveBlockProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  centerValue?: boolean;
}

function PredictiveBlock({ label, value, subtitle, centerValue }: PredictiveBlockProps) {
  return (
    <Stack sx={{ flex: 1, minWidth: 0, height: '100%' }} spacing={0.5}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: 'text.secondary',
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      {centerValue === true ? <Box sx={{ pt: 1.5 }}>{value}</Box> : value}
      {subtitle !== undefined ? (
        <Typography variant="caption" sx={{ fontSize: 11, color: 'text.disabled' }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default function SlaPredictiveCard() {
  const score = useSlaPredictiveScore();
  const chip = STATUS_CHIP_CONFIG[score.statusGeral];
  const numberColor = STATUS_COLOR[score.statusGeral];

  return (
    <Card sx={{ py: 2, px: 3, mb: 2.5 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={3}
        alignItems="stretch"
        sx={{ minHeight: 72 }}
      >
        <PredictiveBlock
          label="Risco de violação SLA hoje"
          value={
            <Typography variant="h3" sx={{ fontSize: 32, fontWeight: 800, color: numberColor }}>
              {score.percentualRisco}%
            </Typography>
          }
        />
        <PredictiveBlock
          label="Em risco crítico"
          value={
            <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 700 }}>
              {score.emRiscoCritico} de {score.totalFila} pedidos
            </Typography>
          }
          subtitle={`${String(score.jaViolados)} já violado(s)`}
        />
        <PredictiveBlock
          label="Carga restante"
          value={
            <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 700 }}>
              ≈ {score.trabalhoRestanteHoras}h de trabalho
            </Typography>
          }
          subtitle={`${String(score.autorizadoresAtivos)} autorizadores ativos · ${String(score.capacidadeHoras)}h de capacidade`}
        />
        <PredictiveBlock
          label="Recomendação"
          centerValue
          value={
            <Chip
              label={chip.label}
              size="small"
              sx={{
                backgroundColor: chip.bg,
                color: chip.color,
                fontWeight: 700,
                height: 24,
                fontSize: 12,
              }}
            />
          }
        />
      </Stack>
    </Card>
  );
}
