'use client';

import { Suspense, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

import { DENIAL_REASONS } from '../constants/denial-reasons';
import { useAdjustmentState } from '../hooks/useAdjustmentState';
import { useAnalysis } from '../hooks/useAnalysis';
import { useDecisionFlow } from '../hooks/useDecisionFlow';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

import AdjustmentDrawer from './AdjustmentDrawer';
import AlertsBanner from './AlertsBanner';
import AnalysisSkeleton from './AnalysisSkeleton';
import AssistantSidebar from './AssistantSidebar';
import AuditLogSection from './AuditLogSection';
import BeneficiarySection from './BeneficiarySection';
import ConsolidatedHistorySection from './ConsolidatedHistorySection';
import AdjustmentApprovalDialog from './dialogs/AdjustmentApprovalDialog';
import ApprovalDialog from './dialogs/ApprovalDialog';
import DenialDialog from './dialogs/DenialDialog';
import DivergenceDialog from './dialogs/DivergenceDialog';
import PartialApprovalDialog from './dialogs/PartialApprovalDialog';
import ShortcutsHelpDialog from './dialogs/ShortcutsHelpDialog';
import DocumentsSection from './DocumentsSection';
import InternalNotesSection from './InternalNotesSection';
import ObservationsSection from './ObservationsSection';
import PageHeader from './PageHeader';
import ProceduresSection from './ProceduresSection';
import RegisteredAdjustmentsSection from './RegisteredAdjustmentsSection';

function AnalysisInner() {
  const [internalNotes, setInternalNotes] = useState('' as string);
  const {
    request,
    currentIndex,
    total,
    handleNavPrev,
    handleNavNext,
    handleBack,
    snackbar,
    showSnackbar,
    closeSnackbar,
  } = useAnalysis();

  const adjustment = useAdjustmentState({ request, showSnackbar });

  const decision = useDecisionFlow({
    request,
    allAdjustments: adjustment.allAdjustments,
    showSnackbar,
  });

  useKeyboardNavigation({
    isAnyDialogOpen: decision.isAnyDialogOpen,
    isDrawerOpen: adjustment.drawerOpen,
    canNavigatePrev: currentIndex > 0,
    canNavigateNext: currentIndex < total - 1,
    onNavigatePrev: handleNavPrev,
    onNavigateNext: handleNavNext,
    onApprove: decision.handleApproveClick,
    onDeny: decision.handleDenyClick,
    onShowShortcuts: () => {
      decision.setShowShortcutsHelp(true);
    },
  });

  return (
    <Box
      sx={{
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <PageHeader
        request={request}
        onBack={handleBack}
        currentIndex={currentIndex}
        total={total}
        onPrev={handleNavPrev}
        onNext={handleNavNext}
      />
      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2, overflow: 'hidden' }}>
        {/* Left content -- scrolls independently */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {request.procedureAlreadyPerformed ? (
              <Alert
                severity="error"
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: 2,
                  border: '1px solid rgba(212,24,61,0.3)',
                }}
              >
                Procedimento já realizado antes da autorização — atenção redobrada na análise
              </Alert>
            ) : null}
            <AlertsBanner request={request} />
            <BeneficiarySection request={request} />
            <ProceduresSection
              request={request}
              allAdjustments={adjustment.allAdjustments}
              onAdjustClick={adjustment.handleAdjustClick}
            />
            <RegisteredAdjustmentsSection adjustments={adjustment.allAdjustments} />
            <ObservationsSection request={request} />
            <InternalNotesSection value={internalNotes} onChange={setInternalNotes} />
            <AuditLogSection entries={request.auditLog ?? []} />
            <ConsolidatedHistorySection request={request} />
            <DocumentsSection request={request} />
          </Box>
        </Box>

        {/* Right sidebar -- always fully visible, own scroll if needed */}
        <Box sx={{ width: 400, flexShrink: 0, overflowY: 'auto', pb: 2 }}>
          <AssistantSidebar
            request={request}
            onAprovarClick={decision.handleApproveClick}
            onNegarClick={decision.handleDenyClick}
            procDecisoes={decision.procDecisions}
            onProcDecisaoChange={decision.handleProcDecisionChange}
            onConfirmarDecisaoClick={decision.handleConfirmDecisionClick}
          />
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ minWidth: 300 }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>

      {/* Ajuste Drawer */}
      <AdjustmentDrawer
        key={adjustment.drawerProc?.codigo ?? 'none'}
        open={adjustment.drawerOpen}
        requestId={request.id}
        requestStatus={request.status}
        proc={adjustment.drawerProc}
        existingAdjustments={adjustment.allAdjustments}
        onClose={() => {
          adjustment.setDrawerOpen(false);
        }}
        onConfirm={adjustment.handleAdjustConfirm}
      />

      {/* Adjustment Approval Confirm Dialog */}
      <AdjustmentApprovalDialog
        open={decision.showAdjustApprovalConfirm}
        allAdjustments={adjustment.allAdjustments}
        onReview={() => {
          decision.setShowAdjustApprovalConfirm(false);
        }}
        onConfirm={() => {
          decision.setShowAdjustApprovalConfirm(false);
          decision.doApprove();
        }}
      />

      {/* Approval Dialog */}
      <ApprovalDialog
        open={decision.showApprovalDialog}
        requestId={request.id}
        approvalReason={decision.approvalReason}
        onApprovalReasonChange={decision.setApprovalReason}
        approvalJustification={decision.approvalJustification}
        onApprovalJustificationChange={decision.setApprovalJustification}
        onConfirm={decision.confirmApproval}
        onClose={() => {
          decision.setShowApprovalDialog(false);
        }}
      />

      {/* Denial Dialog */}
      <DenialDialog
        open={decision.showDenialDialog}
        requestId={request.id}
        beneficiaryName={request.beneficiary.name}
        iaSuggestion={request.iaSuggestion}
        denialReasonIdx={decision.denialReasonIdx}
        onDenialReasonChange={(idx) => {
          decision.setDenialReasonIdx(idx);
          decision.setDenialJustification(DENIAL_REASONS[idx]?.texto ?? '');
        }}
        denialJustification={decision.denialJustification}
        onDenialJustificationChange={decision.setDenialJustification}
        onConfirm={decision.confirmDenial}
        onClose={() => {
          decision.setShowDenialDialog(false);
        }}
      />

      {/* Divergence Dialog */}
      <DivergenceDialog
        open={decision.showDivergenceDialog}
        iaSuggestion={request.iaSuggestion}
        divergenceReason={decision.divergenceReason}
        onDivergenceReasonChange={decision.setDivergenceReason}
        onContinue={decision.handleDivergenceContinue}
        onClose={() => {
          decision.setShowDivergenceDialog(false);
        }}
      />

      {/* Partial Approval Dialog */}
      <PartialApprovalDialog
        open={decision.showPartialDialog}
        request={request}
        procDecisions={decision.procDecisions}
        partialDenialReasonMap={decision.partialDenialReasonMap}
        onPartialDenialReasonMapChange={decision.setPartialDenialReasonMap}
        partialDenialJustMap={decision.partialDenialJustMap}
        onPartialDenialJustMapChange={decision.setPartialDenialJustMap}
        onConfirm={decision.confirmPartialDecision}
        onClose={() => {
          decision.setShowPartialDialog(false);
        }}
      />

      {/* Shortcuts Help Dialog */}
      <ShortcutsHelpDialog
        open={decision.showShortcutsHelp}
        onClose={() => {
          decision.setShowShortcutsHelp(false);
        }}
      />
    </Box>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <AnalysisInner />
    </Suspense>
  );
}
