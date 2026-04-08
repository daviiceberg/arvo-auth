'use client'

import React, { Suspense } from 'react'

import { useSearchParams } from 'next/navigation'

import CheckIcon from '@mui/icons-material/Check'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import theme from '@/core/theme'

import { moduloLabels } from '../constants/module-labels'
import { useDocumentUpload } from '../hooks/useDocumentUpload'
import { useNewRequestForm, initialForm  } from '../hooks/useNewRequestForm'
import { useStepNavigation } from '../hooks/useStepNavigation'
import { useUploadStep } from '../hooks/useUploadStep'
import { type ModuloType } from '../types'

import { StepBeneficiary } from './StepBeneficiary'
import { StepClinical } from './StepClinical'
import { StepDocuments } from './StepDocuments'
import { StepDynamic } from './StepDynamic'
import { StepReview } from './StepReview'
import { StepUpload } from './StepUpload'
import { SuccessDialog } from './SuccessDialog'
import { TissDocPreview } from './TissDocPreview'

// ── Step custom icon ──────────────────────────────────────────────────
function StepIcon({ active, completed, index }: { active: boolean; completed: boolean; index: number }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed ? '#16a34a' : active ? '#902B29' : '#e5e7eb',
        color: completed || active ? '#fff' : '#6b7280',
        fontSize: 12,
        fontWeight: 700,
        transition: 'all 200ms ease',
        flexShrink: 0,
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
    </Box>
  )
}

// ── Inner component (uses useSearchParams) ────────────────────────────
function NewRequestInner() {
  const searchParams = useSearchParams()
  const moduloParam = (searchParams.get('modulo') ?? '') as ModuloType | ''

  const {
    form, setForm, set, setSelect,
    terapiaProcedimentos, handleAddTerapiaProc, handleRemoveTerapiaProc, handleUpdateTerapiaProc,
    cidSecundarioInput, setCidSecundarioInput, addCidSecundario, removeCidSecundario,
    resetForm,
  } = useNewRequestForm(moduloParam)

  const {
    currentStep, setCurrentStep, steps,
    submitting, modalAberto, setModalAberto,
    numeroProtocolo, setNumeroProtocolo, setSubmitting,
    handleNext, handleBack, handleCancel,
    goToDashboard, activeModulo,
  } = useStepNavigation({ form, terapiaProcedimentos })

  const {
    uploadState, uploadProgress, dragOver, setDragOver,
    zoom, rotation, handleUpload, resetUpload,
    zoomIn, zoomOut, rotate,
  } = useUploadStep()

  const docUpload = useDocumentUpload({
    activeModulo,
    etapaAutorizacao: form.etapaAutorizacao,
  })

  const handleUploadComplete = () => {
    handleUpload(() => { setCurrentStep(1); })
  }

  const handleSkipUpload = () => {
    setForm({ ...initialForm, tipoSolicitacao: '' })
    setCurrentStep(1)
  }

  const handleNovaSolicitacao = () => {
    setModalAberto(false)
    setNumeroProtocolo('')
    setSubmitting(false)
    setCurrentStep(0)
    resetUpload()
    resetForm(moduloParam)
    docUpload.resetDocs()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#faf6f2', fontFamily: '"Space Grotesk", sans-serif' }}>

      {/* ── Top bar ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 1.5,
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        flexShrink: 0,
        minHeight: 60,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/logo-arvo.svg" alt="Arvo" style={{ height: 26 }} />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>
            Nova Solicitação: Pré-Autorização
          </Typography>
          {form.tipoSolicitacao ? <Chip
              label={moduloLabels[form.tipoSolicitacao]}
              size="small"
              sx={{ fontWeight: 600, fontSize: 11, backgroundColor: 'rgba(144,43,41,0.08)', color: '#902B29' }}
            /> : null}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SaveOutlinedIcon />}
            sx={{ minHeight: 36 }}
            onClick={() => { alert('Rascunho salvo!'); }}
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
      <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', px: 4, py: 1.5, flexShrink: 0 }}>
        <Stepper activeStep={currentStep} alternativeLabel connector={null}
          sx={{
            maxWidth: 700, mx: 'auto',
            '& .MuiStepLabel-label': { fontSize: 11, mt: 0.5, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500 },
            '& .MuiStepLabel-label.Mui-active': { fontWeight: 700, color: '#902B29' },
            '& .MuiStepLabel-label.Mui-completed': { color: '#16a34a' },
          }}
        >
          {steps.map((step, i) => (
            <Step key={step.label} completed={i < currentStep}>
              <StepLabel
                StepIconComponent={() => <StepIcon active={i === currentStep} completed={i < currentStep} index={i} />}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: document viewer — hidden on step 0 */}
        {currentStep > 0 && (
          <Box sx={{
            width: '45%',
            flexShrink: 0,
            backgroundColor: '#f3f4f6',
            borderRight: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Viewer toolbar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff', flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={zoomOut} disabled={zoom <= 50}><ZoomOutIcon fontSize="small" /></IconButton>
                <Typography variant="caption" sx={{ fontSize: 11, minWidth: 36, textAlign: 'center' }}>{zoom}%</Typography>
                <IconButton size="small" onClick={zoomIn} disabled={zoom >= 200}><ZoomInIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={rotate}><RotateRightIcon fontSize="small" /></IconButton>
              </Box>
              <Button size="small" startIcon={<UploadFileIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11 }}>
                Novo Arquivo
              </Button>
            </Box>

            {/* Document */}
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <TissDocPreview zoom={zoom} rotation={rotation} />
            </Box>
          </Box>
        )}

        {/* Right: form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Form content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: currentStep === 0 ? 0 : 4 }}>
            {currentStep === 0 && (
              <StepUpload
                uploadState={uploadState}
                uploadProgress={uploadProgress}
                dragOver={dragOver}
                setDragOver={setDragOver}
                onUpload={handleUploadComplete}
                onSkip={handleSkipUpload}
              />
            )}
            {currentStep === 1 && (
              <StepBeneficiary form={form} set={set} setSelect={setSelect} />
            )}
            {currentStep === 2 && (
              <StepClinical
                form={form} set={set} setSelect={setSelect}
                cidSecundarioInput={cidSecundarioInput}
                setCidSecundarioInput={setCidSecundarioInput}
                addCidSecundario={addCidSecundario}
                removeCidSecundario={removeCidSecundario}
              />
            )}
            {currentStep === 3 && (
              <StepDynamic
                form={form} setForm={setForm} set={set} setSelect={setSelect}
                terapiaProcedimentos={terapiaProcedimentos}
                handleAddTerapiaProc={handleAddTerapiaProc}
                handleRemoveTerapiaProc={handleRemoveTerapiaProc}
                handleUpdateTerapiaProc={handleUpdateTerapiaProc}
              />
            )}
            {currentStep === 4 && (
              <StepDocuments
                modulo={activeModulo}
                docsObrigatorios={docUpload.docsObrigatorios}
                docsAdicionais={docUpload.docsAdicionais}
                pendentesObrig={docUpload.pendentesObrig}
                showAddDocForm={docUpload.showAddDocForm}
                setShowAddDocForm={docUpload.setShowAddDocForm}
                newDocTipo={docUpload.newDocTipo}
                setNewDocTipo={docUpload.setNewDocTipo}
                newDocFile={docUpload.newDocFile}
                setNewDocFile={docUpload.setNewDocFile}
                newDocDescricao={docUpload.newDocDescricao}
                setNewDocDescricao={docUpload.setNewDocDescricao}
                docDragOver={docUpload.docDragOver}
                setDocDragOver={docUpload.setDocDragOver}
                docFileRef={docUpload.docFileRef}
                handleObrigUpload={docUpload.handleObrigUpload}
                handleRemoveObrigDoc={docUpload.handleRemoveObrigDoc}
                handleAddDocAdicional={docUpload.handleAddDocAdicional}
                handleRemoveDocAdicional={docUpload.handleRemoveDocAdicional}
                cancelAddDoc={docUpload.cancelAddDoc}
              />
            )}
            {currentStep === 5 && (
              <StepReview
                form={form}
                terapiaProcedimentos={terapiaProcedimentos}
                docsObrigatorios={docUpload.docsObrigatorios}
                docsAdicionais={docUpload.docsAdicionais}
              />
            )}
          </Box>

          {/* Navigation footer */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 4, py: 2,
            borderTop: '1px solid rgba(0,0,0,0.07)',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}>
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
              {currentStep > 0 && (
                <Button
                  variant="contained"
                  endIcon={currentStep < 5 ? <ChevronRightIcon /> : undefined}
                  startIcon={submitting ? <CircularProgress size={15} sx={{ color: 'inherit' }} /> : undefined}
                  onClick={handleNext}
                  disabled={submitting}
                  sx={{ minHeight: 44, px: 3 }}
                >
                  {currentStep < steps.length - 1 ? 'Próxima Etapa' : submitting ? 'Enviando...' : 'Enviar Solicitação'}
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
    </Box>
  )
}

// ── Exported page component with ThemeProvider ────────────────────────
export function NewRequestPage() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <NewRequestInner />
      </Suspense>
    </ThemeProvider>
  )
}
