'use client'

import { useRouter } from 'next/navigation'

import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { type Pedido } from '@/data/pedidos'

interface BeneficiarySectionProps {
  pedido: Pedido
}

export default function BeneficiarySection({ pedido }: BeneficiarySectionProps) {
  const b = pedido.beneficiario
  const router = useRouter()
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
          Beneficiário
        </Typography>

        {/* Row 1: nome + chips | botão */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
              {b.nome}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${String(b.idade)} anos`}
                size="small"
                sx={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#6b7280', fontWeight: 600, height: 22, fontSize: 12 }}
              />
              <Chip
                icon={b.sexo === 'M'
                  ? <MaleIcon sx={{ fontSize: 14, color: '#1d4ed8' }} />
                  : <FemaleIcon sx={{ fontSize: 14, color: '#be185d' }} />
                }
                label={b.sexo === 'M' ? 'Masculino' : 'Feminino'}
                size="small"
                sx={{
                  backgroundColor: b.sexo === 'M' ? 'rgba(29,78,216,0.08)' : 'rgba(190,24,93,0.08)',
                  color: b.sexo === 'M' ? '#1d4ed8' : '#be185d',
                  fontWeight: 600, height: 22, fontSize: 12,
                }}
              />
            </Box>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => { router.push(`/fila?beneficiario=${encodeURIComponent(b.nome)}`); }}
            sx={{ fontSize: 12, py: 0.5, flexShrink: 0, color: 'primary.main', borderColor: 'rgba(144,43,41,0.35)', whiteSpace: 'nowrap' }}
          >
            Ver todas as guias deste beneficiário →
          </Button>
        </Box>

        {/* Row 2: dados em grid horizontal */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', pt: 2.5, mt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {[
            { label: 'Carteirinha', value: b.carteirinha },
            { label: 'CPF', value: b.cpf },
            { label: 'Nascimento', value: b.dataNascimento },
            { label: 'Plano', value: b.plano },
          ].map(f => (
            <Box key={f.label}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', mb: 0.5 }}>
                {f.label}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                {f.value}
              </Typography>
            </Box>
          ))}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', mb: 0.5 }}>
              Carência
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, color: b.carencia ? '#b45309' : '#16a34a' }}>
              {b.carencia ? 'Em carência' : 'Sem carência'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
