import { type ModuloType } from '../types';

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

export const DOCS_OBRIGATORIOS: Record<
  ModuloType,
  { nome: string; descricao: string; obrigatorio: boolean }[]
> = {
  terapias: DOCS_TERAPIAS_PRIMEIRA,
  oncologia: [
    {
      nome: 'Pedido Médico',
      descricao: 'Com CID oncológico e protocolo indicado',
      obrigatorio: true,
    },
    {
      nome: 'Laudo Anatomopatológico',
      descricao: 'Confirmação histológica do diagnóstico',
      obrigatorio: true,
    },
    {
      nome: 'Protocolo Quimioterápico',
      descricao: 'Protocolo aprovado por oncologista',
      obrigatorio: true,
    },
  ],
  opme: [
    {
      nome: 'Pedido Médico com Justificativa',
      descricao: 'Indicação cirúrgica fundamentada',
      obrigatorio: true,
    },
    {
      nome: 'Orçamento do Fornecedor (3 cópias)',
      descricao: 'Cotação de ao menos 3 fornecedores distintos',
      obrigatorio: true,
    },
    {
      nome: 'Laudo Técnico do Produto',
      descricao: 'Especificação do material solicitado',
      obrigatorio: true,
    },
  ],
  internacao: [
    {
      nome: 'Pedido de Internação',
      descricao: 'Solicitação médica com CID e justificativa',
      obrigatorio: true,
    },
    {
      nome: 'Exames Pré-Operatórios',
      descricao: 'Hemograma, coagulação, ECG conforme protocolo',
      obrigatorio: true,
    },
  ],
  cirurgias: [
    { nome: 'Pedido Médico', descricao: 'Com CID e indicação cirúrgica', obrigatorio: true },
    {
      nome: 'Parecer do Especialista',
      descricao: 'Avaliação pré-cirúrgica do especialista',
      obrigatorio: true,
    },
    {
      nome: 'Avaliação Anestésica',
      descricao: 'Quando aplicável ao porte cirúrgico',
      obrigatorio: false,
    },
  ],
  urgencia: [],
  exames: [],
  homecare: [],
};

export const SUBTITULO_DOC: Record<ModuloType, string> = {
  terapias: 'Anexe os documentos exigidos para autorização de terapias especiais.',
  oncologia: 'Inclua laudos e protocolos clínicos necessários para análise oncológica.',
  opme: 'Adicione orçamentos e laudos cirúrgicos conforme exigência regulatória.',
  internacao: 'Inclua exames pré-operatórios e pareceres médicos pertinentes.',
  cirurgias: 'Inclua exames pré-operatórios e pareceres médicos pertinentes.',
  urgencia: 'Adicione documentos de suporte que auxiliem na análise da solicitação.',
  exames: 'Adicione documentos de suporte que auxiliem na análise da solicitação.',
  homecare: 'Adicione documentos de suporte que auxiliem na análise da solicitação.',
};

export const TIPOS_DOC_UPLOAD = [
  'Exame Laboratorial',
  'Exame de Imagem',
  'Laudo Médico',
  'Relatório de Evolução',
  'Documento Jurídico',
  'Orçamento / Cotação',
  'Pedido Médico',
  'Outro',
];
