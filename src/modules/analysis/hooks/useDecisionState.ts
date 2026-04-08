'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { type Pedido, type Ajuste } from '@/data/pedidos'

import { type ProcDecision, type SnackbarState } from '../types'

interface UseDecisionStateParams {
  pedido: Pedido
  allAdjustments: Ajuste[]
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void
}

export function useDecisionState({ pedido, allAdjustments, showSnackbar }: UseDecisionStateParams) {
  const router = useRouter()

  // Dialog visibility states
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showDenialDialog, setShowDenialDialog] = useState(false)
  const [showPendencyDialog, setShowPendencyDialog] = useState(false)
  const [showMedicalBoardDialog, setShowMedicalBoardDialog] = useState(false)
  const [showDivergenceDialog, setShowDivergenceDialog] = useState(false)
  const [showPartialDialog, setShowPartialDialog] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showAdjustApprovalConfirm, setShowAdjustApprovalConfirm] = useState(false)

  // Pending action for divergence flow
  const [pendingAction, setPendingAction] = useState<'autorizar' | 'negar' | null>(null)

  // Per-procedure decision state (multi-procedure flow)
  const [procDecisions, setProcDecisions] = useState<Record<string, ProcDecision>>(() =>
    Object.fromEntries(pedido.procedimentos.map(p => [p.codigo, 'pendente' as ProcDecision]))
  )

  // Partial approval dialog state
  const [partialDenialReasonMap, setPartialDenialReasonMap] = useState<Record<string, number>>({})
  const [partialDenialJustMap, setPartialDenialJustMap] = useState<Record<string, string>>({})

  // Form field states
  const [approvalReason, setApprovalReason] = useState('')
  const [approvalJustification, setApprovalJustification] = useState('')
  const [denialReasonIdx, setDenialReasonIdx] = useState<number>(-1)
  const [denialJustification, setDenialJustification] = useState('')
  const [pendencyItems, setPendencyItems] = useState<string[]>([])
  const [pendencyJustification, setPendencyJustification] = useState('')
  const [medicalBoardReason, setMedicalBoardReason] = useState('')
  const [medicalBoardObs, setMedicalBoardObs] = useState('')
  const [divergenceReason, setDivergenceReason] = useState('')

  // Decision handlers
  const handleApproveClick = () => {
    if (allAdjustments.length > 0) {
      setShowAdjustApprovalConfirm(true)
      return
    }
    doApprove()
  }

  const doApprove = () => {
    if (pedido.iaSugestao !== 'Aprovar') {
      setPendingAction('autorizar')
      setShowDivergenceDialog(true)
    } else {
      setApprovalJustification(`Justificativa: ${pedido.iaJustificativa}`)
      setShowApprovalDialog(true)
    }
  }

  const handleDenyClick = () => {
    setDenialReasonIdx(-1)
    setDenialJustification('')
    setShowDenialDialog(true)
  }

  const handleDivergenceContinue = () => {
    if (!divergenceReason.trim()) return
    setShowDivergenceDialog(false)
    if (pendingAction === 'autorizar') {
      setApprovalJustification(`Justificativa: ${pedido.iaJustificativa}`)
      setShowApprovalDialog(true)
    } else {
      setDenialJustification(`Justificativa: ${pedido.iaJustificativa}`)
      setShowDenialDialog(true)
    }
  }

  const confirmApproval = () => {
    if (!approvalReason) return
    setShowApprovalDialog(false)
    showSnackbar(`Pedido ${pedido.id} aprovado com sucesso`, 'success')
  }

  const confirmDenial = () => {
    if (denialReasonIdx === -1 || !denialJustification.trim()) return
    setShowDenialDialog(false)
    showSnackbar(`Pedido ${pedido.id} negado`, 'error')
  }

  const confirmPendency = () => {
    if (pendencyItems.length === 0) return
    setShowPendencyDialog(false)
    router.push('/fila?tab=devolutivas&pendenciado=' + pedido.id)
  }

  const confirmMedicalBoard = () => {
    if (!medicalBoardReason) return
    setShowMedicalBoardDialog(false)
    showSnackbar('Encaminhado para Junta Médica', 'info')
  }

  const handleProcDecisionChange = (codigo: string, decision: ProcDecision) => {
    setProcDecisions(prev => ({ ...prev, [codigo]: decision }))
  }

  const handleConfirmDecisionClick = () => {
    const initJust: Record<string, string> = {}
    pedido.procedimentos.forEach(pr => {
      if ((procDecisions[pr.codigo] ?? 'pendente') === 'negado') {
        initJust[pr.codigo] = initJust[pr.codigo] ?? ''
      }
    })
    setPartialDenialJustMap(initJust)
    setPartialDenialReasonMap({})
    setShowPartialDialog(true)
  }

  const confirmPartialDecision = () => {
    const negados = pedido.procedimentos.filter(pr => (procDecisions[pr.codigo] ?? 'pendente') === 'negado')
    const allValid = negados.every(pr => partialDenialReasonMap[pr.codigo] !== undefined && partialDenialJustMap[pr.codigo]?.trim())
    if (!allValid) return
    setShowPartialDialog(false)
    const nAprovado = pedido.procedimentos.filter(pr => procDecisions[pr.codigo] === 'aprovado').length
    const nNegado = negados.length
    if (nNegado === 0) {
      showSnackbar(`Pedido ${pedido.id} aprovado com sucesso`, 'success')
    } else if (nAprovado === 0) {
      showSnackbar(`Pedido ${pedido.id} negado`, 'error')
    } else {
      showSnackbar(`Pedido ${pedido.id} — Aprovação Parcial registrada (${nAprovado} aprovado(s), ${nNegado} negado(s))`, 'warning')
    }
  }

  // Computed: whether any dialog is open (for keyboard shortcut gating)
  const isAnyDialogOpen =
    showApprovalDialog ||
    showDenialDialog ||
    showPendencyDialog ||
    showMedicalBoardDialog ||
    showDivergenceDialog ||
    showPartialDialog ||
    showShortcutsHelp ||
    showAdjustApprovalConfirm

  return {
    // Dialog visibility
    showApprovalDialog,
    setShowApprovalDialog,
    showDenialDialog,
    setShowDenialDialog,
    showPendencyDialog,
    setShowPendencyDialog,
    showMedicalBoardDialog,
    setShowMedicalBoardDialog,
    showDivergenceDialog,
    setShowDivergenceDialog,
    showPartialDialog,
    setShowPartialDialog,
    showShortcutsHelp,
    setShowShortcutsHelp,
    showAdjustApprovalConfirm,
    setShowAdjustApprovalConfirm,

    // Pending action
    pendingAction,

    // Per-procedure decisions
    procDecisions,
    partialDenialReasonMap,
    setPartialDenialReasonMap,
    partialDenialJustMap,
    setPartialDenialJustMap,

    // Form fields
    approvalReason,
    setApprovalReason,
    approvalJustification,
    setApprovalJustification,
    denialReasonIdx,
    setDenialReasonIdx,
    denialJustification,
    setDenialJustification,
    pendencyItems,
    setPendencyItems,
    pendencyJustification,
    setPendencyJustification,
    medicalBoardReason,
    setMedicalBoardReason,
    medicalBoardObs,
    setMedicalBoardObs,
    divergenceReason,
    setDivergenceReason,

    // Handlers
    handleApproveClick,
    doApprove,
    handleDenyClick,
    confirmApproval,
    confirmDenial,
    confirmPendency,
    confirmMedicalBoard,
    handleDivergenceContinue,
    handleProcDecisionChange,
    handleConfirmDecisionClick,
    confirmPartialDecision,

    // Computed
    isAnyDialogOpen,
  }
}
