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
  type AuditLevel,
  type GuideStatus,
  type GuideType,
  type HospitalizationContext,
  type HospitalizationType,
  type ManchesterClassificationFinal,
  type OncologyProtocol,
  type OncologyTreatmentLine,
  type OncologyTreatmentType,
  type PreOpItem,
  type PreOpItemStatus,
  type PreOpItemType,
  type Procedure,
  type Request,
  type SurgeryContext,
  type SurgeryType,
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

function buildHospitalizationProcedures(form: FormData, cid: string): Procedure[] {
  return form.hospitalizationProcedimentos
    .filter((p) => p.codigoTUSS.trim() !== '')
    .map((p) => ({
      ...buildProcedure({
        codigoTUSS: p.codigoTUSS,
        descricaoTUSS: p.descricaoTUSS,
        qty: Number(p.qtd) || 1,
        cid: p.cid.trim() === '' ? cid : extractCidCode(p.cid),
      }),
      auditLevel: pickAuditLevel(form),
    }));
}

function buildSurgeryProcedures(form: FormData, cid: string): Procedure[] {
  const procedures: Procedure[] = [];
  if (form.surgeryMainProcedureCode.trim() !== '') {
    procedures.push({
      ...buildProcedure({
        codigoTUSS: form.surgeryMainProcedureCode,
        descricaoTUSS: form.surgeryMainProcedureDescription,
        qty: 1,
        cid,
      }),
      auditLevel: pickAuditLevel(form),
    });
  }
  for (const acc of form.surgeryAcessorios) {
    if (acc.codigoTUSS.trim() === '') continue;
    procedures.push({
      ...buildProcedure({
        codigoTUSS: acc.codigoTUSS,
        descricaoTUSS: acc.descricaoTUSS,
        qty: 1,
        cid,
      }),
      auditLevel: pickAuditLevel(form),
    });
  }
  return procedures;
}

function pickAuditLevel(form: FormData): AuditLevel {
  if (form.hospitalizationAuditLevel === '') return 'AMBULATORIAL';
  return form.hospitalizationAuditLevel;
}

function buildHospitalizationContext(form: FormData): HospitalizationContext | undefined {
  if (form.hospitalizationTipo === '') return undefined;
  const tipo: HospitalizationType = form.hospitalizationTipo;
  return {
    type: tipo,
    plannedDate: form.hospitalizationDataPrevista,
    expectedDays: Number(form.hospitalizationDuracao) || 0,
    taxes: form.hospitalizationTaxas
      .filter((t) => t.code.trim() !== '')
      .map((t) => ({
        code: t.code,
        description: t.description,
        quantity: Number(t.quantity) || 1,
        estimatedValue: Number(t.estimatedValue) || 0,
      })),
    ...(form.hospitalizationUtiJustificativa.trim() !== '' && {
      utiJustification: form.hospitalizationUtiJustificativa,
    }),
  };
}

function buildSurgeryContext(form: FormData): SurgeryContext | undefined {
  if (form.surgeryTipo === '') return undefined;
  const tipo: SurgeryType = form.surgeryTipo;
  return {
    type: tipo,
    mainProcedureCode: form.surgeryMainProcedureCode,
    accessoryProcedureCodes: form.surgeryAcessorios
      .map((a) => a.codigoTUSS)
      .filter((c) => c.trim() !== ''),
    hasOpme: form.surgeryHasOpme,
    hasOncologyLink: form.surgeryHasOncologyLink,
    ...(form.surgeryNotes.trim() !== '' && { notes: form.surgeryNotes }),
  };
}

function buildPreOpItems(form: FormData): PreOpItem[] | undefined {
  if (form.preOpItens.length === 0) return undefined;
  return form.preOpItens.map((item) => {
    const type: PreOpItemType = item.type;
    const status: PreOpItemStatus = item.status;
    return {
      id: item.templateId ?? item.id,
      type,
      description: item.description,
      required: item.required,
      status,
      ...(item.date.trim() !== '' && { date: item.date }),
    };
  });
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
    if (form.category === 'Internação') return buildHospitalizationProcedures(form, cid);
    if (form.category === 'Cirurgias Eletivas') return buildSurgeryProcedures(form, cid);
    return buildTherapyProcedures(terapiaProcedimentos, cid);
  })();

  const status: GuideStatus = 'Em Análise';

  const partial: Partial<Request> = {
    id: generatedId,
    status,
    guideType: pickGuideType(form),
    category: form.category,
    auditLevel: pickAuditLevel(form),
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

  applyCategorySpecificFields(partial, form);

  return partial;
}

function applyCategorySpecificFields(partial: Partial<Request>, form: FormData): void {
  if (form.category === 'Oncologia') {
    const protocol = buildOncologyProtocol(form);
    if (protocol) partial.oncologyProtocol = protocol;
  }
  if (form.category === 'Internação' || form.category === 'Cirurgias Eletivas') {
    const hospitalization = buildHospitalizationContext(form);
    if (hospitalization) partial.hospitalization = hospitalization;
  }
  if (form.category === 'Cirurgias Eletivas') {
    applySurgeryFields(partial, form);
  }
}

function applySurgeryFields(partial: Partial<Request>, form: FormData): void {
  const surgery = buildSurgeryContext(form);
  if (surgery) partial.surgery = surgery;
  const preOp = buildPreOpItems(form);
  if (preOp) partial.preOp = preOp;
  if (form.surgeryHasOncologyLink) {
    const protocol = buildOncologyProtocol(form);
    if (protocol) partial.oncologyProtocol = protocol;
  }
}
