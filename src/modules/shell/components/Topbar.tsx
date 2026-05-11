'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useUser } from '@auth0/nextjs-auth0';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { signOutWithBackendThenAuth0 } from '@/lib/client-sign-out';
import { clearDynamicNotifications } from '@/shared/notifications/notification-store';
import { type Notification } from '@/types/notificacao';

import { cleanupLegacyM1State, resetAllM1State } from '@/modules/analysis/hooks/useM1RequestState';

function userInitials(name: string | undefined, email: string | undefined): string {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0]?.[0];
      const b = parts[parts.length - 1]?.[0];
      if (a && b) return (a + b).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return '?';
}

interface TopbarProps {
  // Notifications
  notifications: Notification[];
  notifAnchor: HTMLElement | null;
  notifOpen: boolean;
  unreadCount: number;
  onToggleNotifications: (e: React.MouseEvent<HTMLElement>) => void;
  onCloseNotifications: () => void;
  // User menu
  userMenuAnchor: HTMLElement | null;
  onOpenUserMenu: (e: React.MouseEvent<HTMLElement>) => void;
  onCloseUserMenu: () => void;
}

export default function Topbar({
  notifications,
  notifAnchor,
  notifOpen,
  unreadCount,
  onToggleNotifications,
  onCloseNotifications,
  userMenuAnchor,
  onOpenUserMenu,
  onCloseUserMenu,
}: TopbarProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [resetToastOpen, setResetToastOpen] = useState(false);

  const handleResetSimulation = () => {
    resetAllM1State();
    cleanupLegacyM1State();
    clearDynamicNotifications();
    onCloseUserMenu();
    setResetToastOpen(true);
  };
  const displayName = isLoading ? '…' : (user?.name ?? user?.email ?? 'Usuário');
  const displaySubtitle = isLoading ? '…' : (user?.email ?? '—');
  const avatarInitials = userInitials(user?.name, user?.email);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important', px: 3 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            component="img"
            src="/logo-arvo.svg"
            alt="Arvo Auth"
            sx={{ width: 110, height: 28, display: 'block' }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Notifications */}
        <Box sx={{ position: 'relative', mr: 3 }}>
          <IconButton size="medium" onClick={onToggleNotifications}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsOutlinedIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
          <Popover
            open={notifOpen}
            anchorEl={notifAnchor}
            onClose={onCloseNotifications}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  width: 360,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: 'none',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  Notificações
                </Typography>
                <Box
                  sx={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    {unreadCount}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="text"
                size="small"
                sx={{ fontSize: 12, color: 'primary.main', minHeight: 'auto', p: 0 }}
              >
                Marcar todas como lidas
              </Button>
            </Box>
            {notifications.slice(0, 4).map((n, i) => (
              <Box
                key={n.id}
                onClick={() => {
                  onCloseNotifications();
                  router.push(n.href);
                }}
                sx={{
                  px: 2,
                  py: 1.75,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  backgroundColor: n.read ? 'transparent' : 'rgba(144,43,41,0.025)',
                  '&:hover': { backgroundColor: 'rgba(144,43,41,0.04)' },
                  transition: 'background-color 150ms ease',
                }}
              >
                <Box
                  sx={{
                    mt: 0.75,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: n.read ? 'transparent' : 'primary.main',
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={n.read ? 400 : 600}
                    sx={{ fontSize: 13, lineHeight: 1.3 }}
                  >
                    {n.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 12, lineHeight: 1.4, display: 'block', mt: 0.25 }}
                  >
                    {n.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 12, mt: 0.5, display: 'block' }}
                  >
                    {n.time}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Box
              sx={{ borderTop: '1px solid rgba(0,0,0,0.04)', px: 2, py: 1.25, textAlign: 'center' }}
            >
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  onCloseNotifications();
                  router.push('/notificacoes');
                }}
                sx={{ fontSize: 12, color: 'primary.main', fontWeight: 600 }}
              >
                Ver todas as notificações
              </Button>
            </Box>
          </Popover>
        </Box>

        {/* User section */}
        <Button
          onClick={onOpenUserMenu}
          disableRipple={false}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 1,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            textTransform: 'none',
            color: 'text.primary',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'rgba(144,43,41,0.05)' },
            minHeight: 44,
          }}
        >
          <Avatar
            src={user?.picture}
            alt=""
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}
          >
            {!user?.picture ? avatarInitials : null}
          </Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, lineHeight: 1 }}
            >
              {displaySubtitle}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              transition: 'transform 150ms ease',
              transform: userMenuAnchor ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Button>

        {/* User dropdown */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={onCloseUserMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                minWidth: 200,
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: 'none',
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onCloseUserMenu();
              router.push('/meu-perfil');
            }}
            sx={{ gap: 1.5, minHeight: 44, borderRadius: 1, mx: 0.5 }}
          >
            <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">Meu Perfil</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={handleResetSimulation}
            sx={{
              gap: 1.5,
              minHeight: 40,
              borderRadius: 1,
              mx: 0.5,
              color: 'text.secondary',
            }}
          >
            <RestartAltIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              Resetar processo
            </Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              onCloseUserMenu();
              void signOutWithBackendThenAuth0();
            }}
            sx={{ gap: 1.5, minHeight: 44, color: 'error.main', borderRadius: 1, mx: 0.5 }}
          >
            <LogoutIcon fontSize="small" />
            <Typography variant="body2">Sair</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* M1 — Reset simulação confirmation toast */}
      <Snackbar
        open={resetToastOpen}
        autoHideDuration={3500}
        onClose={() => {
          setResetToastOpen(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => {
            setResetToastOpen(false);
          }}
          sx={{ fontSize: 13 }}
        >
          Processo resetado — todos os pedidos voltaram ao estado inicial
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
