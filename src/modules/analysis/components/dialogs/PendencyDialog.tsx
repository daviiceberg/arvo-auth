'use client'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { PENDENCY_REASONS } from '../../constants/pendency-reasons'

interface PendencyDialogProps {
  open: boolean
  pendencyItems: string[]
  onPendencyItemsChange: (items: string[]) => void
  pendencyJustification: string
  onPendencyJustificationChange: (value: string) => void
  onConfirm: () => void
  onClose: () => void
}

export default function PendencyDialog({
  open,
  pendencyItems,
  onPendencyItemsChange,
  pendencyJustification,
  onPendencyJustificationChange,
  onConfirm,
  onClose,
}: PendencyDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Pendenciar Solicitação</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
          Pendenciar NÃO interrompe o contador de SLA
        </Alert>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Motivos para pendenciar *</Typography>
        <FormGroup sx={{ mb: 2, maxHeight: 220, overflowY: 'auto' }}>
          {PENDENCY_REASONS.map(item => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={pendencyItems.includes(item)}
                  onChange={e => { onPendencyItemsChange(
                    e.target.checked ? [...pendencyItems, item] : pendencyItems.filter(i => i !== item)
                  ); }}
                />
              }
              label={<Typography variant="body2">{item}</Typography>}
            />
          ))}
        </FormGroup>
        <TextField
          label="Justificativa Adicional *"
          multiline rows={3} fullWidth size="small"
          placeholder="Descreva o motivo..."
          value={pendencyJustification}
          onChange={e => { onPendencyJustificationChange(e.target.value); }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={pendencyItems.length === 0}
          onClick={onConfirm}
          sx={{ backgroundColor: '#ea580c', '&:hover': { backgroundColor: '#c2410c' } }}
        >
          Confirmar Pendenciamento
        </Button>
      </DialogActions>
    </Dialog>
  )
}
