'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { type IAFieldStatus, type IAExtractionField } from '../utils/ia-extraction';

// ---- Helpers ----
function IAFieldIcon({ status }: { status: IAFieldStatus }) {
  if (status === 'ok')
    return <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'success.main', flexShrink: 0 }} />;
  if (status === 'warning')
    return <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main', flexShrink: 0 }} />;
  return <ErrorOutlineIcon sx={{ fontSize: 14, color: 'error.main', flexShrink: 0 }} />;
}

// ---- Component ----
interface IAExtractionPanelProps {
  isOpen: boolean;
  isProcessing: boolean;
  fields: IAExtractionField[] | null;
  onToggle: () => void;
}

export default function IAExtractionPanel({
  isOpen,
  isProcessing,
  fields,
  onToggle,
}: IAExtractionPanelProps) {
  return (
    <>
      {/* Toggle bar */}
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 2,
          py: 0.75,
          borderTop: '1px solid rgba(0,0,0,0.04)',
          backgroundColor: isOpen ? 'rgba(37,99,235,0.03)' : 'transparent',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(37,99,235,0.05)' },
          transition: 'background-color 0.12s ease',
        }}
      >
        <SmartToyIcon sx={{ fontSize: 13, color: 'info.main' }} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'info.main', flex: 1 }}>
          {isProcessing ? 'IA processando...' : 'IA extraiu'}
        </Typography>
        <Box
          sx={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
            display: 'flex',
            color: 'text.secondary',
          }}
        >
          <ExpandMoreIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* Expandable content */}
      <Collapse in={isOpen}>
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 2,
            backgroundColor: 'rgba(37,99,235,0.02)',
            borderTop: '1px solid rgba(37,99,235,0.08)',
          }}
        >
          {isProcessing ? (
            <Typography sx={{ fontSize: 12, color: 'info.main', fontStyle: 'italic' }}>
              Analisando documento... aguarde.
            </Typography>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  mb: 1.25,
                }}
              >
                Leitura do documento pela IA
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {(fields ?? []).map((field) => (
                  <Box key={field.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <IAFieldIcon status={field.status} />
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                      <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {field.label}:
                      </Box>{' '}
                      {field.valor}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </>
  );
}
