'use client';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

import { DENIAL_REASONS } from '@/modules/analysis/constants/denial-reasons';
import { type ProcDecision } from '@/modules/analysis/types';

interface PartialApprovalDialogProps {
  open: boolean;
  request: Request;
  procDecisions: Record<string, ProcDecision>;
  partialDenialReasonMap: Record<string, number>;
  onPartialDenialReasonMapChange: (map: Record<string, number>) => void;
  partialDenialJustMap: Record<string, string>;
  onPartialDenialJustMapChange: (map: Record<string, string>) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function PartialApprovalDialog({
  open,
  request,
  procDecisions,
  partialDenialReasonMap,
  onPartialDenialReasonMapChange,
  partialDenialJustMap,
  onPartialDenialJustMapChange,
  onConfirm,
  onClose,
}: PartialApprovalDialogProps) {
  const nA = request.procedures.filter((pr) => procDecisions[pr.code] === 'aprovado').length;
  const nN = request.procedures.filter((pr) => procDecisions[pr.code] === 'negado').length;
  const title =
    nA === request.procedures.length
      ? 'Confirmar Aprovação Total'
      : nN === request.procedures.length
        ? 'Confirmar Negativa Total'
        : 'Confirmar Aprovação Parcial';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {title} — {request.id}
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
          Revise a decisão por procedimento. Para cada procedimento negado, informe o motivo e a
          justificativa técnica.
        </Typography>

        {/* Procedure table */}
        <Box
          sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 120px',
              gap: 0,
              backgroundColor: 'rgba(0,0,0,0.03)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
              Código
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
              Procedimento
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
              Decisão
            </Typography>
          </Box>
          {request.procedures.map((proc, idx) => {
            const dec = procDecisions[proc.code] ?? 'pendente';
            const isNegado = dec === 'negado';
            const motivoIdx = partialDenialReasonMap[proc.code] ?? -1;
            const justificativa = partialDenialJustMap[proc.code] ?? '';
            return (
              <Box
                key={proc.code}
                sx={{
                  borderTop: idx > 0 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                  px: 2,
                  py: 1.5,
                  backgroundColor: isNegado ? 'rgba(212,24,61,0.02)' : 'transparent',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr 120px',
                    gap: 0,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}
                  >
                    {proc.tuss}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                    {proc.description}
                  </Typography>
                  <Box>
                    {dec === 'aprovado' ? (
                      <Chip
                        icon={
                          <CheckIcon
                            sx={{ fontSize: 13, ml: '4px !important', color: 'success.main' }}
                          />
                        }
                        label="Aprovado"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(22,163,74,0.1)',
                          color: 'success.main',
                          fontWeight: 700,
                          fontSize: 12,
                          height: 22,
                        }}
                      />
                    ) : (
                      <Chip
                        icon={
                          <CloseIcon
                            sx={{ fontSize: 13, ml: '4px !important', color: 'error.main' }}
                          />
                        }
                        label="Negado"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(212,24,61,0.1)',
                          color: 'error.main',
                          fontWeight: 700,
                          fontSize: 12,
                          height: 22,
                        }}
                      />
                    )}
                  </Box>
                </Box>
                {/* Fields for negated procedures */}
                {isNegado ? (
                  <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Motivo da negativa *</InputLabel>
                      <Select
                        value={motivoIdx === -1 ? '' : String(motivoIdx)}
                        label="Motivo da negativa *"
                        onChange={(e) => {
                          const idx2 = Number(e.target.value);
                          onPartialDenialReasonMapChange({
                            ...partialDenialReasonMap,
                            [proc.code]: idx2,
                          });
                          onPartialDenialJustMapChange({
                            ...partialDenialJustMap,
                            [proc.code]: DENIAL_REASONS[idx2]?.texto ?? '',
                          });
                        }}
                      >
                        {DENIAL_REASONS.map((m, i) => (
                          <MenuItem key={i} value={String(i)}>
                            {m.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Justificativa técnica *"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      value={justificativa}
                      onChange={(e) => {
                        onPartialDenialJustMapChange({
                          ...partialDenialJustMap,
                          [proc.code]: e.target.value,
                        });
                      }}
                      placeholder="Descreva o motivo da negativa para este procedimento..."
                      helperText={
                        motivoIdx >= 0 && motivoIdx < DENIAL_REASONS.length - 1
                          ? 'Texto preenchido automaticamente. Edite se necessário.'
                          : undefined
                      }
                    />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>

        {/* Summary badge */}
        {(() => {
          const label =
            nA === request.procedures.length
              ? 'Aprovação Total'
              : nN === request.procedures.length
                ? 'Negativa Total'
                : 'Aprovação Parcial';
          const bg =
            nA === request.procedures.length
              ? 'rgba(22,163,74,0.08)'
              : nN === request.procedures.length
                ? 'rgba(212,24,61,0.08)'
                : 'rgba(217,119,6,0.1)';
          const color =
            nA === request.procedures.length
              ? 'success.main'
              : nN === request.procedures.length
                ? 'error.main'
                : 'warning.main';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Status da solicitação:
              </Typography>
              <Chip
                label={label}
                size="small"
                sx={{ backgroundColor: bg, color, fontWeight: 700, fontSize: 12, height: 22 }}
              />
            </Box>
          );
        })()}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={request.procedures
            .filter((pr) => (procDecisions[pr.code] ?? 'pendente') === 'negado')
            .some(
              (pr) =>
                partialDenialReasonMap[pr.code] === undefined ||
                !(partialDenialJustMap[pr.code] ?? '').trim(),
            )}
          onClick={onConfirm}
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
