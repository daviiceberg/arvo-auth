'use client';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import { type HistoricoEntry } from '@/types/pedido';

import { type NotifyChannel } from '../types';

interface AppealDialogProps {
  open: boolean;
  onClose: () => void;
  entry: HistoricoEntry;
  notifyChannel: NotifyChannel;
  onNotifyChannelChange: (channel: NotifyChannel) => void;
  onSend: () => void;
  snackbarOpen: boolean;
  snackbarMessage: string;
  onSnackbarClose: () => void;
}

export default function AppealDialog({
  open,
  onClose,
  entry,
  notifyChannel,
  onNotifyChannelChange,
  onSend,
  snackbarOpen,
  snackbarMessage,
  onSnackbarClose,
}: AppealDialogProps) {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
          Informar Decisão ao Beneficiário
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2.5 }}>
            Selecione o canal para comunicar a decisão do pedido{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {entry.id}
            </Box>{' '}
            a{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {entry.beneficiario}
            </Box>
            .
          </Typography>
          <FormControl size="small" fullWidth>
            <InputLabel>Canal de envio</InputLabel>
            <Select
              label="Canal de envio"
              value={notifyChannel}
              onChange={(e) => { onNotifyChannelChange(e.target.value as NotifyChannel); }}
            >
              <MenuItem value="app">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneAndroidIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                  App
                </Box>
              </MenuItem>
              <MenuItem value="whatsapp">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                  WhatsApp
                </Box>
              </MenuItem>
              <MenuItem value="email">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlinedIcon sx={{ fontSize: 16, color: '#0891b2' }} />
                  E-mail
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <Alert
            severity="info"
            sx={{ mt: 2, '& .MuiAlert-message': { fontSize: 12 } }}
            icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}
          >
            A mensagem incluirá o resultado ({entry.acao}), o número do protocolo e instruções ao beneficiário.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onSend} startIcon={<SendIcon />} sx={{ fontWeight: 600 }}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
