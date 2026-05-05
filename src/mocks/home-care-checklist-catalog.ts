import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface HomeCareChecklistScenario extends BaseScenario {
  cid?: string;
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  pedidoMedicoAusente?: boolean;
  planoCuidadosAusente?: boolean;
  prestadorAutorizadoDomiciliar?: boolean;
  cicloAnteriorRegistrado?: boolean;
  hasEvolutionReport?: boolean;
  juntaIndicada?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushDiagnosticoHomeCare(items: ChecklistItem[], s: HomeCareChecklistScenario): void {
  add(items, {
    id: 'PEDIDO_MEDICO_ASSINADO',
    texto: s.pedidoMedicoAusente
      ? 'Pedido médico ausente, ilegível ou sem assinatura'
      : 'Pedido médico assinado e legível',
    status: s.pedidoMedicoAusente ? 'error' : 'ok',
    origin: 'ia',
    severity: s.pedidoMedicoAusente ? 95 : undefined,
    showWhenOk: true,
  });
}

function pushPrestadorHomeCare(items: ChecklistItem[], s: HomeCareChecklistScenario): void {
  if (s.prestadorAutorizadoDomiciliar === false)
    add(items, {
      id: 'PRESTADOR_AUTORIZADO_DOMICILIAR',
      texto: 'Prestador não credenciado para atendimento domiciliar',
      status: 'error',
      origin: 'dados',
      severity: 95,
    });
}

function pushProcedimentoHomeCare(items: ChecklistItem[], s: HomeCareChecklistScenario): void {
  add(items, {
    id: 'PLANO_CUIDADOS_DETALHADO',
    texto: s.planoCuidadosAusente
      ? 'Plano de cuidados domiciliares ausente ou incompleto'
      : 'Plano de cuidados detalhado — equipe, frequência e duração definidos',
    status: s.planoCuidadosAusente ? 'error' : 'ok',
    origin: 'ia',
    severity: s.planoCuidadosAusente ? 90 : undefined,
    showWhenOk: true,
  });
}

function pushHistoricoHomeCare(items: ChecklistItem[], s: HomeCareChecklistScenario): void {
  if (s.authorizationStage === 'continuidade') {
    add(items, {
      id: 'CICLO_ANTERIOR_REGISTRADO',
      texto: s.cicloAnteriorRegistrado
        ? 'Ciclo anterior de Home Care registrado — renovação rastreável'
        : 'Ciclo anterior não localizado — verificar histórico',
      status: s.cicloAnteriorRegistrado ? 'ok' : 'warning',
      origin: 'dados',
      severity: s.cicloAnteriorRegistrado ? undefined : 70,
      showWhenOk: false,
    });
    add(items, {
      id: 'RELATORIO_EVOLUCAO_AUSENTE',
      texto: s.hasEvolutionReport
        ? 'Relatório de evolução do ciclo anterior anexado'
        : 'Relatório de evolução do ciclo anterior ausente',
      status: s.hasEvolutionReport ? 'ok' : 'error',
      origin: 'ia',
      severity: s.hasEvolutionReport ? undefined : 90,
      showWhenOk: true,
    });
  }
  if (s.juntaIndicada)
    add(items, {
      id: 'JUNTA_MEDICA_INDICADA',
      texto: 'Caso sugere encaminhamento para junta médica',
      status: 'warning',
      origin: 'ia',
      severity: 70,
    });
}

function pushRegulatorioHomeCare(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 aplicável — prazo padrão de resposta',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildHomeCareChecklist(s: HomeCareChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushDiagnosticoHomeCare(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushPrestadorHomeCare(items, s);
  pushProcedimentoBase(items, s);
  pushProcedimentoHomeCare(items, s);
  pushHistoricoHomeCare(items, s);
  pushRegulatorioHomeCare(items);
  return items;
}
