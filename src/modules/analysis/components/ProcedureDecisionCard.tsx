'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { type SxProps, type Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { type Procedure } from '@/types/pedido';

import { type ProcDecision } from '../types';

interface ProcedureDecisionCardProps {
  procedure: Procedure;
  decision: ProcDecision;
  isGuideFinalized: boolean;
  onDecisionChange: (code: string, decision: ProcDecision) => void;
}

function getApproveButtonSx(isApproved: boolean, isDenied: boolean): SxProps<Theme> {
  const base = { minHeight: 32, fontSize: 12, fontWeight: 600 };
  if (isApproved)
    return { ...base, backgroundColor: 'success.main', '&:hover': { backgroundColor: '#15803d' } };
  if (isDenied)
    return {
      ...base,
      borderColor: 'rgba(0,0,0,0.2)',
      color: 'text.disabled',
      '&:hover': {
        borderColor: 'success.main',
        color: 'success.main',
        backgroundColor: 'rgba(22,163,74,0.04)',
      },
    };
  return {
    ...base,
    borderColor: 'success.main',
    color: 'success.main',
    '&:hover': { backgroundColor: 'rgba(22,163,74,0.06)', borderColor: 'success.main' },
  };
}

function getDenyButtonSx(isApproved: boolean, isDenied: boolean): SxProps<Theme> {
  const base = { minHeight: 32, fontSize: 12, fontWeight: 600 };
  if (isDenied)
    return { ...base, backgroundColor: 'error.main', '&:hover': { backgroundColor: '#b91c1c' } };
  if (isApproved)
    return {
      ...base,
      borderColor: 'rgba(0,0,0,0.2)',
      color: 'text.disabled',
      '&:hover': {
        borderColor: 'error.main',
        color: 'error.main',
        backgroundColor: 'rgba(212,24,61,0.04)',
      },
    };
  return {
    ...base,
    borderColor: 'error.main',
    color: 'error.main',
    '&:hover': { backgroundColor: 'rgba(212,24,61,0.06)', borderColor: 'error.main' },
  };
}

export default function ProcedureDecisionCard({
  procedure,
  decision,
  isGuideFinalized,
  onDecisionChange,
}: ProcedureDecisionCardProps) {
  const isApproved = decision === 'aprovado';
  const isDenied = decision === 'negado';

  return (
    <Box sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1.5, p: 1.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          lineHeight: 1.4,
          mb: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Box component="span" sx={{ fontWeight: 700 }}>
          {procedure.tuss}
        </Box>
        <Box component="span" sx={{ color: 'text.secondary' }}>
          {' '}
          · {procedure.description}
        </Box>
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75 }}>
        <Tooltip
          title={isDenied ? `Trocar para Aprovar — ${procedure.description}` : ''}
          placement="top"
          disableHoverListener={!isDenied}
        >
          <Button
            size="small"
            fullWidth
            variant={isApproved ? 'contained' : 'outlined'}
            startIcon={isApproved ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> : undefined}
            onClick={() => {
              onDecisionChange(procedure.code, isApproved ? 'pendente' : 'aprovado');
            }}
            disabled={isGuideFinalized}
            aria-label={
              isApproved
                ? `Desfazer aprovação de ${procedure.description}`
                : `Aprovar ${procedure.description}`
            }
            sx={getApproveButtonSx(isApproved, isDenied)}
          >
            Aprovar
          </Button>
        </Tooltip>
        <Tooltip
          title={isApproved ? `Trocar para Negar — ${procedure.description}` : ''}
          placement="top"
          disableHoverListener={!isApproved}
        >
          <Button
            size="small"
            fullWidth
            variant={isDenied ? 'contained' : 'outlined'}
            startIcon={isDenied ? <CloseIcon sx={{ fontSize: 14 }} /> : undefined}
            onClick={() => {
              onDecisionChange(procedure.code, isDenied ? 'pendente' : 'negado');
            }}
            disabled={isGuideFinalized}
            aria-label={
              isDenied
                ? `Desfazer negativa de ${procedure.description}`
                : `Negar ${procedure.description}`
            }
            sx={getDenyButtonSx(isApproved, isDenied)}
          >
            Negar
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}
