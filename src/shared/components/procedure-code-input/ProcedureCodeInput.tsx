'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type GuiaProcedure } from '@/types/procedure-codes';

import { type CodeOption, useProcedureCodeInput } from './useProcedureCodeInput';

interface ProcedureCodeInputProps {
  onAdd: (procedure: GuiaProcedure) => void;
  defaultCode?: string;
  disabled?: boolean;
  label?: string;
}

export default function ProcedureCodeInput({
  onAdd,
  disabled,
  label = 'Buscar código TUSS ou pacote',
}: ProcedureCodeInputProps) {
  const { inputValue, setInputValue, filteredOptions, buildProcedure } = useProcedureCodeInput();

  return (
    <Autocomplete<CodeOption>
      options={filteredOptions}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => `${option.code} — ${option.description}`}
      inputValue={inputValue}
      onInputChange={(_e, value, reason) => {
        if (reason !== 'reset') setInputValue(value);
      }}
      onChange={(_e, option) => {
        if (!option) return;
        onAdd(buildProcedure(option));
        setInputValue('');
      }}
      value={null}
      disabled={disabled}
      noOptionsText={inputValue.length < 2 ? 'Digite ao menos 2 caracteres' : 'Nenhum resultado'}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={`${option.codeType}-${option.code}`}>
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
        </Box>
      )}
      renderInput={(params) => <TextField {...params} size="small" placeholder={label} fullWidth />}
      slotProps={{ paper: { sx: { fontSize: 13 } } }}
      size="small"
      fullWidth
    />
  );
}
