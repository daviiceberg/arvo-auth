'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import DataTablePagination from '@/shared/components/DataTablePagination';
import { type HistoryEntry } from '@/types/pedido';

import { type SortDirection } from '../types';

import HistoryListTableRow from './HistoryListTableRow';

interface HistoryListTableProps {
  pagedEntries: HistoryEntry[];
  filteredCount: number;
  page: number;
  rowsPerPage: number;
  sortDirection: SortDirection;
  activeCategory: string;
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
  activeCategory,
  onToggleSort,
  onPageChange,
  onNavigate,
}: HistoryListTableProps) {
  const categoryActive = activeCategory !== 'Todas';
  const emptyText = categoryActive
    ? `Nenhuma decisão de ${activeCategory} no histórico`
    : 'Nenhuma decisão encontrada para os filtros selecionados.';
  return (
    <>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 1100 }}>
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
              <TableCell sx={{ minWidth: 145 }}>Categoria</TableCell>
              <TableCell sx={{ minWidth: 280, maxWidth: 280 }}>Procedimento</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Decisão</TableCell>
              <TableCell sx={{ minWidth: 185 }}>Origem / Responsável</TableCell>
              <TableCell
                sx={{ minWidth: 135, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                onClick={onToggleSort}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Data Decisão
                  {sortDirection === 'asc' ? (
                    <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  ) : (
                    <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: 125 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              pagedEntries.map((entry) => (
                <HistoryListTableRow key={entry.id} entry={entry} onNavigate={onNavigate} />
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      <DataTablePagination
        count={filteredCount}
        page={page}
        rowsPerPage={rowsPerPage}
        itemLabel="decisões"
        onPageChange={onPageChange}
      />
    </>
  );
}
