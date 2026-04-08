'use client'

import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GavelIcon from '@mui/icons-material/Gavel'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox'

import { type Pedido } from '@/data/pedidos'

interface PendencyBannerProps {
  pedido: Pedido
}

export default function PendencyBanner({ pedido }: PendencyBannerProps) {
  const [parecerExpanded, setParecerExpanded] = useState(false)

  const sub = pedido.subStatus

  // Legacy Devolutiva without subStatus
  if (pedido.status === 'Devolutiva' && !sub && pedido.pendenciaMotivos) {
    return (
      <Box>
        <Alert
          severity="warning"
          icon={<ErrorOutlineIcon fontSize="small" />}
          sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(245,158,11,0.35)' }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
            Pedido em pendência — aguardando documentação complementar
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Pendenciado por <strong>{pedido.pendenciaResponsavel}</strong> em {pedido.pendenciaData}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {pedido.pendenciaMotivos.map((m) => (
              <Typography key={m} component="li" variant="caption" sx={{ display: 'list-item' }}>{m}</Typography>
            ))}
          </Box>
        </Alert>
      </Box>
    )
  }

  if (sub === 'PENDENTE_AGUARDANDO') {
    return (
      <Alert
        severity="warning"
        icon={<HourglassTopIcon fontSize="small" />}
        sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(245,158,11,0.35)' }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
          Aguardando retorno — documentação complementar solicitada
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: pedido.pendenciaMotivos ? 0.5 : 0 }}>
          Pendenciado por <strong>{pedido.pendenciaResponsavel}</strong> em {pedido.pendenciaData}. Aguardando envio dos documentos pelo beneficiário/prestador.
        </Typography>
        {pedido.pendenciaMotivos && (
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {pedido.pendenciaMotivos.map((m) => (
              <Typography key={m} component="li" variant="caption" sx={{ display: 'list-item' }}>{m}</Typography>
            ))}
          </Box>
        )}
      </Alert>
    )
  }

  if (sub === 'PENDENTE_RETORNO_RECEBIDO') {
    return (
      <Alert
        severity="info"
        icon={<MoveToInboxIcon fontSize="small" />}
        sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(37,99,235,0.3)', backgroundColor: 'rgba(37,99,235,0.05)' }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
          Retorno recebido — documentação complementar enviada
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: pedido.pendenciaMotivos ? 0.5 : 0 }}>
          A documentação solicitada foi recebida. Revise os itens abaixo e prossiga com a decisão.
        </Typography>
        {pedido.pendenciaMotivos && (
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {pedido.pendenciaMotivos.map((m) => (
              <Typography key={m} component="li" variant="caption" sx={{ display: 'list-item' }}>{m}</Typography>
            ))}
          </Box>
        )}
      </Alert>
    )
  }

  if (sub === 'JUNTA_AGUARDANDO') {
    return (
      <Alert
        severity="info"
        icon={<GavelIcon fontSize="small" />}
        sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(37,99,235,0.3)', backgroundColor: 'rgba(37,99,235,0.04)' }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
          Aguardando parecer da Junta Médica
        </Typography>
        <Typography variant="caption">
          Este pedido foi encaminhado para avaliação pela Junta Médica. A decisão final ficará disponível após o recebimento do parecer. Ações de aprovação e negação estão temporariamente desabilitadas.
        </Typography>
      </Alert>
    )
  }

  if (sub === 'JUNTA_PARECER_RECEBIDO') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Alert
          severity="success"
          icon={<GavelIcon fontSize="small" />}
          sx={{ borderRadius: 2, alignItems: 'flex-start', border: '1px solid rgba(22,163,74,0.3)', backgroundColor: 'rgba(22,163,74,0.04)' }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
            Parecer da Junta Médica recebido
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            O parecer foi emitido e está disponível para consulta. Prossiga com a decisão com base na recomendação da junta.
          </Typography>
          <Box
            component="span"
            onClick={() => setParecerExpanded(v => !v)}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#16a34a', fontWeight: 600, fontSize: 12 }}
          >
            <ExpandMoreIcon sx={{ fontSize: 16, transition: 'transform 0.2s', transform: parecerExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            {parecerExpanded ? 'Ocultar parecer' : 'Ver parecer completo'}
          </Box>
        </Alert>
        <Collapse in={parecerExpanded}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid rgba(22,163,74,0.25)',
              backgroundColor: 'rgba(22,163,74,0.03)',
            }}
          >
            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: '#16a34a', display: 'block', mb: 1 }}>
              Parecer da Junta Médica
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.65, color: 'text.primary', fontSize: 13 }}>
              {pedido.juntaParecer}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    )
  }

  return null
}
