'use client';

import { useState } from 'react';

import { type Notification } from '@/types/notificacao';
import { type Request } from '@/types/pedido';

import { NAV_ITEMS, type NavItem } from '../constants/navigation';

function buildNavItems(requests: Request[]): NavItem[] {
  return NAV_ITEMS.map((item) =>
    item.path === '/fila' ? { ...item, badge: requests.length } : item,
  );
}

export default function useAppShell(requests: Request[], notifications: Notification[]) {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const notifOpen = Boolean(notifAnchor);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const navItems = buildNavItems(requests);

  return {
    // User menu
    userMenuAnchor,
    openUserMenu: (e: React.MouseEvent<HTMLElement>) => {
      setUserMenuAnchor(e.currentTarget);
    },
    closeUserMenu: () => {
      setUserMenuAnchor(null);
    },

    // Notifications
    notifAnchor,
    notifOpen,
    unreadCount,
    toggleNotifications: (e: React.MouseEvent<HTMLElement>) => {
      setNotifAnchor(notifAnchor ? null : e.currentTarget);
    },
    closeNotifications: () => {
      setNotifAnchor(null);
    },

    // Help drawer
    helpDrawerOpen,
    openHelpDrawer: () => {
      setHelpDrawerOpen(true);
    },
    closeHelpDrawer: () => {
      setHelpDrawerOpen(false);
    },

    // Nav
    navItems,

    // Sidebar collapse
    sidebarCollapsed,
    toggleSidebar: () => {
      setSidebarCollapsed((prev) => !prev);
    },
  };
}
