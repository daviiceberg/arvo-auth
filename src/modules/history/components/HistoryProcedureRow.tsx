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

interface DetailedProc {
  code: string;
  tuss: string;
  description: string;
  qty: number;
  authorizedQty?: number;
  startDate: string;
  endDate: string;
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

interface HistoryProcedureRowProps {
  proc: DetailedProc;
  isLast: boolean;
  isPartial: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function HistoryProcedureRow({
  proc,
  isLast,
  isPartial,
  isExpanded,
  onToggleExpand,
}: HistoryProcedureRowProps) {
  const codeType = proc.codeType ?? 'TUSS';
  const isPackage = codeType === 'PACKAGE';
  const hasTussCodes = isPackage && (proc.tussCodesIncluded?.length ?? 0) > 0;

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
        <TableCell sx={{ pl: 0, verticalAlign: 'top', pt: 1.5, width: 80 }}>
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
        <TableCell
          sx={{ fontWeight: 700, fontSize: 13, width: 120, verticalAlign: 'top', pt: 1.5 }}
        >
          {proc.tuss}
        </TableCell>
        {/* Descrição */}
        <TableCell sx={{ fontWeight: 600, fontSize: 13, verticalAlign: 'top', pt: 1.5 }}>
          {proc.description}
        </TableCell>
        {/* Qtd */}
        <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
          Qtd: {proc.qty}
          {proc.authorizedQty !== undefined ? ` · Aut: ${String(proc.authorizedQty)}` : ''}
        </TableCell>
        {/* Período */}
        <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
          {proc.startDate} → {proc.endDate}
        </TableCell>
        {/* Status */}
        <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
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
            <Chip
              label={proc.auditLevel}
              size="small"
              sx={{
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: '#6b7280',
                fontWeight: 600,
                fontSize: 11,
                height: 20,
              }}
            />
          </Box>
        </TableCell>
        {/* Decisão parcial */}
        {isPartial ? (
          <TableCell sx={{ verticalAlign: 'top', pt: 1.5, pr: 0 }}>
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
              <TableCell />
              <TableCell sx={{ pl: 2 }}>
                <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: 'text.secondary' }}>
                  {tuss.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                  {tuss.description}
                </Typography>
              </TableCell>
              <TableCell colSpan={isPartial ? 4 : 3} />
            </TableRow>
          ))
        : null}
    </>
  );
}
