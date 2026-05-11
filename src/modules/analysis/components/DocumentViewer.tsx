'use client';

import React from 'react';

import Image from 'next/image';

import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// ---- Component ----
interface DocumentViewerProps {
  docName: string | null;
  zoom: number;
  onZoomChange: (updater: (prev: number) => number) => void;
  onClose: () => void;
}

export default function DocumentViewer({
  docName,
  zoom,
  onZoomChange,
  onClose,
}: DocumentViewerProps) {
  return (
    <Dialog
      open={!!docName}
      onClose={onClose}
      maxWidth={false}
      aria-labelledby="doc-viewer-title"
      slotProps={{
        paper: {
          sx: {
            width: 860,
            maxWidth: '95vw',
            height: '90vh',
            maxHeight: '90vh',
            backgroundColor: '#fff',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            m: 0,
            border: '1px solid rgba(0,0,0,0.04)',
          },
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          height: 52,
          flexShrink: 0,
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionOutlinedIcon sx={{ color: 'text.secondary', fontSize: 17 }} />
          <Typography
            id="doc-viewer-title"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: 'text.primary',
              maxWidth: 320,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {docName}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled', ml: 0.5 }}>
            — Esc para fechar
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Reduzir zoom">
            <span>
              <IconButton
                size="small"
                aria-label="Reduzir zoom"
                onClick={() => {
                  onZoomChange((z) => Math.max(50, z - 10));
                }}
                disabled={zoom <= 50}
                sx={{ color: 'text.secondary' }}
              >
                <ZoomOutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Box
            aria-live="polite"
            aria-label={`Zoom: ${String(zoom)}%`}
            sx={{
              px: 1.25,
              py: 0.25,
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 1,
              minWidth: 42,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
              {zoom}%
            </Typography>
          </Box>
          <Tooltip title="Ampliar zoom">
            <span>
              <IconButton
                size="small"
                aria-label="Ampliar zoom"
                onClick={() => {
                  onZoomChange((z) => Math.min(200, z + 10));
                }}
                disabled={zoom >= 200}
                sx={{ color: 'text.secondary' }}
              >
                <ZoomInIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, height: 20, alignSelf: 'center' }}
          />
          <Button
            size="small"
            startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/exemplo-request.png';
              a.download = docName ?? 'documento';
              a.click();
            }}
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': { color: 'text.primary', backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Baixar
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, height: 20, alignSelf: 'center' }}
          />
          <Tooltip title="Fechar (Esc)">
            <IconButton
              size="small"
              aria-label="Fechar visualizador"
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', backgroundColor: 'rgba(0,0,0,0.06)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {/* Document area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          py: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            width: `${String(zoom)}%`,
            maxWidth: 757,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/exemplo-request.png"
            alt={`Visualização do documento: ${docName ?? ''}`}
            width={757}
            height={1070}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized
          />
        </Box>
      </Box>
    </Dialog>
  );
}
