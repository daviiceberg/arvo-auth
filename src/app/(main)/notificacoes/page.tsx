'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { NOTIFICACOES } from '@/data/notificacoes';
import { type Notification } from '@/types/notificacao';

export default function NotificacoesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICACOES);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (n: Notification) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
    );
    router.push(n.href);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: 'auto' }}>
      {/* Page header */}
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: 22, mb: 0.5 }}>
            Notificações
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {unreadCount > 0
              ? `Você tem ${String(unreadCount)} notificaç${unreadCount === 1 ? 'ão não lida' : 'ões não lidas'}`
              : 'Nenhuma notificação não lida'}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={markAllRead}
            sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}
          >
            Marcar todas como lidas
          </Button>
        )}
      </Box>

      {/* Notifications card */}
      <Card sx={{ overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box
            sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Nenhuma notificação
            </Typography>
          </Box>
        ) : (
          notifications.map((n, i) => {
            return (
              <Box key={n.id}>
                {i > 0 && <Divider />}
                <Box
                  onClick={() => {
                    handleClick(n);
                  }}
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    cursor: 'pointer',
                    backgroundColor: n.read ? 'transparent' : 'rgba(144,43,41,0.025)',
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.04)' },
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {/* Unread dot */}
                  <Box
                    sx={{
                      mt: 1,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: n.read ? 'transparent' : 'primary.main',
                      flexShrink: 0,
                    }}
                  />
                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography
                        variant="body2"
                        fontWeight={n.read ? 500 : 700}
                        sx={{ fontSize: 14, lineHeight: 1.3 }}
                      >
                        {n.title}
                      </Typography>
                      <Chip
                        label={n.id}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          color: 'text.secondary',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13, lineHeight: 1.5, display: 'block' }}
                    >
                      {n.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
                    >
                      {n.time}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Card>
    </Box>
  );
}
