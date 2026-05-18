'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { regulatoryAlertColorMap } from '@/shared/constants';

interface QueueTabBarProps {
  tabValue: number;
  totalCount: number;
  warningCount: number;
  violatedCount: number;
  devolutivasCount?: number;
  liminaresCount?: number;
  nipsCount?: number;
  opmeCount?: number;
  onTabChange: (value: number) => void;
}

export default function QueueTabBar({
  tabValue,
  totalCount,
  warningCount,
  violatedCount,
  devolutivasCount = 0,
  liminaresCount = 0,
  nipsCount = 0,
  opmeCount = 0,
  onTabChange,
}: QueueTabBarProps) {
  return (
    <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
      <Tabs
        value={tabValue}
        onChange={(_e, v) => {
          onTabChange(v as number);
        }}
        aria-label="Abas da fila"
        sx={{
          px: 2,
          '& .MuiTab-root': { minHeight: 48, fontSize: 13, fontWeight: 600 },
          '& .Mui-selected': { color: 'primary.main' },
          '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
        }}
      >
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Fila Geral
              <Chip
                label={totalCount}
                size="small"
                sx={{ height: 18, fontSize: 12, fontWeight: 700 }}
              />
            </Box>
          }
          aria-label="Fila Geral"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Liminares Judiciais
              <Chip
                label={liminaresCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: regulatoryAlertColorMap.liminares.bg,
                  color: regulatoryAlertColorMap.liminares.color,
                }}
              />
            </Box>
          }
          aria-label="Liminares Judiciais ativas"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              NIPs Abertas
              <Chip
                label={nipsCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: regulatoryAlertColorMap.nips.bg,
                  color: regulatoryAlertColorMap.nips.color,
                }}
              />
            </Box>
          }
          aria-label="NIPs Abertas — RN 483/2022"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              SLA Violado
              <Chip
                label={violatedCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: 'rgba(212,24,61,0.1)',
                  color: '#d4183d',
                }}
              />
            </Box>
          }
          aria-label="SLA Violado"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              SLA em Risco
              <Chip
                label={warningCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: 'rgba(245,158,11,0.12)',
                  color: 'warning.main',
                }}
              />
            </Box>
          }
          aria-label="SLA em Risco"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Devolutivas
              <Chip
                label={devolutivasCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: regulatoryAlertColorMap.devolutivas.bg,
                  color: regulatoryAlertColorMap.devolutivas.color,
                }}
              />
            </Box>
          }
          aria-label="Devolutivas (Pendência e Junta Médica)"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Tem OPME
              <Chip
                label={opmeCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: regulatoryAlertColorMap.opme.bg,
                  color: regulatoryAlertColorMap.opme.color,
                }}
              />
            </Box>
          }
          aria-label="Pedidos com OPME (standalone + embutido em cirurgia/oncologia)"
        />
      </Tabs>
    </Box>
  );
}
