'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { type Pedido } from '@/data/pedidos'

interface ObservationsSectionProps {
  pedido: Pedido
}

export default function ObservationsSection({ pedido }: ObservationsSectionProps) {
  if (!pedido.observacoes) return null
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Observações do Solicitante
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {pedido.observacoes}
        </Typography>
      </CardContent>
    </Card>
  )
}
