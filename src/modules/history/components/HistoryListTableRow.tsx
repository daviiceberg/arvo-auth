'use client';

import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { CategoryChip, DecisionActionChip } from '@/shared/components';
import { CHIP_BASE_SX, CHIP_ICON_FONT_SIZE } from '@/shared/components/chips/chip-styles';
import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type HistoryEntry } from '@/types/pedido';

import DecisionOriginChip from './DecisionOriginChip';

const FLAG_CHIP_SX = (bg: string, color: string) => ({
  ...CHIP_BASE_SX,
  backgroundColor: bg,
  color,
  alignSelf: 'flex-start',
  '& .MuiChip-icon': { color },
});

function FlagChips({ entry }: { entry: HistoryEntry }) {
  const has =
    entry.passedThroughPendency === true ||
    entry.passedThroughJunta === true ||
    entry.hadInjunction === true ||
    entry.hadNip === true;
  if (!has) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.5 }}>
      {entry.passedThroughPendency ? (
        <Chip
          icon={
            <AssignmentReturnOutlinedIcon
              sx={{ fontSize: CHIP_ICON_FONT_SIZE, ml: '4px !important' }}
            />
          }
          label="Passou por pendência"
          size="small"
          sx={FLAG_CHIP_SX('rgba(245,158,11,0.18)', '#d97706')}
        />
      ) : null}
      {entry.passedThroughJunta ? (
        <Chip
          icon={<GroupsOutlinedIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE, ml: '4px !important' }} />}
          label="Passou por junta médica"
          size="small"
          sx={FLAG_CHIP_SX('rgba(124,58,237,0.12)', '#6d28d9')}
        />
      ) : null}
      {entry.hadInjunction ? (
        <Chip
          label="Liminar Judicial"
          size="small"
          sx={FLAG_CHIP_SX('rgba(91,33,182,0.12)', '#5b21b6')}
        />
      ) : null}
      {entry.hadNip ? (
        <Chip label="NIP" size="small" sx={FLAG_CHIP_SX('rgba(194,65,12,0.12)', '#c2410c')} />
      ) : null}
    </Box>
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
      <TableCell sx={{ px: 1.5 }}>
        <CategoryChip category={entry.category} />
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
        <FlagChips entry={entry} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {`${entry.decisionDate.slice(0, 5)}/${entry.decisionDate.slice(8, 10)}`}
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
