'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

interface QueueTabBarProps {
  tabValue: number;
  totalCount: number;
  warningCount: number;
  violatedCount: number;
  onTabChange: (value: number) => void;
}

export default function QueueTabBar({
  tabValue,
  totalCount,
  warningCount,
  violatedCount,
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
      </Tabs>
    </Box>
  );
}
