import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface CirurgiasChecklistScenario extends BaseScenario {
  cid?: string;
  preOpCompleto?: boolean;
  preOpItensPendentes?: number;
  avaliacaoPreAnestesicaAusente?: boolean;
  planoCirurgicoIncompleto?: boolean;
  procedimentoPrincipalCodificado?: boolean;
  acessoriosCoerentes?: boolean;
  opmeIntegrado?: boolean;
  oncologiaVinculada?: boolean;
  pacoteCirurgicoReconhecido?: boolean;
  pacoteCirurgicoNome?: string;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushCirurgiasPreOp(items: ChecklistItem[], s: CirurgiasChecklistScenario): void {
  const pendentes = s.preOpItensPendentes ?? 0;
  add(items, {
    id: 'PRE_OP_COMPLETUDE',
    texto:
      s.preOpCompleto === false
        ? `Pré-operatório incompleto: ${String(pendentes)} item(ns) obrigatório(s) pendente(s)`
        : 'Pré-operatório completo (exames, avaliações e consultas)',
    status: s.preOpCompleto === false ? 'error' : 'ok',
    origin: 'dados',
    severity: s.preOpCompleto === false ? 90 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'PRE_OP_AVALIACAO_PRE_ANESTESICA',
    texto:
      s.avaliacaoPreAnestesicaAusente === true
        ? 'Avaliação pré-anestésica ausente ou desatualizada'
        : 'Avaliação pré-anestésica realizada',
    status: s.avaliacaoPreAnestesicaAusente === true ? 'error' : 'ok',
    origin: 'dados',
    severity: s.avaliacaoPreAnestesicaAusente === true ? 95 : undefined,
    showWhenOk: false,
  });
}

function pushCirurgiasPlano(items: ChecklistItem[], s: CirurgiasChecklistScenario): void {
  add(items, {
    id: 'PLANO_CIRURGICO_DETALHADO',
    texto:
      s.planoCirurgicoIncompleto === true
        ? 'Plano cirúrgico incompleto — falta procedimento principal ou tempo estimado'
        : 'Plano cirúrgico detalhado (principal + acessórios + tempo estimado)',
    status: s.planoCirurgicoIncompleto === true ? 'error' : 'ok',
    origin: 'ia',
    severity: s.planoCirurgicoIncompleto === true ? 85 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'PROCEDIMENTO_PRINCIPAL_CODIFICADO',
    texto:
      s.procedimentoPrincipalCodificado === false
        ? 'Procedimento principal sem código TUSS válido'
        : 'Procedimento principal codificado (TUSS válido)',
    status: s.procedimentoPrincipalCodificado === false ? 'error' : 'ok',
    origin: 'engenharia',
    severity: s.procedimentoPrincipalCodificado === false ? 90 : undefined,
    showWhenOk: false,
  });
  if (s.acessoriosCoerentes === false)
    add(items, {
      id: 'ACESSORIOS_COERENTES',
      texto: 'Procedimentos acessórios não coerentes com principal — revisar plano',
      status: 'warning',
      origin: 'ia',
      severity: 65,
    });
}

function pushCirurgiasIntegracoes(items: ChecklistItem[], s: CirurgiasChecklistScenario): void {
  if (s.opmeIntegrado === true)
    add(items, {
      id: 'OPME_INTEGRADO',
      texto: 'OPME vinculado — validação ANVISA + cotações entra em milestone futuro (M5)',
      status: 'warning',
      origin: 'engenharia',
      severity: 50,
      showWhenOk: true,
    });
  if (s.oncologiaVinculada === true)
    add(items, {
      id: 'ONCOLOGIA_VINCULADA',
      texto: 'Cirurgia oncológica vinculada a protocolo M3 (estadiamento e ciclo)',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
  if (s.pacoteCirurgicoReconhecido === false)
    add(items, {
      id: 'PACOTE_RECONHECIDO',
      texto: `Pacote cirúrgico não reconhecido${s.pacoteCirurgicoNome ? ` (${s.pacoteCirurgicoNome})` : ''}`,
      status: 'error',
      origin: 'engenharia',
      severity: 85,
    });
  else if (s.pacoteCirurgicoReconhecido === true)
    add(items, {
      id: 'PACOTE_RECONHECIDO',
      texto: `Pacote cirúrgico reconhecido${s.pacoteCirurgicoNome ? ` (${s.pacoteCirurgicoNome})` : ''}`,
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
}

function pushCirurgiasRegulatory(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 — prazo máximo de realização: 21 dias úteis para cirurgia eletiva',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildCirurgiasChecklist(s: CirurgiasChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushCirurgiasPreOp(items, s);
  pushCirurgiasPlano(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushCirurgiasIntegracoes(items, s);
  pushCirurgiasRegulatory(items);
  return items;
}
