'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

interface AlertsBannerProps {
  request: Request;
}

export default function AlertsBanner({ request }: AlertsBannerProps) {
  if (request.alerts.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {request.alerts.map((alert) => (
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
