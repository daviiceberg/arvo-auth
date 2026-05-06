'use client';

import { useState } from 'react';

import { type Request } from '@/types/pedido';

type SortColumn = 'id' | 'sla' | null;
type SortDirection = 'asc' | 'desc';

interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

export function useQueueTableSort() {
  const [sort, setSort] = useState<SortState>({ column: null, direction: 'asc' });

  const toggleSort = (column: SortColumn) => {
    if (sort.column === column) {
      setSort({ column, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ column, direction: 'asc' });
    }
  };

  const sortItems = (items: Request[]): Request[] => {
    if (!sort.column) return items;

    return [...items].sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;

      if (sort.column === 'id') {
        // Sort by protocolDate
        compareA = a.protocolDate;
        compareB = b.protocolDate;
      } else if (sort.column === 'sla') {
        // Sort by slaStatus (treat as string for alphabetical ordering)
        compareA = a.slaStatus;
        compareB = b.slaStatus;
      } else {
        return 0;
      }

      if (compareA < compareB) return sort.direction === 'asc' ? -1 : 1;
      if (compareA > compareB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return { sort, toggleSort, sortItems };
}
