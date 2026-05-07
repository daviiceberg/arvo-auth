'use client';

import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type InjunctionContext } from '@/types/pedido';

interface InjunctionBannerProps {
  context: InjunctionContext;
}

const INJUNCTION_PURPLE = '#5b21b6';
const INJUNCTION_BG = 'rgba(91,33,182,0.08)';

export default function InjunctionBanner({ context }: InjunctionBannerProps) {
  return (
    <Alert
      severity="warning"
      icon={<GavelOutlinedIcon sx={{ color: INJUNCTION_PURPLE }} />}
      sx={{
        mb: 0,
        borderRadius: 2,
        border: `1px solid ${INJUNCTION_PURPLE}`,
        backgroundColor: INJUNCTION_BG,
        color: 'text.primary',
        '& .MuiAlert-message': { width: '100%' },
        '& .MuiAlert-icon': { color: INJUNCTION_PURPLE },
      }}
    >
      <AlertTitle sx={{ fontWeight: 700, color: INJUNCTION_PURPLE }}>
        Liminar Judicial ativa — atenção obrigatória
      </AlertTitle>
      <Box sx={{ mt: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            mb: 0.75,
            color: INJUNCTION_PURPLE,
          }}
        >
          Decisão judicial impõe autorização — negativa requer justificativa explícita
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
          <strong>Processo:</strong> {context.processNumber}
          {context.court ? ` · ${context.court}` : ''}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
          <strong>Escopo:</strong> {context.scope}
        </Typography>
        {context.validUntil ? (
          <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
            Válida até <strong>{context.validUntil}</strong>
          </Typography>
        ) : null}
        {context.notes ? (
          <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
            {context.notes}
          </Typography>
        ) : null}
      </Box>
    </Alert>
  );
}
