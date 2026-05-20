'use client';

import React, { Suspense, useCallback, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import theme from '@/core/theme';

import { type Category } from '@/types/pedido';

import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { useNewRequestForm } from '../hooks/useNewRequestForm';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { useUploadStep } from '../hooks/useUploadStep';
import { type SnackbarState } from '../types';

import { StepBeneficiary } from './StepBeneficiary';
import { StepClinical } from './StepClinical';
import { StepDocuments } from './StepDocuments';
import { StepDynamic } from './StepDynamic';
import { StepReview } from './StepReview';
import { StepUpload } from './StepUpload';
import { SuccessDialog } from './SuccessDialog';
import { TissDocPreview } from './TissDocPreview';

// ── Step custom icon ──────────────────────────────────────────────────
function StepIcon({
  active,
  completed,
  index,
}: {
  active: boolean;
  completed: boolean;
  index: number;
}) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed ? 'success.main' : active ? 'primary.main' : '#e5e7eb',
        color: completed || active ? '#fff' : '#6b7280',
        fontSize: 12,
        fontWeight: 700,
        transition: 'all 200ms ease',
        flexShrink: 0,
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
    </Box>
  );
}

// ── Inner component (uses useSearchParams) ────────────────────────────
function NewRequestInner() {
  const searchParams = useSearchParams();
  const categoryParam = (searchParams.get('category') ?? '') as Category | '';

  const {
    form,
    set,
    setSelect,
    setCategory,
    handleSetParentRequest,
    handleClearParentRequest,
    terapiaProcedimentos,
    handleAddTerapiaProc,
    handleRemoveTerapiaProc,
    handleUpdateTerapiaProc,
    handleAddSadtProcedimento,
    handleRemoveSadtProcedimento,
    handleUpdateSadtProcedimento,
    handleAddExamsProcedimento,
    handleRemoveExamsProcedimento,
    handleUpdateExamsProcedimento,
    handleAddHomeCareProcedimento,
    handleRemoveHomeCareProcedimento,
    handleUpdateHomeCareProcedimento,
    handleAddUrgencyProcedimento,
    handleRemoveUrgencyProcedimento,
    handleUpdateUrgencyProcedimento,
    handleAddOncologyProcedimento,
    handleRemoveOncologyProcedimento,
    handleUpdateOncologyProcedimento,
    handleAddHospitalizationProcedimento,
    handleRemoveHospitalizationProcedimento,
    handleUpdateHospitalizationProcedimento,
    handleAddHospitalizationTaxa,
    handleRemoveHospitalizationTaxa,
    handleUpdateHospitalizationTaxa,
    handleSetSurgeryTipo,
    handleAddSurgeryAcessorio,
    handleRemoveSurgeryAcessorio,
    handleUpdateSurgeryAcessorio,
    handleSetSurgeryMainProcedure,
    handleSetSurgeryHasOpme,
    handleSetSurgeryHasOncologyLink,
    handleAddPreOpItem,
    handleRemovePreOpItem,
    handleUpdatePreOpItem,
    handleAddOpmeMaterial,
    handleRemoveOpmeMaterial,
    handleUpdateOpmeMaterial,
    handleAddOpmeQuotation,
    handleRemoveOpmeQuotation,
    handleUpdateOpmeQuotation,
    handleSelectOpmeQuotation,
    handleSetOpmeChosenReason,
    handleConsultAnvisa,
    cidSecundarioInput,
    setCidSecundarioInput,
    addCidSecundario,
    removeCidSecundario,
    resetForm,
    isManualEntry,
    setIsManualEntry,
  } = useNewRequestForm(categoryParam);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    msg: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((msg: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, msg, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleStepValidationError = useCallback(
    (msg: string) => {
      showSnackbar(msg, 'error');
    },
    [showSnackbar],
  );

  const {
    currentStep,
    setCurrentStep,
    steps,
    submitting,
    modalAberto,
    setModalAberto,
    numeroProtocolo,
    setNumeroProtocolo,
    setSubmitting,
    handleNext,
    handleBack,
    handleCancel,
    goToDashboard,
    activeCategory,
    lastStep,
    allStepErrors,
    isCurrentStepValid,
  } = useStepNavigation({
    form,
    terapiaProcedimentos,
    onValidationError: handleStepValidationError,
  });

  const handleJumpToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
    },
    [setCurrentStep],
  );

  const {
    uploadState,
    uploadProgress,
    dragOver,
    setDragOver,
    zoom,
    rotation,
    fileInputRef,
    handleFileSelected,
    resetUpload,
    zoomIn,
    zoomOut,
    rotate,
  } = useUploadStep();

  const docUpload = useDocumentUpload({
    activeCategory,
    etapaAutorizacao: form.etapaAutorizacao,
  });

  const handleFileFromStepUpload = useCallback(
    (file: File) => {
      handleFileSelected(file, {
        onFailed: (message) => {
          showSnackbar(`Falha ao enviar o documento: ${message}`, 'error');
        },
      });
    },
    [handleFileSelected, showSnackbar],
  );

  const handleSkipUpload = () => {
    // `setCategory` (acionado em StepUpload) já preenche o form com os mocks
    // específicos da categoria — preserva-se como ponto de partida quando o
    // usuário opta por preencher manualmente.
    setIsManualEntry(true);
    setCurrentStep(1);
  };

  const handleNovaSolicitacao = () => {
    setModalAberto(false);
    setNumeroProtocolo('');
    setSubmitting(false);
    setCurrentStep(0);
    resetUpload();
    resetForm(categoryParam);
    docUpload.resetDocs();
  };

  const stepContent: Record<number, React.ReactNode> = {
    0: (
      <StepUpload
        uploadState={uploadState}
        uploadProgress={uploadProgress}
        dragOver={dragOver}
        setDragOver={setDragOver}
        fileInputRef={fileInputRef}
        onFileSelected={handleFileFromStepUpload}
        onSkip={handleSkipUpload}
        category={form.category}
        setCategory={setCategory}
      />
    ),
    1: (
      <StepBeneficiary
        form={form}
        set={set}
        isManualEntry={isManualEntry}
        onSetParentRequest={handleSetParentRequest}
        onClearParentRequest={handleClearParentRequest}
        onParentLinked={(parentId) => {
          showSnackbar(`Vinculado a ${parentId}. Campos pré-preenchidos.`, 'success');
        }}
      />
    ),
    2: (
      <StepClinical
        form={form}
        set={set}
        setSelect={setSelect}
        cidSecundarioInput={cidSecundarioInput}
        setCidSecundarioInput={setCidSecundarioInput}
        addCidSecundario={addCidSecundario}
        removeCidSecundario={removeCidSecundario}
        isManualEntry={isManualEntry}
        category={form.category}
      />
    ),
    3: (
      <StepDynamic
        form={form}
        set={set}
        setSelect={setSelect}
        terapiaProcedimentos={terapiaProcedimentos}
        handleAddTerapiaProc={handleAddTerapiaProc}
        handleRemoveTerapiaProc={handleRemoveTerapiaProc}
        handleUpdateTerapiaProc={handleUpdateTerapiaProc}
        handleAddSadtProcedimento={handleAddSadtProcedimento}
        handleRemoveSadtProcedimento={handleRemoveSadtProcedimento}
        handleUpdateSadtProcedimento={handleUpdateSadtProcedimento}
        handleAddExamsProcedimento={handleAddExamsProcedimento}
        handleRemoveExamsProcedimento={handleRemoveExamsProcedimento}
        handleUpdateExamsProcedimento={handleUpdateExamsProcedimento}
        handleAddHomeCareProcedimento={handleAddHomeCareProcedimento}
        handleRemoveHomeCareProcedimento={handleRemoveHomeCareProcedimento}
        handleUpdateHomeCareProcedimento={handleUpdateHomeCareProcedimento}
        handleAddUrgencyProcedimento={handleAddUrgencyProcedimento}
        handleRemoveUrgencyProcedimento={handleRemoveUrgencyProcedimento}
        handleUpdateUrgencyProcedimento={handleUpdateUrgencyProcedimento}
        handleAddOncologyProcedimento={handleAddOncologyProcedimento}
        handleRemoveOncologyProcedimento={handleRemoveOncologyProcedimento}
        handleUpdateOncologyProcedimento={handleUpdateOncologyProcedimento}
        handleAddHospitalizationProcedimento={handleAddHospitalizationProcedimento}
        handleRemoveHospitalizationProcedimento={handleRemoveHospitalizationProcedimento}
        handleUpdateHospitalizationProcedimento={handleUpdateHospitalizationProcedimento}
        handleAddHospitalizationTaxa={handleAddHospitalizationTaxa}
        handleRemoveHospitalizationTaxa={handleRemoveHospitalizationTaxa}
        handleUpdateHospitalizationTaxa={handleUpdateHospitalizationTaxa}
        handleSetSurgeryTipo={handleSetSurgeryTipo}
        handleSetSurgeryMainProcedure={handleSetSurgeryMainProcedure}
        handleAddSurgeryAcessorio={handleAddSurgeryAcessorio}
        handleRemoveSurgeryAcessorio={handleRemoveSurgeryAcessorio}
        handleUpdateSurgeryAcessorio={handleUpdateSurgeryAcessorio}
        handleSetSurgeryHasOpme={handleSetSurgeryHasOpme}
        handleSetSurgeryHasOncologyLink={handleSetSurgeryHasOncologyLink}
        handleAddPreOpItem={handleAddPreOpItem}
        handleRemovePreOpItem={handleRemovePreOpItem}
        handleUpdatePreOpItem={handleUpdatePreOpItem}
        handleAddOpmeMaterial={handleAddOpmeMaterial}
        handleRemoveOpmeMaterial={handleRemoveOpmeMaterial}
        handleUpdateOpmeMaterial={handleUpdateOpmeMaterial}
        handleAddOpmeQuotation={handleAddOpmeQuotation}
        handleRemoveOpmeQuotation={handleRemoveOpmeQuotation}
        handleUpdateOpmeQuotation={handleUpdateOpmeQuotation}
        handleSelectOpmeQuotation={handleSelectOpmeQuotation}
        handleSetOpmeChosenReason={handleSetOpmeChosenReason}
        handleConsultAnvisa={handleConsultAnvisa}
      />
    ),
    4: (
      <StepDocuments
        category={form.category}
        etapaAutorizacao={form.etapaAutorizacao}
        docsAdicionais={docUpload.docsAdicionais}
        docDragOver={docUpload.docDragOver}
        setDocDragOver={docUpload.setDocDragOver}
        docFileRef={docUpload.docFileRef}
        addDocAdicionalFile={docUpload.addDocAdicionalFile}
        handleRemoveDocAdicional={docUpload.handleRemoveDocAdicional}
      />
    ),
    5: (
      <StepReview
        form={form}
        terapiaProcedimentos={terapiaProcedimentos}
        docsObrigatorios={docUpload.docsObrigatorios}
        docsAdicionais={docUpload.docsAdicionais}
        errors={allStepErrors}
        onJumpToStep={handleJumpToStep}
      />
    ),
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#faf6f2',
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {/* ── Top bar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink: 0,
          minHeight: 60,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Image
            src="/logo-arvo.svg"
            alt="Arvo"
            width={80}
            height={26}
            style={{ height: 26 }}
            unoptimized
            priority
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>
            Nova Solicitação: Pré-Autorização
          </Typography>
          {form.category ? (
            <Chip
              label={form.category}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                backgroundColor: 'rgba(144,43,41,0.08)',
                color: 'primary.main',
              }}
            />
          ) : null}
          {form.parentRequestId ? (
            <Chip
              label={`Complementar a ${form.parentRequestId}`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                backgroundColor: 'rgba(13,148,136,0.08)',
                color: '#0d9488',
              }}
            />
          ) : null}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SaveOutlinedIcon />}
            sx={{ minHeight: 36 }}
            onClick={() => {
              alert('Rascunho salvo!');
            }}
          >
            Salvar Rascunho
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            sx={{ minHeight: 36 }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Box>
      </Box>

      {/* ── Stepper ── */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          px: 4,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          connector={null}
          sx={{
            maxWidth: 700,
            mx: 'auto',
            '& .MuiStepLabel-label': {
              fontSize: 11,
              mt: 0.5,
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 500,
            },
            '& .MuiStepLabel-label.Mui-active': { fontWeight: 700, color: 'primary.main' },
            '& .MuiStepLabel-label.Mui-completed': { color: 'success.main' },
          }}
        >
          {steps.map((step, i) => (
            <Step key={step.label} completed={i < currentStep}>
              <StepLabel
                slots={{
                  stepIcon: () => (
                    <StepIcon active={i === currentStep} completed={i < currentStep} index={i} />
                  ),
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: document viewer — hidden em Upload (0) */}
        {currentStep > 0 && (
          <Box
            sx={{
              width: '45%',
              flexShrink: 0,
              backgroundColor: '#f3f4f6',
              borderRight: '1px solid rgba(0,0,0,0.07)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Viewer toolbar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderBottom: '1px solid rgba(0,0,0,0.07)',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={zoomOut} disabled={zoom <= 50}>
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, minWidth: 36, textAlign: 'center' }}
                >
                  {zoom}%
                </Typography>
                <IconButton size="small" onClick={zoomIn} disabled={zoom >= 200}>
                  <ZoomInIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={rotate}>
                  <RotateRightIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Document */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <TissDocPreview zoom={zoom} rotation={rotation} />
            </Box>
          </Box>
        )}

        {/* Right: form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Form content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: currentStep === 0 ? 0 : 4 }}>
            {stepContent[currentStep]}
          </Box>

          {/* Navigation footer */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 4,
              py: 2,
              borderTop: '1px solid rgba(0,0,0,0.07)',
              backgroundColor: '#fff',
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
              {`Etapa ${String(currentStep + 1)} de ${String(steps.length)}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<ChevronLeftIcon />}
                onClick={handleBack}
                disabled={currentStep === 0}
                sx={{ minHeight: 44 }}
              >
                Voltar
              </Button>
              {(currentStep !== 0 || uploadState === 'processed') && (
                <Button
                  variant="contained"
                  endIcon={currentStep < lastStep ? <ChevronRightIcon /> : undefined}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={15} sx={{ color: 'inherit' }} />
                    ) : undefined
                  }
                  onClick={handleNext}
                  disabled={submitting || !isCurrentStepValid}
                  sx={{ minHeight: 44, px: 3 }}
                >
                  {currentStep < lastStep
                    ? 'Próxima Etapa'
                    : submitting
                      ? 'Enviando...'
                      : 'Enviar Solicitação'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Modal de confirmação pós-submissão ── */}
      <SuccessDialog
        open={modalAberto}
        numeroProtocolo={numeroProtocolo}
        onGoToDashboard={goToDashboard}
        onNewRequest={handleNovaSolicitacao}
      />

      {/* ── Snackbar de feedback (upload/erros) ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ minWidth: 300 }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── Exported page component with ThemeProvider ────────────────────────
export function NewRequestPage() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <NewRequestInner />
      </Suspense>
    </ThemeProvider>
  );
}
