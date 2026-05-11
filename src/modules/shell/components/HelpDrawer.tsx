'use client';

import { useRouter } from 'next/navigation';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const KEYBOARD_SHORTCUTS = [
  ['← →  /  J K', 'Navegar entre guias'],
  ['A', 'Aprovar guia'],
  ['N', 'Negar guia'],
  ['P', 'Pendenciar guia'],
  ['?', 'Abrir esta ajuda'],
] as const;

const QUICK_LINKS = [
  { label: 'FAQ — Perguntas Frequentes', path: '/ajuda' },
  { label: 'Manual do Autorizador', path: '/ajuda/manual' },
  { label: 'DUTs e Protocolos ANS', path: '/ajuda/duts-protocolos' },
  { label: 'Contato com Suporte', path: '/ajuda#contato' },
] as const;

interface HelpDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpDrawer({ open, onClose }: HelpDrawerProps) {
  const router = useRouter();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 400, p: 0 } } }}
      sx={{ zIndex: 1300 }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography fontWeight={700} sx={{ fontSize: 16 }}>
            Central de Ajuda
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <KeyboardArrowDownIcon sx={{ fontSize: 18, transform: 'rotate(-90deg)' }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          overflowY: 'auto',
          px: 3,
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Keyboard shortcuts */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              textTransform: 'uppercase',
              fontSize: 11,
              letterSpacing: 0.5,
              color: 'text.secondary',
              display: 'block',
              mb: 1.5,
            }}
          >
            Atalhos de Teclado — Tela de Análise
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {KEYBOARD_SHORTCUTS.map(([key, label]) => (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {label}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    backgroundColor: 'rgba(0,0,0,0.07)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  {key}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Quick links */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              textTransform: 'uppercase',
              fontSize: 11,
              letterSpacing: 0.5,
              color: 'text.secondary',
              display: 'block',
              mb: 1.5,
            }}
          >
            Links Rápidos
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {QUICK_LINKS.map(({ label, path }) => (
              <Button
                key={label}
                variant="text"
                fullWidth
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                onClick={() => {
                  onClose();
                  router.push(path);
                }}
                sx={{
                  fontSize: 13,
                  justifyContent: 'space-between',
                  px: 0,
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Version */}
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
          Arvo Auth v2.1.0 · Suporte: suporte@arvo.com.br
        </Typography>
      </Box>
    </Drawer>
  );
}
