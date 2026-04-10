'use client';

import React, { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { decisionActionConfigMap } from '@/shared/constants';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Helpers ----
type Decision = 'aprovado' | 'negado' | 'ajustado';

const decisionKeyMap: Record<Decision, keyof typeof decisionActionConfigMap> = {
  aprovado: 'Aprovado',
  negado: 'Negado',
  ajustado: 'Aprovado Parcial',
};

function decisionIcon(d: Decision) {
  const { color } = decisionActionConfigMap[decisionKeyMap[d]];
  if (d === 'aprovado') return <CheckIcon sx={{ fontSize: 14, color }} />;
  if (d === 'negado') return <CloseIcon sx={{ fontSize: 14, color }} />;
  return <WarningAmberIcon sx={{ fontSize: 14, color }} />;
}

function decisionChipColor(d: Decision) {
  const { bg, color } = decisionActionConfigMap[decisionKeyMap[d]];
  return { bg, color };
}

// ---- Component ----
interface HistoryAuthorizationsProps {
  authorizations: ConsolidatedHistory['autorizacoesAnteriores'];
}

export default function HistoryAuthorizations({ authorizations }: HistoryAuthorizationsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? authorizations : authorizations.slice(0, 3);

  return (
    <>
      <Divider sx={{ mb: 2.5 }} />

      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 12,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1.5,
        }}
      >
        Autorizações Anteriores
      </Typography>
      {authorizations.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 2 }}>
          Nenhuma autorização anterior registrada.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
          {visible.map((auth) => {
            const dc = decisionChipColor(auth.decisao);
            return (
              <Box
                key={auth.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 1.5,
                  backgroundColor: auth.destaque ? 'rgba(245,158,11,0.04)' : 'transparent',
                }}
              >
                <Box sx={{ flexShrink: 0 }}>{decisionIcon(auth.decisao)}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, mb: 0.25 }}>
                    {auth.procedimento}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                    {auth.data} · CID {auth.cid} · {auth.motivo}
                  </Typography>
                </Box>
                <Chip
                  label={auth.decisao}
                  size="small"
                  sx={{
                    backgroundColor: dc.bg,
                    color: dc.color,
                    fontWeight: 700,
                    height: 20,
                    fontSize: 12,
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
      {authorizations.length > 3 && (
        <Button
          size="small"
          onClick={() => {
            setShowAll(!showAll);
          }}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showAll ? 'rotate(180deg)' : 'none',
                transition: '0.2s',
                fontSize: 16,
              }}
            />
          }
          sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'none', mb: 1.5 }}
        >
          {showAll ? 'Mostrar menos' : `Ver mais ${String(authorizations.length - 3)} registros`}
        </Button>
      )}
    </>
  );
}
