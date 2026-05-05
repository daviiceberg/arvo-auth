import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface SadtChecklistScenario extends BaseScenario {
  cid?: string;
  pedidoMedicoAusente?: boolean;
  indicacaoClinicaInsuficiente?: boolean;
  altaUtilMes?: number;
  quantidadeAcima?: boolean;
  juntaIndicada?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushPedidoMedico(items: ChecklistItem[], s: SadtChecklistScenario): void {
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
  add(items, {
    id: 'HIPOTESE_DIAGNOSTICA',
    texto: s.indicacaoClinicaInsuficiente
      ? 'Indicação clínica insuficiente para justificar o procedimento'
      : 'Indicação clínica adequada ao procedimento solicitado',
    status: s.indicacaoClinicaInsuficiente ? 'warning' : 'ok',
    origin: 'ia',
    severity: s.indicacaoClinicaInsuficiente ? 70 : undefined,
    showWhenOk: false,
  });
}

function pushHistoricoSadt(items: ChecklistItem[], s: SadtChecklistScenario): void {
  if (typeof s.altaUtilMes === 'number')
    add(items, {
      id: 'ALTA_UTILIZACAO_MES',
      texto: `Alta utilização: ${String(s.altaUtilMes)} procedimentos SADT no mês`,
      status: 'warning',
      origin: 'dados',
      severity: 65,
    });
  if (s.quantidadeAcima)
    add(items, {
      id: 'QUANTIDADE_ACIMA_PROTOCOLO',
      texto: 'Quantidade solicitada acima do esperado para o procedimento',
      status: 'warning',
      origin: 'ia',
      severity: 70,
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

function pushRegulatorioSadt(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 aplicável — prazo de realização padrão',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildSadtChecklist(s: SadtChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushPedidoMedico(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushHistoricoSadt(items, s);
  pushRegulatorioSadt(items);
  return items;
}
