'use client';

import { useRouter } from 'next/navigation';

import BiotechIcon from '@mui/icons-material/Biotech';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import EmergencyIcon from '@mui/icons-material/Emergency';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { type CategoryData } from '../types';

interface CategorySummaryProps {
  categories: CategoryData[];
  loading: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Internação: <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  'Urgência/Emergência': <EmergencyIcon sx={{ fontSize: 14 }} />,
  Oncologia: <BiotechIcon sx={{ fontSize: 14 }} />,
  'Terapias Especiais': <PsychologyIcon sx={{ fontSize: 14 }} />,
  OPME: <DevicesOtherIcon sx={{ fontSize: 14 }} />,
  'Exames Alta Complexidade': <ScienceIcon sx={{ fontSize: 14 }} />,
  'Cirurgias Eletivas': <ContentCutIcon sx={{ fontSize: 14 }} />,
  'Home Care': <HomeIcon sx={{ fontSize: 14 }} />,
};

export default function CategorySummary({ categories, loading }: CategorySummaryProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={90} height={30} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {categories.map((cat) => (
        <Box
          key={cat.categoria}
          role="button"
          tabIndex={0}
          onClick={() => { router.push(`/fila?categoria=${encodeURIComponent(cat.categoria)}`); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/fila?categoria=${encodeURIComponent(cat.categoria)}`); } }}
          aria-label={`Filtrar por categoria ${cat.categoria}: ${String(cat.total)} pedidos`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.5,
            borderRadius: 2,
            border: `1px solid ${cat.color}30`,
            backgroundColor: `${cat.color}08`,
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            '&:hover': { backgroundColor: `${cat.color}15` },
            '&:focus-visible': { outline: `2px solid ${cat.color}`, outlineOffset: 2 },
          }}
        >
          <Box sx={{ color: cat.color, display: 'flex', alignItems: 'center' }}>
            {categoryIcons[cat.categoria]}
          </Box>
          <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
            {cat.categoria.replace('Urgência/Emergência', 'U/E').replace('Exames Alta Complexidade', 'Exames').replace('Cirurgias Eletivas', 'Cirurgias').replace('Terapias Especiais', 'Terapias')}
          </Typography>
          <Chip
            label={cat.total}
            size="small"
            sx={{ height: 18, fontSize: 12, fontWeight: 700, backgroundColor: `${cat.color}20`, color: 'text.primary', '& .MuiChip-label': { px: 0.5 } }}
          />
        </Box>
      ))}
    </Box>
  );
}
