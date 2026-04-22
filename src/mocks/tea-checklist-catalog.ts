import { type ChecklistItem } from '@/types/pedido';

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
  BENEF_ELEGIBILIDADE: 'identificacao',
  BENEF_CARENCIA_ATIVA: 'identificacao',
  BENEF_INADIMPLENCIA: 'identificacao',
  BENEF_NIP_ATIVA: 'identificacao',
  BENEF_PLANO_REGULAMENTADO: 'identificacao',
  CID_CONFIRMADO_LAUDO: 'diagnostico',
  LAUDO_NEURO_VIGENCIA: 'diagnostico',
  LAUDO_COMPLETO: 'diagnostico',
  CID_DIVERGENCIA_PRESTADOR_LAUDO: 'diagnostico',
  CID_SECUNDARIO_RELEVANTE: 'diagnostico',
  CRM_VALIDADO: 'solicitante',
  CRM_ATIVO: 'solicitante',
  CBO_COMPATIVEL: 'solicitante',
  PRESTADOR_CREDENCIADO: 'prestador',
  PRESTADOR_HABILITADO: 'prestador',
  PRESTADOR_QUADRO_PROFISSIONAL: 'prestador',
  PROCEDIMENTO_ROL_ANS: 'procedimento',
  TUSS_VALIDO: 'procedimento',
  TUSS_CID_COMPATIVEL: 'procedimento',
  DUT_APLICAVEL: 'procedimento',
  DUT_CRITERIOS_ATENDIDOS: 'procedimento',
  PROTOCOLO_CLINICO: 'procedimento',
  PACOTE_RECONHECIDO: 'procedimento',
  PACOTE_TUSS_COMPOSICAO: 'procedimento',
  ALTA_UTILIZACAO_MES: 'historico',
  RELATORIO_EVOLUCAO_AUSENTE: 'historico',
  RELATORIO_EXECUTANTE: 'historico',
  QUANTIDADE_ACIMA_PROTOCOLO: 'historico',
  SOLICITACAO_DUPLICADA: 'historico',
  JUNTA_MEDICA_INDICADA: 'historico',
  RN_539_APLICAVEL: 'regulatorio',
  IN_40_APLICAVEL: 'regulatorio',
};

export function getChecklistGroup(id: string | undefined): ChecklistGroup {
  if (!id) return 'procedimento';
  return ID_GROUP_MAP[id] ?? 'procedimento';
}

export interface TeaChecklistScenario {
  cid?: string;
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  hasEvolutionReport?: boolean;
  crmInvalid?: boolean;
  crmInactive?: boolean;
  laudoVencido?: boolean;
  laudoIncompleto?: boolean;
  carencia?: boolean;
  inadimplencia?: boolean;
  nipAtiva?: boolean;
  planoNaoRegulamentado?: boolean;
  cidDivergence?: boolean;
  cidNaoConfirmadoLaudo?: boolean;
  secondaryCids?: string[];
  cboIncompativel?: boolean;
  prestadorNaoCredenciado?: boolean;
  prestadorNaoHabilitado?: boolean;
  quadroProfissional?: boolean;
  procedureRolAnsOut?: boolean;
  procedureRolAnsOutName?: string;
  tussInvalido?: boolean;
  tussCidMismatch?: boolean;
  dutApplicable?: { number: number; label: string } | null;
  dutCriteriosOk?: boolean;
  protocoloForaRecomendado?: boolean;
  isPacote?: { code: string; tussCount: number } | null;
  altaUtilMes?: number;
  quantidadeAcima?: boolean;
  solicitacaoDuplicada?: boolean;
  juntaIndicada?: boolean;
  in40Aplicavel?: boolean;
  dutCriteriosDetail?: string;
}

function add(
  items: ChecklistItem[],
  item: ChecklistItem & { id: string; origin: NonNullable<ChecklistItem['origin']> },
): void {
  items.push(item);
}

function pushIdentificacao(items: ChecklistItem[], s: TeaChecklistScenario): void {
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

function pushDiagnostico(items: ChecklistItem[], s: TeaChecklistScenario, cid: string): void {
  const cidOk = !s.cidNaoConfirmadoLaudo;
  add(items, {
    id: 'CID_CONFIRMADO_LAUDO',
    texto: cidOk
      ? `Diagnóstico CID ${cid} confirmado por laudo`
      : `CID ${cid} não confirmado no laudo`,
    status: cidOk ? 'ok' : 'error',
    origin: 'ia',
    severity: cidOk ? undefined : 100,
    showWhenOk: true,
  });
  add(items, {
    id: 'LAUDO_NEURO_VIGENCIA',
    texto: s.laudoVencido
      ? 'Laudo neuropsicológico vencido (>12 meses)'
      : 'Laudo neuropsicológico em vigência (<12 meses)',
    status: s.laudoVencido ? 'error' : 'ok',
    origin: 'ia',
    severity: s.laudoVencido ? 100 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'LAUDO_COMPLETO',
    texto: s.laudoIncompleto
      ? 'Laudo incompleto — falta assinatura, data ou identificação do profissional'
      : 'Laudo completo — assinatura, data e identificação presentes',
    status: s.laudoIncompleto ? 'error' : 'ok',
    origin: 'ia',
    severity: s.laudoIncompleto ? 85 : undefined,
    showWhenOk: false,
  });
  if (s.cidDivergence)
    add(items, {
      id: 'CID_DIVERGENCIA_PRESTADOR_LAUDO',
      texto: 'CID informado pelo prestador diverge do laudo',
      status: 'error',
      origin: 'ia',
      severity: 90,
    });
  if (s.secondaryCids && s.secondaryCids.length > 0)
    add(items, {
      id: 'CID_SECUNDARIO_RELEVANTE',
      texto: `CIDs secundários identificados no laudo: ${s.secondaryCids.join(', ')}`,
      status: 'ok',
      origin: 'ia',
      severity: 40,
      showWhenOk: true,
    });
}

function pushSolicitante(items: ChecklistItem[], s: TeaChecklistScenario): void {
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

function pushPrestador(items: ChecklistItem[], s: TeaChecklistScenario): void {
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

function pushDutAndPacote(items: ChecklistItem[], s: TeaChecklistScenario): void {
  if (s.dutApplicable)
    add(items, {
      id: 'DUT_APLICAVEL',
      texto: `DUT aplicável identificada: DUT ${String(s.dutApplicable.number)} — ${s.dutApplicable.label}`,
      status: 'ok',
      origin: 'engenharia',
      severity: 50,
      showWhenOk: true,
    });
  if (s.dutCriteriosOk === false)
    add(items, {
      id: 'DUT_CRITERIOS_ATENDIDOS',
      texto: s.dutCriteriosDetail
        ? `Critérios da DUT não atendidos: ${s.dutCriteriosDetail}`
        : 'Critérios da DUT não atendidos',
      status: 'error',
      origin: 'ia',
      severity: 90,
    });
  if (s.protocoloForaRecomendado)
    add(items, {
      id: 'PROTOCOLO_CLINICO',
      texto: 'Protocolo/intervenção fora do recomendado para o quadro',
      status: 'warning',
      origin: 'ia',
      severity: 75,
    });
  if (s.isPacote) {
    add(items, {
      id: 'PACOTE_RECONHECIDO',
      texto: `Código de pacote ${s.isPacote.code} registrado na operadora`,
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: false,
    });
    add(items, {
      id: 'PACOTE_TUSS_COMPOSICAO',
      texto: `${String(s.isPacote.tussCount)} códigos TUSS identificados no pacote`,
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
  }
}

function pushProcedimento(items: ChecklistItem[], s: TeaChecklistScenario): void {
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
  pushDutAndPacote(items, s);
}

function pushHistorico(items: ChecklistItem[], s: TeaChecklistScenario): void {
  if (s.authorizationStage === 'continuidade') {
    add(items, {
      id: 'RELATORIO_EVOLUCAO_AUSENTE',
      texto: s.hasEvolutionReport
        ? 'Relatório de Evolução Terapêutica anexado'
        : 'Relatório de Evolução Terapêutica ausente para renovação',
      status: s.hasEvolutionReport ? 'ok' : 'error',
      origin: 'ia',
      severity: s.hasEvolutionReport ? undefined : 95,
      showWhenOk: true,
    });
    add(items, {
      id: 'RELATORIO_EXECUTANTE',
      texto: s.hasEvolutionReport
        ? 'Relatório emitido pelo profissional executante'
        : 'Emissão pelo profissional executante não confirmada',
      status: s.hasEvolutionReport ? 'ok' : 'warning',
      origin: 'ia',
      severity: s.hasEvolutionReport ? undefined : 80,
      showWhenOk: false,
    });
  }
  if (typeof s.altaUtilMes === 'number')
    add(items, {
      id: 'ALTA_UTILIZACAO_MES',
      texto: `Alta utilização: ${String(s.altaUtilMes)} sessões no mês — acima da média`,
      status: 'warning',
      origin: 'dados',
      severity: 70,
    });
  if (s.quantidadeAcima)
    add(items, {
      id: 'QUANTIDADE_ACIMA_PROTOCOLO',
      texto: 'Quantidade solicitada acima do protocolo',
      status: 'warning',
      origin: 'ia',
      severity: 75,
    });
  if (s.solicitacaoDuplicada)
    add(items, {
      id: 'SOLICITACAO_DUPLICADA',
      texto: 'Possível solicitação duplicada no mês',
      status: 'warning',
      origin: 'dados',
      severity: 85,
    });
  if (s.juntaIndicada)
    add(items, {
      id: 'JUNTA_MEDICA_INDICADA',
      texto: 'Caso sugere encaminhamento para junta médica',
      status: 'warning',
      origin: 'ia',
      severity: 70,
    });
}

function pushRegulatorio(items: ChecklistItem[], s: TeaChecklistScenario, cid: string): void {
  if (cid.startsWith('F84'))
    add(items, {
      id: 'RN_539_APLICAVEL',
      texto: 'RN 539/2022 aplicável — sessões ilimitadas para CID F84.x',
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
  if (s.in40Aplicavel)
    add(items, {
      id: 'IN_40_APLICAVEL',
      texto: 'IN 40 (Rol exemplificativo) aplicável — validação adicional requerida',
      status: 'warning',
      origin: 'engenharia',
      severity: 60,
    });
}

export function buildTeaChecklist(s: TeaChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const cid = s.cid ?? 'F84.0';
  pushIdentificacao(items, s);
  pushDiagnostico(items, s, cid);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimento(items, s);
  pushHistorico(items, s);
  pushRegulatorio(items, s, cid);
  return items;
}
