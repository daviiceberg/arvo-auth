'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

interface IADecisionSectionProps {
  entry: HistoryEntry;
}

export default function IADecisionSection({ entry }: IADecisionSectionProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(37,99,235,0.04)',
        border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 2,
        p: 2,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <SmartToyIcon sx={{ fontSize: 16, color: 'info.main' }} />
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: 'info.main' }}>
          {entry.action === 'Aprovado'
            ? 'Aprovado automaticamente pela IA'
            : 'Negado automaticamente pela IA'}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, color: '#374151', lineHeight: 1.6, display: 'block' }}
      >
        {entry.decisionReason}
      </Typography>
      <Alert
        severity="info"
        sx={{ mt: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}
        icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}
      >
        Decisão automática registrada para fins de auditoria.
      </Alert>
    </Box>
  );
}
