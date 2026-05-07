'use client';

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [externalLinksOpen, setExternalLinksOpen] = useState(false);

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

        {/* Main nav (Dashboard + Fila Operacional) */}
        <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.slice(0, 2).map(renderNavItem)}
          </List>
        </Box>

        {/* Categories Menu Item */}
        {!collapsed && (
          <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  setCategoriesOpen((v) => !v);
                }}
                sx={{
                  minHeight: 44,
                  borderRadius: '6px !important',
                  px: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                  <FolderOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Categorias"
                  slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500 } } }}
                />
                {categoriesOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
              </ListItemButton>

              {/* Subcategories */}
              {categoriesOpen ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pl: 2 }}>
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
                            width: 12,
                            height: 12,
                            borderRadius: 0.5,
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
            </List>
          </Box>
        )}

        {/* Remaining main nav (Histórico) */}
        <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.slice(2).map(renderNavItem)}
          </List>
        </Box>

        {/* Admin nav */}
        <Box sx={{ px: 1, pt: 0.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {ADMIN_ITEMS.map(renderNavItem)}
          </List>
        </Box>

        {/* Spacer pushes footer to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Footer: Links Úteis + Help */}
        <Box
          sx={{
            px: 1,
            py: 1.5,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            flexShrink: 0,
            mt: collapsed ? 'auto' : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {!collapsed && (
            <ListItemButton
              onClick={() => {
                setExternalLinksOpen(true);
              }}
              sx={{
                minHeight: 44,
                borderRadius: '6px !important',
                px: 1.5,
                '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <OpenInNewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Links Úteis"
                slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500 } } }}
              />
            </ListItemButton>
          )}
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

      {/* External Links Modal */}
      <Dialog
        open={externalLinksOpen}
        onClose={() => {
          setExternalLinksOpen(false);
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '8px' },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Links Úteis</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2 }}>
          {EXTERNAL_LINKS.map((link) => (
            <Button
              key={link.label}
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              endIcon={<OpenInNewIcon />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 500,
                color: 'text.primary',
                borderColor: 'rgba(0,0,0,0.12)',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(144,43,41,0.05)',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}
