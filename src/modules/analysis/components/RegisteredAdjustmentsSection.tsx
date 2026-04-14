'use client';

import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { type Adjustment } from '@/types/pedido';

function formatAdjustmentTimestamp(ts: string): string {
  const d = new Date(ts);
  return `${d.toLocaleDateString('pt-BR')} · ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

interface RegisteredAdjustmentsSectionProps {
  adjustments: Adjustment[];
}

export default function RegisteredAdjustmentsSection({
  adjustments,
}: RegisteredAdjustmentsSectionProps) {
  const [collapsed, setCollapsed] = useState(true);
  if (adjustments.length === 0) return null;

  const fieldLabel: Record<Adjustment['field'], string> = {
    quantidade: 'Qtd. autorizada alterada',
    prestador: 'Prestador executante alterado',
    codigo: 'Código do procedimento alterado',
    fabricante: 'Fabricante alterado',
    valorUnitario: 'Valor unitário alterado',
    dut: 'DUT alterada',
  };

  return (
    <Card
      sx={{
        border: '1px solid rgba(245,158,11,0.35) !important',
        backgroundColor: 'rgba(255,251,235,0.6)',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box
          onClick={() => {
            setCollapsed((v) => !v);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ fontSize: 15, color: 'primary.main' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>
              Ajustes Registrados ({adjustments.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: 'primary.main', fontWeight: 600 }}>
              {collapsed ? 'ver todos' : 'recolher'}
            </Typography>
            <ExpandMoreIcon
              sx={{
                fontSize: 16,
                color: 'primary.main',
                transform: collapsed ? 'none' : 'rotate(180deg)',
                transition: 'transform 200ms',
              }}
            />
          </Box>
        </Box>
        <Collapse in={!collapsed}>
          <Box sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {adjustments.map((aj) => (
              <Box
                key={aj.id}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 1.5,
                  p: 1.75,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 0.75,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <EditIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {fieldLabel[aj.field]}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 11, flexShrink: 0, ml: 1 }}
                  >
                    {formatAdjustmentTimestamp(aj.timestamp)}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12, display: 'block', mb: 0.5 }}
                >
                  {aj.procedureCode} — {aj.procedureDescription}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mb: 0.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>De:</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{aj.previousValue}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>→ Para:</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'primary.main' }}>
                    {aj.newValue}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12, display: 'block', mb: 0.25 }}
                >
                  Motivo: {aj.reason}
                </Typography>
                {aj.justification ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 12, display: 'block', mb: 0.25, fontStyle: 'italic' }}
                  >
                    {aj.justification}
                  </Typography>
                ) : null}
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Por: {aj.operator} ({aj.profile})
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
