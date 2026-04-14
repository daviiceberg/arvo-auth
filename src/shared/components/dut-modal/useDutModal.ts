'use client';

import { useCallback, useState } from 'react';

import { type DutEntry } from '@/types/dut';

import { getDutByNumber } from '@/mocks/dut-database';

export function useDutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dutEntry, setDutEntry] = useState<DutEntry | null>(null);

  const open = useCallback((dutNumber: number) => {
    setDutEntry(getDutByNumber(dutNumber) ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, dutEntry, open, close };
}
