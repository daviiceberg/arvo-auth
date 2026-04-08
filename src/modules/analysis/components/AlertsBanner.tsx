'use client'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { type Pedido } from '@/data/pedidos'

interface AlertsBannerProps {
  pedido: Pedido
}

export default function AlertsBanner({ pedido }: AlertsBannerProps) {
  if (pedido.alertas.length === 0) return null
  const alertCount = pedido.alertas.length
  return (
    <Box>
      <Alert
        severity={pedido.alertas.includes('Liminar Judicial') ? 'warning' : 'error'}
        icon={<WarningAmberIcon fontSize="small" />}
        sx={{ borderRadius: 2, border: pedido.alertas.includes('Liminar Judicial') ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(212,24,61,0.3)' }}
      >
        <Typography variant="body2" fontWeight={600}>
          {alertCount} alerta{alertCount > 1 ? 's' : ''} identificado{alertCount > 1 ? 's' : ''} neste pedido.
        </Typography>
        <Typography variant="caption">
          {pedido.alertas.join(' · ')}
        </Typography>
      </Alert>
    </Box>
  )
}
