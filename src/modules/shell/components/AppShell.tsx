'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

import { NOTIFICACOES } from '@/data/notificacoes';
import { pedidos } from '@/data/pedidos';

import useAppShell from '../hooks/useAppShell';

import HelpDrawer from './HelpDrawer';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const shell = useAppShell(pedidos, NOTIFICACOES);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Topbar
        notifications={NOTIFICACOES}
        notifAnchor={shell.notifAnchor}
        notifOpen={shell.notifOpen}
        unreadCount={shell.unreadCount}
        onToggleNotifications={shell.toggleNotifications}
        onCloseNotifications={shell.closeNotifications}
        regional={shell.regional}
        regionalAnchor={shell.regionalAnchor}
        onOpenRegionalMenu={shell.openRegionalMenu}
        onCloseRegionalMenu={shell.closeRegionalMenu}
        onSelectRegional={shell.selectRegional}
        userMenuAnchor={shell.userMenuAnchor}
        onOpenUserMenu={shell.openUserMenu}
        onCloseUserMenu={shell.closeUserMenu}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          navItems={shell.navItems}
          categories={shell.categories}
          categoriesOpen={shell.categoriesOpen}
          onToggleCategories={shell.toggleCategories}
          onOpenHelp={shell.openHelpDrawer}
        />

        <Box
          component="main"
          sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'background.default' }}
        >
          {children}
        </Box>
      </Box>

      <HelpDrawer open={shell.helpDrawerOpen} onClose={shell.closeHelpDrawer} />

      <Snackbar
        open={!!shell.regionalSnackbar}
        autoHideDuration={3000}
        onClose={shell.closeRegionalSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={shell.closeRegionalSnackbar} sx={{ minWidth: 300 }}>
          {shell.regionalSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
