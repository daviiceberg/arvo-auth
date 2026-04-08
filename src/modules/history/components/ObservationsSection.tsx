'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { type HistoricoEntry } from '@/types/pedido';

interface ObservationsSectionProps {
  entry: HistoricoEntry;
}

export default function ObservationsSection({ entry }: ObservationsSectionProps) {
  if (!entry.observacoes) return null;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1.5, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}
        >
          Observações
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {entry.observacoes}
        </Typography>
      </CardContent>
    </Card>
  );
}
