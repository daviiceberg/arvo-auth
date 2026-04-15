export type ModuloType = 'terapias';

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
  dataInicio: string;
  dataTermino: string;
  frequenciaSemanal: string;
  duracaoSessao: string;
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
  // Step 1
  tipoSolicitacao: ModuloType | '';
  nomeBeneficiario: string;
  carteirinha: string;
  dataNascimento: string;
  cpf: string;
  operadora: string;
  validadeCarteirinha: string;
  // Step 2
  cidPrincipal: string;
  cidsSecundarios: string[];
  caraterAtendimento: string;
  medicoSolicitante: string;
  crm: string;
  indicacaoClinica: string;
  prestador: string;
  cnpjPrestador: string;
  // Terapias
  etapaAutorizacao: string;
  tipoTerapia: string;
  codigoTuss: string;
  numSessoes: string;
  terapiaDataInicio: string;
  terapiaDataTermino: string;
  frequenciaSemanal: string;
  duracaoSessao: string;
}
