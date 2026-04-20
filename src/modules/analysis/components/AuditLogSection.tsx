'use client';

import { useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineIcon from '@mui/icons-material/Timeline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { type AuditLogEntry } from '@/types/pedido';

interface AuditLogSectionProps {
  entries: AuditLogEntry[];
}

export default function AuditLogSection({ entries }: AuditLogSectionProps) {
  const [open, setOpen] = useState(true);

  if (entries.length === 0) return null;

  return (
    <Card>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15 }}>
              Histórico de Ações
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: 'text.secondary',
                fontWeight: 600,
                backgroundColor: 'rgba(0,0,0,0.05)',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              {entries.length} {entries.length === 1 ? 'ação' : 'ações'}
            </Typography>
          </Box>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>
        <Collapse in={open}>
          <Box sx={{ mt: 2.5 }}>
            {entries.map((entry, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  position: 'relative',
                  pb: idx < entries.length - 1 ? 0 : 0,
                  ml: 0.5,
                }}
              >
                {/* Timeline rail */}
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
                  {idx < entries.length - 1 ? (
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

                {/* Content */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    pb: idx < entries.length - 1 ? 2 : 0,
                    borderBottom: idx < entries.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                    mb: idx < entries.length - 1 ? 0.5 : 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 13, lineHeight: 1.4 }}
                  >
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
        </Collapse>
      </CardContent>
    </Card>
  );
}
