'use client';

import { useState } from 'react';

import { anvisaService } from '@/services/anvisa/anvisa.service';
import { logger } from '@/shared/utils/logger';
import { type AnvisaStatus, type OpmeValueReasonCode } from '@/types/pedido';

import { categoryMocks } from '../constants/category-mocks';
import { buildPreOpFromTemplate } from '../constants/pre-op-required';
import { TUSS_POR_TERAPIA } from '../constants/tuss-therapy-codes';
import {
  type FormData,
  type TerapiaProcedimento,
  type SadtProcedimento,
  type ExamsProcedimento,
  type HomeCareItem,
  type UrgencyProcedimento,
  type OncologyProcedimento,
  type HospitalTaxItem,
  type HospitalizationProcedimento,
  type SurgeryAcessorio,
  type SurgeryTipoChoice,
  type PreOpFormItem,
} from '../types';
import {
  type OpmeFormMaterial,
  type OpmeFormQuotation,
  createEmptyOpmeMaterial,
  createEmptyOpmeQuotation,
} from '../types/opme';

const newSadtProcedimento = (base?: Partial<SadtProcedimento>): SadtProcedimento => ({
  id: crypto.randomUUID(),
  codigoTUSS: '',
  descricaoTUSS: '',
  tipo: '',
  frequencia: '',
  quantidade: '',
  ...base,
});

const newExamsProcedimento = (base?: Partial<ExamsProcedimento>): ExamsProcedimento => ({
  id: crypto.randomUUID(),
  codigoTUSS: '',
  descricaoTUSS: '',
  regiaoAnatomica: '',
  hipoteseDiagnostica: '',
  historicoExamesAnteriores: '',
  ...base,
});

const newHomeCareItem = (base?: Partial<HomeCareItem>): HomeCareItem => ({
  id: crypto.randomUUID(),
  tipo: '',
  frequencia: '',
  duracaoDias: '',
  escalaCuidadores: '',
  equipamentos: '',
  enderecoAtendimento: '',
  ...base,
});

const newUrgencyProcedimento = (base?: Partial<UrgencyProcedimento>): UrgencyProcedimento => ({
  id: crypto.randomUUID(),
  tipo: '',
  classificacaoRisco: '',
  codigoTUSS: '10101039',
  descricaoTUSS: 'Consulta em pronto socorro',
  justificativaClinica: '',
  quantidade: '1',
  ...base,
});

const newOncologyProcedimento = (base?: Partial<OncologyProcedimento>): OncologyProcedimento => ({
  id: crypto.randomUUID(),
  codigoTUSS: '',
  descricaoTUSS: '',
  quantidade: '1',
  ...base,
});

const newHospitalTaxItem = (base?: Partial<HospitalTaxItem>): HospitalTaxItem => ({
  id: crypto.randomUUID(),
  code: '',
  description: '',
  quantity: '1',
  estimatedValue: '',
  ...base,
});

const newHospitalizationProcedimento = (
  base?: Partial<HospitalizationProcedimento>,
): HospitalizationProcedimento => ({
  id: crypto.randomUUID(),
  codigoTUSS: '',
  descricaoTUSS: '',
  cid: '',
  qtd: '1',
  ...base,
});

const newSurgeryAcessorio = (base?: Partial<SurgeryAcessorio>): SurgeryAcessorio => ({
  id: crypto.randomUUID(),
  codigoTUSS: '',
  descricaoTUSS: '',
  ...base,
});

const newPreOpItem = (base?: Partial<PreOpFormItem>): PreOpFormItem => ({
  id: crypto.randomUUID(),
  type: 'exame',
  description: '',
  required: true,
  status: 'pendente',
  date: '',
  ...base,
});

const newTerapiaProc = (base?: Partial<TerapiaProcedimento>): TerapiaProcedimento => ({
  id: crypto.randomUUID(),
  tipoTerapia: '',
  codigoTUSS: '',
  descricaoTUSS: '',
  numeroSessoes: '',
  dataSolicitacao: base?.dataSolicitacao ?? '',
  dataValidadeSenha: base?.dataValidadeSenha ?? '',
  frequenciaSemanal: '3x por semana',
});

export const initialForm: FormData = {
  category: '',
  nomeBeneficiario: 'Lucas Martins de Almeida',
  carteirinha: '9876543210987654',
  dataNascimento: '2018-07-22',
  cpf: '',
  operadora: '',
  validadeCarteirinha: '',
  telefoneContato: '',
  dataInclusaoPlano: '',
  cidPrincipal: 'F84.0 - Autismo infantil',
  cidsSecundarios: [],
  indicacaoClinica:
    'Paciente pediátrico com diagnóstico de TEA (F84.0) em acompanhamento multidisciplinar. Indicada continuidade do plano terapêutico com Fonoaudiologia, Terapia Ocupacional e Psicologia/ABA.',
  procedimentoJaRealizado: '',
  profissionalSolicitante: 'Dra. Helena Rocha',
  conselhoTipo: 'CRM',
  conselhoNumero: '98765',
  conselhoUF: 'SP',
  cboCodigo: '225142',
  nomeContratadoSolicitante: 'Clínica Neuropediátrica Esperança',
  nomeContratadoExecutante: 'Clínica Integrar TEA',
  cnesExecutante: '7547277',
  etapaAutorizacao: '',
  tipoTerapia: 'Fonoaudiologia',
  codigoTuss: TUSS_POR_TERAPIA.Fonoaudiologia ?? '',
  numSessoes: '',
  terapiaDataSolicitacao: '',
  terapiaDataValidadeSenha: '',
  frequenciaSemanal: '3x por semana',
  estadiamentoTNM: '',
  numeroCiclo: '',
  protocoloQuimio: '',
  tipoTratamento: '',
  totalCiclos: '',
  sadtProcedimentos: [newSadtProcedimento()],
  examsProcedimentos: [newExamsProcedimento()],
  homeCareProcedimentos: [newHomeCareItem()],
  urgencyProcedimentos: [newUrgencyProcedimento()],
  oncologyProcedimentos: [newOncologyProcedimento()],
  hospitalizationTipo: '',
  hospitalizationDataPrevista: '',
  hospitalizationDuracao: '',
  hospitalizationAuditLevel: '',
  hospitalizationUtiJustificativa: '',
  hospitalizationTaxas: [],
  hospitalizationProcedimentos: [newHospitalizationProcedimento()],
  surgeryTipo: '',
  surgeryMainProcedureCode: '',
  surgeryMainProcedureDescription: '',
  surgeryAcessorios: [],
  surgeryHasOpme: false,
  surgeryHasOncologyLink: false,
  surgeryNotes: '',
  preOpItens: [],
  opmeMateriais: [createEmptyOpmeMaterial()],
  opmeRelatedSurgery: '',
};

export function useNewRequestForm(categoryParam: string) {
  const [form, setForm] = useState({
    ...initialForm,
    category: (categoryParam || '') as FormData['category'],
  });

  const [terapiaProcedimentos, setTerapiaProcedimentos] = useState([newTerapiaProc()]);
  const [cidSecundarioInput, setCidSecundarioInput] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const set =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const setSelect = (field: keyof FormData) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleAddTerapiaProc = () => {
    if (terapiaProcedimentos.length >= 5) return;
    const first = terapiaProcedimentos[0];
    setTerapiaProcedimentos((prev) => [
      ...prev,
      newTerapiaProc({
        dataSolicitacao: first?.dataSolicitacao,
        dataValidadeSenha: first?.dataValidadeSenha,
      }),
    ]);
  };

  const handleRemoveTerapiaProc = (id: string) => {
    if (terapiaProcedimentos.length <= 1) return;
    setTerapiaProcedimentos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateTerapiaProc = (
    id: string,
    field: keyof Omit<TerapiaProcedimento, 'id'>,
    value: string,
  ) => {
    setTerapiaProcedimentos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'tipoTerapia') updated.codigoTUSS = TUSS_POR_TERAPIA[value] ?? p.codigoTUSS;
        return updated;
      }),
    );
  };

  const addCidSecundario = (cid: string) => {
    if (!cid.trim()) return;
    setForm((f) => ({ ...f, cidsSecundarios: [...f.cidsSecundarios, cid.trim()] }));
    setCidSecundarioInput('');
  };

  const removeCidSecundario = (index: number) => {
    setForm((f) => ({ ...f, cidsSecundarios: f.cidsSecundarios.filter((_, i) => i !== index) }));
  };

  const resetForm = (categoryParamValue: string) => {
    setForm({
      ...initialForm,
      category: (categoryParamValue || '') as FormData['category'],
    });
    setTerapiaProcedimentos([newTerapiaProc()]);
    setCidSecundarioInput('');
  };

  const setCategory = (next: FormData['category']) => {
    const mockData = next ? categoryMocks[next] : {};
    setForm({ ...initialForm, category: next, ...mockData });
    setTerapiaProcedimentos([newTerapiaProc()]);
    setCidSecundarioInput('');
    setIsManualEntry(false);
  };

  const handleAddSadtProcedimento = () => {
    if (form.sadtProcedimentos.length >= 5) return;
    setForm((f) => ({
      ...f,
      sadtProcedimentos: [...f.sadtProcedimentos, newSadtProcedimento()],
    }));
  };

  const handleRemoveSadtProcedimento = (id: string) => {
    if (form.sadtProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      sadtProcedimentos: f.sadtProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateSadtProcedimento = (
    id: string,
    field: keyof Omit<SadtProcedimento, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      sadtProcedimentos: f.sadtProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddExamsProcedimento = () => {
    if (form.examsProcedimentos.length >= 5) return;
    setForm((f) => ({
      ...f,
      examsProcedimentos: [...f.examsProcedimentos, newExamsProcedimento()],
    }));
  };

  const handleRemoveExamsProcedimento = (id: string) => {
    if (form.examsProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      examsProcedimentos: f.examsProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateExamsProcedimento = (
    id: string,
    field: keyof Omit<ExamsProcedimento, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      examsProcedimentos: f.examsProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddHomeCareProcedimento = () => {
    if (form.homeCareProcedimentos.length >= 5) return;
    setForm((f) => ({
      ...f,
      homeCareProcedimentos: [...f.homeCareProcedimentos, newHomeCareItem()],
    }));
  };

  const handleRemoveHomeCareProcedimento = (id: string) => {
    if (form.homeCareProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      homeCareProcedimentos: f.homeCareProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateHomeCareProcedimento = (
    id: string,
    field: keyof Omit<HomeCareItem, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      homeCareProcedimentos: f.homeCareProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddUrgencyProcedimento = () => {
    if (form.urgencyProcedimentos.length >= 3) return;
    setForm((f) => ({
      ...f,
      urgencyProcedimentos: [...f.urgencyProcedimentos, newUrgencyProcedimento()],
    }));
  };

  const handleRemoveUrgencyProcedimento = (id: string) => {
    if (form.urgencyProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      urgencyProcedimentos: f.urgencyProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateUrgencyProcedimento = (
    id: string,
    field: keyof Omit<UrgencyProcedimento, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      urgencyProcedimentos: f.urgencyProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddOncologyProcedimento = () => {
    if (form.oncologyProcedimentos.length >= 5) return;
    setForm((f) => ({
      ...f,
      oncologyProcedimentos: [...f.oncologyProcedimentos, newOncologyProcedimento()],
    }));
  };

  const handleRemoveOncologyProcedimento = (id: string) => {
    if (form.oncologyProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      oncologyProcedimentos: f.oncologyProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateOncologyProcedimento = (
    id: string,
    field: keyof Omit<OncologyProcedimento, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      oncologyProcedimentos: f.oncologyProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddHospitalizationProcedimento = () => {
    if (form.hospitalizationProcedimentos.length >= 5) return;
    setForm((f) => ({
      ...f,
      hospitalizationProcedimentos: [
        ...f.hospitalizationProcedimentos,
        newHospitalizationProcedimento(),
      ],
    }));
  };

  const handleRemoveHospitalizationProcedimento = (id: string) => {
    if (form.hospitalizationProcedimentos.length <= 1) return;
    setForm((f) => ({
      ...f,
      hospitalizationProcedimentos: f.hospitalizationProcedimentos.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateHospitalizationProcedimento = (
    id: string,
    field: keyof Omit<HospitalizationProcedimento, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      hospitalizationProcedimentos: f.hospitalizationProcedimentos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleAddHospitalizationTaxa = () => {
    if (form.hospitalizationTaxas.length >= 10) return;
    setForm((f) => ({
      ...f,
      hospitalizationTaxas: [...f.hospitalizationTaxas, newHospitalTaxItem()],
    }));
  };

  const handleRemoveHospitalizationTaxa = (id: string) => {
    setForm((f) => ({
      ...f,
      hospitalizationTaxas: f.hospitalizationTaxas.filter((t) => t.id !== id),
    }));
  };

  const handleUpdateHospitalizationTaxa = (
    id: string,
    field: keyof Omit<HospitalTaxItem, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      hospitalizationTaxas: f.hospitalizationTaxas.map((t) =>
        t.id === id ? { ...t, [field]: value } : t,
      ),
    }));
  };

  const handleSetSurgeryTipo = (next: SurgeryTipoChoice) => {
    setForm((f) => {
      const populatedPreOp = next
        ? buildPreOpFromTemplate(next, (tpl) =>
            newPreOpItem({
              templateId: tpl.id,
              type: tpl.type,
              description: tpl.description,
              required: tpl.required,
              status: 'pendente',
            }),
          )
        : [];
      return {
        ...f,
        surgeryTipo: next,
        preOpItens: populatedPreOp,
      };
    });
  };

  const handleAddSurgeryAcessorio = () => {
    if (form.surgeryAcessorios.length >= 5) return;
    setForm((f) => ({
      ...f,
      surgeryAcessorios: [...f.surgeryAcessorios, newSurgeryAcessorio()],
    }));
  };

  const handleRemoveSurgeryAcessorio = (id: string) => {
    setForm((f) => ({
      ...f,
      surgeryAcessorios: f.surgeryAcessorios.filter((a) => a.id !== id),
    }));
  };

  const handleUpdateSurgeryAcessorio = (
    id: string,
    field: keyof Omit<SurgeryAcessorio, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      surgeryAcessorios: f.surgeryAcessorios.map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    }));
  };

  const handleSetSurgeryMainProcedure = (code: string, description: string) => {
    setForm((f) => ({
      ...f,
      surgeryMainProcedureCode: code,
      surgeryMainProcedureDescription: description,
    }));
  };

  const handleSetSurgeryHasOpme = (value: boolean) => {
    setForm((f) => ({ ...f, surgeryHasOpme: value }));
  };

  const handleSetSurgeryHasOncologyLink = (value: boolean) => {
    setForm((f) => ({ ...f, surgeryHasOncologyLink: value }));
  };

  const handleAddPreOpItem = () => {
    if (form.preOpItens.length >= 15) return;
    setForm((f) => ({
      ...f,
      preOpItens: [...f.preOpItens, newPreOpItem({ required: false })],
    }));
  };

  const handleRemovePreOpItem = (id: string) => {
    setForm((f) => ({
      ...f,
      preOpItens: f.preOpItens.filter((i) => i.id !== id),
    }));
  };

  const handleUpdatePreOpItem = (
    id: string,
    field: keyof Omit<PreOpFormItem, 'id' | 'templateId'>,
    value: string | boolean,
  ) => {
    setForm((f) => ({
      ...f,
      preOpItens: f.preOpItens.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));
  };

  // ── M5 — OPME ──────────────────────────────────────────────────────────
  const handleAddOpmeMaterial = () => {
    if (form.opmeMateriais.length >= 10) return;
    setForm((f) => ({ ...f, opmeMateriais: [...f.opmeMateriais, createEmptyOpmeMaterial()] }));
  };

  const handleRemoveOpmeMaterial = (id: string) => {
    if (form.opmeMateriais.length <= 1) return;
    setForm((f) => ({ ...f, opmeMateriais: f.opmeMateriais.filter((m) => m.id !== id) }));
  };

  const handleUpdateOpmeMaterial = (
    id: string,
    field: keyof Omit<OpmeFormMaterial, 'id' | 'quotations'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const handleAddOpmeQuotation = (materialId: string) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) => {
        if (m.id !== materialId) return m;
        if (m.quotations.length >= 5) return m;
        return { ...m, quotations: [...m.quotations, createEmptyOpmeQuotation()] };
      }),
    }));
  };

  const handleRemoveOpmeQuotation = (materialId: string, quotationId: string) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) => {
        if (m.id !== materialId) return m;
        if (m.quotations.length <= 3) return m;
        return {
          ...m,
          quotations: m.quotations.filter((q) => q.id !== quotationId),
          chosenQuotationId: m.chosenQuotationId === quotationId ? '' : m.chosenQuotationId,
        };
      }),
    }));
  };

  const handleUpdateOpmeQuotation = (
    materialId: string,
    quotationId: string,
    field: keyof Omit<OpmeFormQuotation, 'id'>,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) =>
        m.id === materialId
          ? {
              ...m,
              quotations: m.quotations.map((q) =>
                q.id === quotationId ? { ...q, [field]: value } : q,
              ),
            }
          : m,
      ),
    }));
  };

  const handleSelectOpmeQuotation = (materialId: string, quotationId: string) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) => {
        if (m.id !== materialId) return m;
        const valid = m.quotations.filter((q) => Number(q.unitValue) > 0);
        if (valid.length === 0) return { ...m, chosenQuotationId: quotationId };
        const cheapest = valid.reduce((min, q) =>
          Number(q.unitValue) < Number(min.unitValue) ? q : min,
        );
        const isCheapestChosen = cheapest.id === quotationId;
        return {
          ...m,
          chosenQuotationId: quotationId,
          ...(isCheapestChosen ? { chosenReasonCode: '' as const, chosenReasonNote: '' } : {}),
        };
      }),
    }));
  };

  const handleSetOpmeChosenReason = (
    materialId: string,
    code: OpmeValueReasonCode | '',
    note: string,
  ) => {
    setForm((f) => ({
      ...f,
      opmeMateriais: f.opmeMateriais.map((m) =>
        m.id === materialId ? { ...m, chosenReasonCode: code, chosenReasonNote: note } : m,
      ),
    }));
  };

  const handleConsultAnvisa = async (
    materialId: string,
  ): Promise<{ status: AnvisaStatus | 'error'; productName?: string }> => {
    const material = form.opmeMateriais.find((m) => m.id === materialId);
    if (!material) return { status: 'error' };
    const registration = material.anvisaRegistration.trim();
    if (!registration) return { status: 'not_checked' };
    try {
      const response = await anvisaService.check({ registration });
      setForm((f) => ({
        ...f,
        opmeMateriais: f.opmeMateriais.map((m) =>
          m.id === materialId
            ? {
                ...m,
                anvisaStatus: response.status,
                anvisaProductName: response.productName ?? '',
                anvisaValidUntil: response.validUntil ?? '',
                anvisaConsultedAt: response.checkedAt,
                manufacturer:
                  m.manufacturer.trim() === '' && response.manufacturer
                    ? response.manufacturer
                    : m.manufacturer,
              }
            : m,
        ),
      }));
      return { status: response.status, productName: response.productName };
    } catch (err) {
      logger.error('[new-request] anvisa check failed', err);
      return { status: 'error' };
    }
  };

  return {
    form,
    setForm,
    set,
    setSelect,
    setCategory,
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
  };
}
