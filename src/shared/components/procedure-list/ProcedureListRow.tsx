'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type GuiaProcedure } from '@/types/procedure-codes';

interface ProcedureListRowProps {
  procedure: GuiaProcedure;
  readOnly: boolean;
  showPeriod: boolean;
  showQuantity: boolean;
  isExpanded: boolean;
  isFixed: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
  onPeriodChange: (field: 'periodStart' | 'periodEnd', value: string) => void;
}

export default function ProcedureListRow({
  procedure,
  readOnly,
  showPeriod,
  showQuantity,
  isExpanded,
  isFixed,
  onToggleExpand,
  onRemove,
  onQuantityChange,
  onPeriodChange,
}: ProcedureListRowProps) {
  const isPackage = procedure.codeType === 'PACKAGE';
  const hasTussCodes = isPackage && (procedure.tussCodesIncluded?.length ?? 0) > 0;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          '&:last-of-type': { borderBottom: 'none' },
        }}
      >
        <CodeTypeChip
          codeType={procedure.codeType}
          onClick={hasTussCodes ? onToggleExpand : undefined}
        />
        {hasTussCodes ? (
          <IconButton size="small" onClick={onToggleExpand} sx={{ p: 0.25 }}>
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        ) : null}
        <Typography sx={{ fontWeight: 700, fontSize: 12, fontFamily: 'monospace', flexShrink: 0 }}>
          {procedure.code}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: 'text.secondary',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {procedure.description}
        </Typography>
        {showQuantity ? (
          <TextField
            size="small"
            type="number"
            value={procedure.quantity}
            onChange={(e) => {
              onQuantityChange(Math.max(1, Number(e.target.value)));
            }}
            disabled={readOnly}
            sx={{ width: 70 }}
            slotProps={{ input: { sx: { fontSize: 12 } } }}
          />
        ) : null}
        {showPeriod ? (
          <>
            <TextField
              size="small"
              type="date"
              value={procedure.periodStart ?? ''}
              onChange={(e) => {
                onPeriodChange('periodStart', e.target.value);
              }}
              disabled={readOnly}
              sx={{ width: 140 }}
              slotProps={{ input: { sx: { fontSize: 12 } }, inputLabel: { shrink: true } }}
            />
            <TextField
              size="small"
              type="date"
              value={procedure.periodEnd ?? ''}
              onChange={(e) => {
                onPeriodChange('periodEnd', e.target.value);
              }}
              disabled={readOnly}
              sx={{ width: 140 }}
              slotProps={{ input: { sx: { fontSize: 12 } }, inputLabel: { shrink: true } }}
            />
          </>
        ) : null}
        {!readOnly && !isFixed && (
          <IconButton size="small" color="error" onClick={onRemove} sx={{ p: 0.25 }}>
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
      {isExpanded
        ? procedure.tussCodesIncluded?.map((tuss) => (
            <Box
              key={tuss.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pl: 6,
                pr: 1.5,
                py: 0.5,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                }}
              >
                {tuss.code}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                {tuss.description}
              </Typography>
            </Box>
          ))
        : null}
    </>
  );
}
