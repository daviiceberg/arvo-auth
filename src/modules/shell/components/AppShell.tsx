'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { NOTIFICACOES } from '@/data/notificacoes';
import { pedidos } from '@/data/pedidos';
import { useSlaAlerts } from '@/shared/hooks/useSlaAlerts';
import { useDynamicNotifications } from '@/shared/notifications/notification-store';

import { cleanupLegacyM1State } from '@/modules/analysis/hooks/useM1RequestState';

import useAppShell from '../hooks/useAppShell';

import HelpDrawer from './HelpDrawer';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const dynamicNotifications = useDynamicNotifications();
  const allNotifications = [...dynamicNotifications, ...NOTIFICACOES];
  const shell = useAppShell(pedidos, allNotifications);

  // M1: limpa chaves legadas do localStorage de versões anteriores que persistiam
  // simulações. Atual: simulações ficam em memória (refresh = volta ao mock).
  useEffect(() => {
    cleanupLegacyM1State();
  }, []);

  // M3: dispara notificações escalonadas para pedidos com SLA crítico (1h, 30min, violado).
  useSlaAlerts(pedidos);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <Topbar
        notifications={allNotifications}
        notifAnchor={shell.notifAnchor}
        notifOpen={shell.notifOpen}
        unreadCount={shell.unreadCount}
        onToggleNotifications={shell.toggleNotifications}
        onCloseNotifications={shell.closeNotifications}
        userMenuAnchor={shell.userMenuAnchor}
        onOpenUserMenu={shell.openUserMenu}
        onCloseUserMenu={shell.closeUserMenu}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          navItems={shell.navItems}
          collapsed={shell.sidebarCollapsed}
          onToggleCollapse={shell.toggleSidebar}
          onOpenHelp={shell.openHelpDrawer}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#FAF6F2',
            borderRadius: '24px',
            mr: '22px',
            mb: '22px',
          }}
        >
          {children}
        </Box>
      </Box>

      <HelpDrawer open={shell.helpDrawerOpen} onClose={shell.closeHelpDrawer} />
    </Box>
  );
}
