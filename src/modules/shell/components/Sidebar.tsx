'use client';

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { pedidos } from '@/data/pedidos';
import { categoryColorMap } from '@/shared/constants';
import { type Category } from '@/types/pedido';

import { type NavItem } from '../constants/navigation';
import {
  ADMIN_ITEMS,
  EXTERNAL_LINKS,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_WIDTH,
} from '../constants/navigation';

const CATEGORIES: Category[] = [
  'Terapias Especiais',
  'SADT',
  'Exames Alta Complexidade',
  'Home Care',
];

function categoryActiveCount(category: Category): number {
  return pedidos.filter((p) => p.category === category).length;
}

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
}

export default function Sidebar({
  navItems,
  collapsed,
  onToggleCollapse,
  onOpenHelp,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
    const button = (
      <ListItemButton
        key={item.path}
        selected={isActive}
        onClick={() => {
          router.push(item.path);
        }}
        sx={{
          minHeight: 44,
          borderRadius: '6px !important',
          px: 1.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          ...(isActive && {
            backgroundColor: 'primary.main',
            color: '#ffffff !important',
            '& .MuiListItemIcon-root': { color: '#ffffff !important' },
            '& .MuiListItemText-primary': { color: '#ffffff !important' },
          }),
          ...(!isActive && {
            '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
          }),
        }}
      >
        <ListItemIcon
          sx={{ minWidth: collapsed ? 0 : 32, color: isActive ? '#fff' : 'text.secondary' }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.label}
            slotProps={{ primary: { sx: { fontSize: 13, fontWeight: isActive ? 700 : 500 } } }}
          />
        )}
        {!collapsed && item.badge != null && (
          <Chip
            label={item.badge}
            size="small"
            sx={{
              height: 18,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(144,43,41,0.1)',
              color: isActive ? '#fff' : 'primary.main',
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        )}
      </ListItemButton>
    );

    if (collapsed) {
      return (
        <Tooltip
          key={item.path}
          title={`${item.label}${item.badge != null ? ` (${String(item.badge)})` : ''}`}
          placement="right"
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        transition: 'width 200ms ease',
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          top: 60,
          height: 'calc(100vh - 60px)',
          transition: 'width 200ms ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          borderRight: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {/* Collapse toggle */}
        <Box
          onClick={onToggleCollapse}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            gap: 0.5,
            px: 2,
            pt: 1.5,
            pb: 1,
            flexShrink: 0,
            cursor: 'pointer',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            opacity: 0.5,
            '&:hover': { opacity: 1 },
            transition: 'opacity 150ms ease',
          }}
        >
          {!collapsed && (
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 500, userSelect: 'none' }}
            >
              Recolher menu
            </Typography>
          )}
          <Tooltip title={collapsed ? 'Expandir menu' : ''} placement="right">
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              {collapsed ? (
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
          </Tooltip>
        </Box>

        {/* Main nav */}
        <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.map(renderNavItem)}
          </List>
        </Box>

        {/* Admin nav */}
        <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {ADMIN_ITEMS.map(renderNavItem)}
          </List>
        </Box>

        {!collapsed && (
          <>
            {/* Categorias */}
            <Box
              sx={{
                px: 1.5,
                pt: 1.5,
                mt: 1,
                borderTop: '1px solid rgba(0,0,0,0.07)',
                flexShrink: 0,
              }}
            >
              <Box
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCategoriesOpen((v) => !v);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCategoriesOpen((v) => !v);
                  }
                }}
                aria-expanded={categoriesOpen}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    fontSize: 12,
                  }}
                >
                  Categorias
                </Typography>
                {categoriesOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                )}
              </Box>
              {categoriesOpen ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.5 }}>
                  {CATEGORIES.map((category) => {
                    const colors = categoryColorMap[category];
                    const count = categoryActiveCount(category);
                    return (
                      <Box
                        key={category}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          router.push(`/fila?categoria=${encodeURIComponent(category)}`);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            router.push(`/fila?categoria=${encodeURIComponent(category)}`);
                          }
                        }}
                        aria-label={`Filtrar fila por categoria ${category}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.6,
                          borderRadius: 1,
                          cursor: 'pointer',
                          minHeight: 32,
                          '&:hover': { backgroundColor: 'rgba(144,43,41,0.05)' },
                          transition: 'background-color 150ms ease',
                        }}
                      >
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: 1,
                            backgroundColor: colors.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontSize: 12, fontWeight: 500, flex: 1, color: 'text.primary' }}
                        >
                          {category}
                        </Typography>
                        <Chip
                          label={count}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            color: 'text.secondary',
                            '& .MuiChip-label': { px: 0.75 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : null}
            </Box>

            {/* Spacer pushes external links to the bottom */}
            <Box sx={{ flex: 1 }} />

            {/* External links */}
            <Box sx={{ px: 1.5, pt: 1, pb: 2, flexShrink: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  fontSize: 12,
                }}
              >
                Links Úteis
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {EXTERNAL_LINKS.map((link) => (
                  <Box
                    key={link.label}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 1,
                      cursor: 'pointer',
                      minHeight: 32,
                      textDecoration: 'none',
                      color: 'text.secondary',
                      '&:hover': { backgroundColor: 'rgba(144,43,41,0.05)', color: 'primary.main' },
                      transition: 'background-color 150ms ease, color 150ms ease',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>
                      {link.label}
                    </Typography>
                    <OpenInNewIcon sx={{ fontSize: 12, flexShrink: 0, opacity: 0.6 }} />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Help button */}
        <Box
          sx={{
            px: 1,
            py: 1.5,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            flexShrink: 0,
            mt: collapsed ? 'auto' : 0,
          }}
        >
          {collapsed ? (
            <Tooltip title="Ajuda" placement="right">
              <IconButton
                onClick={onOpenHelp}
                sx={{
                  display: 'flex',
                  mx: 'auto',
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
                }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <ListItemButton
              onClick={onOpenHelp}
              sx={{
                minHeight: 44,
                borderRadius: '6px !important',
                px: 1.5,
                '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <HelpOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Ajuda"
                slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500 } } }}
              />
            </ListItemButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
