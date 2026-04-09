'use client'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { type Pedido } from '@/data/pedidos'

interface AlertsBannerProps {
  request: Pedido
}

export default function AlertsBanner({ request }: AlertsBannerProps) {
  if (request.alertas.length === 0) return null
  const alertCount = request.alertas.length
  return (
    <Box>
      <Alert
        severity={request.alertas.includes('Liminar Judicial') ? 'warning' : 'error'}
        icon={<WarningAmberIcon fontSize="small" />}
        sx={{ borderRadius: 2, border: request.alertas.includes('Liminar Judicial') ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(212,24,61,0.3)' }}
      >
        <Typography variant="body2" fontWeight={600}>
          {alertCount} alerta{alertCount > 1 ? 's' : ''} identificado{alertCount > 1 ? 's' : ''} neste pedido.
        </Typography>
        <Typography variant="caption">
          {request.alertas.join(' · ')}
        </Typography>
      </Alert>
    </Box>
  )
}
