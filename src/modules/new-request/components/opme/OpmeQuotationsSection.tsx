'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type OpmeItemData, type OpmeQuotation } from '@/modules/new-request/types/opme';

interface OpmeQuotationsSectionProps {
  item: OpmeItemData;
  onUpdate: (item: OpmeItemData) => void;
}

export default function OpmeQuotationsSection({ item, onUpdate }: OpmeQuotationsSectionProps) {
  const handleChange = (index: number, field: keyof OpmeQuotation, value: string) => {
    const updated = item.quotations.map((q, i) => (i === index ? { ...q, [field]: value } : q)) as [
      OpmeQuotation,
      OpmeQuotation,
      OpmeQuotation,
    ];
    onUpdate({ ...item, quotations: updated });
  };

  return (
    <Box>
      <Divider sx={{ my: 2 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary' }}
        >
          Cotações (mín. 3)
        </Typography>
      </Divider>
      {item.quotations.map((q, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
          <TextField
            size="small"
            label={`Fornecedor ${String(i + 1)}`}
            value={q.supplier}
            onChange={(e) => {
              handleChange(i, 'supplier', e.target.value);
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Valor (R$)"
            type="number"
            value={q.value}
            onChange={(e) => {
              handleChange(i, 'value', e.target.value);
            }}
            sx={{ width: 140 }}
          />
        </Box>
      ))}
    </Box>
  );
}
