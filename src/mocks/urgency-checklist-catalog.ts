import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface UrgencyChecklistScenario extends BaseScenario {
  cid?: string;
  cidObrigatorioAusente?: boolean;
  justificativaInsuficiente?: boolean;
  protocoloUrgenciaAplicavel?: boolean;
  bypassCarencia?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushUrgencyClinical(items: ChecklistItem[], s: UrgencyChecklistScenario): void {
  add(items, {
    id: 'CID_CONFIRMADO_LAUDO',
    texto: s.cidObrigatorioAusente
      ? 'CID ausente — obrigatório em U/E para configurar quadro'
      : `CID ${s.cid ?? 'informado'} confirmado no laudo`,
    status: s.cidObrigatorioAusente ? 'error' : 'ok',
    origin: 'ia',
    severity: s.cidObrigatorioAusente ? 100 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'JUSTIFICATIVA_TECNICA_AC',
    texto: s.justificativaInsuficiente
      ? 'Justificativa clínica do quadro de urgência insuficiente'
      : 'Justificativa clínica do quadro de urgência registrada',
    status: s.justificativaInsuficiente ? 'warning' : 'ok',
    origin: 'ia',
    severity: s.justificativaInsuficiente ? 75 : undefined,
    showWhenOk: false,
  });
}

function pushUrgencyRegulatory(items: ChecklistItem[], s: UrgencyChecklistScenario): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 art. 3º — atendimento imediato (≤2h), sem autorização prévia',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: true,
  });
  if (s.bypassCarencia)
    add(items, {
      id: 'BENEF_CARENCIA_ATIVA',
      texto: 'Carência reduzida a 24h em U/E (RN 195/2009 art. 11) — cobertura mantida',
      status: 'ok',
      origin: 'engenharia',
      severity: undefined,
      showWhenOk: true,
    });
  if (s.protocoloUrgenciaAplicavel)
    add(items, {
      id: 'PROTOCOLO_CLINICO',
      texto: 'Protocolo de triagem de urgência aplicável (Manchester/ESI)',
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
}

export function buildUrgencyChecklist(s: UrgencyChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushUrgencyClinical(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushUrgencyRegulatory(items, s);
  return items;
}
