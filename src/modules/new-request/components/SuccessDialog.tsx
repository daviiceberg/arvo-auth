'use client';

import React from 'react';

import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

interface SuccessDialogProps {
  open: boolean;
  numeroProtocolo: string;
  onGoToDashboard: () => void;
  onNewRequest: () => void;
}

export function SuccessDialog({
  open,
  numeroProtocolo,
  onGoToDashboard,
  onNewRequest,
}: SuccessDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return;
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2, px: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'rgba(144,43,41,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: 18 }}>
          Solicitação Registrada
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: 13, lineHeight: 1.6 }}>
          O pedido foi protocolado. A IA está analisando agora.
        </Typography>

        <Box
          sx={{
            backgroundColor: 'rgba(144,43,41,0.04)',
            border: '1px solid rgba(144,43,41,0.12)',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mb: 3,
            textAlign: 'left',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              display: 'block',
              mb: 1,
            }}
          >
            Após o processamento, o pedido será:
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#64748b', fontSize: 12, lineHeight: 1.8, display: 'block' }}
          >
            {'\u2022'}{' '}
            <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Encaminhado para a Fila Operacional
            </Box>{' '}
            — para decisão do analista responsável
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#f8f5f5',
            border: '1px solid rgba(144,43,41,0.15)',
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
            mb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: 10,
            }}
          >
            Protocolo
          </Typography>
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15, mt: 0.25 }}>
            {numeroProtocolo || '\u2014'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            backgroundColor: 'rgba(37,99,235,0.05)',
            border: '1px solid rgba(37,99,235,0.15)',
            borderRadius: 2,
            px: 2,
            py: 1.25,
            textAlign: 'left',
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 16, color: 'info.main', mt: 0.25, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
            Uma confirma\u00e7\u00e3o ser\u00e1 enviada por e-mail ao prestador solicitante assim
            que o pedido for processado.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          pt: 0,
          flexDirection: 'column',
          gap: 1,
          '& > :not(style) ~ :not(style)': { ml: 0 },
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={onGoToDashboard}
          sx={{ fontWeight: 700, textTransform: 'none', fontSize: 14 }}
        >
          Acompanhar no Dashboard
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onNewRequest}
          sx={{ fontWeight: 600, textTransform: 'none', fontSize: 14 }}
        >
          Nova Solicitação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
