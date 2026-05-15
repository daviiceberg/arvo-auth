'use client';

import { useState } from 'react';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import DataTablePagination from '@/shared/components/DataTablePagination';
import { useUserPermissions } from '@/shared/hooks/useUserPermissions';
import { type ProcessingRequest } from '@/types/pedido';

import useProcessingActions from '../hooks/useProcessingActions';
import useProcessingQueue from '../hooks/useProcessingQueue';

import ProcessingStatusChip from './ProcessingStatusChip';

// -- Helpers ------------------------------------------------------------------
const originLabelMap: Record<string, string> = {
  app: 'App',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  prestador: 'Prestador',
  call_center: 'Call Center',
};

const originIconMap: Record<string, React.ReactNode> = {
  app: <SmartphoneOutlinedIcon sx={{ fontSize: 14 }} />,
  whatsapp: <WhatsAppIcon sx={{ fontSize: 14 }} />,
  email: <EmailOutlinedIcon sx={{ fontSize: 14 }} />,
  prestador: <MedicalServicesOutlinedIcon sx={{ fontSize: 14 }} />,
  call_center: <PhoneOutlinedIcon sx={{ fontSize: 14 }} />,
};

function formatQueueTime(entradaEm: Date): string {
  const diffMin = Math.round((Date.now() - entradaEm.getTime()) / 60000);
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${String(diffMin)} min`;
  const h = Math.floor(diffMin / 60);
  return `${String(h)}h${diffMin % 60 > 0 ? ` ${String(diffMin % 60)}min` : ''}`;
}

function formatEntryTime(d: Date): string {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const thSx = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  color: 'text.secondary',
  py: '6px',
  px: 2,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

// -- Sub-components -----------------------------------------------------------
interface ErrorActionsRowProps {
  pedido: ProcessingRequest;
  isGestor: boolean;
  isRetrying: boolean;
  onRetry: (id: string) => void;
  onRequestDiscard: (id: string) => void;
}

function ErrorActionsRow({
  pedido,
  isGestor,
  isRetrying,
  onRetry,
  onRequestDiscard,
}: ErrorActionsRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={5} sx={{ py: 1, px: 2, backgroundColor: 'rgba(212,24,61,0.03)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />
          <Typography variant="caption" sx={{ fontSize: 12, color: 'error.main', fontWeight: 600 }}>
            {pedido.erroDescricao}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
            Tentativa {pedido.retryCount ?? 0} de 3
          </Typography>
          {isGestor ? (
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                disabled={isRetrying}
                onClick={() => {
                  onRetry(pedido.id);
                }}
                startIcon={isRetrying ? <CircularProgress size={12} /> : null}
                sx={{ fontSize: 11 }}
              >
                Tentar processar novamente
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => {
                  onRequestDiscard(pedido.id);
                }}
                sx={{ fontSize: 11 }}
              >
                Descartar
              </Button>
            </Box>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  );
}

interface DiscardDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DiscardDialog({ open, onCancel, onConfirm }: DiscardDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Descartar pedido?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Descartar este pedido? Esta ação não pode ser desfeita. O prestador precisará reenviar a
          solicitação se necessário.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="outlined" color="error" onClick={onConfirm}>
          Sim, descartar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface MainRowProps {
  pedido: ProcessingRequest;
  hasDetail: boolean;
}

function MainRow({ pedido, hasDetail }: MainRowProps) {
  const isDiscarded = pedido.statusProcessamento === 'descartado';
  const isFailed = pedido.statusProcessamento === 'falhou_definitivamente';
  return (
    <TableRow
      sx={{
        '&:last-child td': { borderBottom: 0 },
        ...(hasDetail ? { '& td': { borderBottom: 'none' } } : {}),
        opacity: isDiscarded ? 0.6 : 1,
      }}
    >
      <TableCell sx={{ py: '4px', px: '12px', width: 150, minWidth: 150 }}>
        <Typography
          variant="caption"
          color="primary"
          fontWeight={600}
          sx={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}
        >
          {pedido.id}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: 11, whiteSpace: 'nowrap', display: 'block' }}
        >
          {formatEntryTime(pedido.entradaEm)}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: '4px', px: '12px' }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13, lineHeight: 1.3 }}>
          {pedido.beneficiary}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.3 }}>
          {pedido.plan}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: '4px', px: '12px' }}>
        <Chip
          label={originLabelMap[pedido.origin]}
          size="small"
          icon={originIconMap[pedido.origin] as React.ReactElement}
          sx={{ height: 22, fontSize: 11 }}
        />
      </TableCell>
      <TableCell sx={{ py: '4px', px: '12px', whiteSpace: 'nowrap', width: 110 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {formatQueueTime(pedido.entradaEm)}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: '4px', px: '12px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
          <ProcessingStatusChip status={pedido.statusProcessamento} />
          {isFailed ? (
            <Typography variant="caption" sx={{ fontSize: 10, color: 'text.disabled' }}>
              Notificação enviada ao gestor
            </Typography>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  );
}

// -- Component ----------------------------------------------------------------
const RETRY_DELAY_MS = 500;

export default function ProcessingQueueTable() {
  const { page, rowsPerPage, pagedItems, sorted, counts, total, setPage } = useProcessingQueue();
  const { retry, discard } = useProcessingActions();
  const permissions = useUserPermissions();
  const isGestor = permissions.profile === 'gestor';

  const [discardConfirmId, setDiscardConfirmId] = useState<string | null>(null);
  const [retryingIds, setRetryingIds] = useState<ReadonlySet<string>>(new Set());

  if (total === 0) return null;

  const handleRetry = (id: string) => {
    setRetryingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      retry(id);
      setRetryingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, RETRY_DELAY_MS);
  };

  const handleDiscardConfirm = () => {
    if (discardConfirmId !== null) discard(discardConfirmId);
    setDiscardConfirmId(null);
  };

  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutorenewOutlinedIcon
              color="primary"
              sx={{
                fontSize: 18,
                '@keyframes spin': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' },
                },
                animation: 'spin 2s linear infinite',
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}
            >
              Entrando no sistema
            </Typography>
          </Box>
          <Tooltip
            title={`${String(counts.processing)} em processamento · ${String(counts.error)} com erro`}
          >
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
              {total} pedidos aguardando processamento da IA
            </Typography>
          </Tooltip>
        </Box>

        <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...thSx, width: 150, minWidth: 150 }}>ID</TableCell>
                <TableCell sx={thSx}>Beneficiário</TableCell>
                <TableCell sx={{ ...thSx, width: 130 }}>Origem</TableCell>
                <TableCell sx={{ ...thSx, width: 110, minWidth: 110, whiteSpace: 'nowrap' }}>
                  Tempo em fila
                </TableCell>
                <TableCell sx={{ ...thSx, width: 180 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedItems.map((p) => (
                <RowGroup
                  key={p.id}
                  pedido={p}
                  isGestor={isGestor}
                  isRetrying={retryingIds.has(p.id)}
                  onRetry={handleRetry}
                  onRequestDiscard={setDiscardConfirmId}
                />
              ))}
            </TableBody>
          </Table>
          {sorted.length > rowsPerPage && (
            <DataTablePagination
              count={sorted.length}
              page={page}
              rowsPerPage={rowsPerPage}
              itemLabel="pedidos"
              onPageChange={setPage}
            />
          )}
        </Box>
      </CardContent>

      <DiscardDialog
        open={discardConfirmId !== null}
        onCancel={() => {
          setDiscardConfirmId(null);
        }}
        onConfirm={handleDiscardConfirm}
      />
    </Card>
  );
}

interface RowGroupProps {
  pedido: ProcessingRequest;
  isGestor: boolean;
  isRetrying: boolean;
  onRetry: (id: string) => void;
  onRequestDiscard: (id: string) => void;
}

function RowGroup({ pedido, isGestor, isRetrying, onRetry, onRequestDiscard }: RowGroupProps) {
  const hasErrorDetail = pedido.statusProcessamento === 'erro_processamento';
  return (
    <>
      <MainRow pedido={pedido} hasDetail={hasErrorDetail} />
      {hasErrorDetail ? (
        <ErrorActionsRow
          pedido={pedido}
          isGestor={isGestor}
          isRetrying={isRetrying}
          onRetry={onRetry}
          onRequestDiscard={onRequestDiscard}
        />
      ) : null}
    </>
  );
}
