'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DecisionActionChip } from '@/shared/components';
import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type HistoryEntry, type IASuggestion } from '@/types/pedido';

import DecisionOriginChip from './DecisionOriginChip';

interface IASuggestionCellProps {
  iaSuggestion: HistoryEntry['iaSuggestion'];
}

const SUGGESTION_COLOR_MAP: Record<IASuggestion, string> = {
  Aprovar: 'success.main',
  Negar: 'error.main',
};

function IASuggestionCell({ iaSuggestion }: IASuggestionCellProps) {
  const suggestionColor = SUGGESTION_COLOR_MAP[iaSuggestion];

  return (
    <Chip
      label={iaSuggestion}
      size="small"
      variant="outlined"
      sx={{
        fontSize: 12,
        fontWeight: 600,
        height: 20,
        borderColor: suggestionColor,
        color: suggestionColor,
      }}
    />
  );
}

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
      <TableCell sx={{ maxWidth: 280, px: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
          <CodeTypeChip codeType={entry.detailedProcedures?.[0]?.codeType ?? 'TUSS'} />
          {(entry.detailedProcedures?.length ?? 0) > 1 ? (
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
              {entry.detailedProcedures?.length} procedimentos
            </Typography>
          ) : null}
        </Box>
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
        <IASuggestionCell iaSuggestion={entry.iaSuggestion} />
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
