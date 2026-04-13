'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

const FIELD_LABELS: Record<string, string> = {
  quantidade: 'Quantidade autorizada',
  prestador: 'Prestador executante',
  codigo: 'Código do procedimento',
};

function getFieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

interface AnalystDecisionSectionProps {
  entry: HistoryEntry;
}

export default function AnalystDecisionSection({ entry }: AnalystDecisionSectionProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2.5, mb: 1.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: 'text.secondary',
              fontWeight: 600,
              display: 'block',
              mb: 0.25,
            }}
          >
            Responsável
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
              {entry.analyst}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: 'text.secondary',
              fontWeight: 600,
              display: 'block',
              mb: 0.25,
            }}
          >
            Data da decisão
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {entry.decisionDate}
          </Typography>
        </Box>
      </Box>
      {entry.analysisTimeMin > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Tempo de análise: <strong>{entry.analysisTimeMin} min</strong>
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: '#f9fafb',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: 'text.secondary',
            display: 'block',
            mb: 0.75,
          }}
        >
          Motivo da Decisão
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>
          {entry.decisionReason}
        </Typography>
        {entry.freeText ? (
          <Typography
            variant="caption"
            sx={{ fontSize: 12, color: 'text.secondary', mt: 1, display: 'block', lineHeight: 1.5 }}
          >
            {entry.freeText}
          </Typography>
        ) : null}
      </Box>

      {/* Ajustes aplicados */}
      {entry.adjustments && entry.adjustments.length > 0 ? (
        <Box
          sx={{
            backgroundColor: 'rgba(255,251,235,0.8)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 2,
            p: 2,
            mt: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: 'warning.main',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              display: 'block',
              mb: 1.25,
            }}
          >
            Ajustes Aplicados
          </Typography>
          <Divider sx={{ mb: 1.25, borderColor: 'rgba(245,158,11,0.2)' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {entry.adjustments.map((aj) => (
              <Box key={aj.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <EditIcon sx={{ fontSize: 13, color: 'warning.main', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                    {getFieldLabel(aj.field)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mb: 0.25,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Solicitado:
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{aj.previousValue}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    → Autorizado:
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'warning.main' }}>
                    {aj.newValue}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11, display: 'block', mb: 0.25 }}
                >
                  Motivo: {aj.reason}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Por: {aj.operator} · {new Date(aj.timestamp).toLocaleDateString('pt-BR')}{' '}
                  {new Date(aj.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
