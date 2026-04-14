'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { dutDatabase } from '@/mocks/dut-database';

interface DutOption {
  number: number;
  label: string;
}

const DUT_OPTIONS: DutOption[] = Object.values(dutDatabase).map((d) => ({
  number: d.number,
  label: `DUT ${String(d.number)} — ${d.title}`,
}));

interface AdjustmentFieldDutProps {
  newDut: string;
  setNewDut: (value: string) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export default function AdjustmentFieldDut({
  newDut,
  setNewDut,
  errors,
  setErrors,
}: AdjustmentFieldDutProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.75, display: 'block' }}
      >
        Nova DUT *
      </Typography>
      <Autocomplete
        options={DUT_OPTIONS}
        getOptionLabel={(opt) => opt.label}
        value={DUT_OPTIONS.find((o) => String(o.number) === newDut) ?? null}
        onChange={(_e, opt) => {
          setNewDut(opt ? String(opt.number) : '');
          setErrors({ ...errors, newDut: '' });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="Buscar DUT por número ou título"
            error={!!errors.newDut}
            helperText={errors.newDut}
          />
        )}
        size="small"
      />
    </Box>
  );
}
