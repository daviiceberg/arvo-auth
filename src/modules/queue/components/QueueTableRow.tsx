'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { type SxProps, type Theme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  CategoryChip,
  GuideTypeChip,
  IASuggestionChip,
  OriginChip,
  PrioDot,
  RequestTypeChip,
  SLAChip,
} from '@/shared/components';
import { type Request } from '@/types/pedido';

import { REQUEST_TYPE_MAP } from '../constants/request-type-map';

import SubStatusLabel from './SubStatusLabel';

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
    ...(request.status === 'Devolutiva' && {
      borderLeft: '3px solid #f59e0b',
    }),
    ...(request.subStatus === 'PENDENTE_RETORNO_RECEBIDO' && {
      backgroundColor: 'rgba(245,158,11,0.06) !important',
    }),
    ...(request.subStatus === 'JUNTA_PARECER_RECEBIDO' && {
      backgroundColor: 'rgba(37,99,235,0.05) !important',
      borderLeft: '3px solid #2563eb',
    }),
    ...(request.subStatus === 'JUNTA_AGUARDANDO' && {
      borderLeft: '3px solid rgba(37,99,235,0.5)',
    }),
  };
}

// ── Procedures cell ──────────────────────────────────────────────────
function ProceduresCell({ procedures }: { procedures: Request['procedures'] }) {
  if (procedures.length > 1) {
    return (
      <>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
          {procedures.length} procedimentos
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Clique para ver detalhes
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, fontFamily: 'monospace' }}>
        {procedures[0]?.tuss ?? '—'}
      </Typography>
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
        {procedures[0]?.description ?? '—'}
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
            ? `Em análise por ${request.operatorLock.nome} desde ${request.operatorLock.desde}`
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
            {request.operatorLock.nome}
          </Typography>
        </Box>
      ) : null}
      {!request.operatorLock && request.subStatus ? (
        <Box sx={{ mt: 0.75 }}>
          <SubStatusLabel subStatus={request.subStatus} />
        </Box>
      ) : null}
    </Box>
  );
}

// ── Main component ───────────────────────────────────────────────────
interface QueueTableRowProps {
  request: Request;
  categoryFilter: string;
  lastViewedId: string | null;
  onRowClick: (requestId: string) => void;
}

export default function QueueTableRow({
  request,
  categoryFilter,
  lastViewedId,
  onRowClick,
}: QueueTableRowProps) {
  const requestType = REQUEST_TYPE_MAP[request.id] ?? 'primeira';

  return (
    <TableRow
      key={request.id}
      onClick={() => {
        onRowClick(request.id);
      }}
      aria-label={`Pedido ${request.id}`}
      sx={getRowSx(request, lastViewedId)}
    >
      <TableCell align="center" sx={{ px: 1.5 }}>
        <PrioDot prioridade={request.priority} />
      </TableCell>
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
        <OriginChip origin={request.origin} />
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
          <GuideTypeChip type={request.guideType} />
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          {request.provider.hospital}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {request.provider.doctor}
        </Typography>
      </TableCell>
      {categoryFilter === 'Todas' && (
        <TableCell sx={{ px: 1.5 }}>
          <CategoryChip category={request.category} />
        </TableCell>
      )}
      <TableCell sx={{ maxWidth: 160, px: 1.5 }}>
        <ProceduresCell procedures={request.procedures} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {request.queueTime}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <SLAChip status={request.slaStatus} label={request.slaText} />
        {request.status === 'Devolutiva' && (
          <Tooltip
            title="Devolutiva não interrompe o prazo ANS — SLA continua em contagem"
            placement="top"
          >
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                mt: 0.4,
                fontSize: 10,
                color: 'warning.main',
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              <TimerOffIcon sx={{ fontSize: 11 }} /> SLA em curso
            </Typography>
          </Tooltip>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Tooltip
          title="Ponto de vista da análise da IA — a decisão final é do analista"
          placement="top"
        >
          <span>
            <IASuggestionChip suggestion={request.iaSuggestion} />
          </span>
        </Tooltip>
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
