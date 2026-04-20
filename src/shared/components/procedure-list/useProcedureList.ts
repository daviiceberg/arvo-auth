'use client';

import { useCallback, useState } from 'react';

import { type GuiaProcedure } from '@/types/procedure-codes';

export function useProcedureList(
  procedures: GuiaProcedure[],
  onUpdate: (procedures: GuiaProcedure[]) => void,
) {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showInput, setShowInput] = useState(false);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAdd = useCallback(
    (proc: GuiaProcedure) => {
      onUpdate([...procedures, proc]);
      setShowInput(false);
    },
    [procedures, onUpdate],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onUpdate(procedures.filter((p) => p.id !== id));
    },
    [procedures, onUpdate],
  );

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      onUpdate(procedures.map((p) => (p.id === id ? { ...p, quantity } : p)));
    },
    [procedures, onUpdate],
  );

  const handlePeriodChange = useCallback(
    (id: string, field: 'requestDate' | 'passwordExpiryDate', value: string) => {
      onUpdate(procedures.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    },
    [procedures, onUpdate],
  );

  return {
    expandedIds,
    showInput,
    setShowInput,
    toggleExpand,
    handleAdd,
    handleRemove,
    handleQuantityChange,
    handlePeriodChange,
  };
}
