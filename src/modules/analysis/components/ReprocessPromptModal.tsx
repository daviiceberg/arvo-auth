'use client';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

interface ReprocessPromptModalProps {
  open: boolean;
  changes: string[];
  onClose: () => void;
  onAttachAnother: () => void;
  onRequestReprocess: () => void;
}

function ChangeRow({ text }: { text: string }) {
  const isRemoval = text.toLowerCase().includes('removido');
  return (
    <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
      {isRemoval ? (
        <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: 'error.main', flexShrink: 0 }} />
      ) : (
        <AddCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />
      )}
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        {text}
      </Typography>
    </Box>
  );
}

export default function ReprocessPromptModal({
  open,
  changes,
  onClose,
  onAttachAnother,
  onRequestReprocess,
}: ReprocessPromptModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Box component="span" sx={{ display: 'block', fontSize: 16, fontWeight: 700 }}>
          Documentos atualizados — é hora de reanalisar?
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          aria-label="Fechar"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ fontSize: 13, mb: 1 }}>
          Você fez as seguintes alterações neste pedido:
        </Typography>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', mb: 2 }}>
          {changes.map((c, i) => (
            <ChangeRow key={`${c}-${String(i)}`} text={c} />
          ))}
        </Box>
        <Alert severity="warning" icon={false} sx={{ fontSize: 13 }}>
          <Typography
            component="span"
            variant="body2"
            fontWeight={700}
            sx={{ fontSize: 13, display: 'block', mb: 0.5 }}
          >
            Atenção — a reanálise dos agentes de IA leva alguns minutos.
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 12 }}>
            Recomendamos solicitá-la apenas após finalizar <strong>todos</strong> os ajustes desta
            tela — inclusive o envio de outros documentos, se houver.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onAttachAnother} sx={{ fontSize: 12 }}>
          Anexar outro documento
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
          onClick={onRequestReprocess}
          sx={{ fontSize: 12 }}
        >
          Solicitar verificação da IA
        </Button>
      </DialogActions>
    </Dialog>
  );
}
