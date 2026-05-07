'use client';

import { useState, useCallback } from 'react';

export function useDecisionFormFields() {
  // Approval form fields
  const [approvalReason, setApprovalReason] = useState('');
  const [approvalJustification, setApprovalJustification] = useState('');

  // Denial form fields
  const [denialReasonIdx, setDenialReasonIdx] = useState(-1);
  const [denialJustification, setDenialJustification] = useState('');

  // Pendency form fields
  const [pendencyItems, setPendencyItems] = useState<string[]>([]);
  const [pendencyJustification, setPendencyJustification] = useState('');

  // Medical board form fields
  const [medicalBoardReason, setMedicalBoardReason] = useState('');
  const [medicalBoardObs, setMedicalBoardObs] = useState('');

  // Divergence form field
  const [divergenceReason, setDivergenceReason] = useState('');

  // Partial denial form fields
  const [partialDenialReasonMap, setPartialDenialReasonMap] = useState<Record<string, number>>({});
  const [partialDenialJustMap, setPartialDenialJustMap] = useState<Record<string, string>>({});

  // Injunction acknowledgment form field
  const [injunctionAcknowledgment, setInjunctionAcknowledgment] = useState('');

  const resetApprovalFields = useCallback(() => {
    setApprovalReason('');
    setApprovalJustification('');
  }, []);

  const resetDenialFields = useCallback(() => {
    setDenialReasonIdx(-1);
    setDenialJustification('');
  }, []);

  const resetPendencyFields = useCallback(() => {
    setPendencyItems([]);
    setPendencyJustification('');
  }, []);

  const resetMedicalBoardFields = useCallback(() => {
    setMedicalBoardReason('');
    setMedicalBoardObs('');
  }, []);

  const resetDivergenceFields = useCallback(() => {
    setDivergenceReason('');
  }, []);

  const resetPartialDenialFields = useCallback(() => {
    setPartialDenialReasonMap({});
    setPartialDenialJustMap({});
  }, []);

  return {
    // Approval
    approvalReason,
    setApprovalReason,
    approvalJustification,
    setApprovalJustification,

    // Denial
    denialReasonIdx,
    setDenialReasonIdx,
    denialJustification,
    setDenialJustification,

    // Pendency
    pendencyItems,
    setPendencyItems,
    pendencyJustification,
    setPendencyJustification,

    // Medical board
    medicalBoardReason,
    setMedicalBoardReason,
    medicalBoardObs,
    setMedicalBoardObs,

    // Divergence
    divergenceReason,
    setDivergenceReason,

    // Partial denial
    partialDenialReasonMap,
    setPartialDenialReasonMap,
    partialDenialJustMap,
    setPartialDenialJustMap,

    // Injunction acknowledgment
    injunctionAcknowledgment,
    setInjunctionAcknowledgment,

    // Reset helpers
    resetApprovalFields,
    resetDenialFields,
    resetPendencyFields,
    resetMedicalBoardFields,
    resetDivergenceFields,
    resetPartialDenialFields,
  };
}
