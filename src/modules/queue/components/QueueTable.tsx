'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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

import { type Request } from '@/types/pedido';

import { useQueueTableSort } from '../hooks/useQueueTableSort';

import QueueTableRow from './QueueTableRow';

export interface QueueTableSubGroup {
  label: string;
  items: Request[];
}

interface SortableHeaderProps {
  label: string;
  isSorted: boolean;
  isAsc: boolean;
  onClick: () => void;
  minWidth?: number;
}

function SortableHeader({ label, isSorted, isAsc, onClick, minWidth = 130 }: SortableHeaderProps) {
  const nextDirection = !isSorted || isAsc ? 'desc' : 'asc';
  const showDownArrow = nextDirection === 'desc';
  const iconColor = isSorted ? 'primary.main' : 'text.disabled';

  return (
    <TableCell
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        minWidth,
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
      }}
    >
      <span>{label}</span>
      {showDownArrow ? (
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: iconColor }} />
      ) : (
        <KeyboardArrowUpIcon sx={{ fontSize: 16, color: iconColor }} />
      )}
    </TableCell>
  );
}

interface QueueTableProps {
  items: Request[];
  loading: boolean;
  lastViewedId: string | null;
  hasFilters: boolean;
  activeCategory: string;
  onRowClick: (requestId: string) => void;
  onClearFilters: () => void;
  subGroups?: QueueTableSubGroup[];
}

export default function QueueTable({
  items,
  loading,
  lastViewedId,
  hasFilters,
  activeCategory,
  onRowClick,
  onClearFilters,
  subGroups,
}: QueueTableProps) {
  const { sort, toggleSort, sortItems } = useQueueTableSort();
  const categoryActive = activeCategory !== 'Todas';
  const emptyTitle = categoryActive
    ? `Nenhuma guia de ${activeCategory} na fila`
    : 'Nenhum pedido encontrado';
  const visibleGroups = subGroups?.filter((g) => g.items.length > 0) ?? null;
  const hasGroups = visibleGroups !== null && visibleGroups.length > 0;
  const sortedItems = sortItems(items);
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
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, overflowX: 'auto' }}>
      <Table aria-label="Tabela da fila operacional" size="small" sx={{ minWidth: 1100 }}>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-head': {
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                color: 'text.secondary',
                px: 1,
              },
            }}
          >
            <TableCell sx={{ minWidth: 115 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 170 }}>Beneficiário</TableCell>
            <TableCell sx={{ minWidth: 105 }}>Categoria</TableCell>
            <TableCell sx={{ minWidth: 155 }}>Prestador</TableCell>
            <TableCell sx={{ minWidth: 200, maxWidth: 200 }}>Procedimento(s)</TableCell>
            <TableCell sx={{ minWidth: 75, whiteSpace: 'nowrap' }}>Em Fila</TableCell>
            <SortableHeader
              label="SLA"
              isSorted={sort.column === 'sla'}
              isAsc={sort.direction === 'asc'}
              onClick={() => {
                toggleSort('sla');
              }}
              minWidth={105}
            />
            <TableCell sx={{ minWidth: 125 }}>Etapa</TableCell>
            <TableCell sx={{ minWidth: 100 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} sx={{ py: 6, border: 0 }}>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {emptyTitle}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {hasFilters
                      ? 'Tente ajustar ou limpar os filtros aplicados.'
                      : 'A fila está vazia no momento.'}
                  </Typography>
                  {hasFilters ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        borderColor: 'rgba(0,0,0,0.2)',
                        color: 'text.secondary',
                      }}
                      onClick={onClearFilters}
                    >
                      Limpar
                    </Button>
                  ) : null}
                </Box>
              </TableCell>
            </TableRow>
          ) : hasGroups ? (
            visibleGroups.map((group) => (
              <SubGroupRows
                key={group.label}
                group={group}
                lastViewedId={lastViewedId}
                onRowClick={onRowClick}
                sortItems={sortItems}
              />
            ))
          ) : (
            sortedItems.map((item) => (
              <QueueTableRow
                key={item.id}
                request={item}
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

interface SubGroupRowsProps {
  group: QueueTableSubGroup;
  lastViewedId: string | null;
  onRowClick: (requestId: string) => void;
  sortItems: (items: Request[]) => Request[];
}

function SubGroupRows({ group, lastViewedId, onRowClick, sortItems }: SubGroupRowsProps) {
  const sortedGroupItems = sortItems(group.items);
  return (
    <>
      <TableRow>
        <TableCell
          colSpan={9}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.04)',
            py: 1,
            px: 1,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          {group.label} ({group.items.length})
        </TableCell>
      </TableRow>
      {sortedGroupItems.map((item) => (
        <QueueTableRow
          key={item.id}
          request={item}
          lastViewedId={lastViewedId}
          onRowClick={onRowClick}
        />
      ))}
    </>
  );
}
