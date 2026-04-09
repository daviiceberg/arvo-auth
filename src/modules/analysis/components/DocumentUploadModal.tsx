'use client';

import React, { type RefObject } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DOCUMENT_TYPES } from '../constants/document-types';

// ---- Component ----
interface DocumentUploadModalProps {
  open: boolean;
  addTipo: string;
  addFile: File | null;
  addDragOver: boolean;
  addDescricao: string;
  addError: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onTipoChange: (value: string) => void;
  onFileChange: (file: File) => void;
  onDragOverChange: (value: boolean) => void;
  onDescricaoChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DocumentUploadModal({
  open,
  addTipo,
  addFile,
  addDragOver,
  addDescricao,
  addError,
  fileInputRef,
  onTipoChange,
  onFileChange,
  onDragOverChange,
  onDescricaoChange,
  onClose,
  onConfirm,
}: DocumentUploadModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachFileIcon sx={{ fontSize: 18, color: '#902B29' }} />
          <Typography fontWeight={700} sx={{ fontSize: 15 }}>
            Adicionar Documento
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {addError ? (
          <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
            {addError}
          </Alert>
        ) : null}

        {/* Tipo */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}
        >
          Tipo do documento <span style={{ color: '#C62828' }}>*</span>
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
          <Select
            value={addTipo}
            displayEmpty
            onChange={(e) => {
              onTipoChange(e.target.value);
            }}
          >
            <MenuItem value="" disabled>
              <em>Selecione o tipo...</em>
            </MenuItem>
            {DOCUMENT_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Drop zone */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}
        >
          Arquivo <span style={{ color: '#C62828' }}>*</span>
        </Typography>
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            onDragOverChange(true);
          }}
          onDragLeave={() => {
            onDragOverChange(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            onDragOverChange(false);
            const f = e.dataTransfer.files[0];
            if (f) onFileChange(f);
          }}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${addDragOver ? '#902B29' : addFile ? '#16a34a' : 'rgba(0,0,0,0.2)'}`,
            borderRadius: 2,
            backgroundColor: addDragOver
              ? 'rgba(144,43,41,0.04)'
              : addFile
                ? 'rgba(22,163,74,0.04)'
                : '#fafafa',
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            mb: 2.5,
            '&:hover': { borderColor: '#902B29', backgroundColor: 'rgba(144,43,41,0.03)' },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileChange(f);
            }}
          />
          {addFile ? (
            <>
              <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#16a34a' }} />
              <Typography variant="body2" fontWeight={600} sx={{ color: '#15803d' }}>
                {addFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Clique para trocar
              </Typography>
            </>
          ) : (
            <>
              <UploadFileIcon sx={{ fontSize: 32, color: 'rgba(0,0,0,0.3)' }} />
              <Typography variant="body2" fontWeight={600}>
                Arraste o arquivo aqui
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ou clique para selecionar · PDF, JPG, PNG — até 10MB
              </Typography>
            </>
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: 12, display: 'block', mb: 0.75 }}
        >
          Descrição (opcional)
        </Typography>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={2}
          placeholder="Descreva o conteúdo do documento..."
          value={addDescricao}
          onChange={(e) => {
            onDescricaoChange(e.target.value);
          }}
          sx={{ mb: 2 }}
        />

        <Alert severity="info" icon={false} sx={{ fontSize: 12, py: 0.75 }}>
          O documento será vinculado a esta guia e ficará disponível para o analista responsável.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" startIcon={<AttachFileIcon />} onClick={onConfirm}>
          Adicionar Documento
        </Button>
      </DialogActions>
    </Dialog>
  );
}
