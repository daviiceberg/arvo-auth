'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ScienceIcon from '@mui/icons-material/Science'
import PsychologyIcon from '@mui/icons-material/Psychology'
import DevicesOtherIcon from '@mui/icons-material/DevicesOther'
import HomeIcon from '@mui/icons-material/Home'
import EmergencyIcon from '@mui/icons-material/Emergency'
import BiotechIcon from '@mui/icons-material/Biotech'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckIcon from '@mui/icons-material/Check'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { pedidos } from '@/data/pedidos'
import { NOTIFICACOES } from '@/data/notificacoes'

const SIDEBAR_WIDTH = 240

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Fila Operacional', icon: <FormatListBulletedIcon fontSize="small" />, path: '/fila', badge: pedidos.length },
  { label: 'Histórico', icon: <HistoryIcon fontSize="small" />, path: '/historico' },
]

const adminItems = [
  { label: 'Usuários', icon: <PeopleOutlineIcon fontSize="small" />, path: '/usuarios' },
]

const linksUteis = [
  { label: 'Rol da ANS', href: 'https://www.ans.gov.br/images/stories/Legislacao/rn/Anexo_I_Rol_2021RN_465.2021_RN654.2025L4.pdf' },
  { label: 'Consulta ANVISA', href: 'https://consultas.anvisa.gov.br/#/medicamentos/' },
  { label: 'Árvore de Códigos', href: 'https://arvoredecodigos.com.br/app' },
  { label: 'Padrão TISS 2026', href: 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-janeiro-2026' },
]

const catIconMap: Record<string, React.ReactNode> = {
  'Internação': <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  'Urgência/Emergência': <EmergencyIcon sx={{ fontSize: 14 }} />,
  'Oncologia': <BiotechIcon sx={{ fontSize: 14 }} />,
  'Terapias Especiais': <PsychologyIcon sx={{ fontSize: 14 }} />,
  'OPME': <DevicesOtherIcon sx={{ fontSize: 14 }} />,
  'Exames Alta Complexidade': <ScienceIcon sx={{ fontSize: 14 }} />,
  'Cirurgias Eletivas': <ContentCutIcon sx={{ fontSize: 14 }} />,
  'Home Care': <HomeIcon sx={{ fontSize: 14 }} />,
}
const catColorMap: Record<string, string> = {
  'Internação': '#902B29',
  'Urgência/Emergência': '#d4183d',
  'Oncologia': '#7c3aed',
  'Terapias Especiais': '#f59e0b',
  'OPME': '#b45309',
  'Exames Alta Complexidade': '#0891b2',
  'Cirurgias Eletivas': '#059669',
  'Home Care': '#16a34a',
}
const categoriaOrder = ['Internação', 'Urgência/Emergência', 'Oncologia', 'Terapias Especiais', 'OPME', 'Exames Alta Complexidade', 'Cirurgias Eletivas', 'Home Care']
const categoriaCounts: Record<string, number> = {}
for (const p of pedidos) {
  categoriaCounts[p.categoria] = (categoriaCounts[p.categoria] ?? 0) + 1
}
const categorias = categoriaOrder
  .filter(cat => (categoriaCounts[cat] ?? 0) > 0)
  .map(cat => ({
    label: cat,
    count: categoriaCounts[cat],
    color: catColorMap[cat] ?? '#5a6070',
    icon: catIconMap[cat] ?? <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  }))

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [categoriasOpen, setCategoriasOpen] = useState(true)
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)
  const notifOpen = Boolean(notifAnchor)
  const [regional, setRegional] = useState<'Sul' | 'Sudeste' | 'Nordeste'>('Sul')
  const [regionalAnchor, setRegionalAnchor] = useState<null | HTMLElement>(null)
  const [regionalSnackbar, setRegionalSnackbar] = useState('')
  const [ajudaDrawerOpen, setAjudaDrawerOpen] = useState(false)

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setUserMenuAnchor(e.currentTarget)
  const handleUserMenuClose = () => setUserMenuAnchor(null)

  const notifications = NOTIFICACOES

  const isHelpActive = pathname === '/ajuda'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>

      {/* ── Topbar — full width ──────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important', px: 3 }}>
          {/* Logo on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <img src="/logo-arvo.svg" alt="Arvo Auth" style={{ width: 110, height: 28, display: 'block' }} />
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

            {/* Notifications */}
            <Box sx={{ position: 'relative', mr: 3 }}>
              <IconButton
                aria-label="Notificações"
                size="medium"
                onClick={(e) => setNotifAnchor(notifAnchor ? null : e.currentTarget)}
              >
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <NotificationsOutlinedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
              <Popover
                open={notifOpen}
                anchorEl={notifAnchor}
                onClose={() => setNotifAnchor(null)}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                slotProps={{
                  paper: {
                    sx: { mt: 0.5, width: 360, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden' },
                  },
                }}
              >
                {/* Popover header */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700}>Notificações</Typography>
                    <Box sx={{ minWidth: 20, height: 20, borderRadius: '50%', backgroundColor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{notifications.filter(n => !n.read).length}</Typography>
                    </Box>
                  </Box>
                  <Button variant="text" size="small" sx={{ fontSize: 12, color: 'primary.main', minHeight: 'auto', p: 0 }}>
                    Marcar todas como lidas
                  </Button>
                </Box>
                {/* Notification items */}
                {notifications.map((n, i) => (
                  <Box
                    key={n.id}
                    onClick={() => { setNotifAnchor(null); router.push(n.href) }}
                    sx={{
                      px: 2, py: 1.75,
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
                    <Box sx={{ mt: 0.75, width: 8, height: 8, borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'primary.main', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={n.read ? 400 : 600} sx={{ fontSize: 13, lineHeight: 1.3 }}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.4, display: 'block', mt: 0.25 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: 'block' }}>
                        {n.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {/* Footer */}
                <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.07)', px: 2, py: 1.25, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { setNotifAnchor(null); router.push('/notificacoes') }}
                    sx={{ fontSize: 12, color: 'primary.main', fontWeight: 600 }}
                  >
                    Ver todas as notificações
                  </Button>
                </Box>
              </Popover>
            </Box>

            {/* Regional selector */}
            <Box
              onClick={(e) => setRegionalAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                mr: 2,
                border: '1px solid rgba(144,43,41,0.25)',
                borderRadius: 1.5,
                backgroundColor: 'rgba(144,43,41,0.04)',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(144,43,41,0.08)' },
                transition: 'background-color 0.12s ease',
              }}
            >
              <LocationOnIcon sx={{ fontSize: 14, color: '#902B29' }} />
              <Typography sx={{ fontSize: 12, color: '#5a3030', lineHeight: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, color: '#902B29' }}>Regional:</Box>{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#902B29' }}>{regional}</Box>
              </Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#902B29', ml: 0.25 }} />
            </Box>
            <Menu
              anchorEl={regionalAnchor}
              open={Boolean(regionalAnchor)}
              onClose={() => setRegionalAnchor(null)}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              slotProps={{ paper: { sx: { mt: 0.5, minWidth: 140, borderRadius: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } } }}
            >
              {(['Sul', 'Sudeste', 'Nordeste'] as const).map((r) => (
                <MenuItem
                  key={r}
                  selected={regional === r}
                  onClick={() => {
                    setRegionalAnchor(null)
                    if (r !== regional) {
                      setRegional(r)
                      setRegionalSnackbar(`Regional alterada para ${r}. Recarregando dados...`)
                    }
                  }}
                  sx={{ fontSize: 13, fontWeight: regional === r ? 700 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
                >
                  {r}
                  {regional === r && <CheckIcon sx={{ fontSize: 14, color: 'primary.main' }} />}
                </MenuItem>
              ))}
            </Menu>

            {/* User section */}
            <Button
              onClick={handleUserMenuOpen}
              aria-label="Menu do usuário"
              aria-haspopup="true"
              aria-expanded={Boolean(userMenuAnchor)}
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
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>
                AS
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  Ana Paula Santos
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1 }}>
                  Autorizadora
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 18,
                  color: 'text.secondary',
                  transition: 'transform 150ms ease',
                  transform: Boolean(userMenuAnchor) ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </Button>

            {/* User dropdown */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  sx: { mt: 0.5, minWidth: 200, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
                },
              }}
            >
              <MenuItem
                onClick={() => { handleUserMenuClose(); router.push('/meu-perfil') }}
                sx={{ gap: 1.5, minHeight: 44, borderRadius: 1, mx: 0.5 }}
              >
                <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">Meu Perfil</Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={() => { handleUserMenuClose(); router.push('/login') }}
                sx={{ gap: 1.5, minHeight: 44, color: 'error.main', borderRadius: 1, mx: 0.5 }}
              >
                <LogoutIcon fontSize="small" />
                <Typography variant="body2">Sair</Typography>
              </MenuItem>
            </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar + content row ────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
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
        {/* Conteúdo da sidebar — com borda direita */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid rgba(0,0,0,0.07)' }}>

        {/* Main Nav */}
        <Box sx={{ px: 1.5, pt: 2, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
              return (
                <ListItemButton
                  key={item.path}
                  selected={isActive}
                  onClick={() => router.push(item.path)}
                  aria-label={`Navegar para ${item.label}`}
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
                    primaryTypographyProps={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}
                  />
                  {item.badge && (
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
              )
            })}
          </List>
        </Box>

        <Divider sx={{ mx: 1.5, my: 1 }} />

        {/* Admin Nav */}
        <Box sx={{ px: 1.5, flexShrink: 0 }}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {adminItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
              return (
                <ListItemButton
                  key={item.path}
                  selected={isActive}
                  onClick={() => router.push(item.path)}
                  aria-label={`Navegar para ${item.label}`}
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
                    primaryTypographyProps={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>

        <Divider sx={{ mx: 1.5, my: 1 }} />

        {/* Categorias */}
        <Box sx={{ px: 1.5, pt: 2, flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Box
            onClick={() => setCategoriasOpen(!categoriasOpen)}
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
              sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12 }}
            >
              Categorias
            </Typography>
            <ExpandMoreIcon
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                transition: 'transform 150ms ease',
                transform: categoriasOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </Box>
          <Collapse in={categoriasOpen}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.5 }}>
              {categorias.map((cat) => (
                <Box
                  key={cat.label}
                  onClick={() => router.push(`/fila?categoria=${encodeURIComponent(cat.label)}`)}
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
                    <Box sx={{ color: cat.color, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      {cat.icon}
                    </Box>
                    <Tooltip title={cat.label} placement="right" disableHoverListener={cat.label.length < 20}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {cat.label}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Chip
                    label={cat.count}
                    size="small"
                    sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: `${cat.color}18`, color: cat.color, flexShrink: 0, '& .MuiChip-label': { px: 0.75 } }}
                  />
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Links Úteis */}
        <Box sx={{ px: 1.5, pt: 1, pb: 2, flexShrink: 0 }}>
          <Typography
            variant="caption"
            sx={{ px: 1.5, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12 }}
          >
            Links Úteis
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {linksUteis.map((link) => (
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

        {/* Help — bottom of sidebar */}
        <Box sx={{ px: 1.5, py: 1.5, borderTop: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <ListItemButton
            onClick={() => setAjudaDrawerOpen(true)}
            sx={{
              minHeight: 44,
              borderRadius: '6px !important',
              px: 1.5,
              '&:hover': { backgroundColor: 'rgba(144,43,41,0.06)' },
            }}
            aria-label="Ajuda"
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
              <HelpOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Ajuda" primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
          </ListItemButton>
        </Box>

        </Box>{/* fim wrapper com borderRight */}
      </Drawer>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{ flex: 1, overflowY: 'auto', backgroundColor: 'background.default' }}
      >
        {children}
      </Box>

      </Box>{/* fim row sidebar + content */}

      {/* Ajuda Drawer */}
      <Drawer
        anchor="right"
        open={ajudaDrawerOpen}
        onClose={() => setAjudaDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, p: 0 } }}
        ModalProps={{ sx: { zIndex: 1300 } }}
      >
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography fontWeight={700} sx={{ fontSize: 16 }}>Central de Ajuda</Typography>
          </Box>
          <IconButton size="small" onClick={() => setAjudaDrawerOpen(false)}>
            <KeyboardArrowDownIcon sx={{ fontSize: 18, transform: 'rotate(-90deg)' }} />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Atalhos de teclado */}
          <Box>
            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Atalhos de Teclado — Tela de Análise
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {[
                ['← →  /  J K', 'Navegar entre guias'],
                ['A', 'Aprovar guia'],
                ['N', 'Negar guia'],
                ['P', 'Pendenciar guia'],
                ['?', 'Abrir esta ajuda'],
              ].map(([key, label]) => (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>{label}</Typography>
                  <Box sx={{ px: 1, py: 0.25, backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: 1, fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>{key}</Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Links rápidos */}
          <Box>
            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Links Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {[
                { label: 'FAQ — Perguntas Frequentes', path: '/ajuda' },
                { label: 'Manual do Autorizador', path: '/ajuda' },
                { label: 'DUTs e Protocolos ANS', path: '/ajuda' },
                { label: 'Contato com Suporte', path: '/ajuda' },
              ].map(({ label, path }) => (
                <Button
                  key={label}
                  variant="text"
                  fullWidth
                  endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                  onClick={() => { setAjudaDrawerOpen(false); router.push(path) }}
                  sx={{ fontSize: 13, justifyContent: 'space-between', px: 0, color: 'primary.main', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Versão */}
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
            Arvo Auth v2.1.0 · Suporte: suporte@arvo.com.br
          </Typography>
        </Box>
      </Drawer>

      {/* Regional change snackbar */}
      <Snackbar
        open={!!regionalSnackbar}
        autoHideDuration={3000}
        onClose={() => setRegionalSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setRegionalSnackbar('')} sx={{ minWidth: 300 }}>
          {regionalSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  )
}
