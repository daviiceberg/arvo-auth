'use client';

import GroupsIcon from '@mui/icons-material/Groups';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

interface JuntaParecerCardProps {
  entry: HistoryEntry;
}

const PURPLE_BG = 'rgba(124,58,237,0.06)';
const PURPLE_BORDER = 'rgba(124,58,237,0.2)';
const PURPLE_DARK = '#6d28d9';
const PURPLE_TEXT = '#4c1d95';

export default function JuntaParecerCard({ entry }: JuntaParecerCardProps) {
  const parecer = entry.juntaParecer;
  if (!parecer) return null;

  return (
    <Card
      sx={{
        backgroundColor: PURPLE_BG,
        border: `1px solid ${PURPLE_BORDER}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <GroupsIcon sx={{ fontSize: 22, color: PURPLE_DARK, mt: 0.25, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: PURPLE_TEXT }}>
                Parecer Técnico da Junta Médica
              </Typography>
              <Chip
                label="Insumo argumentativo da decisão"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: 'rgba(124,58,237,0.12)',
                  color: PURPLE_DARK,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              Documento de fundamentação — não substitui a decisão do analista
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: PURPLE_BORDER }} />
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: 'text.primary' }}>
            {parecer.text}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: PURPLE_BORDER }} />
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            Desempatador: <strong>{parecer.desempatadorName}</strong>
            {parecer.desempatadorCrm ? ` (${parecer.desempatadorCrm})` : ''} · Emitido em{' '}
            <strong>{parecer.issuedAt}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
