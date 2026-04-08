'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { pedidos } from '@/data/pedidos'

import { type SnackbarState } from '../types'

export function useAnalysis() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const pedido = pedidos.find((p) => p.id === id) ?? pedidos[0]
  const currentIndex = pedidos.findIndex((p) => p.id === pedido.id)
  const total = pedidos.length

  const handleNavPrev = () => {
    if (currentIndex > 0) router.push(`/analise?id=${pedidos[currentIndex - 1].id}`)
  }

  const handleNavNext = () => {
    if (currentIndex < total - 1) router.push(`/analise?id=${pedidos[currentIndex + 1].id}`)
  }

  const handleBack = () => router.push('/fila')

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    msg: '',
    severity: 'success',
  })

  const showSnackbar = (msg: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, msg, severity })
  }

  const closeSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }))
  }

  return {
    router,
    pedido,
    currentIndex,
    total,
    handleNavPrev,
    handleNavNext,
    handleBack,
    snackbar,
    showSnackbar,
    closeSnackbar,
  }
}
