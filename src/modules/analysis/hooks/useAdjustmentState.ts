'use client';

import { useState } from 'react';

import { type Request, type Adjustment } from '@/data/pedidos';

import { type SnackbarState } from '../types';

interface UseAdjustmentStateParams {
  request: Request;
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void;
}

export function useAdjustmentState({ request, showSnackbar }: UseAdjustmentStateParams) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProc, setDrawerProc] = useState<{
    codigo: string;
    descricao: string;
    qty: number;
    prestador: string;
    fabricante?: string;
    valorUnitario?: number;
  } | null>(null);
  const [localAdjustments, setLocalAdjustments] = useState<Adjustment[]>([]);

  const allAdjustments: Adjustment[] = [...(request.adjustments ?? []), ...localAdjustments];

  const handleAdjustClick = (proc: {
    codigo: string;
    descricao: string;
    qty: number;
    prestador: string;
    fabricante?: string;
    valorUnitario?: number;
  }) => {
    setDrawerProc(proc);
    setDrawerOpen(true);
  };

  const handleAdjustConfirm = (adjustment: Omit<Adjustment, 'id'>) => {
    const newAdj: Adjustment = { id: `ADJ-${String(Date.now())}`, ...adjustment };
    setLocalAdjustments((prev) => [...prev, newAdj]);
    setDrawerOpen(false);
    const fieldLabel =
      adjustment.field === 'quantidade'
        ? `Qtd. autorizada alterada de ${adjustment.previousValue} para ${adjustment.newValue}`
        : adjustment.field === 'prestador'
          ? `Prestador alterado para ${adjustment.newValue}`
          : adjustment.field === 'fabricante'
            ? `Fabricante alterado para ${adjustment.newValue}`
            : adjustment.field === 'valorUnitario'
              ? `Valor unitário alterado para ${adjustment.newValue}`
              : `Código alterado para ${adjustment.newValue}`;
    showSnackbar(`✓ Ajuste registrado — ${fieldLabel}`, 'warning');
  };

  return {
    drawerOpen,
    setDrawerOpen,
    drawerProc,
    localAdjustments,
    allAdjustments,
    handleAdjustClick,
    handleAdjustConfirm,
  };
}
