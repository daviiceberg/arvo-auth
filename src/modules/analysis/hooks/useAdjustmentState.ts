'use client'

import { useState } from 'react'

import { type Pedido, type Ajuste } from '@/data/pedidos'

import { type SnackbarState } from '../types'

interface UseAdjustmentStateParams {
  request: Pedido
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void
}

export function useAdjustmentState({ request, showSnackbar }: UseAdjustmentStateParams) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerProc, setDrawerProc] = useState<{
    codigo: string
    descricao: string
    qty: number
    prestador: string
    fabricante?: string
    valorUnitario?: number
  } | null>(null)
  const [localAdjustments, setLocalAdjustments] = useState<Ajuste[]>([])

  const allAdjustments: Ajuste[] = [...(request.ajustes ?? []), ...localAdjustments]

  const handleAdjustClick = (proc: {
    codigo: string
    descricao: string
    qty: number
    prestador: string
    fabricante?: string
    valorUnitario?: number
  }) => {
    setDrawerProc(proc)
    setDrawerOpen(true)
  }

  const handleAdjustConfirm = (adjustment: Omit<Ajuste, 'id'>) => {
    const newAdj: Ajuste = { id: `ADJ-${String(Date.now())}`, ...adjustment }
    setLocalAdjustments(prev => [...prev, newAdj])
    setDrawerOpen(false)
    const fieldLabel =
      adjustment.campo === 'quantidade'
        ? `Qtd. autorizada alterada de ${adjustment.valorAnterior} para ${adjustment.valorNovo}`
        : adjustment.campo === 'prestador'
          ? `Prestador alterado para ${adjustment.valorNovo}`
          : adjustment.campo === 'fabricante'
            ? `Fabricante alterado para ${adjustment.valorNovo}`
            : adjustment.campo === 'valorUnitario'
              ? `Valor unitário alterado para ${adjustment.valorNovo}`
              : `Código alterado para ${adjustment.valorNovo}`
    showSnackbar(`✓ Ajuste registrado — ${fieldLabel}`, 'warning')
  }

  return {
    drawerOpen,
    setDrawerOpen,
    drawerProc,
    localAdjustments,
    allAdjustments,
    handleAdjustClick,
    handleAdjustConfirm,
  }
}
