'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type HistoryEntry } from '@/types/pedido';

interface JuntaParecerCardProps {
  entry: HistoryEntry;
}

const PURPLE_BG = 'rgba(124,58,237,0.06)';
const PURPLE_BORDER = 'rgba(124,58,237,0.2)';
const PURPLE_DARK = '#6d28d9';

export default function JuntaParecerCard({ entry }: JuntaParecerCardProps) {
  const parecer = entry.juntaParecer;
  if (!parecer) return null;

  return (
    <CollapsibleCard
      title="Parecer Técnico da Junta Médica"
      cardSx={{
        backgroundColor: PURPLE_BG,
        border: `1px solid ${PURPLE_BORDER}`,
        boxShadow: 'none',
      }}
      headerRight={
        <Chip
          label="Insumo argumentativo da decisão"
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: 'rgba(124,58,237,0.12)',
            color: PURPLE_DARK,
          }}
        />
      }
    >
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5 }}>
        Documento de fundamentação — não substitui a decisão do analista
      </Typography>
      <Divider sx={{ borderColor: PURPLE_BORDER, mb: 2 }} />
      <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: 'text.primary', mb: 2 }}>
        {parecer.text}
      </Typography>
      <Divider sx={{ borderColor: PURPLE_BORDER, mb: 1.5 }} />
      <Box>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          Desempatador: <strong>{parecer.desempatadorName}</strong>
          {parecer.desempatadorCrm ? ` (${parecer.desempatadorCrm})` : ''} · Emitido em{' '}
          <strong>{parecer.issuedAt}</strong>
        </Typography>
      </Box>
    </CollapsibleCard>
  );
}
