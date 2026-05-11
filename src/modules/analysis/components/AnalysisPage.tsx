'use client';

import { Suspense, useRef, useState } from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import { alertOutlines } from '@/shared/constants';
import { toggleHelpDrawer } from '@/shared/hooks/useHelpDrawer';
import { useUserPermissions } from '@/shared/hooks/useUserPermissions';

import { DENIAL_REASONS } from '../constants/denial-reasons';
import { useAdjustmentState } from '../hooks/useAdjustmentState';
import { useAnalysis } from '../hooks/useAnalysis';
import { useDecisionFlow } from '../hooks/useDecisionFlow';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useM1RequestState } from '../hooks/useM1RequestState';

import AdjustmentDrawer from './AdjustmentDrawer';
import AlertsBanner from './AlertsBanner';
import AnalysisSecondarySections from './AnalysisSecondarySections';
import AnalysisSkeleton from './AnalysisSkeleton';
import AssistantSidebar from './AssistantSidebar';
import BeneficiarySection from './BeneficiarySection';
import AdjustmentApprovalDialog from './dialogs/AdjustmentApprovalDialog';
import ApprovalDialog from './dialogs/ApprovalDialog';
import DenialDialog from './dialogs/DenialDialog';
import DivergenceDialog from './dialogs/DivergenceDialog';
import InjunctionAcknowledgmentDialog from './dialogs/InjunctionAcknowledgmentDialog';
import JuntaMedicaDialog from './dialogs/JuntaMedicaDialog';
import PartialApprovalDialog from './dialogs/PartialApprovalDialog';
import PendencyDialog from './dialogs/PendencyDialog';
import HospitalContextSection from './HospitalContextSection';
import M1Banners from './M1Banners';
import OncologyDataSection from './OncologyDataSection';
import PageHeader from './PageHeader';
import ProceduresSection from './ProceduresSection';
import RegisteredAdjustmentsSection from './RegisteredAdjustmentsSection';
import RegulatoryBanners from './RegulatoryBanners';
import ReprocessPromptModal from './ReprocessPromptModal';

const REPROCESS_DURATION_MS = 6000;

const FINALIZED_STATUSES = ['Aprovado', 'Negado', 'Aprovado Parcial'];

function buildPendencyShortcut(args: {
  status: string;
  isLocked: boolean;
  canPendency: boolean;
  open: () => void;
}): (() => void) | undefined {
  if (FINALIZED_STATUSES.includes(args.status)) return undefined;
  if (args.isLocked) return undefined;
  if (!args.canPendency) return undefined;
  return args.open;
}

function AnalysisInner() {
  const [internalNotes, setInternalNotes] = useState('' as string);
  const {
    request: rawRequest,
    currentIndex,
    total,
    handleNavPrev,
    handleNavNext,
    handleBack,
    snackbar,
    showSnackbar,
    closeSnackbar,
  } = useAnalysis();

  const m1 = useM1RequestState(rawRequest);
  const request = m1.effectiveRequest;
  const permissions = useUserPermissions();
  const [showPendencyDialog, setShowPendencyDialog] = useState(false);
  const [showJuntaMedicaDialog, setShowJuntaMedicaDialog] = useState(false);
  const isLocked = Boolean(request.operatorLock);

  const [pendingReprocess, setPendingReprocess] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);
  const [showReprocessModal, setShowReprocessModal] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [lastRequestId, setLastRequestId] = useState(request.id);
  const openAddFromModalRef = useRef<(() => void) | null>(null);

  // Reset reprocess state when navigating between requests (React "reset state on prop change" pattern).
  if (lastRequestId !== request.id) {
    setLastRequestId(request.id);
    setPendingReprocess(false);
    setPendingChanges([]);
    setShowReprocessModal(false);
    setIsReprocessing(false);
  }

  const markStructuralChange = (description: string) => {
    setPendingChanges((prev) => [...prev, description]);
    setPendingReprocess(true);
    setShowReprocessModal(true);
  };

  const requestReprocess = () => {
    setIsReprocessing(true);
    setShowReprocessModal(false);
    showSnackbar(
      'Reanálise solicitada. Os agentes de IA estão verificando o pedido — você será notificado via sino quando a análise for concluída.',
      'info',
    );
    setTimeout(() => {
      setPendingReprocess(false);
      setPendingChanges([]);
      setIsReprocessing(false);
      showSnackbar('Verificação concluída — checklist da IA atualizado.', 'success');
    }, REPROCESS_DURATION_MS);
  };

  const adjustment = useAdjustmentState({ request, showSnackbar });

  const decision = useDecisionFlow({
    request,
    allAdjustments: adjustment.allAdjustments,
    showSnackbar,
  });

  const handlePendencyShortcut = buildPendencyShortcut({
    status: request.status,
    isLocked,
    canPendency: permissions.canPendency,
    open: () => {
      setShowPendencyDialog(true);
    },
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
    onPendency: handlePendencyShortcut,
    onShowShortcuts: toggleHelpDrawer,
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
            <RegulatoryBanners request={request} />
            <M1Banners
              request={request}
              m1={m1}
              permissions={permissions}
              showSnackbar={showSnackbar}
            />
            {pendingReprocess && !showReprocessModal && !isReprocessing ? (
              <Alert
                severity="warning"
                sx={{ borderRadius: 2, border: alertOutlines.warning }}
                action={
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                    onClick={requestReprocess}
                  >
                    Solicitar verificação da IA
                  </Button>
                }
              >
                <AlertTitle sx={{ fontSize: 13, fontWeight: 700 }}>
                  Mudanças aplicadas — pendente de reanálise pela IA
                </AlertTitle>
                <Typography variant="caption" sx={{ fontSize: 12, display: 'block' }}>
                  {pendingChanges.length === 1
                    ? pendingChanges[0]
                    : `${String(pendingChanges.length)} alterações desde a última análise da IA`}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11, display: 'block', mt: 0.5 }}
                >
                  A reanálise leva alguns minutos — faça todos os ajustes necessários antes de
                  solicitar.{' '}
                  <Box
                    component="button"
                    onClick={() => {
                      setShowReprocessModal(true);
                    }}
                    sx={{
                      background: 'none',
                      border: 'none',
                      p: 0,
                      fontSize: 11,
                      color: 'primary.main',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}
                  >
                    Ver detalhes
                  </Box>
                </Typography>
              </Alert>
            ) : null}
            {request.procedureAlreadyPerformed ? (
              <Alert
                severity="error"
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: 2,
                  border: alertOutlines.error,
                }}
              >
                Procedimento já realizado antes da autorização — atenção redobrada na análise
              </Alert>
            ) : null}
            {request.cidDivergence ? (
              <Alert severity="warning" sx={{ borderRadius: 2, border: alertOutlines.warning }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                  Divergência de CID detectada
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12, display: 'block', mt: 0.25 }}
                >
                  {request.cidDivergenceDetail ??
                    'O CID informado pelo prestador difere do CID extraído do laudo. Verifique qual está correto.'}
                </Typography>
              </Alert>
            ) : null}
            <AlertsBanner request={request} />
            <BeneficiarySection request={request} />
            <ProceduresSection
              key={`procedures-${request.id}`}
              request={request}
              allAdjustments={adjustment.allAdjustments}
              onAdjustClick={adjustment.handleAdjustClick}
            />
            <HospitalContextSection request={request} />
            {request.category === 'Oncologia' ? <OncologyDataSection request={request} /> : null}
            <RegisteredAdjustmentsSection adjustments={adjustment.allAdjustments} />
            <AnalysisSecondarySections
              request={request}
              internalNotes={internalNotes}
              onInternalNotesChange={setInternalNotes}
              pendingReprocess={pendingReprocess}
              isReprocessing={isReprocessing}
              onRequestReprocess={requestReprocess}
              onStructuralChange={markStructuralChange}
              attachHandlerRef={openAddFromModalRef}
            />
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
            onPendenciarClick={() => {
              setShowPendencyDialog(true);
            }}
            onJuntaMedicaClick={() => {
              setShowJuntaMedicaDialog(true);
            }}
            permissions={permissions}
            isLocked={isLocked}
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

      {/* Injunction Acknowledgment Dialog */}
      {request.injunction ? (
        <InjunctionAcknowledgmentDialog
          open={decision.showInjunctionAckDialog}
          injunction={request.injunction}
          acknowledgment={decision.injunctionAcknowledgment}
          onAcknowledgmentChange={decision.setInjunctionAcknowledgment}
          onContinue={decision.handleInjunctionAckContinue}
          onClose={() => {
            decision.setShowInjunctionAckDialog(false);
          }}
        />
      ) : null}

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

      {/* Pendency Dialog (M1) */}
      <PendencyDialog
        open={showPendencyDialog}
        requestId={request.id}
        onClose={() => {
          setShowPendencyDialog(false);
        }}
        onConfirm={(payload) => {
          m1.applyPendency({ ...payload, actor: permissions.profile });
          setShowPendencyDialog(false);
          showSnackbar(
            `Pedido ${request.id} pendenciado. Notificação enviada ao prestador.`,
            'warning',
          );
        }}
      />

      {/* Junta Médica Dialog (M1) */}
      <JuntaMedicaDialog
        open={showJuntaMedicaDialog}
        requestId={request.id}
        onClose={() => {
          setShowJuntaMedicaDialog(false);
        }}
        onConfirm={(payload) => {
          m1.applyJuntaMedica({ ...payload, actor: permissions.profile });
          setShowJuntaMedicaDialog(false);
          showSnackbar(`Pedido ${request.id} encaminhado para Junta Médica.`, 'info');
        }}
      />

      {/* Reprocess prompt modal */}
      <ReprocessPromptModal
        open={showReprocessModal}
        changes={pendingChanges}
        onClose={() => {
          setShowReprocessModal(false);
        }}
        onAttachAnother={() => {
          setShowReprocessModal(false);
          setTimeout(() => {
            openAddFromModalRef.current?.();
          }, 120);
        }}
        onRequestReprocess={requestReprocess}
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
