'use client';

import EmergencyIcon from '@mui/icons-material/Emergency';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReplayIcon from '@mui/icons-material/Replay';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { MetricCard } from '@/shared/components';

interface QueueMetricsRowProps {
  totalCount: number;
  urgEmergCount: number;
  returnsCount: number;
  stalled12h: number;
  loading: boolean;
  onTabChange: (tab: number) => void;
}

export default function QueueMetricsRow({
  totalCount,
  urgEmergCount,
  returnsCount,
  stalled12h,
  loading,
  onTabChange,
}: QueueMetricsRowProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: 140 }}>
            <Skeleton variant="rectangular" height={88} sx={{ borderRadius: 2 }} />
          </Box>
        ))
      ) : (
        <>
          <MetricCard
            value={totalCount}
            label="Na Fila de Análise"
            sublabel="Total de pedidos ativos"
            linkLabel="Ver todos os pedidos"
            onLinkClick={() => {
              onTabChange(0);
            }}
            icon={<FormatListBulletedIcon sx={{ fontSize: 18, color: '#902B29' }} />}
            iconBg="rgba(144,43,41,0.1)"
          />
          <MetricCard
            value={urgEmergCount}
            label="Urgência / Emergência"
            sublabel="Requerem atenção imediata"
            linkLabel="Ver pedidos em U/E"
            onLinkClick={() => {
              onTabChange(1);
            }}
            valueColor="#d4183d"
            icon={<EmergencyIcon sx={{ fontSize: 18, color: '#d4183d' }} />}
            iconBg="rgba(212,24,61,0.1)"
          />
          <MetricCard
            value={returnsCount}
            label="Devolutivas"
            sublabel="Aguardando complemento"
            linkLabel="Ver as devolutivas"
            onLinkClick={() => {
              onTabChange(2);
            }}
            valueColor="#b45309"
            icon={<ReplayIcon sx={{ fontSize: 18, color: '#b45309' }} />}
            iconBg="rgba(245,158,11,0.12)"
          />
          <MetricCard
            value={stalled12h}
            label="Parados há mais de 12h"
            sublabel="SLA em risco"
            linkLabel="Ver pedidos"
            onLinkClick={() => {
              onTabChange(3);
            }}
            valueColor="#ea580c"
            icon={<TimerOffIcon sx={{ fontSize: 18, color: '#ea580c' }} />}
            iconBg="rgba(234,88,12,0.1)"
          />
        </>
      )}
    </Box>
  );
}
