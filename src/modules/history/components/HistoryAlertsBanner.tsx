'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

interface HistoryAlertsBannerProps {
  entry: HistoryEntry;
}

export default function HistoryAlertsBanner({ entry }: HistoryAlertsBannerProps) {
  const alerts = entry.alerts ?? [];
  if (alerts.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {alerts.map((alert) => (
        <Alert
          key={alert}
          severity="error"
          icon={<WarningAmberIcon fontSize="small" />}
          sx={{
            borderRadius: 2,
            border: '1px solid rgba(212,24,61,0.3)',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {alert}
          </Typography>
        </Alert>
      ))}
    </Box>
  );
}
