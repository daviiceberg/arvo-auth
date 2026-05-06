'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { type SxProps, type Theme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CategoryChip, RequestTypeChip, SLAChip } from '@/shared/components';
import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { formatDurationFromHours } from '@/shared/utils/formatDuration';
import { type Request } from '@/types/pedido';

import { getRequestStage } from '../utils/request-stage';

// ── Row style helper ─────────────────────────────────────────────────
function getRowSx(request: Request, lastViewedId: string | null): SxProps<Theme> {
  return {
    cursor: 'pointer',
    transition: 'background-color 0.25s ease',
    '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' },
    ...(request.id === lastViewedId && {
      backgroundColor: 'rgba(144,43,41,0.06) !important',
      outline: '1px solid rgba(144,43,41,0.2)',
    }),
  };
}

// ── Procedures cell ──────────────────────────────────────────────────
function ProceduresCell({ procedures }: { procedures: Request['procedures'] }) {
  const first = procedures[0];
  const codeType = first?.codeType ?? 'TUSS';

  if (procedures.length > 1) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
          <CodeTypeChip codeType={codeType} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
            {procedures.length} procedimentos
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Clique para ver detalhes
        </Typography>
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
        <CodeTypeChip codeType={codeType} />
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, fontFamily: 'monospace' }}>
          {first?.tuss ?? '—'}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: 12,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          whiteSpace: 'normal',
        }}
      >
        {codeType === 'PACKAGE' && first?.tussCodesIncluded
          ? `${first.description} (${String(first.tussCodesIncluded.length)} TUSS)`
          : (first?.description ?? '—')}
      </Typography>
    </>
  );
}

// ── Action cell ──────────────────────────────────────────────────────
interface ActionCellProps {
  request: Request;
  onRowClick: (requestId: string) => void;
}

function ActionCell({ request, onRowClick }: ActionCellProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Tooltip
        title={
          request.operatorLock
            ? `Em análise por ${request.operatorLock.userName} desde ${request.operatorLock.lockedAt}`
            : ''
        }
        placement="top"
        disableHoverListener={!request.operatorLock}
      >
        <span>
          <Button
            size="small"
            variant={request.operatorLock ? 'outlined' : 'contained'}
            onClick={() => {
              onRowClick(request.id);
            }}
            aria-label={`Analisar pedido ${request.id}`}
            sx={{
              minHeight: 28,
              fontSize: 12,
              px: 1.5,
              ...(request.operatorLock && {
                color: 'text.secondary',
                borderColor: 'rgba(0,0,0,0.2)',
              }),
            }}
          >
            {request.operatorLock ? 'Observar' : 'Analisar'}
          </Button>
        </span>
      </Tooltip>
      {request.operatorLock ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.5 }}>
          <LockOutlinedIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ fontSize: 10, color: 'text.disabled' }}>
            {request.operatorLock.userName}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

// ── Main component ───────────────────────────────────────────────────
interface QueueTableRowProps {
  request: Request;
  lastViewedId: string | null;
  onRowClick: (requestId: string) => void;
}

export default function QueueTableRow({ request, lastViewedId, onRowClick }: QueueTableRowProps) {
  const requestType = request.authorizationStage === 'continuidade' ? 'continuidade' : 'primeira';

  return (
    <TableRow
      key={request.id}
      onClick={() => {
        onRowClick(request.id);
      }}
      aria-label={`Pedido ${request.id}`}
      sx={getRowSx(request, lastViewedId)}
    >
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main', fontSize: 12 }}>
          {request.id}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: 11, whiteSpace: 'nowrap' }}
        >
          {`${request.protocolDate.slice(0, 5)} · ${request.protocolDate.split(' ')[1] ?? ''}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
          {request.beneficiary.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {request.beneficiary.plan}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <RequestTypeChip type={requestType} />
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <CategoryChip category={request.category} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          {request.executingProvider.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {request.requestingProvider.professional}
        </Typography>
      </TableCell>
      <TableCell sx={{ maxWidth: 160, px: 1.5 }}>
        <ProceduresCell procedures={request.procedures} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {formatDurationFromHours(request.queueTimeHours)}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <SLAChip status={request.slaStatus} label={request.slaText} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>
          {getRequestStage(request)}
        </Typography>
      </TableCell>
      <TableCell
        sx={{ px: 1.5 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ActionCell request={request} onRowClick={onRowClick} />
      </TableCell>
    </TableRow>
  );
}
