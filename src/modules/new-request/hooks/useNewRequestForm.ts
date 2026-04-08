'use client'

import { useState } from 'react'
import { type FormData, type TerapiaProcedimento } from '../types'
import { TUSS_POR_TERAPIA } from '../constants/tuss-therapy-codes'

const newTerapiaProc = (base?: Partial<TerapiaProcedimento>): TerapiaProcedimento => ({
  id: crypto.randomUUID(),
  tipoTerapia: '',
  codigoTUSS: '',
  numeroSessoes: '',
  dataInicio: base?.dataInicio ?? '',
  dataTermino: base?.dataTermino ?? '',
  frequenciaSemanal: '3x por semana',
  duracaoSessao: '50',
})

export const initialForm: FormData = {
  tipoSolicitacao: '',
  nomeBeneficiario: 'Maria Silva Santos',
  carteirinha: '1234567890123456',
  dataNascimento: '1956-03-15',
  cpf: '',
  operadora: 'Bradesco Saúde',
  validadeCarteirinha: '',
  cidPrincipal: 'M17.1 - Gonartrose primária bilateral',
  cidsSecundarios: [],
  caraterAtendimento: 'Eletivo',
  medicoSolicitante: 'Dr. João Oliveira',
  crm: 'CRM/SP 123456',
  indicacaoClinica: 'Paciente com gonartrose primária bilateral com indicação funcional e dor intensa ao deambular e repouso, sem resposta ao tratamento conservador.',
  prestador: '',
  cnpjPrestador: '',
  tipoAcomodacao: 'Apartamento',
  qtdDiarias: '3',
  dataInternacao: '',
  regimeInternacao: 'Hospitalar',
  classificacaoRisco: 'amarelo',
  tipoAtendimento: 'Urgência',
  queixaPrincipal: '',
  estadiamentoTNM: '',
  numeroCiclo: '',
  protocoloQuimio: '',
  tipoTratamento: 'Quimioterapia',
  totalCiclos: '',
  etapaAutorizacao: '',
  tipoTerapia: 'Fisioterapia',
  codigoTuss: TUSS_POR_TERAPIA['Fisioterapia'] ?? '',
  numSessoes: '',
  terapiaDataInicio: '',
  terapiaDataTermino: '',
  frequenciaSemanal: '3x por semana',
  duracaoSessao: '50',
  materiais: [{ codigo: '', descricao: '', fabricante: '', qtd: '1', valor: '' }],
  registroAnvisa: '',
  fabricanteMaterial: '',
  justificativaTecnica: '',
  cotacoes: [{ fornecedor: '', valor: '' }, { fornecedor: '', valor: '' }, { fornecedor: '', valor: '' }],
  exames: [{ codigoTUSS: '', descricao: '', tipo: '', qtd: '1' }],
  procedimentos: [{ codigoTUSS: '30719138', descricao: 'Artroplastia total do joelho', qtd: '1' }],
  opme: [{ codigoTUSS: '93000007', descricao: 'Prótese total joelho, não cimentada', fabricante: '', qtd: '1', valorUnit: '' }],
  modalidadeHomeCare: 'AD2',
  periodoSolicitado: '',
  cuidadosNecessarios: '',
}

export function useNewRequestForm(moduloParam: string) {
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    tipoSolicitacao: (moduloParam || '') as FormData['tipoSolicitacao'],
  })

  const [terapiaProcedimentos, setTerapiaProcedimentos] = useState<TerapiaProcedimento[]>([newTerapiaProc()])
  const [cidSecundarioInput, setCidSecundarioInput] = useState('')

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const setSelect = (field: keyof FormData) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleAddTerapiaProc = () => {
    if (terapiaProcedimentos.length >= 5) return
    const first = terapiaProcedimentos[0]
    setTerapiaProcedimentos(prev => [...prev, newTerapiaProc({ dataInicio: first?.dataInicio, dataTermino: first?.dataTermino })])
  }

  const handleRemoveTerapiaProc = (id: string) => {
    if (terapiaProcedimentos.length <= 1) return
    setTerapiaProcedimentos(prev => prev.filter(p => p.id !== id))
  }

  const handleUpdateTerapiaProc = (id: string, field: keyof Omit<TerapiaProcedimento, 'id'>, value: string) => {
    setTerapiaProcedimentos(prev => prev.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, [field]: value }
      if (field === 'tipoTerapia') updated.codigoTUSS = TUSS_POR_TERAPIA[value] ?? p.codigoTUSS
      return updated
    }))
  }

  const addCidSecundario = (cid: string) => {
    if (!cid.trim()) return
    setForm(f => ({ ...f, cidsSecundarios: [...f.cidsSecundarios, cid.trim()] }))
    setCidSecundarioInput('')
  }

  const removeCidSecundario = (index: number) => {
    setForm(f => ({ ...f, cidsSecundarios: f.cidsSecundarios.filter((_, i) => i !== index) }))
  }

  const resetForm = (moduloParamValue: string) => {
    setForm({ ...initialForm, tipoSolicitacao: (moduloParamValue || '') as FormData['tipoSolicitacao'] })
    setTerapiaProcedimentos([newTerapiaProc()])
    setCidSecundarioInput('')
  }

  return {
    form,
    setForm,
    set,
    setSelect,
    terapiaProcedimentos,
    handleAddTerapiaProc,
    handleRemoveTerapiaProc,
    handleUpdateTerapiaProc,
    cidSecundarioInput,
    setCidSecundarioInput,
    addCidSecundario,
    removeCidSecundario,
    resetForm,
  }
}
