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
  linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
  leituraAssistida:
    'Beneficiário pediátrico com diagnóstico de TEA (F84.0) em acompanhamento multidisciplinar desde 2024. Histórico consistente de sessões de Fonoaudiologia, Terapia Ocupacional e Psicologia. Evolução terapêutica documentada nos relatórios trimestrais. Sem intercorrências clínicas relevantes nos últimos 12 meses.',
  consultasRecentes: {
    count: 6,
    periodo: 'últimos 6 meses',
    especialidades: ['Neuropediatria', 'Psiquiatria Infantil', 'Pediatria'],
  },
  procedimentosRelacionados:
    'Acompanhamento neuropediátrico trimestral, sessões regulares de Fonoaudiologia e Terapia Ocupacional, reavaliação neuropsicológica anual.',
  internacoes: { count: 0, periodo: 'últimos 12 meses' },
  cidRecorrente: { cid: 'F84.0', count: 12, descricao: 'Autismo infantil' },
  sessoesDoMes: [
    {
      utilizadas: 8,
      autorizadas: 8,
      tipo: 'Fonoaudiologia',
      cidF84: true,
      dut: 'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
    },
    {
      utilizadas: 4,
      autorizadas: 4,
      tipo: 'Terapia Ocupacional',
      cidF84: true,
      dut: 'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
    },
  ],
  autorizacoesAnteriores: [
    {
      id: 'HIS-2026-00412',
      procedimento: 'Sessão de Fonoaudiologia (continuidade)',
      codigo: '50000370',
      cid: 'F84.0',
      data: 'Mar/2026',
      decisao: 'aprovado',
      motivo: 'Continuidade do plano terapêutico com evolução positiva',
      destaque: true,
    },
    {
      id: 'HIS-2026-00298',
      procedimento: 'Sessão de Terapia Ocupacional',
      codigo: '50000450',
      cid: 'F84.0',
      data: 'Fev/2026',
      decisao: 'aprovado',
      motivo: 'Plano terapêutico em vigência',
    },
    {
      id: 'HIS-2026-00154',
      procedimento: 'Reavaliação Neuropsicológica',
      codigo: '50000387',
      cid: 'F84.0',
      data: 'Jan/2026',
      decisao: 'aprovado',
      motivo: 'Atualização anual do laudo',
    },
  ],
  sinaisAtencao: [],
  elegibilidade: {
    status: 'ativo',
    carencias: false,
    limitesContratuais:
      'RN 539/2022 — sessões ilimitadas para CID F84.x. Sem restrições contratuais aplicáveis.',
    dutRelevantes: [
      'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
      'DUT 6 — Terapias do Espectro Autista',
    ],
  },
};

export const mockHistorico: Record<string, ConsolidatedHistory> = {
  default: DEFAULT_HISTORY,
  high_use: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiário pediátrico com TEA (F84.0) em protocolo terapêutico intensivo. Volume de sessões mensais acima de 80 — padrão compatível com protocolo EIBI (Early Intensive Behavioral Intervention). Múltiplas terapias em paralelo: ABA, Fonoaudiologia e Terapia Ocupacional. Recomenda-se encaminhamento para Junta Médica dada a quantidade solicitada.',
    consultasRecentes: {
      count: 10,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Psiquiatria Infantil', 'Fonoaudiologia', 'Psicologia'],
    },
    procedimentosRelacionados:
      'Protocolo ABA intensivo (20h/semana), Fonoaudiologia (2x/semana), Terapia Ocupacional (1x/semana), acompanhamento neuropediátrico mensal.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 18, descricao: 'Autismo infantil' },
    sessoesDoMes: [
      {
        utilizadas: 84,
        autorizadas: 80,
        tipo: 'ABA / Análise do Comportamento',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
      },
      {
        utilizadas: 8,
        autorizadas: 8,
        tipo: 'Fonoaudiologia',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
      },
      {
        utilizadas: 4,
        autorizadas: 4,
        tipo: 'Terapia Ocupacional',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
      },
    ],
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00587',
        procedimento: 'Sessão ABA (80 sessões)',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Junta Médica: protocolo EIBI validado',
        destaque: true,
      },
      {
        id: 'HIS-2026-00423',
        procedimento: 'Sessão de Fonoaudiologia',
        codigo: '50000370',
        cid: 'F84.0',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade do plano terapêutico',
      },
      {
        id: 'HIS-2026-00310',
        procedimento: 'Sessão ABA (82 sessões)',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Fev/2026',
        decisao: 'ajustado',
        motivo: 'Quantidade ajustada para 80 conforme parecer da Junta',
      },
      {
        id: 'HIS-2025-02189',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.0',
        data: 'Dez/2025',
        decisao: 'aprovado',
        motivo: 'Atualização obrigatória anual',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa1',
        mensagem: 'Alta utilização: 84 sessões ABA no mês — acima do limite de 80',
        detalhes:
          'RN 539/2022 garante sessões ilimitadas, porém quantidades >80/mês requerem validação por Junta Médica segundo regra operacional.',
        severidade: 'high',
      },
      {
        id: 'sa2',
        mensagem: 'Relatório de Evolução Terapêutica não encontrado para esta renovação',
        detalhes: 'Obrigatório para continuidade do plano terapêutico em TEA.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Quantidades >80/mês → Junta Médica.',
      dutRelevantes: [
        'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },
  primeira_vez: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário pediátrico sem histórico anterior de autorizações para terapias especiais. Primeiro pedido após diagnóstico recente de TEA (F84.0). Laudo neuropsicológico vigente anexado. Plano terapêutico inicial elaborado por equipe multidisciplinar. Sem intercorrências assistenciais relevantes.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 12 meses',
      especialidades: ['Neuropediatria', 'Pediatria'],
    },
    procedimentosRelacionados: 'Avaliação neuropsicológica inicial realizada em Mar/2026.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 1, descricao: 'Autismo infantil (recém-diagnosticado)' },
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Cobertura integral garantida.',
      dutRelevantes: [
        'RN 539/2022 — Terapias TEA (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },
};

/** Maps a request ID to the corresponding history mock data key. */
export function getHistoryKey(requestId: string): string {
  if (requestId === 'REQ-2026-04797') return 'high_use';
  if (requestId === 'REQ-2026-04818') return 'high_use';
  if (requestId === 'REQ-2026-04801') return 'primeira_vez';
  return 'default';
}
