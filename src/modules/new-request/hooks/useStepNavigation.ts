'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type Category } from '@/types/pedido';

import { type FormData, type TerapiaProcedimento } from '../types';

const STEP_DYNAMIC_LABEL_BY_CATEGORY: Record<Category, string> = {
  'Terapias Especiais': 'Sessões de Terapia',
  SADT: 'Procedimento SADT',
  'Exames Alta Complexidade': 'Exame de Alta Complexidade',
  'Home Care': 'Plano de Home Care',
};

function dynamicStepLabel(category: FormData['category']): string {
  return category === '' ? 'Específicos' : STEP_DYNAMIC_LABEL_BY_CATEGORY[category];
}

const TOTAL_STEPS = 6;
const LAST_STEP = TOTAL_STEPS - 1;

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

function validateSadt(form: FormData): string | null {
  for (let i = 0; i < form.sadtProcedimentos.length; i++) {
    const p = form.sadtProcedimentos[i];
    if (!p) continue;
    const n = form.sadtProcedimentos.length > 1 ? ` no Procedimento ${String(i + 1)}` : '';
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
    if (!p.tipo) return `Selecione o tipo${n}.`;
    if (!p.quantidade.trim() || Number(p.quantidade) <= 0) {
      return `Informe a quantidade${n}.`;
    }
  }
  return null;
}

function validateExams(form: FormData): string | null {
  for (let i = 0; i < form.examsProcedimentos.length; i++) {
    const p = form.examsProcedimentos[i];
    if (!p) continue;
    const n = form.examsProcedimentos.length > 1 ? ` no Procedimento ${String(i + 1)}` : '';
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
    if (!p.regiaoAnatomica.trim()) return `Informe a região anatômica${n}.`;
    if (!p.hipoteseDiagnostica.trim()) return `Informe a hipótese diagnóstica${n}.`;
  }
  return null;
}

function validateHomeCare(form: FormData): string | null {
  for (let i = 0; i < form.homeCareProcedimentos.length; i++) {
    const p = form.homeCareProcedimentos[i];
    if (!p) continue;
    const n = form.homeCareProcedimentos.length > 1 ? ` no Plano ${String(i + 1)}` : '';
    if (!p.tipo) return `Selecione o tipo${n}.`;
    if (!p.frequencia.trim()) return `Informe a frequência de atendimento${n}.`;
    if (!p.duracaoDias.trim() || Number(p.duracaoDias) <= 0) {
      return `Informe a duração prevista (em dias)${n}.`;
    }
    if (!p.enderecoAtendimento.trim()) return `Informe o endereço de atendimento${n}.`;
  }
  return null;
}

function validateDynamicStep(form: FormData, procedures: TerapiaProcedimento[]): string | null {
  if (!form.etapaAutorizacao) return 'Selecione a etapa da autorização.';
  if (form.category === 'Terapias Especiais') return validateTherapyProcedures(procedures);
  if (form.category === 'SADT') return validateSadt(form);
  if (form.category === 'Exames Alta Complexidade') return validateExams(form);
  if (form.category === 'Home Care') return validateHomeCare(form);
  return null;
}

function validateStepTransition(
  currentStep: number,
  form: FormData,
  terapiaProcedimentos: TerapiaProcedimento[],
): string | null {
  // Step 1 = Beneficiário — categoria obrigatória para avançar
  if (currentStep === 1 && !form.category) {
    return 'Selecione o tipo de solicitação para continuar.';
  }
  // Step 2 = Clínico
  if (currentStep === 2) {
    if (!form.cidPrincipal.trim()) {
      return 'CID Principal é obrigatório. Preencha o CID antes de continuar.';
    }
    if (!form.indicacaoClinica.trim()) {
      return 'Indicação Clínica é obrigatória. Preencha a indicação clínica antes de continuar.';
    }
  }
  // Step 3 = Dynamic (categoria-specific)
  if (currentStep === 3) {
    return validateDynamicStep(form, terapiaProcedimentos);
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
    { label: dynamicStepLabel(activeCategory) },
    { label: 'Documentos' },
    { label: 'Revisão' },
  ];

  const handleNext = () => {
    const error = validateStepTransition(currentStep, form, terapiaProcedimentos);
    if (error) {
      alert(error);
      return;
    }
    if (currentStep < LAST_STEP) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Last step — submit
    setSubmitting(true);
    setTimeout(() => {
      const id = `REQ-2026-${String(50000 + Math.floor(Math.random() * 49999)).padStart(5, '0')}`;
      setNumeroProtocolo(id);
      setSubmitting(false);
      setModalAberto(true);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
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
    totalSteps: TOTAL_STEPS,
    lastStep: LAST_STEP,
  };
}
