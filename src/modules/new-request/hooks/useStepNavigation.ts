'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { opmeValueReasons } from '@/shared/constants';
import { logger } from '@/shared/utils/logger';
import { type Category } from '@/types/pedido';

import { type FormData, type TerapiaProcedimento } from '../types';
import { cheapestQuotation, parseNumeric } from '../types/opme';
import { formDataToRequest } from '../utils/form-to-request';

const STEP_DYNAMIC_LABEL_BY_CATEGORY: Record<Category, string> = {
  'Terapias Especiais': 'Sessões de Terapia',
  SADT: 'Procedimento SADT',
  'Exames Alta Complexidade': 'Exame de Alta Complexidade',
  'Home Care': 'Plano de Home Care',
  'Urgência/Emergência': 'Atendimento de Urgência',
  Oncologia: 'Protocolo Oncológico',
  Internação: 'Plano de Internação',
  'Cirurgias Eletivas': 'Plano Cirúrgico',
  OPME: 'Materiais OPME',
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

function validateUrgency(form: FormData): string | null {
  for (let i = 0; i < form.urgencyProcedimentos.length; i++) {
    const p = form.urgencyProcedimentos[i];
    if (!p) continue;
    const n = form.urgencyProcedimentos.length > 1 ? ` no Atendimento ${String(i + 1)}` : '';
    if (!p.classificacaoRisco) return `Selecione a Classificação de Risco (Manchester)${n}.`;
    if (!p.tipo) return `Selecione o tipo de atendimento${n}.`;
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
    if (!p.justificativaClinica.trim() || p.justificativaClinica.trim().length < 20) {
      return `Justificativa clínica obrigatória (mínimo 20 caracteres)${n}.`;
    }
  }
  return null;
}

function validateOncology(form: FormData): string | null {
  if (!form.estadiamentoTNM.trim()) return 'Informe o Estadiamento (TNM).';
  if (!form.protocoloQuimio.trim()) return 'Informe o Protocolo Quimioterápico.';
  if (!form.tipoTratamento) return 'Selecione o Tipo de Tratamento.';
  for (let i = 0; i < form.oncologyProcedimentos.length; i++) {
    const p = form.oncologyProcedimentos[i];
    if (!p) continue;
    const n = form.oncologyProcedimentos.length > 1 ? ` no Procedimento ${String(i + 1)}` : '';
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
  }
  return null;
}

const UTI_MIN_JUSTIFICATION_CHARS = 50;

function validateInternacao(form: FormData): string | null {
  if (!form.hospitalizationTipo) return 'Selecione o Tipo de Internação.';
  if (!form.hospitalizationDataPrevista) return 'Informe a Data Prevista de Internação.';
  if (!form.hospitalizationDuracao.trim() || Number(form.hospitalizationDuracao) <= 0) {
    return 'Informe a Duração estimada (diárias).';
  }
  if (!form.hospitalizationAuditLevel) return 'Selecione o Nível de Auditoria.';
  if (
    form.hospitalizationAuditLevel === 'UTI' &&
    form.hospitalizationUtiJustificativa.trim().length < UTI_MIN_JUSTIFICATION_CHARS
  ) {
    return `Justificativa de UTI exige mínimo ${String(UTI_MIN_JUSTIFICATION_CHARS)} caracteres.`;
  }
  for (let i = 0; i < form.hospitalizationProcedimentos.length; i++) {
    const p = form.hospitalizationProcedimentos[i];
    if (!p) continue;
    const n =
      form.hospitalizationProcedimentos.length > 1 ? ` no Procedimento ${String(i + 1)}` : '';
    if (!p.codigoTUSS.trim()) return `Informe o código TUSS${n}.`;
  }
  return null;
}

function validateOpmeBasicFields(
  material: FormData['opmeMateriais'][number],
  suffix: string,
): string | null {
  if (!material.materialDescription.trim()) return `Informe a descrição do material${suffix}.`;
  if (!material.manufacturer.trim()) return `Informe o fabricante${suffix}.`;
  if (Number(material.quantity) <= 0) return `Quantidade inválida${suffix}.`;
  if (material.anvisaRegistration.trim() === '') {
    return `Informe o registro ANVISA${suffix}.`;
  }
  if (material.anvisaStatus === 'not_checked') {
    return `Consulte a ANVISA antes de enviar${suffix}.`;
  }
  if (material.anvisaStatus === 'not_found') {
    return `Registro ANVISA não localizado${suffix} — corrija o número antes de enviar.`;
  }
  return null;
}

function validateOpmeQuotations(
  material: FormData['opmeMateriais'][number],
  suffix: string,
): string | null {
  const validQuotations = material.quotations.filter(
    (q) => q.supplier.trim() !== '' && parseNumeric(q.unitValue) > 0,
  );
  if (validQuotations.length < 3) {
    return `Mínimo de 3 cotações completas (fornecedor + valor)${suffix}.`;
  }
  if (material.chosenQuotationId === '') return `Selecione a cotação escolhida${suffix}.`;
  const chosen = material.quotations.find((q) => q.id === material.chosenQuotationId);
  if (!chosen) return `Cotação escolhida inválida${suffix}.`;
  const cheapest = cheapestQuotation(material);
  if (!cheapest || chosen.id === cheapest.id) return null;
  if (material.chosenReasonCode === '') {
    return `Justifique a escolha (motivo estruturado)${suffix}.`;
  }
  const config = opmeValueReasons[material.chosenReasonCode];
  if (config.requiresFreeText && material.chosenReasonNote.trim().length < 10) {
    return `Justificativa exige observação (mín. 10 caracteres)${suffix}.`;
  }
  return null;
}

function validateOpme(form: FormData): string | null {
  if (form.opmeMateriais.length === 0) return 'Cadastre ao menos 1 material OPME.';
  for (let i = 0; i < form.opmeMateriais.length; i++) {
    const m = form.opmeMateriais[i];
    if (!m) continue;
    const suffix = form.opmeMateriais.length > 1 ? ` no Material ${String(i + 1)}` : '';
    const basicError = validateOpmeBasicFields(m, suffix);
    if (basicError) return basicError;
    const quotationError = validateOpmeQuotations(m, suffix);
    if (quotationError) return quotationError;
  }
  return null;
}

function validateCirurgias(form: FormData): string | null {
  // Reuso: bloco de hospitalização
  const hospitalError = validateInternacao(form);
  if (hospitalError !== null) return hospitalError;
  if (!form.surgeryTipo) return 'Selecione o Tipo de Cirurgia.';
  if (!form.surgeryMainProcedureCode.trim())
    return 'Informe o Procedimento Principal (TUSS / Pacote).';
  // Pré-op: pelo menos os obrigatórios devem estar `realizado` ou `agendado` para avançar.
  const requiredItems = form.preOpItens.filter((i) => i.required);
  const blockingPreOp = requiredItems.filter((i) => i.status === 'pendente');
  if (blockingPreOp.length > 0) {
    return `Pré-operatório: ${String(blockingPreOp.length)} item(ns) obrigatório(s) ainda pendente(s) (mínimo agendado para avançar).`;
  }
  return null;
}

function validateDynamicStep(form: FormData, procedures: TerapiaProcedimento[]): string | null {
  if (form.category === 'Urgência/Emergência') return validateUrgency(form);
  if (form.category === 'Oncologia') return validateOncology(form);
  if (form.category === 'Internação') return validateInternacao(form);
  if (form.category === 'Cirurgias Eletivas') return validateCirurgias(form);
  if (form.category === 'OPME') return validateOpme(form);
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
      // Mapeamento FormData → Request (preparação backend, M3 prototyping).
      // Hoje só validamos shape via logger; quando endpoint existir, basta enviar
      // o payload retornado para o serviço.
      try {
        const payload = formDataToRequest({
          form,
          terapiaProcedimentos,
          generatedId: id,
        });
        logger.info('[new-request] payload preparado', { id, category: payload.category });
      } catch (err) {
        logger.error('[new-request] falha ao mapear FormData → Request', err);
      }
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
