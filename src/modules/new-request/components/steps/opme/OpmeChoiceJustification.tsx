'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { OPME_VALUE_REASON_CODES, opmeValueReasons } from '@/shared/constants';
import { type OpmeValueReasonCode } from '@/types/pedido';

import {
  type OpmeFormMaterial,
  cheapestQuotation,
  parseNumeric,
} from '@/modules/new-request/types/opme';

interface OpmeChoiceJustificationProps {
  material: OpmeFormMaterial;
  onChangeReason: (code: OpmeValueReasonCode | '', note: string) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75, display: 'block' }}
    >
      {children}
    </Typography>
  );
}

export function OpmeChoiceJustification({
  material,
  onChangeReason,
}: OpmeChoiceJustificationProps) {
  if (!material.chosenQuotationId) return null;

  const cheapest = cheapestQuotation(material);
  const chosen = material.quotations.find((q) => q.id === material.chosenQuotationId);
  if (!cheapest || !chosen) return null;

  const isCheapestChosen = chosen.id === cheapest.id;
  if (isCheapestChosen) {
    return (
      <Alert
        severity="success"
        sx={{
          fontSize: 12,
          borderRadius: 2,
          border: '1px solid rgba(22,163,74,0.3)',
          '& .MuiAlert-message': { fontSize: 12 },
        }}
      >
        Cotação escolhida coincide com a mais barata — justificativa estruturada não é necessária.
      </Alert>
    );
  }

  const diff = parseNumeric(chosen.unitValue) - parseNumeric(cheapest.unitValue);
  const diffFormatted = diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const reasonConfig = material.chosenReasonCode
    ? opmeValueReasons[material.chosenReasonCode]
    : null;

  const requireNote = reasonConfig?.requiresFreeText ?? false;

  return (
    <Box
      sx={{
        border: '1px dashed rgba(180,83,9,0.5)',
        borderRadius: '12px',
        p: 2,
        backgroundColor: 'rgba(217,119,6,0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <WarningAmberIcon sx={{ fontSize: 18, color: '#b45309' }} />
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          Justificativa obrigatória — cotação acima da mais barata (+{diffFormatted} por unidade)
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Motivo estruturado</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={material.chosenReasonCode}
              onChange={(e) => {
                onChangeReason(
                  e.target.value as OpmeValueReasonCode | '',
                  material.chosenReasonNote,
                );
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
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Observações {requireNote ? '(obrigatório)' : '(opcional)'}</FieldLabel>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            maxRows={4}
            value={material.chosenReasonNote}
            onChange={(e) => {
              onChangeReason(material.chosenReasonCode, e.target.value);
            }}
            placeholder={
              reasonConfig?.description ??
              'Descreva o motivo de escolher uma cotação acima da mais barata'
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
