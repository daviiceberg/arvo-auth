'use client';

import { useRouter } from 'next/navigation';

import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GavelIcon from '@mui/icons-material/Gavel';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type AlertItem } from '../types';

interface DashboardAlertsProps {
  alertas: AlertItem[];
  loading: boolean;
}

function getAlertUrl(tipo: string): string {
  if (tipo === 'SLA Violado') return '/fila?sla=Violado';
  if (tipo === 'Retornos recebidos') return '/fila?status=retorno_recebido';
  return `/fila?alerta=${encodeURIComponent(tipo)}`;
}

function AlertIcon({ tipo, color }: { tipo: string; color: string }) {
  if (tipo === 'Liminar Judicial') return <GavelIcon sx={{ fontSize: 16, color }} />;
  if (tipo === 'SLA Violado') return <TimerOffIcon sx={{ fontSize: 16, color }} />;
  if (tipo === 'Retornos recebidos') return <AssignmentReturnIcon sx={{ fontSize: 16, color }} />;
  return <WarningAmberIcon sx={{ fontSize: 16, color }} />;
}

export default function DashboardAlerts({ alertas, loading }: DashboardAlertsProps) {
  const router = useRouter();

  if (loading || alertas.length === 0) return null;

  const totalCount = alertas.reduce((s, a) => s + a.count, 0);

  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', flex: 1 }}>
            Alertas que requerem atenção
          </Typography>
          <Chip
            label={`${String(totalCount)} no total`}
            size="small"
            sx={{ height: 20, fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(212,24,61,0.08)', color: '#d4183d', '& .MuiChip-label': { px: 1 } }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {alertas.map((alerta) => {
            const url = getAlertUrl(alerta.tipo);
            return (
              <Box
                key={alerta.tipo}
                role="button"
                tabIndex={0}
                onClick={() => { router.push(url); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(url); } }}
                aria-label={`Ver ${String(alerta.count)} pedidos: ${alerta.tipo}`}
                sx={{
                  flex: 1,
                  minWidth: 160,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${alerta.color}22`,
                  backgroundColor: `${alerta.color}07`,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  '&:hover': { backgroundColor: `${alerta.color}12` },
                  '&:focus-visible': { outline: `2px solid ${alerta.color}`, outlineOffset: 2 },
                }}
              >
                <Box sx={{ color: alerta.color, flexShrink: 0 }}>
                  <AlertIcon tipo={alerta.tipo} color={alerta.color} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontSize: 12, color: alerta.color, fontWeight: 700, lineHeight: 1.2, display: 'block' }} noWrap>
                    {alerta.tipo}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: alerta.color, lineHeight: 1.1 }}>
                    {alerta.count}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 12, color: alerta.color, display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, fontWeight: 600 }}
                >
                  Ver pedidos <ChevronRightIcon sx={{ fontSize: 14 }} />
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
