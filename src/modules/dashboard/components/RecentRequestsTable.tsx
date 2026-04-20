'use client';

import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { StatusChip, SLAChip } from '@/shared/components';
import { type Request } from '@/types/pedido';

interface RecentRequestsTableProps {
  pedidos: Request[];
  loading: boolean;
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

const tdSx = { py: '8px', px: '12px' };

const CRITICAL_ALERTS = ['NIP Ativa'];

function urgencyScore(p: Request): number {
  const hasCritical = p.alerts.some((a) => CRITICAL_ALERTS.includes(a));
  const hasAnyAlert = p.alerts.length > 0;
  if (p.slaStatus === 'violated' && hasCritical) return 0;
  if (p.slaStatus === 'violated') return 1;
  if (p.slaStatus === 'warning' && hasAnyAlert) return 2;
  if (p.slaStatus === 'warning') return 3;
  return 4;
}

export default function RecentRequestsTable({ pedidos, loading }: RecentRequestsTableProps) {
  const router = useRouter();

  const urgentFirst = [...pedidos]
    .sort((a, b) => {
      const diff = urgencyScore(a) - urgencyScore(b);
      if (diff !== 0) return diff;
      return a.protocolDate.localeCompare(b.protocolDate);
    })
    .slice(0, 7);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
          Requerem atenção agora
        </Typography>
        <Button
          size="small"
          endIcon={<ChevronRightIcon fontSize="small" />}
          onClick={() => {
            router.push('/fila');
          }}
          sx={{ fontSize: 12, color: 'primary.main' }}
          aria-label="Ver todas as solicitações"
        >
          Ver todas
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      ) : (
        <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <Table size="small" aria-label="Pedidos que requerem atenção">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...thSx, width: 150, minWidth: 150 }}>ID</TableCell>
                <TableCell sx={{ ...thSx, width: 130 }}>Status</TableCell>
                <TableCell sx={thSx}>Beneficiário</TableCell>
                <TableCell sx={{ ...thSx, width: 160 }}>SLA</TableCell>
                <TableCell sx={{ ...thSx, width: 110, whiteSpace: 'nowrap' }}>Data</TableCell>
                <TableCell sx={{ ...thSx, width: 32 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {urgentFirst.map((pedido) => (
                <TableRow
                  key={pedido.id}
                  tabIndex={0}
                  onClick={() => {
                    router.push(`/analise?id=${pedido.id}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/analise?id=${pedido.id}`);
                    }
                  }}
                  aria-label={`Abrir pedido ${pedido.id} — ${pedido.beneficiary.name}`}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' },
                    '&:focus-visible': { outline: '2px solid #902B29', outlineOffset: -2 },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ ...tdSx, width: 150, minWidth: 150 }}>
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight={700}
                      sx={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}
                    >
                      {pedido.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tdSx}>
                    <StatusChip status={pedido.status} />
                  </TableCell>
                  <TableCell sx={tdSx}>
                    <Typography variant="caption" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
                      {pedido.beneficiary.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tdSx}>
                    <SLAChip status={pedido.slaStatus} label={pedido.slaText} />
                  </TableCell>
                  <TableCell sx={tdSx}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 12, whiteSpace: 'nowrap' }}
                    >
                      {pedido.protocolDate.split(' ')[0]}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={tdSx}>
                    <ChevronRightIcon
                      sx={{ fontSize: 16, color: 'text.secondary', verticalAlign: 'middle' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </>
  );
}
