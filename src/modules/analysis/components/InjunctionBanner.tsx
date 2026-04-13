'use client';

import GavelIcon from '@mui/icons-material/Gavel';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

interface InjunctionBannerProps {
  request: Request;
}

export default function InjunctionBanner({ request }: InjunctionBannerProps) {
  if (!request.injunction?.ativa) return null;
  const { processo, escopo, validade, observacao } = request.injunction;
  return (
    <Box
      sx={{
        border: '1px solid rgba(124,58,237,0.35)',
        borderRadius: 2,
        backgroundColor: 'rgba(124,58,237,0.04)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <GavelIcon sx={{ fontSize: 20, color: 'secondary.main', flexShrink: 0, mt: 0.1 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: 13, color: 'secondary.main' }}
            >
              Liminar Judicial Ativa
            </Typography>
            <Chip
              label={`Válida até ${validade}`}
              size="small"
              sx={{
                fontSize: 10,
                height: 18,
                backgroundColor: 'rgba(124,58,237,0.12)',
                color: 'secondary.main',
                fontWeight: 700,
              }}
            />
            <Chip
              label={processo}
              size="small"
              sx={{
                fontSize: 10,
                height: 18,
                backgroundColor: 'rgba(0,0,0,0.06)',
                color: 'text.secondary',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ fontSize: 12, color: 'text.primary', mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 600 }}>
              Escopo:{' '}
            </Box>
            {escopo}
          </Typography>
          {observacao ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 11, display: 'block', fontStyle: 'italic' }}
            >
              {observacao}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
