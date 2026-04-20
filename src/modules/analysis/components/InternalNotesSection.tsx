'use client';

import { useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface InternalNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InternalNotesSection({ value, onChange }: InternalNotesSectionProps) {
  const [open, setOpen] = useState(!!value);

  return (
    <Card>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityOffIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15 }}>
              Observações Internas
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: 'warning.main',
                fontWeight: 600,
                backgroundColor: 'rgba(245,158,11,0.1)',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              Visível apenas para a equipe da operadora
            </Typography>
          </Box>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>
        <Collapse in={open}>
          <Box sx={{ mt: 2 }}>
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
        </Collapse>
      </CardContent>
    </Card>
  );
}
