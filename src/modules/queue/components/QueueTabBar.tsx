'use client';

import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

interface QueueTabBarProps {
  tabValue: number;
  totalCount: number;
  urgEmergCount: number;
  returnsCount: number;
  returnsWaiting: number;
  returnsReceived: number;
  stalled12h: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
  onTabChange: (value: number) => void;
  onReturnSubFilterChange: (value: 'all' | 'aguardando' | 'retorno') => void;
}

export default function QueueTabBar({
  tabValue,
  totalCount,
  urgEmergCount,
  returnsCount,
  returnsWaiting,
  returnsReceived,
  stalled12h,
  returnSubFilter,
  onTabChange,
  onReturnSubFilterChange,
}: QueueTabBarProps) {
  return (
    <>
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
                Urgência/Emergência
                <Chip
                  label={urgEmergCount}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: 'rgba(212,24,61,0.1)',
                    color: 'error.main',
                  }}
                />
              </Box>
            }
            aria-label="Urgência/Emergência"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Devolutivas
                <Chip
                  label={returnsCount}
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
            aria-label="Devolutivas"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                SLA em Risco
                <Chip
                  label={stalled12h}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: 'rgba(234,88,12,0.1)',
                    color: '#ea580c',
                  }}
                />
              </Box>
            }
            aria-label="SLA em Risco"
          />
        </Tabs>
      </Box>

      {/* Devolutivas sub-filter chips */}
      {tabValue === 2 && (
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: 'rgba(245,158,11,0.03)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              mr: 0.5,
            }}
          >
            Filtrar:
          </Typography>
          {(
            [
              { key: 'all', label: `Todas (${String(returnsCount)})`, icon: null },
              {
                key: 'aguardando',
                label: `Aguardando (${String(returnsWaiting)})`,
                icon: <HourglassTopIcon sx={{ fontSize: 13 }} />,
              },
              {
                key: 'retorno',
                label: `Retorno recebido (${String(returnsReceived)})`,
                icon: <MoveToInboxIcon sx={{ fontSize: 13 }} />,
              },
            ] as const
          ).map(({ key, label, icon }) => (
            <Chip
              key={key}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {icon}
                  {label}
                </Box>
              }
              size="small"
              onClick={() => {
                onReturnSubFilterChange(key);
              }}
              sx={{
                height: 24,
                fontSize: 12,
                fontWeight: returnSubFilter === key ? 700 : 500,
                backgroundColor:
                  returnSubFilter === key ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.05)',
                color: returnSubFilter === key ? 'warning.main' : 'text.secondary',
                border:
                  returnSubFilter === key
                    ? '1px solid rgba(245,158,11,0.4)'
                    : '1px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </>
  );
}
