import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface ExamsChecklistScenario extends BaseScenario {
  cid?: string;
  pedidoMedicoAusente?: boolean;
  justificativaTecnicaAusente?: boolean;
  hipoteseDiagnosticaInsuficiente?: boolean;
  regiaoAnatomicaIncompativel?: boolean;
  examesAnterioresAusentes?: boolean;
  juntaIndicada?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushDiagnosticoExams(items: ChecklistItem[], s: ExamsChecklistScenario): void {
  add(items, {
    id: 'PEDIDO_MEDICO_ASSINADO',
    texto: s.pedidoMedicoAusente
      ? 'Pedido médico ausente, ilegível ou sem assinatura'
      : 'Pedido médico assinado e com indicação clínica explícita',
    status: s.pedidoMedicoAusente ? 'error' : 'ok',
    origin: 'ia',
    severity: s.pedidoMedicoAusente ? 95 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'JUSTIFICATIVA_TECNICA_AC',
    texto: s.justificativaTecnicaAusente
      ? 'Justificativa técnica ausente — exigida para alta complexidade'
      : 'Justificativa técnica presente — alta complexidade fundamentada',
    status: s.justificativaTecnicaAusente ? 'error' : 'ok',
    origin: 'ia',
    severity: s.justificativaTecnicaAusente ? 90 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'HIPOTESE_DIAGNOSTICA',
    texto: s.hipoteseDiagnosticaInsuficiente
      ? 'Hipótese diagnóstica genérica — exames AC exigem precisão'
      : 'Hipótese diagnóstica adequada ao exame solicitado',
    status: s.hipoteseDiagnosticaInsuficiente ? 'warning' : 'ok',
    origin: 'ia',
    severity: s.hipoteseDiagnosticaInsuficiente ? 75 : undefined,
    showWhenOk: false,
  });
}

function pushProcedimentoExams(items: ChecklistItem[], s: ExamsChecklistScenario): void {
  add(items, {
    id: 'REGIAO_ANATOMICA_PERTINENTE',
    texto: s.regiaoAnatomicaIncompativel
      ? 'Região anatômica solicitada não é pertinente à hipótese clínica'
      : 'Região anatômica coerente com a hipótese clínica',
    status: s.regiaoAnatomicaIncompativel ? 'warning' : 'ok',
    origin: 'ia',
    severity: s.regiaoAnatomicaIncompativel ? 80 : undefined,
    showWhenOk: false,
  });
}

function pushHistoricoExams(items: ChecklistItem[], s: ExamsChecklistScenario): void {
  add(items, {
    id: 'EXAMES_ANTERIORES_REGISTRADOS',
    texto: s.examesAnterioresAusentes
      ? 'Exames anteriores não anexados — dificulta avaliação de evolução'
      : 'Exames anteriores anexados',
    status: s.examesAnterioresAusentes ? 'warning' : 'ok',
    origin: 'dados',
    severity: s.examesAnterioresAusentes ? 60 : undefined,
    showWhenOk: false,
  });
  if (s.juntaIndicada)
    add(items, {
      id: 'JUNTA_MEDICA_INDICADA',
      texto: 'Caso sugere encaminhamento para junta médica (alta complexidade)',
      status: 'warning',
      origin: 'ia',
      severity: 75,
    });
}

function pushRegulatorioExams(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 aplicável — prazo de realização variável por procedimento',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildExamsChecklist(s: ExamsChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushDiagnosticoExams(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushProcedimentoExams(items, s);
  pushHistoricoExams(items, s);
  pushRegulatorioExams(items);
  return items;
}
