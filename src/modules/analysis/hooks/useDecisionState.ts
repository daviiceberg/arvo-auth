'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { type Request, type Adjustment } from '@/data/pedidos'

import { type ProcDecision, type SnackbarState } from '../types'

interface UseDecisionStateParams {
  request: Request
  allAdjustments: Adjustment[]
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void
}

export function useDecisionState({ request, allAdjustments, showSnackbar }: UseDecisionStateParams) {
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
    Object.fromEntries(request.procedures.map(p => [p.code, 'pendente' as ProcDecision]))
  )

  // Partial approval dialog state
  const [partialDenialReasonMap, setPartialDenialReasonMap] = useState<Record<string, number>>({})
  const [partialDenialJustMap, setPartialDenialJustMap] = useState<Record<string, string>>({})

  // Form field states
  const [approvalReason, setApprovalReason] = useState('')
  const [approvalJustification, setApprovalJustification] = useState('')
  const [denialReasonIdx, setDenialReasonIdx] = useState(-1)
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
    if (request.iaSuggestion !== 'Aprovar') {
      setPendingAction('autorizar')
      setShowDivergenceDialog(true)
    } else {
      setApprovalJustification(`Justificativa: ${request.iaJustification}`)
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
      setApprovalJustification(`Justificativa: ${request.iaJustification}`)
      setShowApprovalDialog(true)
    } else {
      setDenialJustification(`Justificativa: ${request.iaJustification}`)
      setShowDenialDialog(true)
    }
  }

  const confirmApproval = () => {
    if (!approvalReason) return
    setShowApprovalDialog(false)
    showSnackbar(`Pedido ${request.id} aprovado com sucesso`, 'success')
  }

  const confirmDenial = () => {
    if (denialReasonIdx === -1 || !denialJustification.trim()) return
    setShowDenialDialog(false)
    showSnackbar(`Pedido ${request.id} negado`, 'error')
  }

  const confirmPendency = () => {
    if (pendencyItems.length === 0) return
    setShowPendencyDialog(false)
    router.push('/fila?tab=devolutivas&pendenciado=' + request.id)
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
    request.procedures.forEach(pr => {
      if ((procDecisions[pr.code] ?? 'pendente') === 'negado') {
        initJust[pr.code] = initJust[pr.code] ?? ''
      }
    })
    setPartialDenialJustMap(initJust)
    setPartialDenialReasonMap({})
    setShowPartialDialog(true)
  }

  const confirmPartialDecision = () => {
    const denied = request.procedures.filter(pr => (procDecisions[pr.code] ?? 'pendente') === 'negado')
    const allValid = denied.every(pr => partialDenialReasonMap[pr.code] !== undefined && (partialDenialJustMap[pr.code] ?? '').trim())
    if (!allValid) return
    setShowPartialDialog(false)
    const nApproved = request.procedures.filter(pr => procDecisions[pr.code] === 'aprovado').length
    const nDenied = denied.length
    if (nDenied === 0) {
      showSnackbar(`Pedido ${request.id} aprovado com sucesso`, 'success')
    } else if (nApproved === 0) {
      showSnackbar(`Pedido ${request.id} negado`, 'error')
    } else {
      showSnackbar(`Pedido ${request.id} — Aprovação Parcial registrada (${String(nApproved)} aprovado(s), ${String(nDenied)} negado(s))`, 'warning')
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
