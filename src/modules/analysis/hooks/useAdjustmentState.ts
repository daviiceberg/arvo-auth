'use client'

import { useState } from 'react'

import { type Pedido, type Ajuste } from '@/data/pedidos'

import { type SnackbarState } from '../types'

interface UseAdjustmentStateParams {
  pedido: Pedido
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void
}

export function useAdjustmentState({ pedido, showSnackbar }: UseAdjustmentStateParams) {
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

  const allAdjustments: Ajuste[] = [...(pedido.ajustes ?? []), ...localAdjustments]

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

  const handleAdjustConfirm = (ajuste: Omit<Ajuste, 'id'>) => {
    const newAjuste: Ajuste = { id: `ADJ-${Date.now()}`, ...ajuste }
    setLocalAdjustments(prev => [...prev, newAjuste])
    setDrawerOpen(false)
    const campoLabel =
      ajuste.campo === 'quantidade'
        ? `Qtd. autorizada alterada de ${ajuste.valorAnterior} para ${ajuste.valorNovo}`
        : ajuste.campo === 'prestador'
          ? `Prestador alterado para ${ajuste.valorNovo}`
          : ajuste.campo === 'fabricante'
            ? `Fabricante alterado para ${ajuste.valorNovo}`
            : ajuste.campo === 'valorUnitario'
              ? `Valor unitário alterado para ${ajuste.valorNovo}`
              : `Código alterado para ${ajuste.valorNovo}`
    showSnackbar(`✓ Ajuste registrado — ${campoLabel}`, 'warning')
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
