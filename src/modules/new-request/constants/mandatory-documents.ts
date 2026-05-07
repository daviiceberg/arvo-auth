import { type Category } from '@/types/pedido';

export interface DocSpec {
  nome: string;
  descricao: string;
  obrigatorio: boolean;
}

export interface CategoryDocs {
  primeira: DocSpec[];
  continuidade: DocSpec[];
}

export const DOCS_BY_CATEGORY: Record<Category, CategoryDocs> = {
  'Terapias Especiais': {
    primeira: [
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
    ],
    continuidade: [
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
    ],
  },
  SADT: {
    primeira: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada pelo médico responsável',
        obrigatorio: true,
      },
      {
        nome: 'Indicação Clínica',
        descricao: 'Justificativa clínica do procedimento solicitado',
        obrigatorio: true,
      },
      {
        nome: 'Histórico Clínico',
        descricao: 'Histórico clínico relevante (quando aplicável)',
        obrigatorio: false,
      },
    ],
    continuidade: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada pelo médico responsável',
        obrigatorio: true,
      },
      {
        nome: 'Relatório de Evolução',
        descricao: 'Resultado dos atendimentos anteriores',
        obrigatorio: true,
      },
    ],
  },
  'Exames Alta Complexidade': {
    primeira: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Indicação clínica explícita do exame solicitado',
        obrigatorio: true,
      },
      {
        nome: 'Justificativa Técnica',
        descricao: 'Laudo médico justificando a necessidade do exame de alta complexidade',
        obrigatorio: true,
      },
      {
        nome: 'Histórico Clínico Relevante',
        descricao: 'Exames anteriores e evolução do quadro',
        obrigatorio: true,
      },
    ],
    continuidade: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Indicação clínica do reexame',
        obrigatorio: true,
      },
      {
        nome: 'Relatório do Exame Anterior',
        descricao: 'Resultado do exame anterior + justificativa do reexame',
        obrigatorio: true,
      },
    ],
  },
  'Home Care': {
    primeira: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada pelo médico responsável',
        obrigatorio: true,
      },
      {
        nome: 'Plano de Cuidados Domiciliares',
        descricao: 'Especifica equipe, frequência e tempo previsto de atendimento',
        obrigatorio: true,
      },
      {
        nome: 'Histórico Clínico',
        descricao: 'Estado clínico atual e dependências',
        obrigatorio: true,
      },
      {
        nome: 'Avaliação Social',
        descricao: 'Quando aplicável (estrutura familiar / suporte domiciliar)',
        obrigatorio: false,
      },
    ],
    continuidade: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação de renovação assinada pelo médico responsável',
        obrigatorio: true,
      },
      {
        nome: 'Relatório de Evolução',
        descricao: 'Evolução do quadro durante o período anterior',
        obrigatorio: true,
      },
      {
        nome: 'Plano de Cuidados Atualizado',
        descricao: 'Plano para o próximo ciclo (frequência, equipe, duração)',
        obrigatorio: true,
      },
    ],
  },
  'Urgência/Emergência': {
    primeira: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada e justificativa clínica do quadro de urgência',
        obrigatorio: true,
      },
      {
        nome: 'Triagem / Manchester',
        descricao: 'Classificação de risco do pronto-atendimento',
        obrigatorio: false,
      },
    ],
    continuidade: [
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada pelo médico',
        obrigatorio: true,
      },
    ],
  },
  Oncologia: {
    primeira: [
      {
        nome: 'Laudo Oncológico com Estadiamento TNM',
        descricao: 'Laudo do oncologista com diagnóstico e estadiamento',
        obrigatorio: true,
      },
      {
        nome: 'Protocolo de Tratamento',
        descricao: 'Protocolo proposto (SBOC/NCCN) com linha e ciclos previstos',
        obrigatorio: true,
      },
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação assinada pelo oncologista',
        obrigatorio: true,
      },
    ],
    continuidade: [
      {
        nome: 'Relatório de Evolução Oncológica',
        descricao: 'Resposta ao tratamento, toxicidades, ciclos prévios',
        obrigatorio: true,
      },
      {
        nome: 'Pedido Médico com CID',
        descricao: 'Solicitação do próximo ciclo',
        obrigatorio: true,
      },
    ],
  },
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
