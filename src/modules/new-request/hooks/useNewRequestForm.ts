'use client';

import { useState } from 'react';

import { categoryMocks } from '../constants/category-mocks';
import { TUSS_POR_TERAPIA } from '../constants/tuss-therapy-codes';
import {
  type FormData,
  type TerapiaProcedimento,
  type SadtProcedimento,
  type ExamsProcedimento,
  type HomeCareItem,
} from '../types';

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
  sadtProcedimentos: [newSadtProcedimento()],
  examsProcedimentos: [newExamsProcedimento()],
  homeCareProcedimentos: [newHomeCareItem()],
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
    cidSecundarioInput,
    setCidSecundarioInput,
    addCidSecundario,
    removeCidSecundario,
    resetForm,
    isManualEntry,
    setIsManualEntry,
  };
}
