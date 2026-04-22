'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * Minimal public entry for unauthenticated users (issue NEW-917).
 */
export default function PublicHomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: '#FAF6F2',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '-0.5px', mb: 1 }}
      >
        Arvo Auth
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 480 }}>
        Autorização de procedimentos. Acesse o painel para continuar.
      </Typography>
      <Button
        component={Link}
        href="/auth/login"
        variant="contained"
        color="primary"
        size="large"
        aria-label="Entrar"
        sx={{ minWidth: 200, minHeight: 48 }}
      >
        Entrar
      </Button>
    </Box>
  );
}
