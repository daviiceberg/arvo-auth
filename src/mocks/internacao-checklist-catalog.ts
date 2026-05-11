import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushProcedimentoBase,
  pushSolicitante,
} from './checklist-base';

export interface InternacaoChecklistScenario extends BaseScenario {
  cid?: string;
  planoCuidadosAusente?: boolean;
  estimativaDiariasAusente?: boolean;
  nivelAuditoriaQuestionavel?: boolean;
  utiSemJustificativa?: boolean;
  riscoNosocomialAlto?: boolean;
  internacaoDomiciliarApto?: boolean;
  pacoteHospitalarReconhecido?: boolean;
  pacoteHospitalarNome?: string;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushInternacaoClinical(items: ChecklistItem[], s: InternacaoChecklistScenario): void {
  add(items, {
    id: 'PLANO_CUIDADOS_DETALHADO',
    texto:
      s.planoCuidadosAusente === true
        ? 'Plano de cuidados hospitalares ausente ou incompleto'
        : 'Plano de cuidados hospitalares enviado',
    status: s.planoCuidadosAusente === true ? 'error' : 'ok',
    origin: 'ia',
    severity: s.planoCuidadosAusente === true ? 90 : undefined,
    showWhenOk: true,
  });
  add(items, {
    id: 'EXPECTED_DAYS',
    texto:
      s.estimativaDiariasAusente === true
        ? 'Estimativa de diárias não informada — bloqueia análise financeira'
        : 'Estimativa de diárias informada',
    status: s.estimativaDiariasAusente === true ? 'warning' : 'ok',
    origin: 'dados',
    severity: s.estimativaDiariasAusente === true ? 75 : undefined,
    showWhenOk: false,
  });
  add(items, {
    id: 'AUDIT_LEVEL_APROPRIADO',
    texto:
      s.nivelAuditoriaQuestionavel === true
        ? 'Nível de auditoria proposto requer revisão clínica'
        : 'Nível de auditoria coerente com indicação clínica',
    status: s.nivelAuditoriaQuestionavel === true ? 'warning' : 'ok',
    origin: 'ia',
    severity: s.nivelAuditoriaQuestionavel === true ? 70 : undefined,
    showWhenOk: false,
  });
  if (s.utiSemJustificativa === true)
    add(items, {
      id: 'UTI_JUSTIFICATIVA',
      texto: 'UTI solicitada sem justificativa clínica robusta (mínimo 50 caracteres)',
      status: 'error',
      origin: 'engenharia',
      severity: 95,
      showWhenOk: true,
    });
  if (s.riscoNosocomialAlto === true)
    add(items, {
      id: 'RISCO_NOSOCOMIAL',
      texto: 'Beneficiário com fatores de risco para infecção hospitalar — atenção redobrada',
      status: 'warning',
      origin: 'ia',
      severity: 65,
    });
  if (s.internacaoDomiciliarApto === true)
    add(items, {
      id: 'PRESTADOR_AUTORIZADO_DOMICILIAR',
      texto: 'Internação domiciliar — prestador autorizado para AC e equipe disponível',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
}

function pushInternacaoPacote(items: ChecklistItem[], s: InternacaoChecklistScenario): void {
  if (s.pacoteHospitalarReconhecido === false)
    add(items, {
      id: 'PACOTE_RECONHECIDO',
      texto: `Pacote hospitalar não reconhecido${s.pacoteHospitalarNome ? ` (${s.pacoteHospitalarNome})` : ''}`,
      status: 'error',
      origin: 'engenharia',
      severity: 85,
    });
  else if (s.pacoteHospitalarReconhecido === true)
    add(items, {
      id: 'PACOTE_RECONHECIDO',
      texto: `Pacote hospitalar reconhecido${s.pacoteHospitalarNome ? ` (${s.pacoteHospitalarNome})` : ''}`,
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
}

function pushInternacaoRegulatory(items: ChecklistItem[]): void {
  add(items, {
    id: 'RN_566_APLICAVEL',
    texto: 'RN 566/2022 — prazo de resposta para internação eletiva',
    status: 'ok',
    origin: 'engenharia',
    showWhenOk: false,
  });
}

export function buildInternacaoChecklist(s: InternacaoChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushBeneficiaryEligibility(items, s);
  pushInternacaoClinical(items, s);
  pushSolicitante(items, s);
  pushPrestador(items, s);
  pushProcedimentoBase(items, s);
  pushInternacaoPacote(items, s);
  pushInternacaoRegulatory(items);
  return items;
}
