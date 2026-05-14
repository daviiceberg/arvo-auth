'use client';

import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type HistoryEntry } from '@/types/pedido';

interface ObservationsSectionProps {
  entry: HistoryEntry;
}

export default function ObservationsSection({ entry }: ObservationsSectionProps) {
  if (!entry.observations) return null;

  return (
    <CollapsibleCard title="Observações">
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {entry.observations}
      </Typography>
    </CollapsibleCard>
  );
}
