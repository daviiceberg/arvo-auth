'use client';

import { useMemo } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type CodeType } from '@/types/procedure-codes';

import { OPERATOR_PACKAGES, TUSS_CODES } from '@/mocks/procedure-codes';

interface CodeOption {
  codeType: CodeType;
  code: string;
  description: string;
  group: string;
}

const MIN_CHARS = 2;

function buildOptions(): CodeOption[] {
  const tuss: CodeOption[] = TUSS_CODES.map((t) => ({
    codeType: 'TUSS',
    code: t.code,
    description: t.description,
    group: 'Códigos TUSS',
  }));
  const pkgs: CodeOption[] = OPERATOR_PACKAGES.filter((p) => p.isActive).map((p) => ({
    codeType: 'PACKAGE',
    code: p.packageCode,
    description: p.packageName,
    group: 'Pacotes da operadora',
  }));
  return [...tuss, ...pkgs];
}

interface TussCodeSearchFieldProps {
  /** Current code value (TUSS or pacote). */
  code: string;
  /** Current description value. */
  description: string;
  /** Called with both code and description when user picks an option or types. */
  onChange: (code: string, description: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function TussCodeSearchField({
  code,
  description,
  onChange,
  label = 'Código TUSS / Pacote *',
  placeholder = 'Buscar código TUSS ou pacote',
  disabled = false,
}: TussCodeSearchFieldProps) {
  const options = useMemo(() => buildOptions(), []);

  const currentValue = useMemo<CodeOption | null>(() => {
    if (!code) return null;
    return options.find((o) => o.code === code) ?? null;
  }, [code, options]);

  const inputDisplay = code ? (description ? `${code} — ${description}` : code) : '';

  return (
    <Autocomplete<CodeOption, false, false, true>
      freeSolo
      openOnFocus
      options={options}
      groupBy={(o) => o.group}
      getOptionLabel={(o) => (typeof o === 'string' ? o : `${o.code} — ${o.description}`)}
      isOptionEqualToValue={(option, val) => typeof val !== 'string' && option.code === val.code}
      value={currentValue}
      inputValue={inputDisplay}
      filterOptions={(opts, { inputValue }) => {
        const q = inputValue.toLowerCase().trim();
        if (q.length < MIN_CHARS) return opts;
        return opts.filter(
          (o) => o.code.toLowerCase().includes(q) || o.description.toLowerCase().includes(q),
        );
      }}
      onChange={(_e, newValue) => {
        if (!newValue) {
          onChange('', '');
          return;
        }
        if (typeof newValue === 'string') {
          onChange(newValue, '');
          return;
        }
        onChange(newValue.code, newValue.description);
      }}
      onInputChange={(_e, value, reason) => {
        if (reason === 'input') {
          // user typing free text — keep code in sync, drop description
          onChange(value, '');
        }
      }}
      disabled={disabled}
      renderOption={(props, option) => (
        <li {...props} key={`${option.codeType}-${option.code}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <CodeTypeChip codeType={option.codeType} />
            <Box
              component="span"
              sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace', flexShrink: 0 }}
            >
              {option.code}
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 13,
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {option.description}
            </Box>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} size="small" label={label} placeholder={placeholder} fullWidth />
      )}
      noOptionsText="Digite ao menos 2 caracteres"
      size="small"
      fullWidth
    />
  );
}
