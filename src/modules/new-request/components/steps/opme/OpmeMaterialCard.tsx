'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type OpmeValueReasonCode } from '@/types/pedido';

import {
  type AnvisaConsultResult,
  type OpmeFormMaterial,
  type OpmeFormQuotation,
} from '@/modules/new-request/types/opme';

import { AnvisaCheckRow } from './AnvisaCheckRow';
import { OpmeChoiceJustification } from './OpmeChoiceJustification';
import { QuotationsTable } from './QuotationsTable';

interface OpmeMaterialCardProps {
  index: number;
  total: number;
  material: OpmeFormMaterial;
  onUpdateField: (field: keyof Omit<OpmeFormMaterial, 'id' | 'quotations'>, value: string) => void;
  onUpdateQuotation: (
    quotationId: string,
    field: keyof Omit<OpmeFormQuotation, 'id'>,
    value: string,
  ) => void;
  onAddQuotation: () => void;
  onRemoveQuotation: (quotationId: string) => void;
  onSelectQuotation: (quotationId: string) => void;
  onChangeReason: (code: OpmeValueReasonCode | '', note: string) => void;
  onConsultAnvisa: () => Promise<AnvisaConsultResult>;
  onRemove: () => void;
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

export function OpmeMaterialCard({
  index,
  total,
  material,
  onUpdateField,
  onUpdateQuotation,
  onAddQuotation,
  onRemoveQuotation,
  onSelectQuotation,
  onChangeReason,
  onConsultAnvisa,
  onRemove,
}: OpmeMaterialCardProps) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '16px',
        p: 2.5,
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 14 }}>
          Material {String(index + 1)}
          {total > 1 ? ` de ${String(total)}` : ''}
        </Typography>
        {total > 1 ? (
          <IconButton size="small" onClick={onRemove} sx={{ color: 'text.secondary' }}>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : null}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <FieldLabel>Código do material (TUSS / interno)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.materialCode}
            onChange={(e) => {
              onUpdateField('materialCode', e.target.value);
            }}
            placeholder="Ex: 70770070"
          />
        </Grid>
        <Grid size={{ xs: 8 }}>
          <FieldLabel>Descrição</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.materialDescription}
            onChange={(e) => {
              onUpdateField('materialDescription', e.target.value);
            }}
            placeholder="Ex: Prótese total de joelho cimentada"
          />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <FieldLabel>Fabricante</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.manufacturer}
            onChange={(e) => {
              onUpdateField('manufacturer', e.target.value);
            }}
            placeholder="Ex: DePuy Synthes"
          />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <FieldLabel>Marca / Modelo principal</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.brand}
            onChange={(e) => {
              onUpdateField('brand', e.target.value);
            }}
            placeholder="Ex: PFC Sigma"
          />
        </Grid>
        <Grid size={{ xs: 2 }}>
          <FieldLabel>Unidade</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.unit}
            onChange={(e) => {
              onUpdateField('unit', e.target.value);
            }}
            placeholder="unidade"
          />
        </Grid>
        <Grid size={{ xs: 2 }}>
          <FieldLabel>Quantidade</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={material.quantity}
            onChange={(e) => {
              onUpdateField('quantity', e.target.value);
            }}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <FieldLabel>Valor de referência tabela (R$)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.unitValue}
            onChange={(e) => {
              onUpdateField('unitValue', e.target.value);
            }}
            placeholder="0,00"
            helperText="Valor estimado para comparação — total efetivo é calculado pela cotação escolhida"
            slotProps={{ formHelperText: { sx: { fontSize: 10, mx: 0 } } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2.5 }}>
        <AnvisaCheckRow
          material={material}
          onChangeRegistration={(value) => {
            onUpdateField('anvisaRegistration', value);
          }}
          onConsult={onConsultAnvisa}
        />
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <QuotationsTable
        material={material}
        onChangeField={onUpdateQuotation}
        onSelect={onSelectQuotation}
        onAdd={onAddQuotation}
        onRemove={onRemoveQuotation}
      />

      <Box sx={{ mt: 2 }}>
        <OpmeChoiceJustification material={material} onChangeReason={onChangeReason} />
      </Box>
    </Box>
  );
}
