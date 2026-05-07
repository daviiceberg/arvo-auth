import { type Category } from '@/types/pedido';

export interface SnackbarState {
  open: boolean;
  msg: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export interface ProcedimentoItem {
  codigoTUSS: string;
  descricao: string;
  qtd: string;
}

export interface TerapiaProcedimento {
  id: string;
  tipoTerapia: string;
  codigoTUSS: string;
  descricaoTUSS: string;
  numeroSessoes: string;
  dataSolicitacao: string;
  dataValidadeSenha: string;
  frequenciaSemanal: string;
}

export interface DocUpload {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  obrigatorio: boolean;
  status: 'enviado' | 'pendente';
  file?: File;
}

export type { GuiaProcedure } from '@/types/procedure-codes';

export type SadtTipo = 'coleta' | 'infusao' | 'reabilitacao' | 'outro' | '';

export interface SadtProcedimento {
  id: string;
  codigoTUSS: string;
  descricaoTUSS: string;
  tipo: SadtTipo;
  frequencia: string;
  quantidade: string;
}

export interface ExamsProcedimento {
  id: string;
  codigoTUSS: string;
  descricaoTUSS: string;
  regiaoAnatomica: string;
  hipoteseDiagnostica: string;
  historicoExamesAnteriores: string;
}

export type HomeCareTipo =
  | 'enfermagem'
  | 'fisioterapia'
  | 'fonoaudiologia'
  | 'paliativo'
  | 'outro'
  | '';

export interface HomeCareItem {
  id: string;
  tipo: HomeCareTipo;
  frequencia: string;
  duracaoDias: string;
  escalaCuidadores: string;
  equipamentos: string;
  enderecoAtendimento: string;
}

export type UrgencyTipo = 'urgencia' | 'emergencia' | '';

export type ManchesterClassification = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul' | '';

export interface UrgencyProcedimento {
  id: string;
  tipo: UrgencyTipo;
  classificacaoRisco: ManchesterClassification;
  codigoTUSS: string;
  descricaoTUSS: string;
  justificativaClinica: string;
  quantidade: string;
}

export type OncologyTipoTratamento =
  | 'Quimioterapia'
  | 'Radioterapia'
  | 'Hormonioterapia'
  | 'Imunoterapia'
  | '';

export interface OncologyProcedimento {
  id: string;
  codigoTUSS: string;
  descricaoTUSS: string;
  quantidade: string;
}

export interface FormData {
  // Step 1 — Beneficiário
  category: Category | '';
  nomeBeneficiario: string;
  carteirinha: string;
  dataNascimento: string;
  cpf: string;
  operadora: string;
  validadeCarteirinha: string;
  telefoneContato: string;
  dataInclusaoPlano: string;
  // Step 2 — Dados Clínicos
  cidPrincipal: string;
  cidsSecundarios: string[];
  indicacaoClinica: string;
  procedimentoJaRealizado: string;
  // Step 2 — Profissional Solicitante
  profissionalSolicitante: string;
  conselhoTipo: string;
  conselhoNumero: string;
  conselhoUF: string;
  cboCodigo: string;
  nomeContratadoSolicitante: string;
  // Step 2 — Contratado Executante
  nomeContratadoExecutante: string;
  cnesExecutante: string;
  // Terapias
  etapaAutorizacao: string;
  tipoTerapia: string;
  codigoTuss: string;
  numSessoes: string;
  terapiaDataSolicitacao: string;
  terapiaDataValidadeSenha: string;
  frequenciaSemanal: string;
  // Oncologia (M3) — dados gerais do tratamento
  estadiamentoTNM: string;
  numeroCiclo: string;
  protocoloQuimio: string;
  tipoTratamento: OncologyTipoTratamento;
  totalCiclos: string;
  // Step dynamic — arrays de procedimentos por categoria. Apenas o campo
  // correspondente à categoria ativa é preenchido durante o cadastro;
  // os outros permanecem com arrays vazios.
  sadtProcedimentos: SadtProcedimento[];
  examsProcedimentos: ExamsProcedimento[];
  homeCareProcedimentos: HomeCareItem[];
  urgencyProcedimentos: UrgencyProcedimento[];
  oncologyProcedimentos: OncologyProcedimento[];
}
