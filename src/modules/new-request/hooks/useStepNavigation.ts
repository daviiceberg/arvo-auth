'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type FormData, type TerapiaProcedimento } from '../types';

const STEP_3_LABEL = 'Sessões de Terapia';

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
  if (currentStep === 1 && !form.category) {
    return 'Por favor, selecione o tipo de solicitação antes de continuar.';
  }
  if (currentStep === 2) {
    if (!form.cidPrincipal.trim()) {
      return 'CID Principal é obrigatório. Preencha o CID antes de continuar.';
    }
    if (!form.indicacaoClinica.trim()) {
      return 'Indicação Clínica é obrigatória. Preencha a indicação clínica antes de continuar.';
    }
  }
  if (currentStep === 3 && form.category === 'Terapias Especiais') {
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

  const activeCategory = form.category;

  const steps = [
    { label: 'Upload' },
    { label: 'Beneficiário' },
    { label: 'Clínico' },
    { label: STEP_3_LABEL },
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
    activeCategory,
  };
}
