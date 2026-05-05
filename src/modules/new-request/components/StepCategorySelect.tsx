'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { categoryColorMap } from '@/shared/constants';
import { type Category } from '@/types/pedido';

interface CategoryOption {
  value: Category;
  description: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: 'Terapias Especiais',
    description: 'Terapias multidisciplinares para TEA e transtornos do desenvolvimento (CID F84).',
  },
  {
    value: 'SADT',
    description: 'Serviços auxiliares de diagnóstico e terapia: coletas, infusões, reabilitação.',
  },
  {
    value: 'Exames Alta Complexidade',
    description: 'Exames de imagem e diagnóstico AC: ressonância, tomografia, PET, cintilografia.',
  },
  {
    value: 'Home Care',
    description: 'Atendimento domiciliar continuado: enfermagem, fisioterapia, fono, paliativos.',
  },
];

interface StepCategorySelectProps {
  category: Category | '';
  onSelect: (next: Category) => void;
}

export function StepCategorySelect({ category, onSelect }: StepCategorySelectProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: 15 }}>
        Categoria do pedido
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
        Selecione a categoria correspondente ao pedido para que o sistema apresente os campos e
        documentos certos.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {CATEGORY_OPTIONS.map((opt) => {
          const colors = categoryColorMap[opt.value];
          const selected = category === opt.value;
          return (
            <Box
              key={opt.value}
              role="button"
              tabIndex={0}
              onClick={() => {
                onSelect(opt.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(opt.value);
                }
              }}
              sx={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selected ? colors.color : 'rgba(0,0,0,0.12)',
                backgroundColor: selected ? colors.bg : '#fff',
                borderRadius: 2,
                p: 2,
                transition: 'all 150ms ease',
                outline: 'none',
                '&:hover': {
                  borderColor: colors.color,
                  backgroundColor: colors.bg,
                },
                '&:focus-visible': {
                  borderColor: colors.color,
                  boxShadow: `0 0 0 2px ${colors.color}33`,
                },
              }}
            >
              <Chip
                label={opt.value}
                size="small"
                sx={{
                  backgroundColor: colors.bg,
                  color: colors.color,
                  fontWeight: 600,
                  height: 22,
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                {opt.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
