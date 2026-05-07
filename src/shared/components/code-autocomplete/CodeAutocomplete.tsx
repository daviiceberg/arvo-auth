'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type OperatorPackage, type TussCode } from '@/types/procedure-codes';

export type CodeOption =
  | { kind: 'TUSS'; tuss: TussCode }
  | { kind: 'PACKAGE'; pkg: OperatorPackage };

interface CodeAutocompleteProps {
  tussOptions: TussCode[];
  packageOptions: OperatorPackage[];
  value: CodeOption | null;
  onChange: (option: CodeOption | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

function buildOptions(tussOptions: TussCode[], packageOptions: OperatorPackage[]): CodeOption[] {
  const tussItems: CodeOption[] = tussOptions.map((t) => ({ kind: 'TUSS', tuss: t }));
  const pkgItems: CodeOption[] = packageOptions
    .filter((p) => p.isActive)
    .map((p) => ({ kind: 'PACKAGE', pkg: p }));
  return [...pkgItems, ...tussItems];
}

function getOptionCode(option: CodeOption): string {
  return option.kind === 'TUSS' ? option.tuss.code : option.pkg.packageCode;
}

function getOptionLabel(option: CodeOption): string {
  if (option.kind === 'TUSS') {
    return `${option.tuss.code} — ${option.tuss.description}`;
  }
  return `${option.pkg.packageCode} — ${option.pkg.packageName}`;
}

function getGroupLabel(option: CodeOption): string {
  return option.kind === 'PACKAGE' ? 'Pacote do operador' : 'TUSS';
}

export default function CodeAutocomplete({
  tussOptions,
  packageOptions,
  value,
  onChange,
  label = 'Código',
  placeholder = 'Buscar TUSS ou Pacote',
  disabled = false,
  size = 'small',
  fullWidth = true,
}: CodeAutocompleteProps) {
  const options = buildOptions(tussOptions, packageOptions);

  return (
    <Autocomplete
      value={value}
      onChange={(_event, newValue) => {
        onChange(newValue);
      }}
      options={options}
      groupBy={getGroupLabel}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) => getOptionCode(option) === getOptionCode(val)}
      filterOptions={(opts, { inputValue }) => {
        const q = inputValue.toLowerCase().trim();
        if (q.length === 0) return opts;
        return opts.filter((o) => {
          const code = getOptionCode(o).toLowerCase();
          const label = getOptionLabel(o).toLowerCase();
          return code.includes(q) || label.includes(q);
        });
      }}
      renderOption={(props, option) => (
        <li {...props} key={getOptionCode(option)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: option.kind === 'PACKAGE' ? 'primary.main' : 'text.primary',
                flexShrink: 0,
                minWidth: 96,
              }}
            >
              {getOptionCode(option)}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', flex: 1 }}>
              {option.kind === 'TUSS' ? option.tuss.description : option.pkg.packageName}
            </Typography>
            {option.kind === 'PACKAGE' ? (
              <Chip
                label="PACOTE"
                size="small"
                sx={{
                  fontSize: 10,
                  height: 18,
                  fontWeight: 700,
                  backgroundColor: 'rgba(144,43,41,0.08)',
                  color: 'primary.main',
                }}
              />
            ) : null}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} size={size} />
      )}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    />
  );
}
