import { type CodeType, type TussCode } from './procedure-codes';

export type ProcessingStatus = 'em_processamento' | 'erro_processamento' | 'processado';

export type GuideStatus =
  | 'Em Análise'
  | 'Aprovado'
  | 'Negado'
  | 'Aprovado Parcial'
  | 'Pendente'
  | 'Devolutiva';

export type SubStatus =
  | 'PENDENTE_AGUARDANDO'
  | 'PENDENTE_RETORNO_RECEBIDO'
  | 'JUNTA_AGUARDANDO'
  | 'JUNTA_PARECER_RECEBIDO';

export type SLASuspensionReason = 'EXAME_COMPLEMENTAR' | 'AUSENCIA_BENEFICIARIO';

export interface SLASuspension {
  reason: SLASuspensionReason;
  startedAt: string;
  durationBusinessDays: number;
  resumedAt?: string;
}

export interface OperatorLock {
  userId: string;
  userName: string;
  lockedAt: string;
}

export interface PendencyContext {
  reasons: string[];
  justification: string;
  requestedAt: string;
  deadlineBusinessDays: 3 | 7 | 15;
  responseReceivedAt?: string;
}

export type JuntaMedicaSubStatus =
  | 'aguardando'
  | 'parecer_recebido'
  | 'suspenso_exame_complementar'
  | 'suspenso_ausencia_beneficiario';

export interface JuntaMedicaContext {
  reason: string;
  justification: string;
  forwardedAt: string;
  desempatadorName?: string;
  desempatadorCrm?: string;
  meetingDate?: string;
  status: JuntaMedicaSubStatus;
  parecer?: {
    suggestedDecision: 'aprovado' | 'negado' | 'aprovado_parcial';
    text: string;
    issuedAt: string;
    desempatadorName: string;
  };
}

export type PrestadorMessageChannel = 'email' | 'whatsapp';
export type PrestadorMessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface PrestadorMessage {
  id: string;
  channel: PrestadorMessageChannel;
  subject: string;
  body: string;
  sentAt: string;
  status: PrestadorMessageStatus;
  triggerEvent: 'pendencia' | 'junta_encaminhada' | 'devolutiva_recebida';
}

export type GuideType = 'Eleitiva';

export type RequestOrigin = 'app' | 'whatsapp' | 'email' | 'prestador' | 'call_center';

export type RoutingOutcome = 'queued_for_human_review' | 'auto_decision';
export type RoutingRuleSource = 'rf004_event_type_tea_queue_only' | 'tenant_routing_rules';

export interface RoutingMetadata {
  outcome: RoutingOutcome;
  queueType?: 'operational' | 'medical_board';
  ruleSource?: RoutingRuleSource;
  routedAt?: string;
}

export type AuditLevel = 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';

export type SLAStatus = 'ok' | 'warning' | 'violated';

export type IASuggestion = 'Aprovar' | 'Negar' | 'Junta Médica' | 'Pendenciar';

/**
 * Snapshot final da recomendação da IA usado no Histórico.
 *
 * Conceitualmente diferente de IASuggestion (operacional, usada na Fila):
 * - IASuggestion = "o que a IA recomenda fazer agora" (4 valores)
 * - AISuggestionFinal = "o que a IA recomendou como decisão final" (3 valores)
 *
 * Pedidos que passaram por pendência ou junta carregam aqui a recomendação
 * pós-reprocessamento — a que o analista tinha em mãos no momento da decisão.
 * "Pendenciar" e "Junta Médica" são etapas, não desfechos.
 */
export type AISuggestionFinal = 'Aprovar' | 'Negar' | 'Aprovar Parcial';

export type Category = 'Terapias Especiais' | 'SADT' | 'Exames Alta Complexidade' | 'Home Care';

export type AccidentIndication = 'NAO_ACIDENTE' | 'TRABALHO' | 'TRANSITO' | 'OUTROS';

export type PlanScope = 'Municipal' | 'Estadual' | 'Nacional';

export interface AuditLogEntry {
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export type ChecklistStatus = 'ok' | 'warning' | 'error';
export type ChecklistOrigin = 'ia' | 'dados' | 'engenharia';

/**
 * Item do checklist da Análise da IA.
 *
 * REGRA DE UX (NÃO VIOLAR):
 * O texto deve sempre refletir o estado atual do item:
 *
 *   - status: 'ok'      → texto afirmativo  → "CRM médico validado"
 *   - status: 'warning' → texto de alerta   → "Laudo próximo do vencimento"
 *   - status: 'error'   → texto do problema → "CRM inválido ou não localizado"
 *
 * Nunca deixar texto afirmativo com status error/warning — isso gera
 * contradição visual (ícone vermelho + texto positivo).
 *
 * REGRA DE EXIBIÇÃO:
 * - Todo item negativo (error/warning) aparece na lista visível.
 * - Itens positivos (ok) só aparecem quando `showWhenOk === true` — ou seja,
 *   quando o item poupa esforço manual do analista (ex: CID confirmado no laudo).
 * - Itens com `showWhenOk=false` e status='ok' ficam só no modal "Ver todas".
 * - Ranqueamento: error (por severity desc) → warning (por severity desc) → ok relevantes.
 * - Limite visível: 6 itens. Restante vai para o modal.
 */
export interface ChecklistItem {
  /** Identificador estável do item (ex: "LAUDO_NEURO_VIGENCIA"). Deve ser estável entre rodadas de IA. */
  id?: string;
  texto: string;
  sub?: string;
  status: ChecklistStatus;
  /** Origem do dado: 'ia' (inferência), 'dados' (base estruturada), 'engenharia' (payload). */
  origin?: ChecklistOrigin;
  /** 0–100. Usado para ranquear itens negativos. Itens 'ok' podem omitir. */
  severity?: number;
  /** true quando o item, estando 'ok', ainda poupa esforço manual do analista. */
  showWhenOk?: boolean;
}

export interface Procedure {
  code: string;
  tuss: string;
  description: string;
  qty: number;
  authorizedQty?: number;
  requestDate: string;
  authorizationDate?: string;
  passwordExpiryDate?: string;
  cid: string;
  auditLevel: AuditLevel;
  tableNumber?: number;
  codeType?: CodeType;
  packageId?: string;
  tussCodesIncluded?: TussCode[];
  auditNotes?: string;
  procedureNotes?: string;
}

export interface RequestingProvider {
  name: string;
  operatorCode?: string;
  professional: string;
  councilType: string;
  councilNumber: string;
  councilUF: string;
  cboCode?: string;
}

export interface ExecutingProvider {
  name: string;
  operatorCode?: string;
  cnesCode?: string;
}

export interface Adjustment {
  id: string;
  procedureCode: string;
  procedureDescription: string;
  field: 'quantidade' | 'prestador' | 'codigo' | 'cid' | 'dut';
  previousValue: string;
  newValue: string;
  reason: string;
  justification?: string;
  operator: string;
  profile: string;
  timestamp: string;
}

export type DocumentOrigem = 'devolutiva_prestador' | 'parecer_junta';

export interface Document {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: string;
  enviadoEm?: string;
  obrigatorio: boolean;
  status: 'enviado' | 'pendente';
  origem?: DocumentOrigem;
}

export interface Request {
  id: string;
  status: GuideStatus;
  guideType: GuideType;
  category: Category;
  auditLevel: AuditLevel;
  priority: 'alta' | 'media' | 'baixa';
  protocolDate: string;
  queueTimeHours: number;
  slaStatus: SLAStatus;
  slaText: string;
  slaDeadlineHours: number;
  beneficiary: {
    name: string;
    cardNumber: string;
    cpf: string;
    birthDate: string;
    age: number;
    sex: 'M' | 'F';
    plan: string;
    waitingPeriod: boolean;
    planContractCode?: string;
    planInclusionDate?: string;
    planScope?: PlanScope;
    isRegulatedPlan?: boolean;
    contactPhone?: string;
    isNewborn?: boolean;
    beneficiaryNotes?: string;
  };
  requestingProvider: RequestingProvider;
  executingProvider: ExecutingProvider;
  guideNumber?: string;
  mainGuideNumber?: string;
  operatorGuideNumber?: string;
  password?: string;
  passwordExpiryDate?: string;
  operatorRegistryANS?: string;
  isNewborn?: boolean;
  origin: RequestOrigin;
  routing?: RoutingMetadata;
  procedures: Procedure[];
  alerts: string[];
  iaSuggestion: IASuggestion;
  iaJustification: string;
  iaSuggestionAfterReprocess?: IASuggestion;
  iaJustificationAfterReprocess?: string;
  iaChecklistAfterReprocess?: ChecklistItem[];
  documentsAddedOnDevolutiva?: Document[];
  iaReprocessing?: boolean;
  iaChecklist: ChecklistItem[];
  observations: string;
  documents: Document[];
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  adjustments?: Adjustment[];
  operatorLock?: OperatorLock;
  subStatus?: SubStatus;
  slaSuspension?: SLASuspension;
  pendencyContext?: PendencyContext;
  juntaMedicaContext?: JuntaMedicaContext;
  prestadorMessages?: PrestadorMessage[];
  secondaryCids?: string[];
  guidePassword?: string;
  decisionDate?: string;
  registeredBy?: string;
  accidentIndication?: AccidentIndication;
  procedureAlreadyPerformed?: boolean;
  internalNotes?: string;
  auditLog?: AuditLogEntry[];
  attendanceTypeCode?: string;
  cidSource?: 'prestador' | 'ocr' | 'inferencia';
  cidConfidence?: number;
  cidDivergence?: boolean;
  cidDivergenceDetail?: string;
}

export interface ProcessingRequest {
  id: string;
  statusProcessamento: Exclude<ProcessingStatus, 'processado'>;
  origin: RequestOrigin;
  beneficiary: string;
  plan: string;
  category: Category;
  entradaEm: Date;
  erroDescricao?: string;
}

export type DecisionAction =
  | 'Aprovado'
  | 'Negado'
  | 'Aprovado Parcial'
  | 'Devolutiva'
  | 'Junta Médica';

export type DecisionOrigin = 'ia_automatica' | 'analista';

export interface HistoryEntry {
  id: string;
  beneficiary: string;
  cardNumber: string;
  plan: string;
  category: Category;
  procedure: string;
  cid: string;
  requestingProviderName: string;
  executingProviderName: string;
  requestingProfessional: string;
  guideType: GuideType;
  protocolDate: string;
  decisionDate: string;
  action: DecisionAction;
  origin: DecisionOrigin;
  analyst: string;
  decisionReason: string;
  freeText?: string;
  iaSuggestion: AISuggestionFinal;
  divergence: boolean;
  divergenceReason?: string;
  analysisTimeMin: number;
  observations?: string;
  sex?: 'M' | 'F';
  age?: number;
  cpf?: string;
  birthDate?: string;
  waitingPeriod?: boolean;
  detailedProcedures?: {
    code: string;
    tuss: string;
    description: string;
    qty: number;
    authorizedQty?: number;
    requestDate: string;
    passwordExpiryDate?: string;
    cid: string;
    auditLevel: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';
    decisao?: 'aprovado' | 'negado';
    motivoDecisao?: string;
    codeType?: CodeType;
    packageId?: string;
    tussCodesIncluded?: TussCode[];
  }[];
  alerts?: string[];
  iaChecklist?: ChecklistItem[];
  documents?: { nome: string; tipo: string; data: string }[];
  adjustments?: Adjustment[];
  secondaryCids?: string[];
  internalNotes?: string;
  auditLog?: AuditLogEntry[];
  procedureAlreadyPerformed?: boolean;
  cidDivergence?: boolean;
  cidDivergenceDetail?: string;
  planInclusionDate?: string;
  contactPhone?: string;
  planScope?: PlanScope;
  isRegulatedPlan?: boolean;
  beneficiaryNotes?: string;
  passedThroughPendency?: boolean;
  passedThroughJunta?: boolean;
  pendencyTimeout?: boolean;
  juntaParecer?: {
    text: string;
    suggestedDecision: 'aprovado' | 'negado' | 'aprovado_parcial';
    desempatadorName: string;
    desempatadorCrm?: string;
    issuedAt: string;
  };
}
