'use client';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

interface QueuePaginationProps {
  filteredCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export default function QueuePagination({ filteredCount, page, rowsPerPage, onPageChange }: QueuePaginationProps) {
  return (
    <Box
      sx={{
        px: 2,
        borderTop: '1px solid rgba(0,0,0,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, py: 1.5 }}>
        Exibindo {Math.min(page * rowsPerPage + 1, filteredCount)}–{Math.min((page + 1) * rowsPerPage, filteredCount)} de {filteredCount} solicitações
      </Typography>
      <TablePagination
        component="div"
        count={filteredCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => { onPageChange(newPage); }}
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
