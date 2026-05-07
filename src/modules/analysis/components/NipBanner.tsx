'use client';

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type NipContext } from '@/types/pedido';

interface NipBannerProps {
  context: NipContext;
}

const NIP_ORANGE = '#c2410c';
const NIP_BG = 'rgba(194,65,12,0.08)';

function statusLabel(status: NipContext['status']): string {
  switch (status) {
    case 'aberta':
      return 'Aberta';
    case 'respondida':
      return 'Respondida';
    case 'arquivada':
      return 'Arquivada';
  }
}

export default function NipBanner({ context }: NipBannerProps) {
  const isOpen = context.status === 'aberta';
  return (
    <Alert
      severity="warning"
      icon={<ReportProblemOutlinedIcon sx={{ color: NIP_ORANGE }} />}
      sx={{
        mb: 0,
        borderRadius: 2,
        border: `1px solid ${NIP_ORANGE}`,
        backgroundColor: NIP_BG,
        color: 'text.primary',
        '& .MuiAlert-message': { width: '100%' },
        '& .MuiAlert-icon': { color: NIP_ORANGE },
      }}
    >
      <AlertTitle sx={{ fontWeight: 700, color: NIP_ORANGE }}>
        NIP {statusLabel(context.status)} — Notificação ANS · RN 483/2022
      </AlertTitle>
      <Box sx={{ mt: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
          <strong>Nº NIP:</strong> {context.nipNumber}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 12, display: 'block' }}>
          Aberta em <strong>{context.openedAt}</strong> · Prazo ANS:{' '}
          <strong>{context.deadline}</strong>
          {isOpen ? ' · resposta obrigatória' : ''}
        </Typography>
        {context.reason ? (
          <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
            <strong>Motivo:</strong> {context.reason}
          </Typography>
        ) : null}
      </Box>
    </Alert>
  );
}
