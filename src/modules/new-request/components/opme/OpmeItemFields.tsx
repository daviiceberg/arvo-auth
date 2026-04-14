'use client';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type OpmeItemData } from '@/modules/new-request/types/opme';

interface OpmeItemFieldsProps {
  item: OpmeItemData;
  onUpdate: (item: OpmeItemData) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}>
      {children}
    </Typography>
  );
}

export default function OpmeItemFields({ item, onUpdate }: OpmeItemFieldsProps) {
  const set = (field: keyof OpmeItemData, value: string) => {
    onUpdate({ ...item, [field]: value });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <FieldLabel>Código do Material *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="Ex: 60012150"
          value={item.materialCode}
          onChange={(e) => {
            set('materialCode', e.target.value);
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <FieldLabel>Descrição *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="Descrição do material ou dispositivo"
          value={item.materialDescription}
          onChange={(e) => {
            set('materialDescription', e.target.value);
          }}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <FieldLabel>Quantidade *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={item.quantity}
          onChange={(e) => {
            set('quantity', e.target.value);
          }}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <FieldLabel>Valor Unitário (R$)</FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="number"
          placeholder="0,00"
          value={item.unitValue}
          onChange={(e) => {
            set('unitValue', e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
}
