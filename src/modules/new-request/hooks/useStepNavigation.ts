'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { getStep3Label } from '../constants/module-labels'
import { type FormData, type TerapiaProcedimento } from '../types'

interface UseStepNavigationParams {
  form: FormData
  terapiaProcedimentos: TerapiaProcedimento[]
}

export function useStepNavigation({ form, terapiaProcedimentos }: UseStepNavigationParams) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [numeroProtocolo, setNumeroProtocolo] = useState('')

  const activeModulo = form.tipoSolicitacao

  const steps = [
    { label: 'Upload' },
    { label: 'Beneficiário' },
    { label: 'Clínico' },
    { label: getStep3Label(activeModulo) },
    { label: 'Documentos' },
    { label: 'Revisão' },
  ]

  const handleNext = () => {
    if (currentStep === 1 && !form.tipoSolicitacao) {
      alert('Por favor, selecione o tipo de solicitação antes de continuar.')
      return
    }
    if (currentStep === 3 && form.tipoSolicitacao === 'terapias') {
      if (!form.etapaAutorizacao) {
        alert('Selecione a etapa da autorização.')
        return
      }
      for (let i = 0; i < terapiaProcedimentos.length; i++) {
        const p = terapiaProcedimentos[i]!
        const n = terapiaProcedimentos.length > 1 ? ` no Procedimento ${i + 1}` : ''
        if (!p.tipoTerapia) { alert(`Selecione o tipo de terapia${n}.`); return }
        if (!p.codigoTUSS.trim()) { alert(`Informe o código TUSS${n}.`); return }
        if (!p.numeroSessoes.trim() || Number(p.numeroSessoes) <= 0) { alert(`Informe o número de sessões${n}.`); return }
        if (!p.dataInicio) { alert(`Informe a data de início${n}.`); return }
        if (!p.dataTermino) { alert(`Informe a data de término${n}.`); return }
        if (p.dataTermino <= p.dataInicio) { alert(`A data de término deve ser posterior à data de início${n}.`); return }
      }
    }
    if (currentStep < 5) { setCurrentStep((s) => s + 1); return }

    // Step 5 — submit
    setSubmitting(true)
    setTimeout(() => {
      const id = `REQ-2026-${String(50000 + Math.floor(Math.random() * 49999)).padStart(5, '0')}`
      setNumeroProtocolo(id)
      setSubmitting(false)
      setModalAberto(true)
    }, 1500)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
    else if (currentStep === 1) setCurrentStep(0)
  }

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
      router.back()
    }
  }

  const goToDashboard = () => {
    setModalAberto(false)
    router.push('/dashboard')
  }

  return {
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
    activeModulo,
  }
}
