// ---- Types ----
export interface ConsolidatedHistory {
  completeness: 'complete' | 'partial' | 'limited';
  linhaDoTempo: {
    ultimaSolicitacaoSimilar: string | null;
    padrao: 'first_time' | 'recurrent' | 'frequent';
  };
  leituraAssistida: string;
  consultasRecentes: { count: number; periodo: string; especialidades: string[] };
  procedimentosRelacionados: string;
  internacoes: { count: number; periodo: string; detalhes?: string };
  cidRecorrente: { cid: string; count: number; descricao: string } | null;
  sessoesDoMes?: {
    utilizadas: number;
    autorizadas: number;
    tipo: string;
    cidF84?: boolean;
    dut?: string;
  }[];
  autorizacoesAnteriores: {
    id: string;
    procedimento: string;
    codigo: string;
    cid: string;
    data: string;
    decisao: 'aprovado' | 'negado' | 'ajustado';
    motivo: string;
    destaque?: boolean;
  }[];
  sinaisAtencao: {
    id: string;
    mensagem: string;
    detalhes?: string;
    severidade: 'low' | 'medium' | 'high';
  }[];
  elegibilidade: {
    status: 'ativo' | 'suspenso' | 'carencia';
    carencias: boolean;
    detalhesCarencia?: string;
    limitesContratuais: string;
    dutRelevantes: string[];
  };
}

// ---- Mock data ----
export const DEFAULT_HISTORY: ConsolidatedHistory = {
  completeness: 'complete',
  linhaDoTempo: { ultimaSolicitacaoSimilar: 'Dez/2025', padrao: 'recurrent' },
  leituraAssistida:
    'Beneficiário com histórico regular de uso assistencial. Padrão de consultas dentro da média esperada para o perfil. Sem intercorrências relevantes nos últimos 12 meses.',
  consultasRecentes: {
    count: 4,
    periodo: 'últimos 6 meses',
    especialidades: ['Cardiologia', 'Clínica Geral'],
  },
  procedimentosRelacionados: 'Exames laboratoriais de rotina e consultas ambulatoriais.',
  internacoes: { count: 0, periodo: 'últimos 12 meses' },
  cidRecorrente: { cid: 'Z00.0', count: 2, descricao: 'Exame geral de rotina' },
  autorizacoesAnteriores: [
    {
      id: 'REQ-2025-09821',
      procedimento: 'Consulta Cardiologista',
      codigo: '10101012',
      cid: 'Z00.0',
      data: 'Dez/2025',
      decisao: 'aprovado',
      motivo: 'Indicação clínica adequada',
    },
    {
      id: 'REQ-2025-07634',
      procedimento: 'Hemograma Completo',
      codigo: '40302605',
      cid: 'Z00.0',
      data: 'Set/2025',
      decisao: 'aprovado',
      motivo: 'Exame de rotina',
    },
    {
      id: 'REQ-2025-05112',
      procedimento: 'Eletrocardiograma',
      codigo: '20101010',
      cid: 'I10',
      data: 'Jun/2025',
      decisao: 'negado',
      motivo: 'Ausência de pedido médico',
    },
  ],
  sinaisAtencao: [],
  elegibilidade: {
    status: 'ativo',
    carencias: false,
    limitesContratuais: 'Sem restrições contratuais identificadas.',
    dutRelevantes: ['DUT 1 — Exames de rotina', 'DUT 12 — Consultas ambulatoriais'],
  },
};

export const mockHistorico: Record<string, ConsolidatedHistory> = {
  default: DEFAULT_HISTORY,
  high_use: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiário com padrão de uso elevado e frequente. Volume de consultas e procedimentos significativamente acima da média. Múltiplas especialidades envolvidas nos últimos 6 meses. Recomenda-se avaliação cuidadosa da pertinência clínica.',
    consultasRecentes: {
      count: 12,
      periodo: 'últimos 6 meses',
      especialidades: ['Reumatologia', 'Ortopedia', 'Clínica Geral', 'Fisioterapia', 'Psicologia'],
    },
    procedimentosRelacionados:
      'Múltiplos procedimentos de reabilitação, exames de imagem e consultas especializadas recorrentes.',
    internacoes: {
      count: 2,
      periodo: 'últimos 12 meses',
      detalhes: 'Jan/2026 — Clínica Médica (3 dias); Out/2025 — Ortopedia (2 dias)',
    },
    cidRecorrente: { cid: 'M79.3', count: 4, descricao: 'Fibromialgia' },
    sessoesDoMes: [
      {
        utilizadas: 20,
        autorizadas: 20,
        tipo: 'ABA / Análise do Comportamento',
        cidF84: true,
        dut: 'DUT 6 — Terapias do Espectro Autista',
      },
      {
        utilizadas: 8,
        autorizadas: 8,
        tipo: 'Fonoaudiologia',
        cidF84: true,
        dut: 'DUT 6 — Terapias do Espectro Autista',
      },
    ],
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-03801',
        procedimento: 'Sessão de Fisioterapia',
        codigo: '50000470',
        cid: 'M79.3',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Indicação clínica adequada',
        destaque: true,
      },
      {
        id: 'REQ-2026-02654',
        procedimento: 'RNM de Coluna Lombar',
        codigo: '40901010',
        cid: 'M51.1',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Solicitação médica com justificativa',
      },
      {
        id: 'REQ-2026-01423',
        procedimento: 'Consulta Reumatologia',
        codigo: '10101012',
        cid: 'M79.3',
        data: 'Jan/2026',
        decisao: 'ajustado',
        motivo: 'Quantidade reduzida conforme protocolo',
      },
      {
        id: 'REQ-2025-11209',
        procedimento: 'Internação Clínica',
        codigo: '40301010',
        cid: 'M79.3',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Agudização com indicação clínica',
      },
      {
        id: 'REQ-2025-09876',
        procedimento: 'Exames Laboratoriais Múltiplos',
        codigo: '40302605',
        cid: 'M79.3',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Protocolo de investigação',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa1',
        mensagem: 'Alto volume de uso — beneficiário entre os top 5% de utilizadores',
        detalhes: '12 consultas e 2 internações nos últimos 6 meses.',
        severidade: 'high',
      },
      {
        id: 'sa2',
        mensagem: 'Múltiplas especialidades simultâneas — possível fragmentação do cuidado',
        severidade: 'medium',
      },
      {
        id: 'sa3',
        mensagem: 'CID M79.3 recorrente em 4 autorizações — avaliar adesão ao tratamento',
        severidade: 'low',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Limite de sessões de fisioterapia atingido (24/24). Internações dentro do limite contratual.',
      dutRelevantes: [
        'DUT 30 — Fisioterapia',
        'DUT 33 — Internação clínica',
        'DUT 18 — Exames de imagem',
      ],
    },
  },
  primeira_vez: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário sem histórico anterior de solicitações similares. Esta é a primeira autorização registrada para este tipo de procedimento. Histórico assistencial limpo e sem ocorrências relevantes.',
    consultasRecentes: { count: 1, periodo: 'últimos 12 meses', especialidades: ['Clínica Geral'] },
    procedimentosRelacionados: 'Nenhum procedimento relacionado anterior identificado.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais identificadas.',
      dutRelevantes: ['DUT 1 — Exames de rotina'],
    },
  },
  opme_quadril: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com histórico ortopédico documentado. Consultas de acompanhamento em Ortopedia nos últimos 18 meses com progressão da coxartrose bilateral. Radiografias seriadas confirmam piora gradual. Indicação cirúrgica compatível com o quadro clínico registrado.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 12 meses',
      especialidades: ['Ortopedia', 'Clínica Geral', 'Anestesiologia'],
    },
    procedimentosRelacionados:
      'Consultas ortopédicas de acompanhamento, radiografias de quadril bilateral, sessões de fisioterapia (encerradas por falha de resposta).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M16.1', count: 4, descricao: 'Coxartrose primária unilateral' },
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-02310',
        procedimento: 'Fisioterapia Ortopédica',
        codigo: '50000470',
        cid: 'M16.1',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Indicação clínica documentada',
      },
      {
        id: 'REQ-2025-11847',
        procedimento: 'Radiografia Quadril Bilateral',
        codigo: '40901060',
        cid: 'M16.1',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Acompanhamento evolutivo',
      },
      {
        id: 'REQ-2025-08934',
        procedimento: 'Consulta Ortopedia',
        codigo: '10101012',
        cid: 'M16.1',
        data: 'Ago/2025',
        decisao: 'aprovado',
        motivo: 'Solicitação médica com indicação',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Sem restrições contratuais identificadas. Cobertura OPME ativa conforme contrato Premium.',
      dutRelevantes: [
        'DUT 45 — Artroplastia total de quadril',
        'DUT 63 — Próteses, órteses e materiais especiais (OPME)',
      ],
    },
  },
};

/** Maps a request ID to the corresponding history mock data key. */
export function getHistoryKey(requestId: string): string {
  if (requestId === 'REQ-2026-04797') return 'high_use';
  if (requestId === 'REQ-2026-04801') return 'primeira_vez';
  if (requestId === 'REQ-2026-04905') return 'opme_quadril';
  return 'default';
}
