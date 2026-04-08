'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { CategoryChip, DecisionActionChip } from '@/shared/components';
import { type HistoricoEntry } from '@/types/pedido';

import DecisionOriginChip from './DecisionOriginChip';

interface HistoryListTableRowProps {
  entry: HistoricoEntry;
  onNavigate: (id: string) => void;
}

export default function HistoryListTableRow({ entry, onNavigate }: HistoryListTableRowProps) {
  return (
    <TableRow
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: 'rgba(144,43,41,0.03)' },
        ...(entry.acao === 'Devolutiva' && {
          borderLeft: '3px solid #f59e0b',
        }),
      }}
      onClick={() => onNavigate(entry.id)}
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
          {entry.beneficiario}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace' }}
        >
          …{entry.carteirinha.slice(-8)}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <CategoryChip category={entry.categoria} />
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
          {entry.procedimento}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <DecisionActionChip action={entry.acao} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <DecisionOriginChip origin={entry.origem} />
        {entry.origem === 'analista' && (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 12, color: 'text.secondary', mt: 0.5 }}
          >
            {entry.analista}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        {entry.origem === 'ia_automatica' ? (
          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.disabled' }}>
            —
          </Typography>
        ) : (
          <Chip
            label={entry.iaSugestao}
            size="small"
            variant="outlined"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              height: 20,
              borderColor:
                entry.iaSugestao === 'Aprovar'
                  ? '#16a34a'
                  : entry.iaSugestao === 'Negar'
                    ? '#d4183d'
                    : '#b45309',
              color:
                entry.iaSugestao === 'Aprovar'
                  ? '#16a34a'
                  : entry.iaSugestao === 'Negar'
                    ? '#d4183d'
                    : '#b45309',
            }}
          />
        )}
        {entry.divergencia ? (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 11, color: '#b45309', fontWeight: 600, mt: 0.4 }}
          >
            ⚠ Divergiu
          </Typography>
        ) : (
          <Typography
            variant="caption"
            sx={{ display: 'block', fontSize: 11, color: '#16a34a', fontWeight: 600, mt: 0.4 }}
          >
            ✓ Alinhado
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {`${entry.dataDecisao.slice(0, 5)}/${entry.dataDecisao.slice(8, 10)} · ${entry.dataDecisao.split(' ')[1]}`}
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
