'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CID_DATABASE, CID_GROUP_LABELS } from '@/shared/constants/cid-codes';

interface AdjustmentFieldCidProps {
  currentCid: string;
  newCid: string;
  onNewCidChange: (value: string) => void;
}

export default function AdjustmentFieldCid({
  currentCid,
  newCid,
  onNewCidChange,
}: AdjustmentFieldCidProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}
        >
          CID Atual
        </Typography>
        <Typography sx={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600 }}>
          {currentCid || '—'}
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            color: 'text.secondary',
            fontWeight: 600,
            mb: 0.5,
            display: 'block',
          }}
        >
          Novo CID <span style={{ color: '#C62828' }}>*</span>
        </Typography>
        <Autocomplete
          freeSolo
          openOnFocus
          options={CID_DATABASE}
          groupBy={(option) => CID_GROUP_LABELS[option.group] ?? ''}
          getOptionLabel={(opt) =>
            typeof opt === 'string' ? opt : `${opt.code} — ${opt.description}`
          }
          filterOptions={(options, { inputValue }) => {
            const q = inputValue.toLowerCase().trim();
            if (q.length < 2) return options.filter((c) => c.group === 'tea');
            return options.filter(
              (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
            );
          }}
          inputValue={newCid}
          onInputChange={(_e, value) => {
            onNewCidChange(value);
          }}
          onChange={(_e, value) => {
            if (value && typeof value !== 'string') {
              onNewCidChange(`${value.code} — ${value.description}`);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="Buscar CID (ex: F84, autismo...)" />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.code}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, width: '100%' }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: 'monospace',
                    color: option.group === 'tea' ? '#166534' : 'text.secondary',
                    flexShrink: 0,
                    minWidth: 56,
                  }}
                >
                  {option.code}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                  {option.description}
                </Typography>
              </Box>
            </li>
          )}
          renderGroup={(params) => (
            <li key={params.key}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: params.group.includes('TEA')
                    ? 'rgba(22,163,74,0.06)'
                    : 'rgba(0,0,0,0.03)',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                    color: params.group.includes('TEA') ? '#166534' : 'text.secondary',
                  }}
                >
                  {params.group}
                </Typography>
              </Box>
              <ul style={{ padding: 0 }}>{params.children}</ul>
            </li>
          )}
          noOptionsText="Nenhum CID encontrado"
          size="small"
        />
        {newCid.startsWith('F84') ? (
          <Typography sx={{ fontSize: 11, color: '#166534', mt: 0.5 }}>
            ✓ RN 539/2022 — sessões ilimitadas aplicáveis
          </Typography>
        ) : null}
        {newCid && !newCid.startsWith('F84') && currentCid.startsWith('F84') ? (
          <Typography sx={{ fontSize: 11, color: '#b45309', mt: 0.5 }}>
            ⚠ Alteração de F84 para outro CID remove a aplicação da RN 539
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
