import { type CodeType, type TussCode } from './procedure-codes';

export type ProcessingStatus =
  | 'aguardando_processamento'
  | 'em_processamento'
  | 'erro_processamento'
  | 'processado';

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

export type GuideType = 'Eleitiva' | 'Urgente' | 'Emergência';

export type RequestOrigin = 'app' | 'whatsapp' | 'email' | 'prestador' | 'call_center';

export type AuditLevel = 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';

export type SLAStatus = 'ok' | 'warning' | 'violated';

export type IASuggestion = 'Aprovar' | 'Negar' | 'Junta Médica';

export type Category =
  | 'Internação'
  | 'Urgência/Emergência'
  | 'Oncologia'
  | 'Terapias Especiais'
  | 'OPME'
  | 'Exames Alta Complexidade'
  | 'Cirurgias Eletivas'
  | 'Home Care'
  | 'SADT';

export interface Procedure {
  code: string;
  tuss: string;
  description: string;
  qty: number;
  authorizedQty?: number;
  startDate: string;
  endDate: string;
  cid: string;
  auditLevel: AuditLevel;
  manufacturer?: string;
  unitValue?: number;
  codeType?: CodeType;
  packageId?: string;
  tussCodesIncluded?: TussCode[];
}

export interface Adjustment {
  id: string;
  procedureCode: string;
  procedureDescription: string;
  field: 'quantidade' | 'prestador' | 'codigo' | 'fabricante' | 'valorUnitario';
  previousValue: string;
  newValue: string;
  reason: string;
  justification?: string;
  operator: string;
  profile: string;
  timestamp: string;
}

export interface BudgetExtractedData {
  fabricante: string;
  modelo: string;
  valorUnitario: number;
  registroANVISA: string;
  numeroCotacoes: number;
  observacao: string;
}

export interface Document {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: string;
  enviadoEm?: string;
  obrigatorio: boolean;
  status: 'enviado' | 'pendente';
  dadosExtraidos?: BudgetExtractedData;
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
  beneficiary: {
    name: string;
    cardNumber: string;
    cpf: string;
    birthDate: string;
    age: number;
    sex: 'M' | 'F';
    plan: string;
    waitingPeriod: boolean;
  };
  provider: {
    hospital: string;
    doctor: string;
    crm: string;
    specialty: string;
  };
  origin: RequestOrigin;
  procedures: Procedure[];
  alerts: string[];
  iaSuggestion: IASuggestion;
  iaJustification: string;
  iaChecklist: { texto: string; status: 'ok' | 'warning' | 'error' }[];
  observations: string;
  documents: Document[];
  pendencyReasons?: string[];
  pendencyResponsible?: string;
  pendencyDate?: string;
  subStatus?: SubStatus;
  boardOpinion?: string;
  boardRecommendation?: 'Aprovar' | 'Negar';
  authorizationStage?: 'primeira_solicitacao' | 'continuidade';
  adjustments?: Adjustment[];
  operatorLock?: { nome: string; desde: string };
  injunction?: {
    ativa: boolean;
    processo: string;
    escopo: string;
    validade: string;
    observacao?: string;
  };
  secondaryCids?: string[];
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

export type DecisionAction = 'Aprovado' | 'Negado' | 'Aprovado Parcial' | 'Devolutiva';

export type DecisionOrigin = 'ia_automatica' | 'analista';

export interface MedicalBoard {
  dataReuniao: string;
  numeroAta: string;
  parecer: string;
  membros: { nome: string; especialidade: string; crm: string }[];
}

export interface HistoryEntry {
  id: string;
  beneficiary: string;
  cardNumber: string;
  plan: string;
  category: Category;
  procedure: string;
  cid: string;
  provider: string;
  requestingDoctor: string;
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
    startDate: string;
    endDate: string;
    cid: string;
    auditLevel: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';
    decisao?: 'aprovado' | 'negado';
    motivoDecisao?: string;
    codeType?: CodeType;
    packageId?: string;
    tussCodesIncluded?: TussCode[];
  }[];
  alerts?: string[];
  iaChecklist?: { texto: string; status: 'ok' | 'warning' | 'error' }[];
  documents?: { nome: string; tipo: string; data: string }[];
  medicalBoard?: MedicalBoard;
  adjustments?: Adjustment[];
  secondaryCids?: string[];
}
