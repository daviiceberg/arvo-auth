'use client';

import { useState, useCallback } from 'react';

export function useDialogVisibility() {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showDenialDialog, setShowDenialDialog] = useState(false);
  const [showPendencyDialog, setShowPendencyDialog] = useState(false);
  const [showMedicalBoardDialog, setShowMedicalBoardDialog] = useState(false);
  const [showDivergenceDialog, setShowDivergenceDialog] = useState(false);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showAdjustApprovalConfirm, setShowAdjustApprovalConfirm] = useState(false);

  const isAnyDialogOpen =
    showApprovalDialog ||
    showDenialDialog ||
    showPendencyDialog ||
    showMedicalBoardDialog ||
    showDivergenceDialog ||
    showPartialDialog ||
    showAdjustApprovalConfirm;

  const closeAllDialogs = useCallback(() => {
    setShowApprovalDialog(false);
    setShowDenialDialog(false);
    setShowPendencyDialog(false);
    setShowMedicalBoardDialog(false);
    setShowDivergenceDialog(false);
    setShowPartialDialog(false);
    setShowAdjustApprovalConfirm(false);
  }, []);

  return {
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
    showAdjustApprovalConfirm,
    setShowAdjustApprovalConfirm,
    isAnyDialogOpen,
    closeAllDialogs,
  };
}
