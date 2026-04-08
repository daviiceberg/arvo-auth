'use client';

import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { type Pedido } from '@/types/pedido';

import QueueTableRow from './QueueTableRow';

interface QueueTableProps {
  items: Pedido[];
  categoriaFilter: string;
  loading: boolean;
  lastViewedId: string | null;
  hasFilters: boolean;
  onRowClick: (pedidoId: string) => void;
  onClearFilters: () => void;
}

export default function QueueTable({
  items,
  categoriaFilter,
  loading,
  lastViewedId,
  hasFilters,
  onRowClick,
  onClearFilters,
}: QueueTableProps) {
  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
      <Table aria-label="Tabela da fila operacional" size="small">
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, color: 'text.secondary', px: 1.5 } }}>
            <TableCell align="center" sx={{ width: 44 }}>Prio.</TableCell>
            <TableCell sx={{ minWidth: 130 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 110 }}>Origem</TableCell>
            <TableCell sx={{ minWidth: 195 }}>Beneficiário</TableCell>
            <TableCell sx={{ minWidth: 175 }}>Prestador</TableCell>
            {categoriaFilter === 'Todas' && <TableCell sx={{ minWidth: 155 }}>Categoria</TableCell>}
            <TableCell sx={{ minWidth: 220, maxWidth: 220 }}>Procedimento(s)</TableCell>
            <TableCell sx={{ minWidth: 85, whiteSpace: 'nowrap' }}>Em Fila</TableCell>
            <TableCell sx={{ minWidth: 120 }}>SLA</TableCell>
            <TableCell sx={{ minWidth: 110 }}>Sugestão IA</TableCell>
            <TableCell sx={{ minWidth: 115 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} sx={{ py: 6, border: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SearchIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Nenhum pedido encontrado
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {hasFilters ? 'Tente ajustar ou limpar os filtros aplicados.' : 'A fila está vazia no momento.'}
                  </Typography>
                  {hasFilters && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      sx={{ mt: 0.5, fontSize: 12, borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary' }}
                      onClick={onClearFilters}
                    >
                      Limpar filtros
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            items.map((pedido) => (
              <QueueTableRow
                key={pedido.id}
                pedido={pedido}
                categoriaFilter={categoriaFilter}
                lastViewedId={lastViewedId}
                onRowClick={onRowClick}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
