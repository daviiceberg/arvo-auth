export type ModuloType =
  | 'internacao'
  | 'urgencia'
  | 'oncologia'
  | 'terapias'
  | 'opme'
  | 'exames'
  | 'cirurgias'
  | 'homecare';

export interface ProcedimentoItem {
  codigoTUSS: string;
  descricao: string;
  qtd: string;
}

export interface OpmeItem {
  codigoTUSS: string;
  descricao: string;
  fabricante: string;
  qtd: string;
  valorUnit: string;
}

export interface ExameItem {
  codigoTUSS: string;
  descricao: string;
  tipo: string;
  qtd: string;
}

export interface MaterialItem {
  codigo: string;
  descricao: string;
  fabricante: string;
  qtd: string;
  valor: string;
}

export interface Cotacao {
  fornecedor: string;
  valor: string;
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
  // Internacao
  tipoAcomodacao: string;
  qtdDiarias: string;
  dataInternacao: string;
  regimeInternacao: string;
  // Urgencia
  classificacaoRisco: string;
  tipoAtendimento: string;
  queixaPrincipal: string;
  // Oncologia
  estadiamentoTNM: string;
  numeroCiclo: string;
  protocoloQuimio: string;
  tipoTratamento: string;
  totalCiclos: string;
  // Terapias
  etapaAutorizacao: string;
  tipoTerapia: string;
  codigoTuss: string;
  numSessoes: string;
  terapiaDataInicio: string;
  terapiaDataTermino: string;
  frequenciaSemanal: string;
  duracaoSessao: string;
  // OPME
  materiais: MaterialItem[];
  registroAnvisa: string;
  fabricanteMaterial: string;
  justificativaTecnica: string;
  cotacoes: Cotacao[];
  // Exames
  exames: ExameItem[];
  // Cirurgias
  procedimentos: ProcedimentoItem[];
  opme: OpmeItem[];
  // Home Care
  modalidadeHomeCare: string;
  periodoSolicitado: string;
  cuidadosNecessarios: string;
}
