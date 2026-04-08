'use client';

import { useState } from 'react';

import { categoryColorMap } from '@/shared/constants';
import { type Notificacao } from '@/types/notificacao';
import { type Pedido } from '@/types/pedido';

import {
  CATEGORY_ICON_MAP,
  CATEGORY_ORDER,
  NAV_ITEMS,
  type NavItem,
  type Regional,
} from '../constants/navigation';

export interface CategoryEntry {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

function buildCategories(requests: Pedido[]): CategoryEntry[] {
  const counts: Record<string, number> = {};
  for (const r of requests) {
    counts[r.categoria] = (counts[r.categoria] ?? 0) + 1;
  }

  return CATEGORY_ORDER.filter((cat) => (counts[cat] ?? 0) > 0).map((cat) => ({
    label: cat,
    count: counts[cat] ?? 0,
    color: categoryColorMap[cat].color,
    icon: CATEGORY_ICON_MAP[cat],
  }));
}

function buildNavItems(requests: Pedido[]): NavItem[] {
  return NAV_ITEMS.map((item) =>
    item.path === '/fila' ? { ...item, badge: requests.length } : item,
  );
}

export default function useAppShell(requests: Pedido[], notifications: Notificacao[]) {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [regional, setRegional] = useState<Regional>('Sul');
  const [regionalAnchor, setRegionalAnchor] = useState<null | HTMLElement>(null);
  const [regionalSnackbar, setRegionalSnackbar] = useState('');
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);

  const notifOpen = Boolean(notifAnchor);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const categories = buildCategories(requests);
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

    // Categories
    categoriesOpen,
    toggleCategories: () => {
      setCategoriesOpen((prev) => !prev);
    },
    categories,

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

    // Regional
    regional,
    regionalAnchor,
    regionalSnackbar,
    openRegionalMenu: (e: React.MouseEvent<HTMLElement>) => {
      setRegionalAnchor(e.currentTarget);
    },
    closeRegionalMenu: () => {
      setRegionalAnchor(null);
    },
    selectRegional: (r: Regional) => {
      setRegionalAnchor(null);
      if (r !== regional) {
        setRegional(r);
        setRegionalSnackbar(`Regional changed to ${r}. Reloading data...`);
      }
    },
    closeRegionalSnackbar: () => {
      setRegionalSnackbar('');
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
  };
}
