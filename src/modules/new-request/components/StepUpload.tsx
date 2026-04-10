'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface StepUploadProps {
  uploadState: 'idle' | 'loading' | 'done';
  uploadProgress: number;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onUpload: () => void;
  onSkip: () => void;
}

export function StepUpload({
  uploadState,
  uploadProgress,
  dragOver,
  setDragOver,
  onUpload,
  onSkip,
}: StepUploadProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
        px: 4,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 520 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
          Nova Solicitação de Autorização
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Envie o pedido médico para que a IA preencha automaticamente os dados, ou preencha
          manualmente.
        </Typography>
      </Box>

      {/* Drop zone */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => {
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onUpload();
        }}
        onClick={() => {
          if (uploadState === 'idle') onUpload();
        }}
        sx={{
          width: '100%',
          maxWidth: 480,
          border: `2px dashed ${dragOver ? '#902B29' : 'rgba(0,0,0,0.2)'}`,
          borderRadius: 3,
          backgroundColor: dragOver
            ? 'rgba(144,43,41,0.07)'
            : uploadState === 'loading'
              ? 'rgba(37,99,235,0.03)'
              : '#fafafa',
          boxShadow: dragOver ? '0 0 0 4px rgba(144,43,41,0.12)' : 'none',
          transform: dragOver ? 'scale(1.01)' : 'scale(1)',
          transition: 'all 0.15s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 5,
          px: 3,
          cursor: uploadState === 'idle' ? 'pointer' : 'default',
          '&:hover':
            uploadState === 'idle'
              ? { borderColor: '#902B29', backgroundColor: 'rgba(144,43,41,0.03)' }
              : {},
        }}
      >
        {uploadState === 'idle' && (
          <>
            <UploadFileIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.25)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5 }}>
                Arraste o pedido médico aqui
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou clique para selecionar o arquivo
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              PDF, JPG, PNG — até 10MB
            </Typography>
          </>
        )}
        {uploadState === 'loading' && (
          <>
            <CircularProgress size={40} thickness={3} sx={{ color: '#2563eb' }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: '#2563eb' }}>
              Lendo documento com IA...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Extraindo dados automaticamente
            </Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(37,99,235,0.12)',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: '#2563eb' },
                }}
              />
              <Typography
                variant="caption"
                sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}
              >
                {uploadProgress}%
              </Typography>
            </Box>
          </>
        )}
        {uploadState === 'done' && (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: '#16a34a' }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: '#16a34a' }}>
              Documento processado!
            </Typography>
          </>
        )}
      </Box>

      <Button
        variant="text"
        size="small"
        endIcon={<ChevronRightIcon />}
        onClick={onSkip}
        sx={{ color: 'text.secondary', fontSize: 13 }}
      >
        Preencher manualmente sem upload
      </Button>
    </Box>
  );
}
