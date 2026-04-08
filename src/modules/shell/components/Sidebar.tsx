'use client';

import { usePathname, useRouter } from 'next/navigation';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { type NavItem } from '../constants/navigation';
import { ADMIN_ITEMS, EXTERNAL_LINKS, SIDEBAR_WIDTH } from '../constants/navigation';
import { type CategoryEntry } from '../hooks/useAppShell';

interface SidebarProps {
  navItems: NavItem[];
  categories: CategoryEntry[];
  categoriesOpen: boolean;
  onToggleCategories: () => void;
  onOpenHelp: () => void;
}

export default function Sidebar({
  navItems,
  categories,
  categoriesOpen,
  onToggleCategories,
  onOpenHelp,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
    return (
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
          ...(isActive && {
            backgroundColor: '#902B29 !important',
            color: '#ffffff !important',
            '& .MuiListItemIcon-root': { color: '#ffffff !important' },
            '& .MuiListItemText-primary': { color: '#ffffff !important' },
          }),
          ...(!isActive && {
            '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
          }),
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: isActive ? '#fff' : 'text.secondary' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          slotProps={{ primary: { sx: { fontSize: 13, fontWeight: isActive ? 700 : 500 } } }}
        />
        {item.badge != null && (
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
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          top: 60,
          height: 'calc(100vh - 60px)',
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
        {/* Main nav */}
        <Box sx={{ px: 1.5, pt: 2, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.map(renderNavItem)}
          </List>
        </Box>

        <Divider sx={{ mx: 1.5, my: 1 }} />

        {/* Admin nav */}
        <Box sx={{ px: 1.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {ADMIN_ITEMS.map(renderNavItem)}
          </List>
        </Box>

        <Divider sx={{ mx: 1.5, my: 1 }} />

        {/* Categories */}
        <Box sx={{ px: 1.5, pt: 2, flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Box
            onClick={onToggleCategories}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.75,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'rgba(144,43,41,0.04)' },
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
            <ExpandMoreIcon
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                transition: 'transform 150ms ease',
                transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </Box>
          <Collapse in={categoriesOpen}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.5 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.label}
                  onClick={() => {
                    router.push(`/fila?categoria=${encodeURIComponent(cat.label)}`);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 1,
                    cursor: 'pointer',
                    minHeight: 32,
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.05)' },
                    transition: 'background-color 150ms ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        color: cat.color,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {cat.icon}
                    </Box>
                    <Tooltip
                      title={cat.label}
                      placement="right"
                      disableHoverListener={cat.label.length < 20}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cat.label}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Chip
                    label={cat.count}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: `${cat.color}18`,
                      color: cat.color,
                      flexShrink: 0,
                      '& .MuiChip-label': { px: 0.75 },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>

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

        {/* Help button */}
        <Box sx={{ px: 1.5, py: 1.5, borderTop: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
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
        </Box>
      </Box>
    </Drawer>
  );
}
