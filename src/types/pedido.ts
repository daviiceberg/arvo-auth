export type StatusProcessamento =
  | 'aguardando_processamento'
  | 'em_processamento'
  | 'erro_processamento'
  | 'processado';

export type StatusGuia =
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

export type TipoGuia = 'Eleitiva' | 'Urgente' | 'Emergência';

export type OrigemPedido = 'app' | 'whatsapp' | 'email' | 'prestador' | 'call_center';

export type NivelAuditoria = 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';

export type SLAStatus = 'ok' | 'warning' | 'violated';

export type IASugestao = 'Aprovar' | 'Negar' | 'Junta Médica';

export type Categoria =
  | 'Internação'
  | 'Urgência/Emergência'
  | 'Oncologia'
  | 'Terapias Especiais'
  | 'OPME'
  | 'Exames Alta Complexidade'
  | 'Cirurgias Eletivas'
  | 'Home Care'
  | 'SADT';

export interface Procedimento {
  codigo: string;
  tuss: string;
  descricao: string;
  qty: number;
  qtyAutorizada?: number;
  dataInicio: string;
  dataFim: string;
  cid: string;
  nivelAud: NivelAuditoria;
  fabricante?: string;
  valorUnitario?: number;
}

export interface Ajuste {
  id: string;
  procedimentoCodigo: string;
  procedimentoDescricao: string;
  campo: 'quantidade' | 'prestador' | 'codigo' | 'fabricante' | 'valorUnitario';
  valorAnterior: string;
  valorNovo: string;
  motivo: string;
  fundamentacao?: string;
  operador: string;
  perfil: string;
  timestamp: string;
}

export interface OrcamentoDadosExtraidos {
  fabricante: string;
  modelo: string;
  valorUnitario: number;
  registroANVISA: string;
  numeroCotacoes: number;
  observacao: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho?: string;
  enviadoEm?: string;
  obrigatorio: boolean;
  status: 'enviado' | 'pendente';
  dadosExtraidos?: OrcamentoDadosExtraidos;
}

export interface Pedido {
  id: string;
  status: StatusGuia;
  tipoGuia: TipoGuia;
  categoria: Categoria;
  nivelAuditoria: NivelAuditoria;
  prioridade: 'alta' | 'media' | 'baixa';
  dataProtocolo: string;
  tempoFila: string;
  slaStatus: SLAStatus;
  slaTexto: string;
  beneficiario: {
    nome: string;
    carteirinha: string;
    cpf: string;
    dataNascimento: string;
    idade: number;
    sexo: 'M' | 'F';
    plano: string;
    carencia: boolean;
  };
  prestador: {
    hospital: string;
    medico: string;
    crm: string;
    especialidade: string;
  };
  origem: OrigemPedido;
  procedimentos: Procedimento[];
  alertas: string[];
  iaSugestao: IASugestao;
  iaJustificativa: string;
  iaChecklist: { texto: string; status: 'ok' | 'warning' | 'error' }[];
  observacoes: string;
  documentos: Documento[];
  pendenciaMotivos?: string[];
  pendenciaResponsavel?: string;
  pendenciaData?: string;
  subStatus?: SubStatus;
  juntaParecer?: string;
  juntaRecomendacao?: 'Aprovar' | 'Negar';
  etapaAutorizacao?: 'primeira_solicitacao' | 'continuidade';
  ajustes?: Ajuste[];
  lockOperador?: { nome: string; desde: string };
  liminar?: {
    ativa: boolean;
    processo: string;
    escopo: string;
    validade: string;
    observacao?: string;
  };
  cidsSecundarios?: string[];
}

export interface PedidoEmProcessamento {
  id: string;
  statusProcessamento: Exclude<StatusProcessamento, 'processado'>;
  origem: OrigemPedido;
  beneficiario: string;
  plano: string;
  categoria: Categoria;
  entradaEm: Date;
  erroDescricao?: string;
}

export type DecisaoAcao = 'Aprovado' | 'Negado' | 'Aprovado Parcial' | 'Devolutiva';

export type DecisaoOrigem = 'ia_automatica' | 'analista';

export interface JuntaMedica {
  dataReuniao: string;
  numeroAta: string;
  parecer: string;
  membros: { nome: string; especialidade: string; crm: string }[];
}

export interface HistoricoEntry {
  id: string;
  beneficiario: string;
  carteirinha: string;
  plano: string;
  categoria: Categoria;
  procedimento: string;
  cid: string;
  prestador: string;
  medicoSolicitante: string;
  tipoGuia: TipoGuia;
  dataProtocolo: string;
  dataDecisao: string;
  acao: DecisaoAcao;
  origem: DecisaoOrigem;
  analista: string;
  motivoDecisao: string;
  textoLivre?: string;
  iaSugestao: IASugestao;
  divergencia: boolean;
  divergenciaMotivo?: string;
  tempoAnaliseMin: number;
  observacoes?: string;
  sexo?: 'M' | 'F';
  idade?: number;
  cpf?: string;
  dataNascimento?: string;
  carencia?: boolean;
  procedimentosDetalhados?: {
    codigo: string;
    tuss: string;
    descricao: string;
    qty: number;
    qtyAutorizada?: number;
    dataInicio: string;
    dataFim: string;
    cid: string;
    nivelAud: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI';
    decisao?: 'aprovado' | 'negado';
    motivoDecisao?: string;
  }[];
  alertas?: string[];
  iaChecklist?: { texto: string; status: 'ok' | 'warning' | 'error' }[];
  documentos?: { nome: string; tipo: string; data: string }[];
  juntaMedica?: JuntaMedica;
  ajustes?: Ajuste[];
  cidsSecundarios?: string[];
}
