'use client'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

import { pedidos, type Request } from '@/data/pedidos'

interface SimultaneousGuidesAlertProps {
  request: Request
}

export default function SimultaneousGuidesAlert({ request }: SimultaneousGuidesAlertProps) {
  const otherGuides = pedidos.filter(
    p => p.id !== request.id &&
    p.beneficiary.cardNumber === request.beneficiary.cardNumber &&
    (p.status === 'Em Análise' || p.status === 'Devolutiva')
  )
  if (otherGuides.length === 0) return null
  return (
    <Alert
      severity="warning"
      icon={<WarningAmberIcon fontSize="small" />}
      sx={{ borderRadius: 2, border: '1px solid rgba(245,158,11,0.35)' }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
        {otherGuides.length} guia{otherGuides.length > 1 ? 's' : ''} simultânea{otherGuides.length > 1 ? 's' : ''} em aberto para este beneficiário
      </Typography>
      <Typography variant="caption">
        {otherGuides.map(o => `${o.id} (${o.status})`).join(' · ')}
      </Typography>
    </Alert>
  )
}
