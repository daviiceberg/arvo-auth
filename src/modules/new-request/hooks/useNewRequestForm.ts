'use client';

import { useState } from 'react';

import { TUSS_POR_TERAPIA } from '../constants/tuss-therapy-codes';
import {
  type FormData,
  type TerapiaProcedimento,
  type SadtData,
  type ExamsData,
  type HomeCareData,
} from '../types';

const initialSadt: SadtData = {
  codigoTUSS: '',
  tipo: '',
  frequencia: '',
  quantidade: '',
};

const initialExams: ExamsData = {
  codigoTUSS: '',
  regiaoAnatomica: '',
  hipoteseDiagnostica: '',
  historicoExamesAnteriores: '',
};

const initialHomeCare: HomeCareData = {
  tipo: '',
  frequencia: '',
  duracaoDias: '',
  escalaCuidadores: '',
  equipamentos: '',
  enderecoAtendimento: '',
};

const newTerapiaProc = (base?: Partial<TerapiaProcedimento>): TerapiaProcedimento => ({
  id: crypto.randomUUID(),
  tipoTerapia: '',
  codigoTUSS: '',
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
  sadt: initialSadt,
  exams: initialExams,
  homeCare: initialHomeCare,
};

export function useNewRequestForm(categoryParam: string) {
  const [form, setForm] = useState({
    ...initialForm,
    category: (categoryParam || '') as FormData['category'],
  });

  const [terapiaProcedimentos, setTerapiaProcedimentos] = useState([newTerapiaProc()]);
  const [cidSecundarioInput, setCidSecundarioInput] = useState('');

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
    setForm((f) => ({ ...f, category: next }));
  };

  const setSadtField = <K extends keyof SadtData>(field: K, value: SadtData[K]) => {
    setForm((f) => ({ ...f, sadt: { ...f.sadt, [field]: value } }));
  };

  const setExamsField = <K extends keyof ExamsData>(field: K, value: ExamsData[K]) => {
    setForm((f) => ({ ...f, exams: { ...f.exams, [field]: value } }));
  };

  const setHomeCareField = <K extends keyof HomeCareData>(field: K, value: HomeCareData[K]) => {
    setForm((f) => ({ ...f, homeCare: { ...f.homeCare, [field]: value } }));
  };

  return {
    form,
    setForm,
    set,
    setSelect,
    setCategory,
    setSadtField,
    setExamsField,
    setHomeCareField,
    terapiaProcedimentos,
    handleAddTerapiaProc,
    handleRemoveTerapiaProc,
    handleUpdateTerapiaProc,
    cidSecundarioInput,
    setCidSecundarioInput,
    addCidSecundario,
    removeCidSecundario,
    resetForm,
  };
}
