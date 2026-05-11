'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { alertOutlines } from '@/shared/constants';
import { type OpmeMaterial } from '@/types/pedido';

interface AnvisaBannerProps {
  materials: OpmeMaterial[];
}

export default function AnvisaBanner({ materials }: AnvisaBannerProps) {
  const expired = materials.filter((m) => m.anvisaStatus === 'invalid');
  const notFound = materials.filter((m) => m.anvisaStatus === 'not_found');

  if (expired.length === 0 && notFound.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {notFound.length > 0 ? (
        <Alert severity="error" sx={{ borderRadius: 2, border: alertOutlines.error }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {notFound.length} material(is) com registro ANVISA não localizado
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 0.25 }}>
            {notFound.map((m) => `${m.description} (${m.anvisaRegistration})`).join(' · ')}
          </Typography>
        </Alert>
      ) : null}
      {expired.length > 0 ? (
        <Alert severity="warning" sx={{ borderRadius: 2, border: alertOutlines.warning }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {expired.length} material(is) com registro ANVISA expirado
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 12, display: 'block', mt: 0.25 }}>
            Alerta — analista decide se aceita prosseguir.{' '}
            {expired
              .map(
                (m) =>
                  `${m.description}${m.anvisaValidUntil ? ` (vigência: ${m.anvisaValidUntil})` : ''}`,
              )
              .join(' · ')}
          </Typography>
        </Alert>
      ) : null}
    </Box>
  );
}
