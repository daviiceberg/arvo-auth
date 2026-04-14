'use client';

import { useCallback, useMemo, useState } from 'react';

import { createEmptyOpmeItem, type OpmeItemData } from '../types/opme';

export function useStepOpme() {
  const [opmeItems, setOpmeItems] = useState([createEmptyOpmeItem()]);

  const handleAddItem = useCallback(() => {
    setOpmeItems((prev) => [...prev, createEmptyOpmeItem()]);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setOpmeItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  const handleUpdateItem = useCallback((index: number, updated: OpmeItemData) => {
    setOpmeItems((prev) => prev.map((item, i) => (i === index ? updated : item)));
  }, []);

  const handleConsultAnvisa = useCallback((item: OpmeItemData) => {
    const reg = item.anvisaRegistration.trim();
    const url = reg
      ? `https://consultas.anvisa.gov.br/#/saude/q/?numeroRegistro=${encodeURIComponent(reg)}`
      : 'https://consultas.anvisa.gov.br/#/saude/';
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const summary = useMemo(() => {
    const totalValue = opmeItems.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const val = Number(item.unitValue) || 0;
      return sum + qty * val;
    }, 0);

    const validAnvisa = opmeItems.filter((i) => i.anvisaStatus === 'valid').length;
    const completeQuotations = opmeItems.filter((i) =>
      i.quotations.every((q) => q.supplier.trim() && q.value.trim()),
    ).length;

    return {
      totalValue,
      validAnvisa,
      totalItems: opmeItems.length,
      completeQuotations,
    };
  }, [opmeItems]);

  return {
    opmeItems,
    setOpmeItems,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleConsultAnvisa,
    summary,
  };
}

export type UseStepOpmeReturn = ReturnType<typeof useStepOpme>;
