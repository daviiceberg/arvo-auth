'use client';

import DataTablePagination from '@/shared/components/DataTablePagination';

interface QueuePaginationProps {
  filteredCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export default function QueuePagination({
  filteredCount,
  page,
  rowsPerPage,
  onPageChange,
}: QueuePaginationProps) {
  return (
    <DataTablePagination
      count={filteredCount}
      page={page}
      rowsPerPage={rowsPerPage}
      itemLabel="solicitações"
      onPageChange={onPageChange}
    />
  );
}
