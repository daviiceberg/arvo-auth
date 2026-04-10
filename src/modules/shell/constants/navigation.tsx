import BiotechIcon from '@mui/icons-material/Biotech';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import EmergencyIcon from '@mui/icons-material/Emergency';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';

import { type Category } from '@/types/pedido';

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
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Fila Operacional', icon: <FormatListBulletedIcon fontSize="small" />, path: '/fila' },
  { label: 'Histórico', icon: <HistoryIcon fontSize="small" />, path: '/historico' },
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
    href: 'https://consultas.anvisa.gov.br/#/medicamentos/',
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

export const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Internação: <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  'Urgência/Emergência': <EmergencyIcon sx={{ fontSize: 14 }} />,
  Oncologia: <BiotechIcon sx={{ fontSize: 14 }} />,
  'Terapias Especiais': <PsychologyIcon sx={{ fontSize: 14 }} />,
  OPME: <DevicesOtherIcon sx={{ fontSize: 14 }} />,
  'Exames Alta Complexidade': <ScienceIcon sx={{ fontSize: 14 }} />,
  'Cirurgias Eletivas': <ContentCutIcon sx={{ fontSize: 14 }} />,
  'Home Care': <HomeIcon sx={{ fontSize: 14 }} />,
};

export const CATEGORY_ORDER: Category[] = [
  'Internação',
  'Urgência/Emergência',
  'Oncologia',
  'Terapias Especiais',
  'OPME',
  'Exames Alta Complexidade',
  'Cirurgias Eletivas',
  'Home Care',
];

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

export type Regional = 'Sul' | 'Sudeste' | 'Nordeste';

export const REGIONAL_OPTIONS: Regional[] = ['Sul', 'Sudeste', 'Nordeste'];
