'use client';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { type HistoryEntry } from '@/types/pedido';

import { type SortDirection } from '../types';

import HistoryListTableRow from './HistoryListTableRow';

interface HistoryListTableProps {
  pagedEntries: HistoryEntry[];
  filteredCount: number;
  page: number;
  rowsPerPage: number;
  sortDirection: SortDirection;
  onToggleSort: () => void;
  onPageChange: (page: number) => void;
  onNavigate: (id: string) => void;
}

export default function HistoryListTable({
  pagedEntries,
  filteredCount,
  page,
  rowsPerPage,
  sortDirection,
  onToggleSort,
  onPageChange,
  onNavigate,
}: HistoryListTableProps) {
  return (
    <Card>
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-head': {
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                color: 'text.secondary',
                px: 1.5,
              },
            }}
          >
            <TableCell sx={{ minWidth: 130 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Beneficiário</TableCell>
            <TableCell sx={{ minWidth: 175 }}>Categoria</TableCell>
            <TableCell sx={{ minWidth: 280, maxWidth: 280 }}>Procedimento</TableCell>
            <TableCell sx={{ minWidth: 120 }}>Decisão</TableCell>
            <TableCell sx={{ minWidth: 185 }}>Origem / Responsável</TableCell>
            <TableCell sx={{ minWidth: 130 }}>Sugestão IA</TableCell>
            <TableCell
              sx={{ minWidth: 135, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
              onClick={onToggleSort}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Data Decisão
                {sortDirection === 'desc' ? (
                  <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                ) : (
                  <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                )}
              </Box>
            </TableCell>
            <TableCell sx={{ minWidth: 125 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {pagedEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                Nenhuma decisão encontrada para os filtros selecionados.
              </TableCell>
            </TableRow>
          ) : (
            pagedEntries.map((entry) => (
              <HistoryListTableRow key={entry.id} entry={entry} onNavigate={onNavigate} />
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_e, p) => {
          onPageChange(p);
        }}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) =>
          `${String(from)}–${String(to)} de ${String(count)}`
        }
      />
    </Card>
  );
}
