/**
 * FormData → Request mapper.
 *
 * Prepara a transformação dos dados do wizard em um payload compatível com
 * o tipo Request (que será enviado ao backend quando endpoints existirem).
 * Hoje em modo Prototyping — saída é consumida apenas para validar shape.
 *
 * Aplica regras de domínio:
 * - Manchester (form) → Request.manchesterClassification
 * - tipoTratamento (PT-BR) → OncologyProtocol.type (enum curto)
 * - justificativaClinica[0] → Request.urgencyReason (concatena se múltiplos)
 * - cidPrincipal (form-level) → procedure.cid em todas as categorias
 * - codigoTUSS + descricaoTUSS → Procedure.{code, tuss, description}
 */

import {
  type GuideStatus,
  type GuideType,
  type ManchesterClassificationFinal,
  type OncologyProtocol,
  type OncologyTreatmentLine,
  type OncologyTreatmentType,
  type Procedure,
  type Request,
  type UrgencyType,
} from '@/types/pedido';

import {
  type FormData,
  type ManchesterClassification,
  type OncologyTipoTratamento,
  type TerapiaProcedimento,
  type UrgencyTipo,
} from '../types';

const TREATMENT_TYPE_MAP: Record<Exclude<OncologyTipoTratamento, ''>, OncologyTreatmentType> = {
  Quimioterapia: 'QT',
  Radioterapia: 'RT',
  Hormonioterapia: 'hormonio',
  Imunoterapia: 'imuno',
};

const URGENCY_TIPO_MAP: Record<
  Exclude<UrgencyTipo, ''>,
  { urgencyType: UrgencyType; guideType: GuideType }
> = {
  urgencia: { urgencyType: 'ambulatorial', guideType: 'Urgência' },
  emergencia: { urgencyType: 'emergencia', guideType: 'Emergência' },
};

function mapManchester(v: ManchesterClassification): ManchesterClassificationFinal | undefined {
  return v === '' ? undefined : v;
}

function extractCidCode(cidPrincipal: string): string {
  // "F84.0 - Autismo infantil" → "F84.0"
  const match = cidPrincipal.split(/[\s—-]/)[0]?.trim();
  return match ?? '';
}

function buildProcedure(args: {
  codigoTUSS: string;
  descricaoTUSS: string;
  qty: number;
  cid: string;
}): Procedure {
  return {
    code: args.codigoTUSS,
    tuss: args.codigoTUSS,
    description: args.descricaoTUSS,
    qty: args.qty,
    requestDate: new Date().toLocaleDateString('pt-BR'),
    cid: args.cid,
    auditLevel: 'AMBULATORIAL',
    tableNumber: 22,
    codeType: 'TUSS',
  };
}

function buildUrgencyProcedures(form: FormData, cid: string): Procedure[] {
  return form.urgencyProcedimentos
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) =>
      buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: Number(p.quantidade) || 1,
        cid,
      }),
    );
}

function buildOncologyProcedures(form: FormData, cid: string): Procedure[] {
  return form.oncologyProcedimentos
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) =>
      buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: Number(p.quantidade) || 1,
        cid,
      }),
    );
}

function buildSadtProcedures(form: FormData, cid: string): Procedure[] {
  return form.sadtProcedimentos
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) =>
      buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: Number(p.quantidade) || 1,
        cid,
      }),
    );
}

function buildExamsProcedures(form: FormData, cid: string): Procedure[] {
  return form.examsProcedimentos
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) =>
      buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: 1,
        cid,
      }),
    );
}

function buildHomeCareProcedures(form: FormData, cid: string): Procedure[] {
  return form.homeCareProcedimentos.map((p, idx) =>
    buildProcedure({
      codigoTUSS: '50000497',
      descricaoTUSS: `Plano Home Care ${String(idx + 1)} — ${p.tipo}`,
      qty: Number(p.duracaoDias) || 30,
      cid,
    }),
  );
}

function buildTherapyProcedures(procedures: TerapiaProcedimento[], cid: string): Procedure[] {
  return procedures
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) =>
      buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: Number(p.numeroSessoes) || 1,
        cid,
      }),
    );
}

function buildOncologyProtocol(form: FormData): OncologyProtocol | undefined {
  if (form.tipoTratamento === '') return undefined;
  const cycleDisplay =
    form.numeroCiclo && form.totalCiclos
      ? `${form.numeroCiclo}/${form.totalCiclos}`
      : form.numeroCiclo || '';
  // Linha não é capturada hoje no wizard — default '1a' como ponto de partida.
  const line: OncologyTreatmentLine = '1a';
  const protocol: OncologyProtocol = {
    type: TREATMENT_TYPE_MAP[form.tipoTratamento],
    protocol: form.protocoloQuimio,
    line,
    cycle: cycleDisplay,
    staging: form.estadiamentoTNM || undefined,
    totalCycles: form.totalCiclos || undefined,
  };
  return protocol;
}

function buildUrgencyReason(form: FormData): string | undefined {
  const justifications = form.urgencyProcedimentos
    .map((p) => p.justificativaClinica.trim())
    .filter((j) => j !== '');
  if (justifications.length === 0) return undefined;
  return justifications.join(' · ');
}

function pickManchester(form: FormData): ManchesterClassificationFinal | undefined {
  for (const p of form.urgencyProcedimentos) {
    const m = mapManchester(p.classificacaoRisco);
    if (m) return m;
  }
  return undefined;
}

function pickGuideType(form: FormData): GuideType {
  if (form.category === 'Urgência/Emergência') {
    const first = form.urgencyProcedimentos[0];
    if (first && first.tipo !== '') return URGENCY_TIPO_MAP[first.tipo].guideType;
  }
  return 'Eleitiva';
}

function pickUrgencyType(form: FormData): UrgencyType | undefined {
  if (form.category !== 'Urgência/Emergência') return undefined;
  const first = form.urgencyProcedimentos[0];
  if (!first || first.tipo === '') return undefined;
  return URGENCY_TIPO_MAP[first.tipo].urgencyType;
}

interface MapperParams {
  form: FormData;
  terapiaProcedimentos: TerapiaProcedimento[];
  generatedId: string;
}

export function formDataToRequest({
  form,
  terapiaProcedimentos,
  generatedId,
}: MapperParams): Partial<Request> {
  if (form.category === '') {
    throw new Error('Categoria não selecionada — não é possível mapear para Request.');
  }

  const cid = extractCidCode(form.cidPrincipal);

  const procedures: Procedure[] = (() => {
    if (form.category === 'Urgência/Emergência') return buildUrgencyProcedures(form, cid);
    if (form.category === 'Oncologia') return buildOncologyProcedures(form, cid);
    if (form.category === 'SADT') return buildSadtProcedures(form, cid);
    if (form.category === 'Exames Alta Complexidade') return buildExamsProcedures(form, cid);
    if (form.category === 'Home Care') return buildHomeCareProcedures(form, cid);
    return buildTherapyProcedures(terapiaProcedimentos, cid);
  })();

  const status: GuideStatus = 'Em Análise';

  const partial: Partial<Request> = {
    id: generatedId,
    status,
    guideType: pickGuideType(form),
    category: form.category,
    auditLevel: 'AMBULATORIAL',
    procedures,
    secondaryCids: form.cidsSecundarios.map(extractCidCode).filter((c) => c !== ''),
    observations: form.indicacaoClinica,
    authorizationStage:
      form.etapaAutorizacao === 'continuidade' ? 'continuidade' : 'primeira_solicitacao',
  };

  const manchester = pickManchester(form);
  if (manchester) partial.manchesterClassification = manchester;

  const urgencyType = pickUrgencyType(form);
  if (urgencyType) partial.urgencyType = urgencyType;

  const urgencyReason = buildUrgencyReason(form);
  if (urgencyReason && form.category === 'Urgência/Emergência') {
    partial.urgencyReason = urgencyReason;
  }

  if (form.category === 'Oncologia') {
    const protocol = buildOncologyProtocol(form);
    if (protocol) partial.oncologyProtocol = protocol;
  }

  return partial;
}
