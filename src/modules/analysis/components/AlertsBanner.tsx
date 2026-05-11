'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { alertOutlines } from '@/shared/constants';
import { type Request } from '@/types/pedido';

interface AlertsBannerProps {
  request: Request;
}

/**
 * Alertas que possuem banner detalhado próprio (InjunctionBanner, NipBanner,
 * PendencyBanner, SLAChip etc) são suprimidos aqui para evitar duplicação.
 * Match feito por substring case-insensitive contra o texto do alerta.
 */
function isRedundantAlert(alert: string, request: Request): boolean {
  const a = alert.toLowerCase().trim();
  if (request.injunction && (a.includes('liminar') || a.includes('judicial'))) return true;
  if (request.nip && a.includes('nip')) return true;
  if (request.pendencyContext && a.includes('pendência')) return true;
  if (request.slaStatus === 'violated' && a.includes('sla violado')) return true;
  return false;
}

export default function AlertsBanner({ request }: AlertsBannerProps) {
  const filtered = request.alerts.filter((a) => !isRedundantAlert(a, request));
  if (filtered.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {filtered.map((alert) => (
        <Alert
          key={alert}
          severity="error"
          icon={<WarningAmberIcon fontSize="small" />}
          sx={{ borderRadius: 2, border: alertOutlines.error }}
        >
          <Typography variant="body2" fontWeight={600}>
            {alert}
          </Typography>
        </Alert>
      ))}
    </Box>
  );
}
