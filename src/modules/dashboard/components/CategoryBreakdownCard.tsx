'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { type CategoryBreakdownEntry } from '../hooks/useDashboardData';

interface CategoryBreakdownCardProps {
  entries: CategoryBreakdownEntry[];
}

interface DonutSegmentProps {
  startAngle: number;
  endAngle: number;
  color: string;
}

const RADIUS_OUTER = 60;
const RADIUS_INNER = 40;
const CENTER = 70;

function polar(angleRad: number, radius: number): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function DonutSegment({ startAngle, endAngle, color }: DonutSegmentProps) {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const outerStart = polar(startAngle, RADIUS_OUTER);
  const outerEnd = polar(endAngle, RADIUS_OUTER);
  const innerStart = polar(startAngle, RADIUS_INNER);
  const innerEnd = polar(endAngle, RADIUS_INNER);

  const d = [
    `M ${String(outerStart.x)} ${String(outerStart.y)}`,
    `A ${String(RADIUS_OUTER)} ${String(RADIUS_OUTER)} 0 ${String(largeArc)} 1 ${String(outerEnd.x)} ${String(outerEnd.y)}`,
    `L ${String(innerEnd.x)} ${String(innerEnd.y)}`,
    `A ${String(RADIUS_INNER)} ${String(RADIUS_INNER)} 0 ${String(largeArc)} 0 ${String(innerStart.x)} ${String(innerStart.y)}`,
    'Z',
  ].join(' ');

  return <path d={d} fill={color} />;
}

function buildSegments(entries: CategoryBreakdownEntry[]): DonutSegmentProps[] {
  const total = entries.reduce((s, e) => s + e.total, 0);
  if (total === 0) return [];
  let cursor = -Math.PI / 2;
  return entries
    .filter((e) => e.total > 0)
    .map((e) => {
      const span = (e.total / total) * 2 * Math.PI;
      const seg: DonutSegmentProps = {
        startAngle: cursor,
        endAngle: cursor + span,
        color: e.color,
      };
      cursor += span;
      return seg;
    });
}

export default function CategoryBreakdownCard({ entries }: CategoryBreakdownCardProps) {
  const total = entries.reduce((s, e) => s + e.total, 0);
  const segments = buildSegments(entries);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flexShrink: 0 }}>
              <svg
                width={140}
                height={140}
                viewBox="0 0 140 140"
                role="img"
                aria-label={`Distribuição por categoria — ${String(total)} guias`}
              >
                {segments.map((seg, i) => (
                  <DonutSegment
                    key={i}
                    startAngle={seg.startAngle}
                    endAngle={seg.endAngle}
                    color={seg.color}
                  />
                ))}
                <text
                  x={CENTER}
                  y={CENTER - 4}
                  textAnchor="middle"
                  fontSize={20}
                  fontWeight={700}
                  fill="#0f172a"
                >
                  {total}
                </text>
                <text x={CENTER} y={CENTER + 14} textAnchor="middle" fontSize={10} fill="#64748b">
                  guias na fila
                </text>
              </svg>
            </Box>

            <Box
              sx={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 1.25 }}
            >
              {entries.map((e) => (
                <Box
                  key={e.category}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12 }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: e.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
                    {e.category}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {e.total > 0
                      ? `${String(e.total)} guia${e.total === 1 ? '' : 's'}`
                      : 'sem guias'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
