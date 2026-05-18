'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type Adjustment, type Request } from '@/types/pedido';

import { type ProcDecision, type SnackbarState } from '../types';

import { useDecisionFormFields } from './useDecisionFormFields';
import { useDialogVisibility } from './useDialogVisibility';

interface UseDecisionFlowParams {
  request: Request;
  allAdjustments: Adjustment[];
  showSnackbar: (msg: string, severity: SnackbarState['severity']) => void;
}

export function useDecisionFlow({ request, allAdjustments, showSnackbar }: UseDecisionFlowParams) {
  const router = useRouter();

  const dialogs = useDialogVisibility();
  const fields = useDecisionFormFields();

  // Pending action for divergence flow
  const [pendingAction, setPendingAction] = useState<'autorizar' | 'negar' | null>(null);

  // Per-procedure decision state (multi-procedure flow)
  const [procDecisions, setProcDecisions] = useState<Record<string, ProcDecision>>(() =>
    Object.fromEntries(request.procedures.map((p) => [p.code, 'pendente' as ProcDecision])),
  );

  // Decision handlers
  const handleApproveClick = () => {
    if (allAdjustments.length > 0) {
      dialogs.setShowAdjustApprovalConfirm(true);
      return;
    }
    doApprove();
  };

  const doApprove = () => {
    if (request.iaSuggestion !== 'Aprovar') {
      setPendingAction('autorizar');
      dialogs.setShowDivergenceDialog(true);
    } else {
      fields.setApprovalJustification(`Justificativa: ${request.iaJustification}`);
      dialogs.setShowApprovalDialog(true);
    }
  };

  const handleDenyClick = () => {
    fields.setDenialReasonIdx(-1);
    fields.setDenialJustification('');
    if (request.injunction) {
      fields.setInjunctionAcknowledgment('');
      dialogs.setShowInjunctionAckDialog(true);
      return;
    }
    dialogs.setShowDenialDialog(true);
  };

  const handleInjunctionAckContinue = () => {
    if (fields.injunctionAcknowledgment.trim().length < 30) return;
    dialogs.setShowInjunctionAckDialog(false);
    dialogs.setShowDenialDialog(true);
  };

  const handleDivergenceContinue = () => {
    if (!fields.divergenceReason.trim()) return;
    dialogs.setShowDivergenceDialog(false);
    if (pendingAction === 'autorizar') {
      fields.setApprovalJustification(`Justificativa: ${request.iaJustification}`);
      dialogs.setShowApprovalDialog(true);
    } else {
      fields.setDenialJustification(`Justificativa: ${request.iaJustification}`);
      dialogs.setShowDenialDialog(true);
    }
  };

  const confirmApproval = () => {
    if (!fields.approvalReason) return;
    dialogs.setShowApprovalDialog(false);
    showSnackbar(`Pedido ${request.id} aprovado com sucesso`, 'success');
  };

  const confirmDenial = () => {
    if (fields.denialReasonIdx === -1 || !fields.denialJustification.trim()) return;
    dialogs.setShowDenialDialog(false);
    showSnackbar(`Pedido ${request.id} negado`, 'error');
  };

  const confirmPendency = () => {
    if (fields.pendencyItems.length === 0) return;
    dialogs.setShowPendencyDialog(false);
    router.push('/fila?tab=devolutivas&pendenciado=' + request.id);
  };

  const confirmMedicalBoard = () => {
    if (!fields.medicalBoardReason) return;
    dialogs.setShowMedicalBoardDialog(false);
    showSnackbar('Encaminhado para Junta Médica', 'info');
  };

  const handleProcDecisionChange = (codigo: string, decision: ProcDecision) => {
    setProcDecisions((prev) => ({ ...prev, [codigo]: decision }));
  };

  const handleConfirmDecisionClick = () => {
    const initJust: Record<string, string> = {};
    request.procedures.forEach((pr) => {
      if ((procDecisions[pr.code] ?? 'pendente') === 'negado') {
        initJust[pr.code] = initJust[pr.code] ?? '';
      }
    });
    fields.setPartialDenialJustMap(initJust);
    fields.setPartialDenialReasonMap({});
    dialogs.setShowPartialDialog(true);
  };

  const confirmPartialDecision = () => {
    const denied = request.procedures.filter(
      (pr) => (procDecisions[pr.code] ?? 'pendente') === 'negado',
    );
    const allValid = denied.every((pr) => {
      const reasonIdx = fields.partialDenialReasonMap[pr.code];
      return (
        reasonIdx !== undefined &&
        reasonIdx >= 0 &&
        (fields.partialDenialJustMap[pr.code] ?? '').trim()
      );
    });
    if (!allValid) return;
    dialogs.setShowPartialDialog(false);
    const nApproved = request.procedures.filter(
      (pr) => procDecisions[pr.code] === 'aprovado',
    ).length;
    const nDenied = denied.length;
    if (nDenied === 0) {
      showSnackbar(`Pedido ${request.id} aprovado com sucesso`, 'success');
    } else if (nApproved === 0) {
      showSnackbar(`Pedido ${request.id} negado`, 'error');
    } else {
      showSnackbar(
        `Pedido ${request.id} — Aprovação Parcial registrada (${String(nApproved)} aprovado(s), ${String(nDenied)} negado(s))`,
        'warning',
      );
    }
  };

  // Return a flat object with the same API as the old useDecisionState
  return {
    // Dialog visibility
    showApprovalDialog: dialogs.showApprovalDialog,
    setShowApprovalDialog: dialogs.setShowApprovalDialog,
    showDenialDialog: dialogs.showDenialDialog,
    setShowDenialDialog: dialogs.setShowDenialDialog,
    showPendencyDialog: dialogs.showPendencyDialog,
    setShowPendencyDialog: dialogs.setShowPendencyDialog,
    showMedicalBoardDialog: dialogs.showMedicalBoardDialog,
    setShowMedicalBoardDialog: dialogs.setShowMedicalBoardDialog,
    showDivergenceDialog: dialogs.showDivergenceDialog,
    setShowDivergenceDialog: dialogs.setShowDivergenceDialog,
    showPartialDialog: dialogs.showPartialDialog,
    setShowPartialDialog: dialogs.setShowPartialDialog,
    showAdjustApprovalConfirm: dialogs.showAdjustApprovalConfirm,
    setShowAdjustApprovalConfirm: dialogs.setShowAdjustApprovalConfirm,
    showInjunctionAckDialog: dialogs.showInjunctionAckDialog,
    setShowInjunctionAckDialog: dialogs.setShowInjunctionAckDialog,

    // Pending action
    pendingAction,

    // Per-procedure decisions
    procDecisions,
    partialDenialReasonMap: fields.partialDenialReasonMap,
    setPartialDenialReasonMap: fields.setPartialDenialReasonMap,
    partialDenialJustMap: fields.partialDenialJustMap,
    setPartialDenialJustMap: fields.setPartialDenialJustMap,

    // Form fields
    approvalReason: fields.approvalReason,
    setApprovalReason: fields.setApprovalReason,
    approvalJustification: fields.approvalJustification,
    setApprovalJustification: fields.setApprovalJustification,
    denialReasonIdx: fields.denialReasonIdx,
    setDenialReasonIdx: fields.setDenialReasonIdx,
    denialJustification: fields.denialJustification,
    setDenialJustification: fields.setDenialJustification,
    pendencyItems: fields.pendencyItems,
    setPendencyItems: fields.setPendencyItems,
    pendencyJustification: fields.pendencyJustification,
    setPendencyJustification: fields.setPendencyJustification,
    medicalBoardReason: fields.medicalBoardReason,
    setMedicalBoardReason: fields.setMedicalBoardReason,
    medicalBoardObs: fields.medicalBoardObs,
    setMedicalBoardObs: fields.setMedicalBoardObs,
    divergenceReason: fields.divergenceReason,
    setDivergenceReason: fields.setDivergenceReason,
    injunctionAcknowledgment: fields.injunctionAcknowledgment,
    setInjunctionAcknowledgment: fields.setInjunctionAcknowledgment,

    // Handlers
    handleApproveClick,
    doApprove,
    handleDenyClick,
    handleInjunctionAckContinue,
    confirmApproval,
    confirmDenial,
    confirmPendency,
    confirmMedicalBoard,
    handleDivergenceContinue,
    handleProcDecisionChange,
    handleConfirmDecisionClick,
    confirmPartialDecision,

    // Computed
    isAnyDialogOpen: dialogs.isAnyDialogOpen,
  };
}
