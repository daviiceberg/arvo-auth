'use client';

import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { type CategoryBreakdownEntry } from '../hooks/useDashboardData';

interface CategoryBreakdownCardProps {
  entries: CategoryBreakdownEntry[];
  hasOpmeTotal: number;
}

export default function CategoryBreakdownCard({
  entries,
  hasOpmeTotal,
}: CategoryBreakdownCardProps) {
  const router = useRouter();
  const total = entries.reduce((s, e) => s + e.total, 0);
  const maxTotal = entries.reduce((m, e) => Math.max(m, e.total), 0);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: 2 }}
        >
          Distribuição por Categoria
        </Typography>

        {total === 0 ? (
          <Typography variant="body2" sx={{ fontSize: 12, color: 'text.disabled' }}>
            Nenhuma guia ativa nas categorias mapeadas.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {entries.map((e) => {
              const widthPct = maxTotal > 0 ? (e.total / maxTotal) * 100 : 0;
              return (
                <Box
                  key={e.category}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    router.push(`/fila?categoria=${encodeURIComponent(e.category)}`);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      router.push(`/fila?categoria=${encodeURIComponent(e.category)}`);
                    }
                  }}
                  aria-label={`Filtrar fila por ${e.category} — ${String(e.total)} guias`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      width: 180,
                      flexShrink: 0,
                      color: 'text.primary',
                    }}
                  >
                    {e.category}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      borderRadius: 1,
                      overflow: 'hidden',
                      minWidth: 60,
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${String(widthPct)}%`,
                        backgroundColor: e.color,
                        transition: 'width 200ms ease',
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'text.primary',
                      width: 24,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {e.total}
                  </Typography>
                  <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                </Box>
              );
            })}
          </Box>
        )}
        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => {
              router.push('/fila?tab=opme');
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                router.push('/fila?tab=opme');
              }
            }}
            aria-label={`Filtrar fila por pedidos com OPME — ${String(hasOpmeTotal)} guias`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary', flex: 1 }}>
              Pedidos com OPME (total)
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6B5544' }}>
              {hasOpmeTotal}
            </Typography>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
