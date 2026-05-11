'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { OPME_VALUE_REASON_CODES, opmeValueReasons } from '@/shared/constants';
import { type Adjustment, type OpmeMaterial, type OpmeValueReasonCode } from '@/types/pedido';

interface OpmeAdjustmentDialogProps {
  open: boolean;
  material: OpmeMaterial | null;
  onClose: () => void;
  onConfirm: (adjustment: Omit<Adjustment, 'id'>) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function OpmeAdjustmentDialogInner({
  material,
  onClose,
  onConfirm,
}: {
  material: OpmeMaterial;
  onClose: () => void;
  onConfirm: (adjustment: Omit<Adjustment, 'id'>) => void;
}) {
  const [newValue, setNewValue] = useState(() => material.unitValue.toFixed(2));
  const [reasonCode, setReasonCode] = useState<OpmeValueReasonCode | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const reasonConfig = reasonCode ? opmeValueReasons[reasonCode] : null;
  const requiresNote = reasonConfig?.requiresFreeText ?? false;

  const handleConfirm = () => {
    const numeric = Number(newValue);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Informe um valor unitário positivo.');
      return;
    }
    if (!reasonCode) {
      setError('Selecione o motivo do ajuste.');
      return;
    }
    if (requiresNote && note.trim().length < 10) {
      setError('Observação obrigatória (mín. 10 caracteres).');
      return;
    }
    onConfirm({
      procedureCode: material.materialCode || material.id,
      procedureDescription: material.description,
      field: 'valor',
      previousValue: formatCurrency(material.unitValue),
      newValue: formatCurrency(numeric),
      reason: reasonCode,
      ...(note.trim() !== '' && { justification: note.trim() }),
      operator: 'Analista',
      profile: 'Analista Sênior',
      timestamp: new Date().toLocaleString('pt-BR'),
    });
  };

  return (
    <>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 700 }}>
        Ajustar valor do material OPME
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Material
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {material.description}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
            {material.manufacturer} · ANVISA {material.anvisaRegistration}
          </Typography>
        </Box>

        <TextField
          label="Valor unitário atual"
          value={formatCurrency(material.unitValue)}
          disabled
          fullWidth
          size="small"
          sx={{ mb: 1.5 }}
        />
        <TextField
          label="Novo valor unitário *"
          type="number"
          value={newValue}
          onChange={(e) => {
            setNewValue(e.target.value);
            setError('');
          }}
          fullWidth
          size="small"
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
            htmlInput: { min: 0.01, step: '0.01' },
          }}
          sx={{ mb: 1.5 }}
        />

        <Typography
          variant="caption"
          sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75, display: 'block' }}
        >
          Motivo do ajuste *
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <Select
            displayEmpty
            value={reasonCode}
            onChange={(e) => {
              setReasonCode(e.target.value as OpmeValueReasonCode | '');
              setError('');
            }}
          >
            <MenuItem value="">
              <em>Selecione…</em>
            </MenuItem>
            {OPME_VALUE_REASON_CODES.map((code) => (
              <MenuItem key={code} value={code}>
                {opmeValueReasons[code].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {reasonConfig ? (
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: 'text.secondary', mb: 1.5, display: 'block' }}
          >
            {reasonConfig.description}
          </Typography>
        ) : null}

        <TextField
          label={`Observação ${requiresNote ? '*' : '(opcional)'}`}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setError('');
          }}
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          placeholder="Descreva o motivo clínico ou administrativo do ajuste"
        />

        {error ? (
          <Typography
            variant="caption"
            sx={{ fontSize: 12, color: 'error.main', mt: 1, display: 'block' }}
          >
            {error}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Registrar ajuste
        </Button>
      </DialogActions>
    </>
  );
}

export default function OpmeAdjustmentDialog({
  open,
  material,
  onClose,
  onConfirm,
}: OpmeAdjustmentDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {material ? (
        <OpmeAdjustmentDialogInner
          key={material.id}
          material={material}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      ) : null}
    </Dialog>
  );
}
