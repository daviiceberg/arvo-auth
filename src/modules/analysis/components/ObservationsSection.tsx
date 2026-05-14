'use client';

import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type Request } from '@/types/pedido';

interface ObservationsSectionProps {
  request: Request;
}

export default function ObservationsSection({ request }: ObservationsSectionProps) {
  if (!request.observations) return null;
  return (
    <CollapsibleCard title="Observações do Solicitante">
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {request.observations}
      </Typography>
    </CollapsibleCard>
  );
}
