import { type CodeType, type TussCode } from './procedure-codes';

export type ProcessingStatus = 'em_processamento' | 'erro_processamento' | 'processado';

export type GuideStatus = 'Em Análise' | 'Aprovado' | 'Negado' | 'Aprovado Parcial';

export type GuideType = 'Eleitiva';

export type RequestOrigin = 'app' | 'whatsapp' | 'email' | 'prestador' | 'call_center';

export type AuditLevel = 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';

export type SLAStatus = 'ok' | 'warning' | 'violated';

export type IASuggestion = 'Aprovar' | 'Negar';

export type Category = 'Terapias Especiais';

export type AccidentIndication = 'NAO_ACIDENTE' | 'TRABALHO' | 'TRANSITO' | 'OUTROS';

export type PlanScope = 'Municipal' | 'Estadual' | 'Nacional';

export interface AuditLogEntry {
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

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
 */
export interface ChecklistItem {
  texto: string;
  sub?: string;
  status: 'ok' | 'warning' | 'error';
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

export interface Document {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: string;
  enviadoEm?: string;
  obrigatorio: boolean;
  status: 'enviado' | 'pendente';
}

export interface Request {
  id: string;
  status: GuideStatus;
  guideType: GuideType;
  category: Category;
  auditLevel: AuditLevel;
  priority: 'alta' | 'media' | 'baixa';
  protocolDate: string;
  queueTime: string;
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
  procedures: Procedure[];
  alerts: string[];
  iaSuggestion: IASuggestion;
  iaJustification: string;
  iaChecklist: ChecklistItem[];
  observations: string;
  documents: Document[];
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  adjustments?: Adjustment[];
  operatorLock?: { nome: string; desde: string };
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

export type DecisionAction = 'Aprovado' | 'Negado' | 'Aprovado Parcial';

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
  iaSuggestion: IASuggestion;
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
}
