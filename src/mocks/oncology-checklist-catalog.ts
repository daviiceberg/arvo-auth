import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface OncologyChecklistScenario extends BaseScenario {
  cid?: string;
  protocoloReconhecido?: boolean;
  protocoloNome?: string;
  linhaCorreta?: boolean;
  cicloRegistrado?: boolean;
  estadiamentoLaudo?: boolean;
  dutAtende?: boolean;
  dutInconclusivo?: boolean;
  juntaOncologica?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushOncologyProtocol(items: ChecklistItem[], s: OncologyChecklistScenario): void {
  add(items, {
    id: 'PROTOCOLO_CLINICO',
    texto:
      s.protocoloReconhecido === false
        ? `Protocolo oncológico não reconhecido${s.protocoloNome ? ` (${s.protocoloNome})` : ''}`
        : `Protocolo oncológico reconhecido${s.protocoloNome ? ` (${s.protocoloNome})` : ''} — SBOC/NCCN`,
    status: s.protocoloReconhecido === false ? 'error' : 'ok',
    origin: 'ia',
    severity: s.protocoloReconhecido === false ? 90 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'CICLO_ANTERIOR_REGISTRADO',
    texto:
      s.cicloRegistrado === false
        ? 'Ciclo anterior não registrado — risco de duplicidade'
        : 'Histórico de ciclos anteriores registrado',
    status: s.cicloRegistrado === false ? 'warning' : 'ok',
    origin: 'dados',
    severity: s.cicloRegistrado === false ? 70 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'EXAMES_ANTERIORES_REGISTRADOS',
    texto:
      s.estadiamentoLaudo === false
        ? 'Estadiamento TNM ausente no laudo oncológico'
        : 'Estadiamento TNM presente no laudo',
    status: s.estadiamentoLaudo === false ? 'error' : 'ok',
    origin: 'ia',
    severity: s.estadiamentoLaudo === false ? 85 : undefined,
    showWhenOk: false,
  });
}

function pushOncologyDut(items: ChecklistItem[], s: OncologyChecklistScenario): void {
  if (s.dutInconclusivo === true) {
    add(items, {
      id: 'DUT_CRITERIOS_ATENDIDOS',
      texto: 'DUT do protocolo: critérios inconclusivos — exige análise manual',
      status: 'warning',
      origin: 'engenharia',
      severity: 75,
    });
    return;
  }
  add(items, {
    id: 'DUT_CRITERIOS_ATENDIDOS',
    texto:
      s.dutAtende === false
        ? 'DUT do protocolo: critérios não atendidos'
        : 'DUT do protocolo: critérios atendidos',
    status: s.dutAtende === false ? 'error' : 'ok',
    origin: 'engenharia',
    severity: s.dutAtende === false ? 90 : undefined,
    showWhenOk: false,
  });
}

function pushOncologyJunta(items: ChecklistItem[], s: OncologyChecklistScenario): void {
  if (s.juntaOncologica)
    add(items, {
      id: 'JUNTA_MEDICA_INDICADA',
      texto: 'Caso sugere parecer de junta oncológica multidisciplinar',
      status: 'warning',
      origin: 'ia',
      severity: 75,
    });
}

function pushOncologyRegulatory(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 — prazo máximo de realização: 10 dias úteis',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildOncologyChecklist(s: OncologyChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushOncologyProtocol(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushOncologyDut(items, s);
  pushOncologyJunta(items, s);
  pushOncologyRegulatory(items);
  return items;
}
