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
}
