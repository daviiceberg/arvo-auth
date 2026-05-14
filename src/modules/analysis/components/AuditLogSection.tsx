'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type AuditLogEntry } from '@/types/pedido';

interface AuditLogSectionProps {
  entries: AuditLogEntry[];
}

/**
 * CONVENÇÃO DE ORDENAÇÃO:
 * Eventos são recebidos em ordem cronológica ascendente (mais antigo → mais recente)
 * e exibidos em ordem descendente (mais recente no topo). Esta inversão acontece
 * dentro deste componente — não modificar a ordem nos mocks ou no payload do BE.
 */
export default function AuditLogSection({ entries }: AuditLogSectionProps) {
  if (entries.length === 0) return null;

  const orderedEntries = [...entries].reverse();

  return (
    <CollapsibleCard
      title="Histórico de Ações"
      headerRight={
        <Chip
          label={`${String(entries.length)} ${entries.length === 1 ? 'ação' : 'ações'}`}
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: 'rgba(0,0,0,0.05)',
            color: 'text.secondary',
          }}
        />
      }
    >
      <Box>
        {orderedEntries.map((entry, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              gap: 1.5,
              position: 'relative',
              pb: idx < orderedEntries.length - 1 ? 0 : 0,
              ml: 0.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: 12,
                pt: '3px',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? 'primary.main' : 'rgba(0,0,0,0.12)',
                  border: idx === 0 ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              />
              {idx < orderedEntries.length - 1 ? (
                <Box
                  sx={{
                    width: '1px',
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    mt: '4px',
                    mb: '-1px',
                  }}
                />
              ) : null}
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                pb: idx < orderedEntries.length - 1 ? 2 : 0,
                borderBottom:
                  idx < orderedEntries.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                mb: idx < orderedEntries.length - 1 ? 0.5 : 0,
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, lineHeight: 1.4 }}>
                {entry.action}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: 'text.disabled', display: 'block', mt: 0.25 }}
              >
                {entry.actor} · {entry.timestamp}
              </Typography>
              {entry.details ? (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    display: 'block',
                    mt: 0.5,
                    pl: 1.5,
                    borderLeft: '2px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {entry.details}
                </Typography>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>
    </CollapsibleCard>
  );
}
