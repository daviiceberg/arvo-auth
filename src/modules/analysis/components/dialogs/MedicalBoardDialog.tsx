'use client'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { MEDICAL_BOARD_REASONS } from '../../constants/medical-board-reasons'

interface MedicalBoardDialogProps {
  open: boolean
  medicalBoardReason: string
  onMedicalBoardReasonChange: (value: string) => void
  medicalBoardObs: string
  onMedicalBoardObsChange: (value: string) => void
  onConfirm: () => void
  onClose: () => void
}

export default function MedicalBoardDialog({
  open,
  medicalBoardReason,
  onMedicalBoardReasonChange,
  medicalBoardObs,
  onMedicalBoardObsChange,
  onConfirm,
  onClose,
}: MedicalBoardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Encaminhar para Junta Médica</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A solicitação será encaminhada para avaliação de especialistas antes da decisão final.
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Motivo do Encaminhamento *</InputLabel>
          <Select value={medicalBoardReason} label="Motivo do Encaminhamento *" onChange={e => { onMedicalBoardReasonChange(e.target.value); }}>
            {MEDICAL_BOARD_REASONS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          label="Observações para a Junta (opcional)"
          multiline rows={3} fullWidth size="small"
          value={medicalBoardObs}
          onChange={e => { onMedicalBoardObsChange(e.target.value); }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!medicalBoardReason}
          onClick={onConfirm}
          sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
        >
          Encaminhar para Junta
        </Button>
      </DialogActions>
    </Dialog>
  )
}
