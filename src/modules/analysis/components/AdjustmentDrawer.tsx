'use client';

import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type Adjustment } from '@/types/pedido';

import { type UseAdjustmentFormReturn, useAdjustmentForm } from '../hooks/useAdjustmentForm';

import AdjustmentFieldCode from './AdjustmentFieldCode';
import AdjustmentFieldDut from './AdjustmentFieldDut';
import AdjustmentFieldProvider from './AdjustmentFieldProvider';
import AdjustmentFieldQuantity from './AdjustmentFieldQuantity';

interface AdjustmentProc {
  codigo: string;
  descricao: string;
  qty: number;
  prestador: string;
}

interface AdjustmentDrawerProps {
  open: boolean;
  requestId: string;
  requestStatus: string;
  existingAdjustments?: Adjustment[];
  proc: AdjustmentProc | null;
  onClose: () => void;
  onConfirm: (adjustment: Omit<Adjustment, 'id'>) => void;
}

/* ---------- Field components lookup ---------- */

function buildFieldComponents(
  proc: AdjustmentProc | null,
  form: UseAdjustmentFormReturn,
): Record<string, React.ReactNode> {
  return {
    quantidade: (
      <AdjustmentFieldQuantity
        currentQty={proc?.qty}
        newQty={form.newQty}
        setNewQty={form.setNewQty}
        errors={form.errors}
        setErrors={form.setErrors}
        qtyStatus={form.qtyStatus}
      />
    ),
    prestador: (
      <AdjustmentFieldProvider
        currentProvider={proc?.prestador}
        newProvider={form.newProvider}
        setNewProvider={form.setNewProvider}
        newCNES={form.newCNES}
        setNewCNES={form.setNewCNES}
        errors={form.errors}
        setErrors={form.setErrors}
      />
    ),
    codigo: (
      <AdjustmentFieldCode
        currentCode={proc?.codigo}
        newCode={form.newCode}
        setNewCode={form.setNewCode}
        newDesc={form.newDesc}
        setNewDesc={form.setNewDesc}
        errors={form.errors}
        setErrors={form.setErrors}
      />
    ),
    dut: (
      <AdjustmentFieldDut
        newDut={form.newDut}
        setNewDut={form.setNewDut}
        errors={form.errors}
        setErrors={form.setErrors}
      />
    ),
  };
}

/* ---------- Scrollable form body ---------- */

function buildCurrentValueRows(
  proc: AdjustmentProc | null,
): { label: string; value: string | undefined }[] {
  return [
    { label: 'Código', value: proc?.codigo },
    { label: 'Descrição', value: proc?.descricao },
    {
      label: 'Qtd. Solicitada',
      value: proc ? `${String(proc.qty)} sessões` : '',
    },
    { label: 'Prestador', value: proc?.prestador },
  ];
}

interface AdjustmentFormBodyProps {
  proc: AdjustmentProc | null;
  form: UseAdjustmentFormReturn;
  fieldComponents: Record<string, React.ReactNode>;
}

function AdjustmentFormBody({ proc, form, fieldComponents }: AdjustmentFormBodyProps) {
  const auditWarningMessage =
    'Este ajuste será registrado no histórico da guia com seu nome e data/hora.';

  const justificationRequired = form.reason === 'Outro (descrever na fundamentação)';
  const currentValues = buildCurrentValueRows(proc);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: 3,
        py: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {/* Current values (read-only) */}
      <Box
        sx={{
          backgroundColor: '#f9fafb',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 1.5,
          p: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
            display: 'block',
            mb: 1.25,
          }}
        >
          Valores Atuais (somente leitura)
        </Typography>
        {currentValues.map((f) => (
          <Box key={f.label} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 12, width: 110, flexShrink: 0 }}
            >
              {f.label}:
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
              {f.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Proposed adjustment */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
            display: 'block',
            mb: 1.5,
          }}
        >
          Ajuste Proposto
        </Typography>

        <FormControl
          fullWidth
          size="small"
          sx={{ mb: form.errors.field ? 0.5 : 2 }}
          error={!!form.errors.field}
        >
          <InputLabel>Campo a ajustar *</InputLabel>
          <Select
            value={form.field}
            label="Campo a ajustar *"
            onChange={(e) => {
              form.setField(e.target.value as typeof form.field);
              form.setErrors({ ...form.errors, campo: '' });
            }}
          >
            {form.availableFields.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
          {form.errors.field ? (
            <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>
              {form.errors.field}
            </Typography>
          ) : null}
        </FormControl>

        {fieldComponents[form.field]}

        {/* Reason */}
        <FormControl
          fullWidth
          size="small"
          sx={{ mb: form.errors.motivo ? 0.5 : 2 }}
          error={!!form.errors.motivo}
        >
          <InputLabel>Motivo do ajuste *</InputLabel>
          <Select
            value={form.reason}
            label="Motivo do ajuste *"
            onChange={(e) => {
              form.setReason(e.target.value);
              form.setErrors({ ...form.errors, motivo: '' });
            }}
          >
            {form.availableReasons.map((m) => (
              <MenuItem key={m} value={m} sx={{ fontSize: 13, whiteSpace: 'normal' }}>
                {m}
              </MenuItem>
            ))}
          </Select>
          {form.errors.motivo ? (
            <Typography sx={{ fontSize: 11, color: 'error.main', mt: 0.5 }}>
              {form.errors.motivo}
            </Typography>
          ) : null}
        </FormControl>

        <TextField
          label={`Fundamentação clínica/regulatória${justificationRequired ? ' *' : ' (opcional)'}`}
          multiline
          rows={3}
          size="small"
          fullWidth
          value={form.justification}
          onChange={(e) => {
            form.setJustification(e.target.value);
            form.setErrors({ ...form.errors, justification: '' });
          }}
          error={!!form.errors.justification}
          helperText={form.errors.justification}
        />
      </Box>

      {/* Audit warning */}
      <Alert
        severity="warning"
        icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
        sx={{ fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}
      >
        {auditWarningMessage}
      </Alert>
    </Box>
  );
}

/* ---------- Main drawer ---------- */

export default function AdjustmentDrawer({
  open,
  requestId,
  requestStatus,
  proc,
  onClose,
  onConfirm,
  existingAdjustments = [],
}: AdjustmentDrawerProps) {
  const form = useAdjustmentForm({ proc, existingAdjustments, open, onClose, onConfirm });
  const isGuideFinalized = ['Aprovado', 'Negado'].includes(requestStatus);
  const fieldComponents = buildFieldComponents(proc, form);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        /* overlay click does NOT close -- only X or Cancelar */
      }}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-label': 'Ajustar procedimento',
          sx: { width: 480, p: 0, display: 'flex', flexDirection: 'column' },
        },
      }}
      ModalProps={{ keepMounted: false, sx: { zIndex: 1300 } }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <EditIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography fontWeight={700} sx={{ fontSize: 15 }}>
              Ajustar Procedimento
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {requestId} · {proc?.codigo}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <AdjustmentFormBody proc={proc} form={form} fieldComponents={fieldComponents} />

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Button variant="outlined" fullWidth onClick={onClose} sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={form.handleConfirm}
          disabled={isGuideFinalized}
          sx={{
            fontWeight: 600,
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Confirmar Ajuste
        </Button>
      </Box>
    </Drawer>
  );
}
