'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { CategoryChip, DecisionActionChip } from '@/shared/components';
import { type HistoryEntry } from '@/types/pedido';

interface HistoryDetailHeaderProps {
  entry: HistoryEntry;
  currentIndex: number;
  total: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function HistoryDetailHeader({
  entry,
  currentIndex,
  total,
  onBack,
  onPrev,
  onNext,
}: HistoryDetailHeaderProps) {
  return (
    <Box
      sx={{
        px: 3,
        py: 1.75,
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: 13 }} />}
        size="small"
        onClick={onBack}
        sx={{
          color: 'text.secondary',
          mb: 0.75,
          p: 0,
          minHeight: 'auto',
          fontSize: 12,
          '&:hover': { backgroundColor: 'transparent', color: 'primary.main' },
        }}
      >
        Histórico
      </Button>

      {/* Row 1: ID + chips + navigator */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {entry.id}
          </Typography>
          <CategoryChip category={entry.category} />
          <DecisionActionChip action={entry.action} />
          {entry.alerts && entry.alerts.length > 0
            ? entry.alerts.map((alerta) => (
                <Chip
                  key={alerta}
                  icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
                  label={alerta}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    color: 'warning.main',
                    fontWeight: 700,
                    height: 22,
                  }}
                />
              ))
            : null}
        </Box>

        {/* Navigator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.13)',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <IconButton
            size="small"
            onClick={onPrev}
            disabled={currentIndex === 0}
            sx={{
              borderRadius: 0,
              px: 1,
              py: 0.75,
              color: 'text.secondary',
              '&:not(:disabled):hover': {
                backgroundColor: 'rgba(144,43,41,0.06)',
                color: 'primary.main',
              },
              '&:disabled': { opacity: 0.35 },
            }}
          >
            <NavigateBeforeIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box
            sx={{
              px: 1.5,
              borderLeft: '1px solid rgba(0,0,0,0.1)',
              borderRight: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: 'text.primary',
                whiteSpace: 'nowrap',
                lineHeight: '30px',
              }}
            >
              {currentIndex + 1}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {' '}
                de {total}
              </Box>
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onNext}
            disabled={currentIndex === total - 1}
            sx={{
              borderRadius: 0,
              px: 1,
              py: 0.75,
              color: 'text.secondary',
              '&:not(:disabled):hover': {
                backgroundColor: 'rgba(144,43,41,0.06)',
                color: 'primary.main',
              },
              '&:disabled': { opacity: 0.35 },
            }}
          >
            <NavigateNextIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Row 2: meta info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 0.75, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <LocalHospitalOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {entry.executingProviderName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Protocolo: {entry.protocolDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Decisão: {entry.decisionDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
