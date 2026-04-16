'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getStep3Label } from '../constants/module-labels';
import { type FormData, type TerapiaProcedimento } from '../types';

function validateTherapyProcedures(procedures: TerapiaProcedimento[]): string | null {
  for (let i = 0; i < procedures.length; i++) {
    const p = procedures[i];
    if (!p) continue;
    const n = procedures.length > 1 ? ` no Procedimento ${String(i + 1)}` : '';
    if (!p.tipoTerapia) return `Selecione o tipo de terapia${n}.`;
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
    if (!p.numeroSessoes.trim() || Number(p.numeroSessoes) <= 0)
      return `Informe o número de sessões${n}.`;
    if (!p.dataSolicitacao) return `Informe a data da solicitação${n}.`;
    if (!p.dataValidadeSenha) return `Informe a data de validade da senha${n}.`;
    if (p.dataValidadeSenha <= p.dataSolicitacao)
      return `A data de validade deve ser posterior à data da solicitação${n}.`;
  }
  return null;
}

function validateStepTransition(
  currentStep: number,
  form: FormData,
  terapiaProcedimentos: TerapiaProcedimento[],
): string | null {
  if (currentStep === 1 && !form.tipoSolicitacao) {
    return 'Por favor, selecione o tipo de solicitação antes de continuar.';
  }
  if (currentStep === 3 && form.tipoSolicitacao === 'terapias') {
    if (!form.etapaAutorizacao) return 'Selecione a etapa da autorização.';
    return validateTherapyProcedures(terapiaProcedimentos);
  }
  return null;
}

interface UseStepNavigationParams {
  form: FormData;
  terapiaProcedimentos: TerapiaProcedimento[];
}

export function useStepNavigation({ form, terapiaProcedimentos }: UseStepNavigationParams) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [numeroProtocolo, setNumeroProtocolo] = useState('');

  const activeModulo = form.tipoSolicitacao;

  const steps = [
    { label: 'Upload' },
    { label: 'Beneficiário' },
    { label: 'Clínico' },
    { label: getStep3Label(activeModulo) },
    { label: 'Documentos' },
    { label: 'Revisão' },
  ];

  const handleNext = () => {
    const error = validateStepTransition(currentStep, form, terapiaProcedimentos);
    if (error) {
      alert(error);
      return;
    }
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Step 5 — submit
    setSubmitting(true);
    setTimeout(() => {
      const id = `REQ-2026-${String(50000 + Math.floor(Math.random() * 49999)).padStart(5, '0')}`;
      setNumeroProtocolo(id);
      setSubmitting(false);
      setModalAberto(true);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
    else if (currentStep === 1) setCurrentStep(0);
  };

  const handleCancel = () => {
    if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
      router.back();
    }
  };

  const goToDashboard = () => {
    setModalAberto(false);
    router.push('/dashboard');
  };

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
  };
}
