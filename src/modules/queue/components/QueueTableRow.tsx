'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
  SubStatusLabel,
} from '@/shared/components';
import { type Pedido } from '@/types/pedido';

import { REQUEST_TYPE_MAP } from '../constants/request-type-map';

interface QueueTableRowProps {
  pedido: Pedido;
  categoriaFilter: string;
  lastViewedId: string | null;
  onRowClick: (pedidoId: string) => void;
}

export default function QueueTableRow({ pedido, categoriaFilter, lastViewedId, onRowClick }: QueueTableRowProps) {
  const requestType = REQUEST_TYPE_MAP[pedido.id] ?? 'primeira';

  return (
    <TableRow
      key={pedido.id}
      onClick={() => onRowClick(pedido.id)}
      aria-label={`Pedido ${pedido.id}`}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.25s ease',
        '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' },
        ...(pedido.id === lastViewedId && {
          backgroundColor: 'rgba(144,43,41,0.06) !important',
          outline: '1px solid rgba(144,43,41,0.2)',
        }),
        ...(pedido.status === 'Devolutiva' && {
          borderLeft: '3px solid #f59e0b',
        }),
        ...(pedido.subStatus === 'PENDENTE_RETORNO_RECEBIDO' && {
          backgroundColor: 'rgba(245,158,11,0.06) !important',
        }),
        ...(pedido.subStatus === 'JUNTA_PARECER_RECEBIDO' && {
          backgroundColor: 'rgba(37,99,235,0.05) !important',
          borderLeft: '3px solid #2563eb',
        }),
        ...(pedido.subStatus === 'JUNTA_AGUARDANDO' && {
          borderLeft: '3px solid rgba(37,99,235,0.5)',
        }),
      }}
    >
      <TableCell align="center" sx={{ px: 1.5 }}>
        <PrioDot prioridade={pedido.prioridade} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main', fontSize: 12 }}>
          {pedido.id}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>
          {`${pedido.dataProtocolo.slice(0, 5)} · ${pedido.dataProtocolo.split(' ')[1]}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <OriginChip origin={pedido.origem} />
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
          {pedido.beneficiario.nome}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {pedido.beneficiario.plano}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <RequestTypeChip type={requestType} />
          <GuideTypeChip type={pedido.tipoGuia} />
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          {pedido.prestador.hospital}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {pedido.prestador.medico}
        </Typography>
      </TableCell>
      {categoriaFilter === 'Todas' && (
        <TableCell sx={{ px: 1.5 }}>
          <CategoryChip category={pedido.categoria} />
        </TableCell>
      )}
      <TableCell sx={{ maxWidth: 160, px: 1.5 }}>
        {pedido.procedimentos.length > 1 ? (
          <>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
              {pedido.procedimentos.length} procedimentos
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Clique para ver detalhes
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12, fontFamily: 'monospace' }}>
              {pedido.procedimentos[0]?.tuss || '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}>
              {pedido.procedimentos[0]?.descricao || '—'}
            </Typography>
          </>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {pedido.tempoFila}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <SLAChip status={pedido.slaStatus} label={pedido.slaTexto} />
        {pedido.status === 'Devolutiva' && (
          <Tooltip title="Devolutiva não interrompe o prazo ANS — SLA continua em contagem" placement="top">
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.4, fontSize: 10, color: '#b45309', fontWeight: 600, cursor: 'default' }}>
              <TimerOffIcon sx={{ fontSize: 11 }} /> SLA em curso
            </Typography>
          </Tooltip>
        )}
      </TableCell>
      <TableCell sx={{ px: 1.5 }}>
        <Tooltip title="Ponto de vista da análise da IA — a decisão final é do analista" placement="top">
          <span><IASuggestionChip suggestion={pedido.iaSugestao} /></span>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ px: 1.5 }} onClick={(e) => e.stopPropagation()}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Tooltip
            title={pedido.lockOperador ? `Em análise por ${pedido.lockOperador.nome} desde ${pedido.lockOperador.desde}` : ''}
            placement="top"
            disableHoverListener={!pedido.lockOperador}
          >
            <span>
              <Button
                size="small"
                variant={pedido.lockOperador ? 'outlined' : 'contained'}
                onClick={() => onRowClick(pedido.id)}
                aria-label={`Analisar pedido ${pedido.id}`}
                sx={{ minHeight: 28, fontSize: 12, px: 1.5, ...(pedido.lockOperador && { color: 'text.secondary', borderColor: 'rgba(0,0,0,0.2)' }) }}
              >
                {pedido.lockOperador ? 'Observar' : 'Analisar'}
              </Button>
            </span>
          </Tooltip>
          {pedido.lockOperador && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.5 }}>
              <LockOutlinedIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ fontSize: 10, color: 'text.disabled' }}>
                {pedido.lockOperador.nome}
              </Typography>
            </Box>
          )}
          {!pedido.lockOperador && pedido.subStatus && (
            <Box sx={{ mt: 0.75 }}>
              <SubStatusLabel subStatus={pedido.subStatus} />
            </Box>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
