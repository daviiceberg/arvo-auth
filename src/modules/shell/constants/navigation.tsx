import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

export interface ExternalLink {
  label: string;
  href: string;
}

export const NAV_ITEMS: Omit<NavItem, 'badge'>[] = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, path: '/dashboard' },
  {
    label: 'Fila Operacional',
    icon: <FormatListBulletedOutlinedIcon fontSize="small" />,
    path: '/fila',
  },
  { label: 'Histórico', icon: <HistoryOutlinedIcon fontSize="small" />, path: '/historico' },
];

export const ADMIN_ITEMS: NavItem[] = [
  { label: 'Usuários', icon: <PeopleOutlineIcon fontSize="small" />, path: '/usuarios' },
];

export const EXTERNAL_LINKS: ExternalLink[] = [
  {
    label: 'Rol da ANS',
    href: 'https://www.ans.gov.br/images/stories/Legislacao/rn/Anexo_I_Rol_2021RN_465.2021_RN654.2025L4.pdf',
  },
  {
    label: 'Consulta ANVISA',
    href: 'https://consultas.anvisa.gov.br/',
  },
  {
    label: 'Árvore de Códigos',
    href: 'https://arvoredecodigos.com.br/app',
  },
  {
    label: 'Padrão TISS 2026',
    href: 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/padrao-tiss-janeiro-2026',
  },
];

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
