'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface ShortcutsHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ShortcutsHelpDialog({ open, onClose }: ShortcutsHelpDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ fontSize: 18 }}>⌨️</Box> Atalhos de Teclado
      </DialogTitle>
      <DialogContent>
        {[
          { keys: '← / K', desc: 'Pedido anterior' },
          { keys: '→ / J', desc: 'Próximo pedido' },
          { keys: 'A', desc: 'Aprovar pedido' },
          { keys: 'N', desc: 'Negar pedido' },
          { keys: '?', desc: 'Mostrar esta ajuda' },
        ].map(({ keys, desc }) => (
          <Box
            key={keys}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.75,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {desc}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {keys.split(' / ').map((k) => (
                <Box
                  key={k}
                  sx={{
                    px: 1,
                    py: 0.25,
                    backgroundColor: 'rgba(0,0,0,0.07)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {k}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Atalhos são desativados quando o foco está em campos de texto.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
