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
import { type Pedido } from '@/types/pedido';


interface RecentRequestsTableProps {
  pedidos: Pedido[];
  loading: boolean;
}

const CRITICAL_ALERTS = ['Liminar Judicial', 'NIP Ativa'];

function urgencyScore(p: Pedido): number {
  const hasCritical = p.alertas.some((a) => CRITICAL_ALERTS.includes(a));
  const hasAnyAlert = p.alertas.length > 0;
  if (p.slaStatus === 'violated' && hasCritical) return 0;
  if (p.slaStatus === 'violated') return 1;
  if (p.slaStatus === 'warning' && hasAnyAlert) return 2;
  if (p.slaStatus === 'warning') return 3;
  if (p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' || p.subStatus === 'JUNTA_PARECER_RECEBIDO') return 4;
  return 5;
}

export default function RecentRequestsTable({ pedidos, loading }: RecentRequestsTableProps) {
  const router = useRouter();

  const urgentFirst = [...pedidos]
    .sort((a, b) => {
      const diff = urgencyScore(a) - urgencyScore(b);
      if (diff !== 0) return diff;
      return a.dataProtocolo.localeCompare(b.dataProtocolo);
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
          onClick={() => { router.push('/fila'); }}
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
        <Table size="small" aria-label="Pedidos que requerem atenção">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0.5, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Beneficiário</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>SLA</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary' }}>Data</TableCell>
              <TableCell sx={{ width: 32 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {urgentFirst.map((pedido) => (
              <TableRow
                key={pedido.id}
                tabIndex={0}
                onClick={() => { router.push(`/analise?id=${pedido.id}`); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/analise?id=${pedido.id}`); } }}
                aria-label={`Abrir pedido ${pedido.id} — ${pedido.beneficiario.nome}`}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' }, '&:focus-visible': { outline: '2px solid #902B29', outlineOffset: -2 } }}
              >
                <TableCell sx={{ pl: 0.5 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: 'primary.main', fontSize: 12 }}>
                    {pedido.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={pedido.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" fontWeight={600} noWrap sx={{ fontSize: 12 }}>
                    {pedido.beneficiario.nome}
                  </Typography>
                </TableCell>
                <TableCell>
                  <SLAChip status={pedido.slaStatus} label={pedido.slaTexto} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {pedido.dataProtocolo.split(' ')[0]}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary', verticalAlign: 'middle' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
