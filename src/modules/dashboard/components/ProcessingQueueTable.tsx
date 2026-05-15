'use client';

import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import DataTablePagination from '@/shared/components/DataTablePagination';

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

// -- Component ----------------------------------------------------------------
export default function ProcessingQueueTable() {
  const { page, rowsPerPage, pagedItems, sorted, counts, total, setPage } = useProcessingQueue();

  if (total === 0) return null;

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
                <TableRow key={p.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ py: '4px', px: '12px', width: 150, minWidth: 150 }}>
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight={600}
                      sx={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}
                    >
                      {p.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: 11, whiteSpace: 'nowrap', display: 'block' }}
                    >
                      {formatEntryTime(p.entradaEm)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: '4px', px: '12px' }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ fontSize: 13, lineHeight: 1.3 }}
                    >
                      {p.beneficiary}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 11, lineHeight: 1.3 }}
                    >
                      {p.plan}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: '4px', px: '12px' }}>
                    <Chip
                      label={originLabelMap[p.origin]}
                      size="small"
                      icon={originIconMap[p.origin] as React.ReactElement}
                      sx={{ height: 22, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: '4px', px: '12px', whiteSpace: 'nowrap', width: 110 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      {formatQueueTime(p.entradaEm)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: '4px', px: '12px' }}>
                    <ProcessingStatusChip status={p.statusProcessamento} />
                  </TableCell>
                </TableRow>
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
    </Card>
  );
}
