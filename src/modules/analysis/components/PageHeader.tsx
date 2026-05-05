'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

import { type Request } from '@/types/pedido';

import { formatSlaDisplay } from '../utils/format-sla';

interface PageHeaderProps {
  request: Request;
  onBack: () => void;
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PageHeader({
  request,
  onBack,
  currentIndex,
  total,
  onPrev,
  onNext,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        px: 3,
        py: 1.75,
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        flexShrink: 0,
      }}
    >
      {/* Back link */}
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
        Fila de Análise
      </Button>

      {/* Row 1: ID + chips + navigator */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1 }}>
            {request.id}
          </Typography>
          {/* Senha + Validade — removidos em M1; reintroduzir em M2 após decisão favorável */}
          {request.slaStatus === 'violated' && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
              label="SLA Violado"
              size="small"
              sx={{
                backgroundColor: 'rgba(212,24,61,0.1)',
                color: 'error.main',
                fontWeight: 700,
                height: 22,
              }}
            />
          )}
          {request.slaStatus === 'warning' && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
              label="SLA em Risco"
              size="small"
              sx={{
                backgroundColor: 'rgba(245,158,11,0.12)',
                color: 'warning.main',
                fontWeight: 700,
                height: 22,
              }}
            />
          )}
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
            mb: 0.75,
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

      {/* Row 2: hospital + entry date + origem | shortcuts hint (right) */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocalHospitalOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {request.executingProvider.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Entrada: {request.protocolDate}
            </Typography>
          </Box>
          {(() => {
            const sla = formatSlaDisplay(
              request.slaStatus,
              request.slaText,
              request.queueTimeHours,
              request.slaDeadlineHours,
            );
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: sla.color }} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 12, fontWeight: 600, color: sla.color }}
                >
                  {sla.text}
                </Typography>
              </Box>
            );
          })()}
        </Box>

        {/* Keyboard shortcuts hint -- aligned below navigator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {[
            ['← →', 'Navegar'],
            ['A', 'Aprovar'],
            ['N', 'Negar'],
            ['P', 'Pendenciar'],
            ['?', 'Ajuda'],
          ].map(([key, label]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <Box
                sx={{
                  px: 0.6,
                  py: 0.1,
                  backgroundColor: 'rgba(0,0,0,0.07)',
                  borderRadius: 0.75,
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'text.secondary',
                  lineHeight: '16px',
                }}
              >
                {key}
              </Box>
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
