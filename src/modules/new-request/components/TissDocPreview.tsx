'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ts = { fontSize: 9, fontFamily: '"Space Grotesk", sans-serif' } as const;
const tsBold = { ...ts, fontWeight: 700 } as const;
const tsLabel = {
  ...ts,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.3,
  fontWeight: 600,
};
const tsValue = { ...ts, color: '#111827', fontWeight: 500 };
const tsHighlight = { ...tsValue, backgroundColor: '#fef9c3' };

function TissCell({
  label,
  value,
  highlight,
  span,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  span?: boolean;
}) {
  return (
    <Box
      sx={{
        border: '1px solid #d1d5db',
        borderRadius: 0,
        px: 1,
        py: 0.5,
        gridColumn: span ? '1 / -1' : undefined,
        minHeight: 34,
      }}
    >
      <Typography sx={tsLabel}>{label}</Typography>
      <Typography sx={highlight ? tsHighlight : tsValue}>{value}</Typography>
    </Box>
  );
}

interface TissDocPreviewProps {
  zoom: number;
  rotation: number;
}

export function TissDocPreview({ zoom, rotation }: TissDocPreviewProps) {
  return (
    <Box
      sx={{
        transform: `scale(${String(zoom / 100)}) rotate(${String(rotation)}deg)`,
        transformOrigin: 'top center',
        transition: 'transform 200ms ease',
        width: '100%',
        maxWidth: 620,
        backgroundColor: '#fff',
        border: '1px solid #d1d5db',
        fontFamily: '"Space Grotesk", sans-serif',
        mx: 'auto',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header faixa */}
      <Box
        sx={{
          backgroundColor: '#902B29',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            ...tsBold,
            fontSize: 10,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Guia de Solicitação / Autorização de Procedimentos — TISS 3.06
        </Typography>
        <Box sx={{ backgroundColor: '#fef9c3', px: 1, py: 0.25, borderRadius: 0.5 }}>
          <Typography sx={{ ...tsBold, fontSize: 9, color: '#b45309' }}>ATIVO</Typography>
        </Box>
      </Box>

      {/* Linha 1: identificação da guia */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1.5fr 1fr',
          borderBottom: '1px solid #d1d5db',
        }}
      >
        <TissCell label="Nº Guia / Senha" value="38697095" />
        <TissCell label="Dt. Emissão" value="24/03/2026" />
        <TissCell label="Auditoria / Operadora" value="LMGRIGOLETTO" highlight />
        <TissCell label="Emitida Por" value="LMGRIGOLETTO" highlight />
      </Box>

      {/* Linha 2: beneficiário */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography
            sx={{
              ...tsBold,
              fontSize: 9,
              color: '#902B29',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Beneficiário
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 1fr',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <TissCell label="Nome Completo" value="ANA CLARA BRUDER DA SILVA" highlight />
          <TissCell label="Nº Carteirinha" value="294999110 / 471" highlight />
          <TissCell label="Data de Nascimento" value="08/06/1980" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr' }}>
          <TissCell label="Unidade" value="AMBULATORIAL" />
          <TissCell
            label="Plano / Operadora"
            value="SAÚDE PLENA 1 — AMHC/OP (PB) — 471"
            highlight
          />
          <TissCell label="Val. Carteirinha" value="31/12/2026" />
        </Box>
      </Box>

      {/* Linha 3: prestador + médico */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography
            sx={{
              ...tsBold,
              fontSize: 9,
              color: '#902B29',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Prestador / Médico Solicitante
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <TissCell
            label="Hospital / Prestador"
            value="CIN — CENTRO INTEGRADO DE NEURODESENVO..."
            highlight
          />
          <TissCell label="CNES" value="2749109" />
          <TissCell label="Contato" value="(44) 00076-7731" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
          <TissCell label="Médico Assistente" value="NEANDER CUELLAR OLIVEIRA" highlight />
          <TissCell label="CRM" value="CRM/PR 19485" highlight />
          <TissCell label="Autorização de Origem" value="—" />
        </Box>
      </Box>

      {/* Linha 4: dados clínicos */}
      <Box sx={{ borderBottom: '1px solid #d1d5db' }}>
        <Box sx={{ backgroundColor: '#f3f4f6', px: 2, py: 0.5, borderBottom: '1px solid #e5e7eb' }}>
          <Typography
            sx={{
              ...tsBold,
              fontSize: 9,
              color: '#902B29',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Dados Clínicos
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <TissCell label="Procedimento Solicitado" value="PSICOLOGIA" highlight />
          <TissCell label="Caráter Atendimento" value="ELETIVA" />
          <TissCell label="Dt. Solicitação" value="08/05/2026" />
          <TissCell label="Regime" value="AMBULATORIAL" />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ border: '1px solid #d1d5db', px: 1, py: 0.5, gridColumn: '1 / -1' }}>
            <Typography sx={tsLabel}>CID Principal</Typography>
            <Typography sx={{ ...tsValue, backgroundColor: '#fef9c3' }}>
              F84.0 — Autismo infantil
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <TissCell label="Tipo/Subtipo" value="E3 - OUTRAS TERAPIAS" />
          <TissCell label="Nº Sessões" value="—" />
          <TissCell label="Dt. Atendimento" value="24/03/2026" />
          <TissCell label="Cidade" value="MARINGÁ" />
        </Box>
      </Box>

      {/* Linha 5: recebimento + status */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr' }}>
        <TissCell label="Dt. Recebimento" value="24/03/2026 10:42:31" />
        <TissCell label="Médico Resp. pela Guia" value="LMGRIGOLETTO" />
        <Box
          sx={{
            border: '1px solid #d1d5db',
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography sx={tsLabel}>Status Geral da Guia</Typography>
          <Box
            sx={{
              backgroundColor: '#fef9c3',
              border: '1px solid #fde047',
              px: 0.75,
              py: 0.25,
              borderRadius: 0.5,
              ml: 0.5,
            }}
          >
            <Typography sx={{ ...tsBold, fontSize: 9, color: '#b45309' }}>
              PROCEDIMENTO NÃO REALIZADO
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
