'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type ConsolidatedHistory } from '../constants/consolidated-history-data';

// ---- Component ----
interface HistoryConsultationsProps {
  consultations: ConsolidatedHistory['consultasRecentes'];
  relatedProcedures: string;
  hospitalizations: ConsolidatedHistory['internacoes'];
  recurrentCid: ConsolidatedHistory['cidRecorrente'];
  monthlySessions?: ConsolidatedHistory['sessoesDoMes'];
}

export default function HistoryConsultations({
  consultations,
  relatedProcedures,
  hospitalizations,
  recurrentCid,
  monthlySessions,
}: HistoryConsultationsProps) {
  return (
    <>
      <Divider sx={{ mb: 2.5 }} />

      {/* Resumo Assistencial */}
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
        Resumo Assistencial
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
        {/* Consultas recentes */}
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
            Consultas Recentes
          </Typography>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}
          >
            {consultations.count}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {consultations.periodo}
          </Typography>
          {consultations.especialidades.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
            >
              {consultations.especialidades.join(', ')}
            </Typography>
          )}
        </Box>
        {/* Procedimentos relacionados */}
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
            Procedimentos Relacionados
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.5, color: '#374151' }}>
            {relatedProcedures}
          </Typography>
        </Box>
        {/* Internações */}
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
            Internações
          </Typography>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}
          >
            {hospitalizations.count}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {hospitalizations.periodo}
          </Typography>
          {hospitalizations.detalhes ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
            >
              {hospitalizations.detalhes}
            </Typography>
          ) : null}
        </Box>
        {/* CID recorrente */}
        <Box
          sx={{
            p: 1.5,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 2,
            backgroundColor: recurrentCid ? 'rgba(245,158,11,0.06)' : 'transparent',
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
            CID Recorrente
          </Typography>
          {recurrentCid ? (
            <>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#92400e' }}>
                {recurrentCid.cid} ({recurrentCid.count}x)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {recurrentCid.descricao}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              Primeira ocorrência
            </Typography>
          )}
        </Box>
      </Box>

      {/* Sessões do Mês */}
      {monthlySessions && monthlySessions.length > 0 ? (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: 0.5,
              display: 'block',
              mb: 1,
            }}
          >
            Sessões Mensais
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {monthlySessions.map((s) => {
              if (s.cidF84) {
                return (
                  <Box
                    key={s.tipo}
                    sx={{
                      p: 1.5,
                      border: '1px solid rgba(37,99,235,0.25)',
                      borderRadius: 2,
                      backgroundColor: 'rgba(37,99,235,0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: 12 }}>
                          {s.tipo}
                        </Typography>
                        {s.dut ? (
                          <Chip
                            label={s.dut}
                            size="small"
                            sx={{
                              fontSize: 10,
                              height: 18,
                              backgroundColor: 'rgba(37,99,235,0.1)',
                              color: 'info.main',
                              fontWeight: 600,
                              '& .MuiChip-label': { px: 0.75 },
                            }}
                          />
                        ) : null}
                      </Box>
                      <Chip
                        label="Ilimitado (RN 539)"
                        size="small"
                        sx={{
                          fontSize: 10,
                          height: 18,
                          backgroundColor: 'rgba(37,99,235,0.1)',
                          color: 'info.main',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: 'info.main', fontWeight: 500 }}
                    >
                      {s.utilizadas} sessões utilizadas · Sem limite contratual — RN 539/2022
                    </Typography>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(37,99,235,0.15)',
                        mt: 0.75,
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 3,
                          backgroundColor: 'info.main',
                          opacity: 0.5,
                        }}
                      />
                    </Box>
                  </Box>
                );
              }
              const pct = Math.min((s.utilizadas / s.autorizadas) * 100, 100);
              const barColor =
                pct >= 100 ? 'error.main' : pct >= 80 ? 'warning.light' : 'success.main';
              return (
                <Box
                  key={s.tipo}
                  sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.75,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="caption" fontWeight={600} sx={{ fontSize: 12 }}>
                        {s.tipo}
                      </Typography>
                      {s.dut ? (
                        <Chip
                          label={s.dut}
                          size="small"
                          sx={{
                            fontSize: 10,
                            height: 18,
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            color: 'text.secondary',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 0.75 },
                          }}
                        />
                      ) : null}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 12, fontWeight: 700, color: barColor }}
                    >
                      {s.utilizadas}/{s.autorizadas} sessões
                    </Typography>
                  </Box>
                  <Box sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.08)' }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: `${String(pct)}%`,
                        borderRadius: 3,
                        backgroundColor: barColor,
                        transition: 'width 400ms ease',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : null}
    </>
  );
}
