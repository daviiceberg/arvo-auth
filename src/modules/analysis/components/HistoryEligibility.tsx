'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Component ----
interface HistoryEligibilityProps {
  eligibility: ConsolidatedHistory['elegibilidade'];
  request: Request;
}

export default function HistoryEligibility({ eligibility, request }: HistoryEligibilityProps) {
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
        Elegibilidade e Regras
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {/* Etapa da Autorização -- only for Terapias Especiais */}
        {request.category === 'Terapias Especiais' && request.authorizationStage ? (
          <Box
            sx={{
              p: 1.5,
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              gridColumn: '1 / -1',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                display: 'block',
                mb: 0.75,
              }}
            >
              Etapa da Autorização
            </Typography>
            <Chip
              label={
                request.authorizationStage === 'primeira_solicitacao'
                  ? 'Primeira Solicitação'
                  : 'Continuidade'
              }
              size="small"
              sx={{
                backgroundColor:
                  request.authorizationStage === 'primeira_solicitacao'
                    ? 'rgba(22,163,74,0.1)'
                    : 'rgba(37,99,235,0.1)',
                color:
                  request.authorizationStage === 'primeira_solicitacao'
                    ? 'success.main'
                    : 'info.main',
                fontWeight: 700,
                height: 22,
                fontSize: 12,
              }}
            />
          </Box>
        ) : null}
        {/* Status elegibilidade */}
        <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.75,
            }}
          >
            Status Elegibilidade
          </Typography>
          <Chip
            label={
              eligibility.status === 'ativo'
                ? 'Ativo'
                : eligibility.status === 'suspenso'
                  ? 'Suspenso'
                  : 'Em carência'
            }
            size="small"
            sx={{
              backgroundColor:
                eligibility.status === 'ativo'
                  ? 'rgba(22,163,74,0.1)'
                  : eligibility.status === 'suspenso'
                    ? 'rgba(212,24,61,0.1)'
                    : 'rgba(245,158,11,0.1)',
              color:
                eligibility.status === 'ativo'
                  ? 'success.main'
                  : eligibility.status === 'suspenso'
                    ? 'error.main'
                    : 'warning.main',
              fontWeight: 700,
              height: 22,
              fontSize: 12,
            }}
          />
        </Box>
        {/* Carências */}
        <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.5,
            }}
          >
            Carências
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
            {eligibility.carencias ? 'Sim' : 'Não'}
          </Typography>
          {eligibility.detalhesCarencia ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {eligibility.detalhesCarencia}
            </Typography>
          ) : null}
        </Box>
        {/* Limites contratuais */}
        <Box
          sx={{
            p: 1.5,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 2,
            gridColumn: '1 / -1',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 0.5,
            }}
          >
            Limites Contratuais
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
            {eligibility.limitesContratuais}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
