import { type ChecklistItem } from '@/types/pedido';

// ── Grupos compartilhados entre catálogos de checklist ─────────────────
export type ChecklistGroup =
  | 'identificacao'
  | 'diagnostico'
  | 'solicitante'
  | 'prestador'
  | 'procedimento'
  | 'historico'
  | 'regulatorio';

export const CHECKLIST_GROUP_LABELS: Record<ChecklistGroup, string> = {
  identificacao: 'Identificação e elegibilidade',
  diagnostico: 'Diagnóstico e laudo',
  solicitante: 'Solicitante e responsabilidade técnica',
  prestador: 'Prestador executante',
  procedimento: 'Procedimento e adequação clínica',
  historico: 'Histórico e frequência',
  regulatorio: 'Regulatório',
};

const ID_GROUP_MAP: Record<string, ChecklistGroup> = {
  // Identificação
  BENEF_ELEGIBILIDADE: 'identificacao',
  BENEF_CARENCIA_ATIVA: 'identificacao',
  BENEF_INADIMPLENCIA: 'identificacao',
  BENEF_NIP_ATIVA: 'identificacao',
  BENEF_PLANO_REGULAMENTADO: 'identificacao',
  // Diagnóstico
  CID_CONFIRMADO_LAUDO: 'diagnostico',
  LAUDO_NEURO_VIGENCIA: 'diagnostico',
  LAUDO_COMPLETO: 'diagnostico',
  CID_DIVERGENCIA_PRESTADOR_LAUDO: 'diagnostico',
  CID_SECUNDARIO_RELEVANTE: 'diagnostico',
  HIPOTESE_DIAGNOSTICA: 'diagnostico',
  PEDIDO_MEDICO_ASSINADO: 'diagnostico',
  // Solicitante
  CRM_VALIDADO: 'solicitante',
  CRM_ATIVO: 'solicitante',
  CBO_COMPATIVEL: 'solicitante',
  // Prestador
  PRESTADOR_CREDENCIADO: 'prestador',
  PRESTADOR_HABILITADO: 'prestador',
  PRESTADOR_QUADRO_PROFISSIONAL: 'prestador',
  PRESTADOR_AUTORIZADO_DOMICILIAR: 'prestador',
  // Procedimento
  PROCEDIMENTO_ROL_ANS: 'procedimento',
  TUSS_VALIDO: 'procedimento',
  TUSS_CID_COMPATIVEL: 'procedimento',
  DUT_APLICAVEL: 'procedimento',
  DUT_CRITERIOS_ATENDIDOS: 'procedimento',
  PROTOCOLO_CLINICO: 'procedimento',
  PACOTE_RECONHECIDO: 'procedimento',
  PACOTE_TUSS_COMPOSICAO: 'procedimento',
  JUSTIFICATIVA_TECNICA_AC: 'procedimento',
  REGIAO_ANATOMICA_PERTINENTE: 'procedimento',
  PLANO_CUIDADOS_DETALHADO: 'procedimento',
  // Histórico
  ALTA_UTILIZACAO_MES: 'historico',
  RELATORIO_EVOLUCAO_AUSENTE: 'historico',
  RELATORIO_EXECUTANTE: 'historico',
  QUANTIDADE_ACIMA_PROTOCOLO: 'historico',
  SOLICITACAO_DUPLICADA: 'historico',
  JUNTA_MEDICA_INDICADA: 'historico',
  EXAMES_ANTERIORES_REGISTRADOS: 'historico',
  CICLO_ANTERIOR_REGISTRADO: 'historico',
  // Regulatório
  RN_539_APLICAVEL: 'regulatorio',
  IN_40_APLICAVEL: 'regulatorio',
  RN_566_APLICAVEL: 'regulatorio',
};

export function getChecklistGroup(id: string | undefined): ChecklistGroup {
  if (!id) return 'procedimento';
  return ID_GROUP_MAP[id] ?? 'procedimento';
}

// ── Cenário compartilhado entre catálogos ──────────────────────────────
export interface BaseScenario {
  // Beneficiário
  carencia?: boolean;
  inadimplencia?: boolean;
  nipAtiva?: boolean;
  planoNaoRegulamentado?: boolean;
  // Solicitante
  crmInvalid?: boolean;
  crmInactive?: boolean;
  cboIncompativel?: boolean;
  // Prestador
  prestadorNaoCredenciado?: boolean;
  prestadorNaoHabilitado?: boolean;
  quadroProfissional?: boolean;
  // Procedimento (genérico)
  procedureRolAnsOut?: boolean;
  procedureRolAnsOutName?: string;
  tussInvalido?: boolean;
  tussCidMismatch?: boolean;
}

// ── Helpers compartilhados (R-M2-03) ───────────────────────────────────
function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

export function pushBeneficiaryEligibility(items: ChecklistItem[], s: BaseScenario): void {
  const benefIneligible = s.carencia === true || s.inadimplencia === true;
  add(items, {
    id: 'BENEF_ELEGIBILIDADE',
    texto: benefIneligible
      ? 'Beneficiário inelegível (carência ou inadimplência)'
      : 'Beneficiário elegível — sem carência, sem inadimplência',
    status: benefIneligible ? 'error' : 'ok',
    origin: 'dados',
    severity: benefIneligible ? 95 : undefined,
    showWhenOk: false,
  });
  if (s.carencia)
    add(items, {
      id: 'BENEF_CARENCIA_ATIVA',
      texto: 'Beneficiário em período de carência',
      status: 'error',
      origin: 'dados',
      severity: 95,
    });
  if (s.inadimplencia)
    add(items, {
      id: 'BENEF_INADIMPLENCIA',
      texto: 'Beneficiário em inadimplência',
      status: 'error',
      origin: 'dados',
      severity: 90,
    });
  if (s.nipAtiva)
    add(items, {
      id: 'BENEF_NIP_ATIVA',
      texto: 'NIP ativa para este beneficiário',
      status: 'error',
      origin: 'dados',
      severity: 85,
    });
  add(items, {
    id: 'BENEF_PLANO_REGULAMENTADO',
    texto: s.planoNaoRegulamentado
      ? 'Plano não regulamentado — cobertura limitada ao contrato'
      : 'Plano regulamentado — cobertura padrão ANS',
    status: s.planoNaoRegulamentado ? 'warning' : 'ok',
    origin: 'dados',
    severity: s.planoNaoRegulamentado ? 60 : undefined,
    showWhenOk: false,
  });
}

export function pushSolicitante(items: ChecklistItem[], s: BaseScenario): void {
  add(items, {
    id: 'CRM_VALIDADO',
    texto: s.crmInvalid
      ? 'CRM médico inválido ou não localizado no CFM'
      : 'CRM médico validado no CFM',
    status: s.crmInvalid ? 'error' : 'ok',
    origin: 'dados',
    severity: s.crmInvalid ? 100 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'CRM_ATIVO',
    texto: s.crmInactive ? 'CRM suspenso ou inativo' : 'CRM ativo no CFM',
    status: s.crmInactive ? 'error' : 'ok',
    origin: 'dados',
    severity: s.crmInactive ? 100 : undefined,
    showWhenOk: false,
  });
  if (s.cboIncompativel)
    add(items, {
      id: 'CBO_COMPATIVEL',
      texto: 'CBO do solicitante incompatível com o procedimento',
      status: 'warning',
      origin: 'dados',
      severity: 70,
    });
}

export function pushPrestador(items: ChecklistItem[], s: BaseScenario): void {
  add(items, {
    id: 'PRESTADOR_CREDENCIADO',
    texto: s.prestadorNaoCredenciado
      ? 'Prestador não credenciado na rede'
      : 'Prestador credenciado na rede',
    status: s.prestadorNaoCredenciado ? 'error' : 'ok',
    origin: 'dados',
    severity: s.prestadorNaoCredenciado ? 100 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'PRESTADOR_HABILITADO',
    texto: s.prestadorNaoHabilitado
      ? 'Prestador não habilitado para executar o procedimento (CNES)'
      : 'Prestador habilitado para executar o procedimento (CNES)',
    status: s.prestadorNaoHabilitado ? 'error' : 'ok',
    origin: 'dados',
    severity: s.prestadorNaoHabilitado ? 100 : undefined,
    showWhenOk: false,
  });
  if (s.quadroProfissional)
    add(items, {
      id: 'PRESTADOR_QUADRO_PROFISSIONAL',
      texto: 'Quadro profissional do prestador não cobre a modalidade solicitada',
      status: 'error',
      origin: 'dados',
      severity: 95,
    });
}

export function pushProcedimentoBase(items: ChecklistItem[], s: BaseScenario): void {
  add(items, {
    id: 'PROCEDIMENTO_ROL_ANS',
    texto: s.procedureRolAnsOut
      ? `Procedimento fora do Rol da ANS${s.procedureRolAnsOutName ? ` (${s.procedureRolAnsOutName})` : ''}`
      : 'Procedimento dentro do Rol da ANS',
    status: s.procedureRolAnsOut ? 'error' : 'ok',
    origin: 'engenharia',
    severity: s.procedureRolAnsOut ? 100 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'TUSS_VALIDO',
    texto: s.tussInvalido ? 'Código TUSS inválido ou não encontrado' : 'Código TUSS válido',
    status: s.tussInvalido ? 'error' : 'ok',
    origin: 'engenharia',
    severity: s.tussInvalido ? 95 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'TUSS_CID_COMPATIVEL',
    texto: s.tussCidMismatch
      ? 'Código TUSS não compatível com o CID informado'
      : 'Código TUSS compatível com o CID informado',
    status: s.tussCidMismatch ? 'error' : 'ok',
    origin: 'ia',
    severity: s.tussCidMismatch ? 85 : undefined,
    showWhenOk: false,
  });
}
