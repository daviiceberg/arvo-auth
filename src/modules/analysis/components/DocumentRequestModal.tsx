'use client';

import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DOCUMENT_REQUEST_TYPES } from '../constants/document-types';

// ---- Component ----
interface DocumentRequestModalProps {
  open: boolean;
  selectedDocs: string[];
  deadline: string;
  message: string;
  onDocsChange: (updater: (prev: string[]) => string[]) => void;
  onDeadlineChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DocumentRequestModal({
  open,
  selectedDocs,
  deadline,
  message,
  onDocsChange,
  onDeadlineChange,
  onMessageChange,
  onClose,
  onConfirm,
}: DocumentRequestModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Typography fontWeight={700} sx={{ fontSize: 15 }}>
          Solicitar Documentação Complementar
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 2, fontSize: 12 }}
        >
          Selecione os documentos necessários. O beneficiário será notificado e o pedido ficará em
          pendência até o envio.
        </Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{
            textTransform: 'uppercase',
            fontSize: 11,
            letterSpacing: 0.5,
            display: 'block',
            mb: 1,
          }}
        >
          Documentos necessários *
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2.5 }}>
          {DOCUMENT_REQUEST_TYPES.map((tipo) => (
            <FormControlLabel
              key={tipo}
              control={
                <Checkbox
                  size="small"
                  checked={selectedDocs.includes(tipo)}
                  onChange={(e) => {
                    onDocsChange((prev) =>
                      e.target.checked ? [...prev, tipo] : prev.filter((d) => d !== tipo),
                    );
                  }}
                  sx={{ py: 0.4, '&.Mui-checked': { color: 'primary.main' } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>{tipo}</Typography>}
            />
          ))}
        </Box>
        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel>Prazo para envio</InputLabel>
          <Select
            value={deadline}
            label="Prazo para envio"
            onChange={(e) => {
              onDeadlineChange(e.target.value);
            }}
          >
            {['3', '5', '7', '10', '15'].map((d) => (
              <MenuItem key={d} value={d}>
                {d} dias úteis
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={3}
          label="Mensagem ao beneficiário (opcional)"
          placeholder="Ex: Para prosseguirmos com a análise, precisamos dos documentos acima dentro do prazo indicado."
          value={message}
          onChange={(e) => {
            onMessageChange(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedDocs.length === 0}
          onClick={onConfirm}
          sx={{ backgroundColor: '#902B29', '&:hover': { backgroundColor: '#6e1f1d' } }}
        >
          Pendenciar e Notificar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
