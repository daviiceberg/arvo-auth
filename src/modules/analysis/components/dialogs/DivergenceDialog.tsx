'use client'

import SmartToyIcon from '@mui/icons-material/SmartToy'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type IASugestao } from '@/data/pedidos'

interface DivergenceDialogProps {
  open: boolean
  iaSuggestion: IASugestao
  divergenceReason: string
  onDivergenceReasonChange: (value: string) => void
  onContinue: () => void
  onClose: () => void
}

export default function DivergenceDialog({
  open,
  iaSuggestion,
  divergenceReason,
  onDivergenceReasonChange,
  onContinue,
  onClose,
}: DivergenceDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <SmartToyIcon color="primary" fontSize="small" />
        Divergência com a IA
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sua decisão difere da sugestão da IA. Por favor, justifique o motivo desta divergência.
        </Typography>
        <Box sx={{ p: 1.5, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1, mb: 2 }}>
          <Typography variant="body2">
            <strong>Sugestão da IA:</strong> {iaSuggestion}
          </Typography>
        </Box>
        <TextField
          label="Motivo da Divergência *"
          multiline rows={4} fullWidth size="small"
          placeholder="Explique por que você está tomando uma decisão diferente da IA..."
          value={divergenceReason}
          onChange={e => { onDivergenceReasonChange(e.target.value); }}
          error={divergenceReason.trim() === ''}
          helperText={divergenceReason.trim() === '' ? 'Campo obrigatório' : ''}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={() => { onClose(); onDivergenceReasonChange('') }}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!divergenceReason.trim()}
          onClick={onContinue}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
