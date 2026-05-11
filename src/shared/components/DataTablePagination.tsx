'use client';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

interface DataTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  itemLabel?: string;
  onPageChange: (newPage: number) => void;
}

export default function DataTablePagination({
  count,
  page,
  rowsPerPage,
  itemLabel = 'registros',
  onPageChange,
}: DataTablePaginationProps) {
  if (count === 0) return null;
  const from = Math.min(page * rowsPerPage + 1, count);
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <Box
      sx={{
        px: 2,
        borderTop: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, py: 1.5 }}>
        Exibindo {from}–{to} de {count} {itemLabel}
      </Typography>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => {
          onPageChange(newPage);
        }}
        rowsPerPageOptions={[rowsPerPage]}
        labelDisplayedRows={() => ''}
        sx={{
          '& .MuiTablePagination-toolbar': { minHeight: 40 },
          '& .MuiTablePagination-spacer': { display: 'none' },
          '& .MuiTablePagination-displayedRows': { display: 'none' },
        }}
      />
    </Box>
  );
}
