'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

import { CollapsibleCard } from '@/shared/components';

interface InternalNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InternalNotesSection({ value, onChange }: InternalNotesSectionProps) {
  return (
    <CollapsibleCard
      title="Observações Internas"
      headerRight={
        <Chip
          label="Visível apenas para a equipe da operadora"
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: 'rgba(245,158,11,0.1)',
            color: 'warning.main',
          }}
        />
      }
    >
      <Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Notas internas sobre esta guia (não compartilhadas com o prestador)..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(245,158,11,0.03)',
              '& fieldset': { borderColor: 'rgba(245,158,11,0.2)' },
            },
          }}
        />
      </Box>
    </CollapsibleCard>
  );
}
