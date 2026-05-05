'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { alertOutlines } from '@/shared/constants';
import { type PendencyContext, type SubStatus } from '@/types/pedido';

import { PENDENCY_REASONS } from '../constants/pendency-reasons';

interface PendencyBannerProps {
  subStatus: SubStatus;
  context: PendencyContext;
  onSimulateReturn?: () => void;
  onReviewReturn?: () => void;
}

function reasonLabel(id: string): string {
  return PENDENCY_REASONS.find((r) => r.id === id)?.label ?? id;
}

export default function PendencyBanner({
  subStatus,
  context,
  onSimulateReturn,
  onReviewReturn,
}: PendencyBannerProps) {
  const isAwaiting = subStatus === 'PENDENTE_AGUARDANDO';
  const isReturned = subStatus === 'PENDENTE_RETORNO_RECEBIDO';

  return (
    <Alert
      severity={isAwaiting ? 'warning' : 'info'}
      icon={isAwaiting ? <HourglassTopIcon /> : <MarkEmailReadIcon />}
      sx={{
        mb: 0,
        borderRadius: 2,
        border: isAwaiting ? alertOutlines.warning : alertOutlines.info,
      }}
      action={
        isAwaiting && onSimulateReturn ? (
          <Button color="inherit" size="small" onClick={onSimulateReturn} sx={{ fontSize: 12 }}>
            Processar retorno do prestador
          </Button>
        ) : isReturned && onReviewReturn ? (
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={onReviewReturn}
            sx={{ fontSize: 12 }}
          >
            Revisar retorno
          </Button>
        ) : null
      }
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        {isAwaiting
          ? 'Pedido pendenciado — aguardando retorno do prestador'
          : 'Retorno do prestador recebido — pronto para revisão'}
      </AlertTitle>
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            mb: 0.5,
          }}
        >
          {isReturned ? 'Itens recebidos do prestador' : 'Itens pendentes'}
        </Typography>
        {isReturned ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
            {context.reasons.map((id) => (
              <Box key={id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />
                <Typography component="span" sx={{ fontSize: 13 }}>
                  {reasonLabel(id)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 1 }}>
            {context.reasons.map((id) => (
              <Box component="li" key={id} sx={{ fontSize: 13 }}>
                {reasonLabel(id)}
              </Box>
            ))}
          </Box>
        )}
        {!isReturned ? (
          <Typography variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
            <strong>Justificativa:</strong> {context.justification}
          </Typography>
        ) : null}
        <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 1 }}>
          Pendenciado em <strong>{context.requestedAt}</strong> · Prazo:{' '}
          <strong>{context.deadlineBusinessDays} dias úteis</strong>
          {context.responseReceivedAt ? ` · Retornado em ${context.responseReceivedAt}` : ''}
        </Typography>
      </Box>
    </Alert>
  );
}
