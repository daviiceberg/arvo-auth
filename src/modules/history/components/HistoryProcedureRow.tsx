'use client';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type CodeType, type TussCode } from '@/types/procedure-codes';

import { getDutNumberForTuss } from '@/mocks/tuss-dut-mapping';

function formatDates(requestDate: string, expiryDate?: string): string {
  return `Solic.: ${requestDate} · Val.: ${expiryDate ?? '—'}`;
}

const TD_SX = { py: '8px', px: 2, verticalAlign: 'top' as const };

interface DetailedProc {
  code: string;
  tuss: string;
  description: string;
  qty: number;
  authorizedQty?: number;
  requestDate: string;
  passwordExpiryDate?: string;
  cid: string;
  auditLevel: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';
  decisao?: 'aprovado' | 'negado';
  motivoDecisao?: string;
  codeType?: CodeType;
  tussCodesIncluded?: TussCode[];
}

interface PartialDecisionCellProps {
  decisao: DetailedProc['decisao'];
  motivoDecisao: DetailedProc['motivoDecisao'];
}

function PartialDecisionCell({ decisao, motivoDecisao }: PartialDecisionCellProps) {
  if (decisao === 'aprovado') {
    return (
      <Chip
        icon={
          <CheckCircleIcon sx={{ fontSize: 12, ml: '4px !important', color: 'success.main' }} />
        }
        label="Aprovado"
        size="small"
        sx={{
          backgroundColor: 'rgba(22,163,74,0.1)',
          color: 'success.main',
          fontWeight: 700,
          fontSize: 11,
          height: 20,
        }}
      />
    );
  }

  if (decisao === 'negado') {
    return (
      <Box>
        <Chip
          icon={<CancelIcon sx={{ fontSize: 12, ml: '4px !important', color: 'error.main' }} />}
          label="Negado"
          size="small"
          sx={{
            backgroundColor: 'rgba(212,24,61,0.1)',
            color: 'error.main',
            fontWeight: 700,
            fontSize: 11,
            height: 20,
            mb: 0.5,
          }}
        />
        {motivoDecisao ? (
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: 'text.secondary', display: 'block' }}
          >
            {motivoDecisao}
          </Typography>
        ) : null}
      </Box>
    );
  }

  return null;
}

function DutCell({
  dutNumber,
  onDutClick,
}: {
  dutNumber: number | null;
  onDutClick: (n: number) => void;
}) {
  return (
    <TableCell sx={{ ...TD_SX, width: 70, textAlign: 'left' }}>
      {dutNumber ? (
        <Typography
          component="button"
          onClick={() => {
            onDutClick(dutNumber);
          }}
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: 'primary.main',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            p: 0,
            whiteSpace: 'nowrap',
            textAlign: 'left',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          DUT {String(dutNumber)}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>—</Typography>
      )}
    </TableCell>
  );
}

interface HistoryProcedureRowProps {
  proc: DetailedProc;
  executingProviderName: string;
  isLast: boolean;
  isPartial: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDutClick: (dutNumber: number) => void;
}

export default function HistoryProcedureRow({
  proc,
  executingProviderName,
  isLast,
  isPartial,
  isExpanded,
  onToggleExpand,
  onDutClick,
}: HistoryProcedureRowProps) {
  const codeType = proc.codeType ?? 'TUSS';
  const isPackage = codeType === 'PACKAGE';
  const hasTussCodes = isPackage && (proc.tussCodesIncluded?.length ?? 0) > 0;
  const dutNumber = getDutNumberForTuss(proc.code);

  return (
    <>
      <TableRow
        sx={{
          cursor: 'default',
          '& td': {
            borderBottom: isLast && !isExpanded ? 'none' : '1px solid rgba(0,0,0,0.08)',
          },
          '&:not(:first-of-type) td': { pt: 2 },
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        {/* Tipo */}
        <TableCell sx={{ ...TD_SX, width: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CodeTypeChip codeType={codeType} onClick={hasTussCodes ? onToggleExpand : undefined} />
            {hasTussCodes ? (
              <IconButton size="small" onClick={onToggleExpand} sx={{ p: 0.25 }}>
                {isExpanded ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            ) : null}
          </Box>
        </TableCell>
        {/* Código */}
        <TableCell sx={{ ...TD_SX, fontWeight: 700, fontSize: 13, width: 120 }}>
          {proc.tuss}
        </TableCell>
        {/* Descrição */}
        <TableCell sx={{ ...TD_SX, fontWeight: 600, fontSize: 13 }}>{proc.description}</TableCell>
        {/* Qtd */}
        <TableCell sx={{ ...TD_SX, color: 'text.secondary', fontSize: 12, width: 80 }}>
          Qtd: {proc.qty}
          {proc.authorizedQty !== undefined ? ` · Aut: ${String(proc.authorizedQty)}` : ''}
        </TableCell>
        {/* Prestador */}
        <TableCell
          sx={{
            ...TD_SX,
            color: 'text.secondary',
            fontSize: 12,
            maxWidth: 160,
            minWidth: 120,
          }}
        >
          {executingProviderName}
        </TableCell>
        {/* Datas */}
        <TableCell sx={{ ...TD_SX, color: 'text.secondary', fontSize: 12, width: 140 }}>
          {formatDates(proc.requestDate, proc.passwordExpiryDate)}
        </TableCell>
        {/* CID */}
        <TableCell sx={TD_SX}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
            {proc.cid ? (
              <Chip
                label={`CID ${proc.cid}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  color: 'info.main',
                  fontWeight: 700,
                  fontSize: 12,
                  height: 20,
                }}
              />
            ) : null}
          </Box>
        </TableCell>
        <DutCell dutNumber={dutNumber} onDutClick={onDutClick} />
        {/* Decisão parcial */}
        {isPartial ? (
          <TableCell sx={{ ...TD_SX, minWidth: 100 }}>
            <PartialDecisionCell decisao={proc.decisao} motivoDecisao={proc.motivoDecisao} />
          </TableCell>
        ) : null}
      </TableRow>
      {/* Expanded TUSS sub-rows */}
      {isExpanded
        ? proc.tussCodesIncluded?.map((tuss) => (
            <TableRow
              key={tuss.code}
              sx={{ '& td': { borderBottom: '1px solid rgba(0,0,0,0.04)' } }}
            >
              <TableCell sx={TD_SX} />
              <TableCell sx={TD_SX}>
                <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: 'text.secondary' }}>
                  {tuss.code}
                </Typography>
              </TableCell>
              <TableCell sx={TD_SX}>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                  {tuss.description}
                </Typography>
              </TableCell>
              <TableCell sx={TD_SX} colSpan={isPartial ? 6 : 5} />
            </TableRow>
          ))
        : null}
    </>
  );
}
