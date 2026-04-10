'use client';

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { CategoryChip, DecisionActionChip } from '@/shared/components';
import { type HistoryEntry } from '@/types/pedido';

import DecisionOriginChip from './DecisionOriginChip';

interface HistoryListTableRowProps {
  entry: HistoryEntry;
  onNavigate: (id: string) => void;
}

export default function HistoryListTableRow({ entry, onNavigate }: HistoryListTableRowProps) {
  return (
    <TableRow
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: 'rgba(144,43,41,0.03)' },
        ...(entry.action === 'Devolutiva' && {
          borderLeft: '3px solid #f59e0b',
        }),
      }}
      onClick={() => {
        onNavigate(entry.id);
      }}
    >
      <TableCell sx={{ px: 1.5 }}>
        <Typography
          variant="body2"
          sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}
        >
          {entry.id}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
          {entry.beneficiary}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace' }}
        >
          …{entry.cardNumber.slice(-8)}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <CategoryChip category={entry.category} />
      </TableCell>
      <TableCell sx={{ maxWidth: 280, px: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            whiteSpace: 'normal',
          }}
        >
          {entry.procedure}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <DecisionActionChip action={entry.action} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <DecisionOriginChip origin={entry.origin} />
        {entry.origin === 'analista' && (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 12, color: 'text.secondary', mt: 0.5 }}
          >
            {entry.analyst}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        {entry.origin === 'ia_automatica' ? (
          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.disabled' }}>
            —
          </Typography>
        ) : (
          <Chip
            label={entry.iaSuggestion}
            size="small"
            variant="outlined"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              height: 20,
              borderColor:
                entry.iaSuggestion === 'Aprovar'
                  ? 'success.main'
                  : entry.iaSuggestion === 'Negar'
                    ? 'error.main'
                    : 'warning.main',
              color:
                entry.iaSuggestion === 'Aprovar'
                  ? 'success.main'
                  : entry.iaSuggestion === 'Negar'
                    ? 'error.main'
                    : 'warning.main',
            }}
          />
        )}
        {entry.divergence ? (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 11, color: 'warning.main', fontWeight: 600, mt: 0.4 }}
          >
            ⚠ Divergiu
          </Typography>
        ) : (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 11, color: 'success.main', fontWeight: 600, mt: 0.4 }}
          >
            ✓ Alinhado
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {`${entry.decisionDate.slice(0, 5)}/${entry.decisionDate.slice(8, 10)} · ${entry.decisionDate.split(' ')[1] ?? ''}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Button
          size="small"
          variant="outlined"
          sx={{ fontSize: 12, py: 0.25, px: 1.5, minHeight: 28 }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(entry.id);
          }}
        >
          Ver detalhes
        </Button>
      </TableCell>
    </TableRow>
  );
}
