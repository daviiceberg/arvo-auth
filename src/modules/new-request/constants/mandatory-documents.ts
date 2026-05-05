import { type Category } from '@/types/pedido';

export const DOCS_TERAPIAS_PRIMEIRA: { nome: string; descricao: string; obrigatorio: boolean }[] = [
  {
    nome: 'Pedido Médico com CID',
    descricao: 'Solicitação assinada pelo médico responsável',
    obrigatorio: true,
  },
  {
    nome: 'Laudo Neuropsicológico',
    descricao: 'Laudo atualizado (validade: 12 meses)',
    obrigatorio: true,
  },
  {
    nome: 'Plano Terapêutico',
    descricao: 'Plano elaborado pelo profissional executante',
    obrigatorio: true,
  },
];

export const DOCS_TERAPIAS_CONTINUIDADE: {
  nome: string;
  descricao: string;
  obrigatorio: boolean;
}[] = [
  {
    nome: 'Pedido Médico com CID',
    descricao: 'Solicitação assinada pelo médico responsável',
    obrigatorio: true,
  },
  {
    nome: 'Relatório de Evolução Terapêutica',
    descricao: 'Emitido pelo terapeuta responsável',
    obrigatorio: true,
  },
  {
    nome: 'Laudo Neuropsicológico',
    descricao: 'Laudo atualizado (validade: 12 meses) — se expirado',
    obrigatorio: true,
  },
];

// TODO(M2 commit 3): preencher docs reais para SADT, Exames Alta Complexidade, Home Care.
export const DOCS_OBRIGATORIOS: Record<
  Category,
  { nome: string; descricao: string; obrigatorio: boolean }[]
> = {
  'Terapias Especiais': DOCS_TERAPIAS_PRIMEIRA,
  SADT: [],
  'Exames Alta Complexidade': [],
  'Home Care': [],
};

export const SUBTITULO_DOC: Record<Category, string> = {
  'Terapias Especiais': 'Anexe os documentos exigidos para autorização de terapias especiais.',
  SADT: 'Anexe os documentos exigidos para autorização de SADT.',
  'Exames Alta Complexidade':
    'Anexe os documentos exigidos para autorização de exames de alta complexidade.',
  'Home Care': 'Anexe os documentos exigidos para autorização de home care.',
};

export const TIPOS_DOC_UPLOAD = [
  'Exame Laboratorial',
  'Exame de Imagem',
  'Laudo Médico',
  'Relatório de Evolução',
  'Documento Jurídico',
  'Pedido Médico',
  'Outro',
];
