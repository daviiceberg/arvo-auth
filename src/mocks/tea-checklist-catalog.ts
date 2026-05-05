import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

// Re-export para back-compat com consumidores antigos.
export { CHECKLIST_GROUP_LABELS, type ChecklistGroup, getChecklistGroup } from './checklist-base';

export interface TeaChecklistScenario extends BaseScenario {
  cid?: string;
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  hasEvolutionReport?: boolean;
  laudoVencido?: boolean;
  laudoIncompleto?: boolean;
  cidDivergence?: boolean;
  cidNaoConfirmadoLaudo?: boolean;
  secondaryCids?: string[];
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

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
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
  pushBeneficiaryEligibility(items, s);
  pushDiagnostico(items, s, cid);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushDutAndPacote(items, s);
  pushHistorico(items, s);
  pushRegulatorio(items, s, cid);
  return items;
}
