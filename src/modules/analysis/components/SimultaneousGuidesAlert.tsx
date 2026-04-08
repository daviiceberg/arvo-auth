'use client'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

import { pedidos, type Pedido } from '@/data/pedidos'

interface SimultaneousGuidesAlertProps {
  pedido: Pedido
}

export default function SimultaneousGuidesAlert({ pedido }: SimultaneousGuidesAlertProps) {
  const outros = pedidos.filter(
    p => p.id !== pedido.id &&
    p.beneficiario.carteirinha === pedido.beneficiario.carteirinha &&
    (p.status === 'Em Análise' || p.status === 'Devolutiva')
  )
  if (outros.length === 0) return null
  return (
    <Alert
      severity="warning"
      icon={<WarningAmberIcon fontSize="small" />}
      sx={{ borderRadius: 2, border: '1px solid rgba(245,158,11,0.35)' }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
        {outros.length} guia{outros.length > 1 ? 's' : ''} simultânea{outros.length > 1 ? 's' : ''} em aberto para este beneficiário
      </Typography>
      <Typography variant="caption">
        {outros.map(o => `${o.id} (${o.status})`).join(' · ')}
      </Typography>
    </Alert>
  )
}
