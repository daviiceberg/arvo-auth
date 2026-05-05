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
      dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
    },
    {
      utilizadas: 4,
      autorizadas: 4,
      tipo: 'Terapia Ocupacional',
      cidF84: true,
      dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
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
      'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      'DUT 6 — Terapias do Espectro Autista',
    ],
  },
};

export const mockHistorico: Record<string, ConsolidatedHistory> = {
  default: DEFAULT_HISTORY,

  // ── TEA: alta utilização (REQ-2026-M1-JUNTA-001) ──────────────────────────
  high_use: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiária pediátrica (10a, F) com TEA (F84.0) em protocolo terapêutico intensivo. Volume de sessões mensais acima de 80 — padrão compatível com protocolo EIBI (Early Intensive Behavioral Intervention). Múltiplas terapias em paralelo: ABA, Fonoaudiologia e Terapia Ocupacional. Recomenda-se encaminhamento para Junta Médica dada a quantidade solicitada.',
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
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
      {
        utilizadas: 8,
        autorizadas: 8,
        tipo: 'Fonoaudiologia',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
      {
        utilizadas: 4,
        autorizadas: 4,
        tipo: 'Terapia Ocupacional',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
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
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: primeira vez ──────────────────────────────────────────────────────
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
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Arthur Lima Ferraz — 4a M, primeiro pacote multidisciplinar (REQ-2026-04895) ──
  tea_arthur: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário pediátrico de 4 anos (M) com diagnóstico de TEA (F84.0) confirmado por laudo neuropsicológico vigente. Primeira solicitação de pacote multidisciplinar completo (ABA + Fonoaudiologia + Terapia Ocupacional + Psicologia). Sem histórico assistencial conflituoso ou autorizações anteriores na operadora. Plano terapêutico inicial elaborado por equipe interdisciplinar do Instituto Integrar TEA.',
    consultasRecentes: {
      count: 2,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Pediatria'],
    },
    procedimentosRelacionados:
      'Avaliação neuropsicológica diagnóstica (Mar/2026). Consulta de triagem neuropediátrica.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 1, descricao: 'Autismo infantil (diagnóstico recente)' },
    sessoesDoMes: [
      {
        utilizadas: 0,
        autorizadas: 0,
        tipo: 'ABA / Análise do Comportamento',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
    ],
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Primeiro ciclo terapêutico — cobertura integral garantida.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Sofia — 7a F, pendência por laudo vencido (REQ-2026-M1-PEND-001) ──
  tea_sofia: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária pediátrica de 7 anos (F) com TEA (F84.0) em acompanhamento terapêutico recorrente de ABA. Histórico de renovações mensais regulares desde 2024. Solicitação atual em pendência por laudo neuropsicológico com prazo de validade vencido — último laudo datado de Fev/2025 (>12 meses). Demais critérios administrativos e de elegibilidade conformes.',
    consultasRecentes: {
      count: 7,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Psicologia', 'Fonoaudiologia'],
    },
    procedimentosRelacionados:
      'Sessões mensais de ABA (16 sessões/mês). Fonoaudiologia quinzenal. Acompanhamento neuropediátrico bimestral.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 14, descricao: 'Autismo infantil' },
    sessoesDoMes: [
      {
        utilizadas: 16,
        autorizadas: 16,
        tipo: 'ABA / Análise do Comportamento',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
      {
        utilizadas: 4,
        autorizadas: 4,
        tipo: 'Fonoaudiologia',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
    ],
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00502',
        procedimento: 'Sessão ABA — renovação mensal',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Renovação regular com laudo válido',
        destaque: true,
      },
      {
        id: 'HIS-2025-01934',
        procedimento: 'Sessão ABA — renovação mensal',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Plano terapêutico em vigência',
      },
      {
        id: 'HIS-2025-01655',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.0',
        data: 'Fev/2025',
        decisao: 'aprovado',
        motivo: 'Laudo anual obrigatório',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-sofia-1',
        mensagem: 'Laudo neuropsicológico vencido — emitido há mais de 12 meses',
        detalhes:
          'Último laudo datado de Fev/2025. Expirou em Fev/2026. Renovação obrigatória conforme protocolo operacional TEA.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Pendência: laudo vencido bloqueia renovação.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Isabela — 9a F, ABA EIBI intensivo, junta por quantidade (REQ-2026-M1-JUNTA-002) ──
  tea_isabela: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiária pediátrica de 9 anos (F) com TEA (F84.0) em protocolo EIBI de alta intensidade. Solicitação atual de 96 sessões mensais de ABA — quantidade superior ao limiar de 80 sessões, conforme regra operacional que requer validação por Junta Médica. Histórico de aprovações com volume elevado desde 2025, todas com respaldo de Junta Médica prévia.',
    consultasRecentes: {
      count: 9,
      periodo: 'últimos 6 meses',
      especialidades: [
        'Neuropediatria',
        'Psiquiatria Infantil',
        'Psicologia',
        'Terapia Ocupacional',
      ],
    },
    procedimentosRelacionados:
      'Protocolo ABA intensivo (24h/semana), Terapia Ocupacional (2x/semana), acompanhamento neuropediátrico mensal.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 20, descricao: 'Autismo infantil' },
    sessoesDoMes: [
      {
        utilizadas: 96,
        autorizadas: 88,
        tipo: 'ABA / Análise do Comportamento',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
      {
        utilizadas: 8,
        autorizadas: 8,
        tipo: 'Terapia Ocupacional',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
    ],
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00601',
        procedimento: 'Sessão ABA (88 sessões) — EIBI',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Junta Médica: protocolo EIBI intensivo validado',
        destaque: true,
      },
      {
        id: 'HIS-2026-00441',
        procedimento: 'Sessão ABA (90 sessões)',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Fev/2026',
        decisao: 'ajustado',
        motivo: 'Quantidade ajustada para 88 conforme Junta',
      },
      {
        id: 'HIS-2025-02301',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.0',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Atualização anual obrigatória',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-isabela-1',
        mensagem:
          'Quantidade solicitada (96 sessões) supera limiar de 80 — Junta Médica obrigatória',
        detalhes:
          'RN 539/2022 não impõe limite, porém regra operacional da operadora exige validação por Junta para volumes >80 sessões/mês.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Quantidades >80/mês → Junta Médica obrigatória.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Daniel — 5a M, Terapia Ocupacional recorrente, em análise (REQ-2026-M1-LOCK-001) ──
  tea_daniel: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário pediátrico de 5 anos (M) com TEA (F84.0) em acompanhamento regular de Terapia Ocupacional. Histórico de renovações mensais consistentes desde 2025, com evolução documentada nos relatórios semestrais. Solicitação atual em análise dentro do fluxo operacional padrão. Sem sinais de alerta assistenciais ou regulatórios.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Terapia Ocupacional', 'Pediatria'],
    },
    procedimentosRelacionados:
      'Terapia Ocupacional (2x/semana). Acompanhamento neuropediátrico trimestral. Avaliação sensorial anual.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 10, descricao: 'Autismo infantil' },
    sessoesDoMes: [
      {
        utilizadas: 8,
        autorizadas: 8,
        tipo: 'Terapia Ocupacional',
        cidF84: true,
        dut: 'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
      },
    ],
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00519',
        procedimento: 'Sessão de Terapia Ocupacional (renovação)',
        codigo: '50000450',
        cid: 'F84.0',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade com evolução positiva documentada',
        destaque: true,
      },
      {
        id: 'HIS-2025-01872',
        procedimento: 'Sessão de Terapia Ocupacional',
        codigo: '50000450',
        cid: 'F84.0',
        data: 'Dez/2025',
        decisao: 'aprovado',
        motivo: 'Plano terapêutico em vigência',
      },
      {
        id: 'HIS-2025-01501',
        procedimento: 'Avaliação Sensorial Ocupacional',
        codigo: '50000461',
        cid: 'F84.0',
        data: 'Jul/2025',
        decisao: 'aprovado',
        motivo: 'Avaliação anual de integração sensorial',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Sem restrições contratuais aplicáveis.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── SADT: Roberto — 53a M, M54.5 lombalgia, fisioterapia (REQ-2026-SADT-002) ──
  sadt_roberto: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário de 53 anos (M) com lombalgia crônica (M54.5) em acompanhamento ortopédico e fisiátrico. Dois ciclos anteriores de fisioterapia motora aprovados em 2025, com melhora funcional parcial documentada. Terceiro ciclo solicitado após recidiva sintomática confirmada por relatório de retorno do ortopedista. Indicação clínica bem fundamentada e dentro dos limites contratuais aplicáveis.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Ortopedia', 'Fisiatria'],
    },
    procedimentosRelacionados:
      'Fisioterapia motora — 2 ciclos anteriores (Jan/2025 e Jul/2025). Consultas ortopédicas trimestrais. Rx coluna lombar (Nov/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M54.5', count: 5, descricao: 'Dor lombar' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00388',
        procedimento: 'Fisioterapia Motora — 10 sessões (ciclo 2)',
        codigo: '20100110',
        cid: 'M54.5',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Segundo ciclo aprovado — relatório de evolução favorável',
        destaque: true,
      },
      {
        id: 'HIS-2025-01820',
        procedimento: 'Fisioterapia Motora — 10 sessões (ciclo 1)',
        codigo: '20100110',
        cid: 'M54.5',
        data: 'Jul/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro ciclo — indicação ortopédica',
      },
      {
        id: 'HIS-2025-01234',
        procedimento: 'Consulta Ortopédica',
        codigo: '40302056',
        cid: 'M54.5',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Acompanhamento clínico regular',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — fisioterapia motora: 12 sessões/ciclo de 30 dias. Ciclo 3 dentro do limite contratual.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Fisioterapia Motora — lombalgia inespecífica',
      ],
    },
  },

  // ── SADT: Marcos — 35a M, M54.4 ciatalgia, RPG, carência ativa (REQ-2026-SADT-004) ──
  sadt_marcos: {
    completeness: 'limited',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário de 35 anos (M) com ciatalgia (M54.4) e indicação de RPG (Reeducação Postural Global) por ortopedista. Primeira solicitação de RPG na operadora — sem histórico assistencial prévio relevante. Carência contratual ativa para terapias físicas — cobertura ainda não disponível para este procedimento. Solicitação não elegível até cumprimento integral do período de carência.',
    consultasRecentes: {
      count: 1,
      periodo: 'últimos 3 meses',
      especialidades: ['Ortopedia'],
    },
    procedimentosRelacionados: 'Consulta ortopédica com indicação de RPG (Mar/2026).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [
      {
        id: 'sa-marcos-1',
        mensagem: 'Carência ativa para terapias físicas — cobertura indisponível',
        detalhes:
          'Contrato iniciado em Fev/2026. Carência de 90 dias para fisioterapia e RPG. Liberação prevista para Mai/2026.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'carencia',
      carencias: true,
      detalhesCarencia: 'Carência de 90 dias para terapias físicas — liberação em Mai/2026.',
      limitesContratuais:
        'DUT 22 — RPG: 8 sessões/ciclo de 30 dias. Cobertura condicionada ao cumprimento da carência.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo RPG — ciatalgia e lombalgia postural',
      ],
    },
  },

  // ── SADT: Patrícia — 46a F, M25.5 dor articular ombro, pendência Rx (REQ-2026-SADT-005) ──
  sadt_patricia: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jun/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 46 anos (F) com dor articular em ombro direito (M25.5) e um ciclo de fisioterapia aprovado em 2025. Solicitação atual em pendência por ausência de Rx de ombro atualizado — exame exigido para nova autorização de ciclo fisioterápico conforme protocolo da operadora. Relatório clínico do ortopedista disponível, porém sem o exame de imagem complementar solicitado.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Ortopedia', 'Reumatologia'],
    },
    procedimentosRelacionados:
      'Fisioterapia motora — 1 ciclo (Jun/2025). Consultas ortopédicas semestrais. Ultrassonografia de ombro (Mar/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M25.5', count: 3, descricao: 'Dor articular — ombro' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2025-01641',
        procedimento: 'Fisioterapia Motora — 8 sessões (ciclo 1)',
        codigo: '20100110',
        cid: 'M25.5',
        data: 'Jun/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro ciclo — indicação ortopédica com Rx disponível',
        destaque: true,
      },
      {
        id: 'HIS-2025-01290',
        procedimento: 'Ultrassonografia de Ombro',
        codigo: '40901346',
        cid: 'M25.5',
        data: 'Mar/2025',
        decisao: 'aprovado',
        motivo: 'Exame diagnóstico de imagem — indicação reumatológica',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-patricia-1',
        mensagem: 'Pendência: Rx de ombro atualizado não anexado',
        detalhes:
          'Protocolo operacional exige Rx atualizado (máx. 6 meses) para renovação de ciclo fisioterápico em articulação.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — fisioterapia motora: 8 sessões/ciclo de 30 dias. Exame de imagem atualizado obrigatório para renovação.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Fisioterapia Motora — patologias articulares',
      ],
    },
  },

  // ── SADT: Eduardo — 70a M, I10 hipertensão, exames laboratoriais (REQ-2026-SADT-006) ──
  sadt_eduardo: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Abr/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário de 70 anos (M) com hipertensão arterial sistêmica (I10) em acompanhamento cardiológico e clínico de rotina. Solicitação recorrente de bateria laboratorial anual (hemograma, função renal, perfil lipídico, glicemia) conforme protocolo de monitoramento cardiovascular. Histórico de exames anuais sem intercorrências — padrão regular esperado para perfil de risco do beneficiário.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 12 meses',
      especialidades: ['Cardiologia', 'Clínica Médica'],
    },
    procedimentosRelacionados:
      'Bateria laboratorial anual — edições 2024 e 2025. Eletrocardiograma (Abr/2025). Consultas cardiológicas semestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'I10', count: 8, descricao: 'Hipertensão arterial essencial' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2025-01788',
        procedimento: 'Bateria Laboratorial — Rotina Cardiovascular (2025)',
        codigo: '40302041',
        cid: 'I10',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Monitoramento anual de paciente hipertenso em uso de medicação',
        destaque: true,
      },
      {
        id: 'HIS-2024-01102',
        procedimento: 'Bateria Laboratorial — Rotina Cardiovascular (2024)',
        codigo: '40302041',
        cid: 'I10',
        data: 'Abr/2024',
        decisao: 'aprovado',
        motivo: 'Acompanhamento anual regular',
      },
      {
        id: 'HIS-2025-01620',
        procedimento: 'Eletrocardiograma de Repouso',
        codigo: '40304361',
        cid: 'I10',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Rastreamento cardiovascular anual',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — exames laboratoriais de rotina: cobertura anual por indicação clínica documentada. Sem limite de quantidade por protocolo de monitoramento cardiovascular.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo de Monitoramento Cardiovascular — hipertensão e dislipidemias',
      ],
    },
  },

  // ── SADT: Gisele — 60a F, M54.5 lombalgia crônica, junta por quantidade RPG (REQ-2026-SADT-009) ──
  sadt_gisele: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiária de 60 anos (F) com lombalgia crônica (M54.5) e indicação de RPG por fisiatria. Solicitação atual de 14 sessões mensais excede o protocolo padrão de 8 sessões/ciclo, exigindo validação por Junta Médica. Histórico de utilização regular de RPG, com volumes crescentes nos últimos 6 meses. Relatório técnico de justificativa disponível, porém quantidade fora dos limites contratuais ordinários.',
    consultasRecentes: {
      count: 7,
      periodo: 'últimos 6 meses',
      especialidades: ['Fisiatria', 'Ortopedia'],
    },
    procedimentosRelacionados:
      'RPG — ciclos mensais desde Set/2025. Consultas fisiátricas mensais. Rx coluna lombossacra (Jan/2026).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M54.5', count: 6, descricao: 'Dor lombar — crônica' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00465',
        procedimento: 'RPG — 8 sessões (ciclo padrão)',
        codigo: '20100129',
        cid: 'M54.5',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Ciclo regular dentro do protocolo',
        destaque: true,
      },
      {
        id: 'HIS-2026-00312',
        procedimento: 'RPG — 10 sessões (com ajuste)',
        codigo: '20100129',
        cid: 'M54.5',
        data: 'Jan/2026',
        decisao: 'ajustado',
        motivo: 'Quantidade ajustada de 12 para 10 — acima do protocolo padrão',
      },
      {
        id: 'HIS-2025-02014',
        procedimento: 'RPG — 8 sessões',
        codigo: '20100129',
        cid: 'M54.5',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro ciclo — lombalgia crônica com indicação fisiátrica',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-gisele-1',
        mensagem: 'Quantidade solicitada (14 sessões/mês) acima do protocolo — Junta obrigatória',
        detalhes:
          'Protocolo contratual estabelece máximo de 8 sessões de RPG por ciclo de 30 dias. Solicitações acima deste limite requerem parecer de Junta Médica.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — RPG: 8 sessões/ciclo de 30 dias. Quantidades acima do protocolo → Junta Médica obrigatória.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo RPG — lombalgia crônica e disfunções posturais',
      ],
    },
  },

  // ── Exames AC: Fernanda — 44a F, G44.0 cefaleia em salvas, RM crânio (REQ-2026-EXAM-001) ──
  exam_fernanda: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Abr/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 44 anos (F) com cefaleia em salvas (G44.0) em acompanhamento neurológico e cefaleiológico. Solicitação recorrente de RM crânio com contraste para monitoramento anual — padrão regular para este diagnóstico. Exame anterior (Abr/2025) sem alterações estruturais relevantes. Indicação clínica bem fundamentada com justificativa técnica do neurologista.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Neurologia', 'Cefaleiologia'],
    },
    procedimentosRelacionados:
      'RM crânio com contraste anual (Abr/2025 — sem alterações). Consultas neurológicas bimestrais. Avaliação cefaleiológica semestral.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'G44.0', count: 6, descricao: 'Cefaleia em salvas' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2025-01755',
        procedimento: 'RM Crânio com Contraste',
        codigo: '40911250',
        cid: 'G44.0',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Monitoramento anual — cefaleia em salvas',
        destaque: true,
      },
      {
        id: 'HIS-2024-01088',
        procedimento: 'RM Crânio com Contraste',
        codigo: '40911250',
        cid: 'G44.0',
        data: 'Abr/2024',
        decisao: 'aprovado',
        motivo: 'Seguimento neurológico anual',
      },
      {
        id: 'HIS-2025-01544',
        procedimento: 'Consulta Neurológica',
        codigo: '40301230',
        cid: 'G44.0',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Acompanhamento regular',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — RM crânio: 1 exame/6 meses por indicação clínica documentada. Solicitação anual dentro do intervalo permitido.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Neurológica — cefaleias primárias',
      ],
    },
  },

  // ── Exames AC: João — 49a M, I25.9 coronariopatia, cintilografia, SLA violado (REQ-2026-EXAM-004) ──
  exam_joao: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Set/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário de 49 anos (M) com coronariopatia crônica (I25.9) em acompanhamento cardiológico e hemodinâmico. Solicitação de cintilografia miocárdica com urgência clínica — piora sintomática documentada pelo cardiologista. SLA de urgência violado pela operadora. Exame semestral habitual aprovado em Set/2025; novo exame justificado por mudança no quadro clínico.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Cardiologia', 'Hemodinâmica'],
    },
    procedimentosRelacionados:
      'Cintilografia miocárdica (Set/2025). Cateterismo diagnóstico (Mar/2025). Consultas cardiológicas mensais.',
    internacoes: {
      count: 1,
      periodo: 'últimos 12 meses',
      detalhes: 'Internação por síndrome coronária aguda — Jan/2026',
    },
    cidRecorrente: { cid: 'I25.9', count: 9, descricao: 'Doença isquêmica crônica do coração' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2025-01932',
        procedimento: 'Cintilografia Miocárdica de Perfusão',
        codigo: '40901167',
        cid: 'I25.9',
        data: 'Set/2025',
        decisao: 'aprovado',
        motivo: 'Seguimento semestral — coronariopatia em tratamento',
        destaque: true,
      },
      {
        id: 'HIS-2025-01521',
        procedimento: 'Cateterismo Cardíaco Diagnóstico',
        codigo: '40501077',
        cid: 'I25.9',
        data: 'Mar/2025',
        decisao: 'aprovado',
        motivo: 'Avaliação hemodinâmica indicada pelo cardiologista',
      },
      {
        id: 'HIS-2025-01200',
        procedimento: 'Ecocardiograma Doppler',
        codigo: '40303667',
        cid: 'I25.9',
        data: 'Jan/2025',
        decisao: 'aprovado',
        motivo: 'Avaliação de função ventricular',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-joao-1',
        mensagem: 'SLA de urgência violado — prazo ANS excedido',
        detalhes:
          'Solicitação classificada como urgência clínica. Prazo máximo ANS de 2 horas para urgências foi ultrapassado. Ação imediata necessária.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — cintilografia miocárdica: 1 exame/6 meses por indicação clínica. Urgência documentada justifica intervalo inferior ao padrão.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Cardiológica — coronariopatias',
        'RN 259/2011 — SLA urgências e emergências',
      ],
    },
  },

  // ── Exames AC: Letícia — 53a F, M50.0 lesão disco cervical, RM coluna, pendência (REQ-2026-EXAM-005) ──
  exam_leticia: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2024', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 53 anos (F) com lesão de disco cervical (M50.0) em acompanhamento ortopédico e neurológico. Solicitação de RM coluna cervical em pendência por ausência de relatório clínico detalhado — documento exigido para justificar novo exame dentro do intervalo de 12 meses. RM anterior realizada em Mar/2024. Sintomatologia descrita pelo médico solicitante, porém sem laudo estruturado conforme protocolo.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Ortopedia', 'Neurologia'],
    },
    procedimentosRelacionados:
      'RM coluna cervical (Mar/2024). Fisioterapia cervical — 2 ciclos em 2024. Consultas ortopédicas trimestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M50.0', count: 3, descricao: 'Lesão do disco cervical com mielopatia' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2024-01311',
        procedimento: 'RM Coluna Cervical com Contraste',
        codigo: '40911284',
        cid: 'M50.0',
        data: 'Mar/2024',
        decisao: 'aprovado',
        motivo: 'Investigação de mielopatia cervical — primeira RM',
        destaque: true,
      },
      {
        id: 'HIS-2024-01589',
        procedimento: 'Fisioterapia Motora — 8 sessões (ciclo 1)',
        codigo: '20100110',
        cid: 'M50.0',
        data: 'Jun/2024',
        decisao: 'aprovado',
        motivo: 'Tratamento conservador pós-diagnóstico',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-leticia-1',
        mensagem: 'Pendência: relatório clínico estruturado não anexado',
        detalhes:
          'Protocolo exige relatório clínico com descrição sintomática atualizada para solicitar RM de coluna dentro do intervalo de 12 meses.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — RM coluna: 1 exame/6 meses por indicação clínica documentada. Relatório técnico obrigatório para solicitações em intervalo inferior a 12 meses.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Musculoesquelética — coluna vertebral',
      ],
    },
  },

  // ── Exames AC: Cristina — 57a F, C18.9 câncer cólon, PET-CT oncológico (REQ-2026-EXAM-007) ──
  exam_cristina: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 57 anos (F) com adenocarcinoma de cólon (C18.9) submetida a cirurgia ressectiva em Jan/2026 e em tratamento quimioterápico adjuvante em curso. Solicitação de PET-CT oncológico para estadiamento pós-operatório conforme protocolo oncológico vigente. Exame de avaliação de resposta terapêutica justificado pela equipe de Oncologia e Cirurgia Geral. Histórico oncológico documentado e elegibilidade plena.',
    consultasRecentes: {
      count: 8,
      periodo: 'últimos 6 meses',
      especialidades: ['Oncologia', 'Cirurgia Geral'],
    },
    procedimentosRelacionados:
      'Cirurgia ressectiva de cólon (Jan/2026). Quimioterapia adjuvante — em curso (Feb/2026–). Colonoscopia diagnóstica (Nov/2025). PET-CT de estadiamento inicial (Dez/2025).',
    internacoes: {
      count: 1,
      periodo: 'últimos 6 meses',
      detalhes: 'Internação para cirurgia oncológica — Jan/2026 (7 dias)',
    },
    cidRecorrente: {
      cid: 'C18.9',
      count: 4,
      descricao: 'Neoplasia maligna do cólon, não especificada',
    },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00201',
        procedimento: 'PET-CT Oncológico — estadiamento inicial',
        codigo: '40901450',
        cid: 'C18.9',
        data: 'Dez/2025',
        decisao: 'aprovado',
        motivo: 'Estadiamento pré-operatório — protocolo oncológico',
        destaque: true,
      },
      {
        id: 'HIS-2026-00089',
        procedimento: 'Quimioterapia Adjuvante (ciclo)',
        codigo: '50000185',
        cid: 'C18.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Protocolo QT adjuvante pós-cirúrgico',
      },
      {
        id: 'HIS-2025-02201',
        procedimento: 'Colonoscopia com Biópsia',
        codigo: '40601110',
        cid: 'C18.9',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Diagnóstico inicial — colonoscopia diagnóstica',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-cristina-1',
        mensagem: 'Protocolo oncológico: exame de estadiamento pós-operatório — prioridade elevada',
        detalhes:
          'PET-CT solicitado dentro do protocolo de estadiamento oncológico após ressecção cirúrgica e início de QT adjuvante. Indicação de alta relevância clínica.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — PET-CT oncológico: cobertura garantida por indicação em protocolo de estadiamento e monitoramento de resposta terapêutica.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Oncológico — estadiamento e resposta terapêutica',
        'RN 566/2022 — cobertura obrigatória para tratamentos oncológicos',
      ],
    },
  },

  // ── Exames AC: André — 67a M, C34.9 carcinoma pulmão, TC tórax, justificativa ausente (REQ-2026-EXAM-008) ──
  exam_andre: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Out/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário de 67 anos (M) com carcinoma de pulmão (C34.9) e histórico de tabagismo de longa data. Solicitação de TC de tórax para seguimento oncológico — exame recorrente no protocolo de monitoramento. TC anterior realizada em Out/2025. Solicitação atual sem justificativa técnica estruturada anexada pelo médico pneumologista, conforme exigido pelo protocolo para solicitações dentro do intervalo de 6 meses.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Pneumologia', 'Oncologia'],
    },
    procedimentosRelacionados:
      'TC tórax — seguimento trimestral (Out/2025, Jul/2025). Broncoscopia diagnóstica (Jan/2025). Consultas pneumológicas mensais.',
    internacoes: {
      count: 1,
      periodo: 'últimos 12 meses',
      detalhes: 'Internação para broncoscopia e biópsia — Jan/2025',
    },
    cidRecorrente: { cid: 'C34.9', count: 7, descricao: 'Carcinoma brônquico, não especificado' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2025-02098',
        procedimento: 'TC Tórax de Alta Resolução',
        codigo: '40910211',
        cid: 'C34.9',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Seguimento oncológico trimestral — protocolo vigente',
        destaque: true,
      },
      {
        id: 'HIS-2025-01780',
        procedimento: 'TC Tórax de Alta Resolução',
        codigo: '40910211',
        cid: 'C34.9',
        data: 'Jul/2025',
        decisao: 'aprovado',
        motivo: 'Monitoramento trimestral de resposta ao tratamento',
      },
      {
        id: 'HIS-2025-01001',
        procedimento: 'Broncoscopia com Biópsia',
        codigo: '40601128',
        cid: 'C34.9',
        data: 'Jan/2025',
        decisao: 'aprovado',
        motivo: 'Diagnóstico histológico — indicação pneumológica',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-andre-1',
        mensagem: 'Justificativa técnica estruturada ausente na solicitação',
        detalhes:
          'Protocolo operacional exige justificativa técnica detalhada para exames de imagem oncológicos em intervalos inferiores a 90 dias. Documento não localizado na guia.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — TC tórax: 1 exame/3 meses por indicação oncológica documentada. Justificativa técnica obrigatória para intervalos abaixo do padrão.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Oncológico — seguimento de neoplasias pulmonares',
      ],
    },
  },

  // ── Home Care: Adelina — 83a F, I63.9 AVC, 12h enfermagem (REQ-2026-HC-001) ──
  hc_adelina: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 83 anos (F) com AVC isquêmico (I63.9) e sequelas motoras e cognitivas, internada por 15 dias em Mar/2026. Alta hospitalar com indicação de Home Care 12h de enfermagem para continuidade do cuidado pós-AVC. Um período anterior de HC aprovado em Jan/2026 (pós-episódio de descompensação clínica). Alta dependência funcional documentada por equipe multidisciplinar. Indicação clínica plenamente justificada.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Neurologia', 'Geriatria', 'Fisioterapia'],
    },
    procedimentosRelacionados:
      'Internação hospitalar por AVC (Mar/2026 — 15 dias). HC 12h anterior (Jan/2026). Fisioterapia neurológica domiciliar. Consultas neurológicas mensais.',
    internacoes: {
      count: 2,
      periodo: 'últimos 6 meses',
      detalhes: 'AVC isquêmico (Mar/2026, 15 dias) + episódio anterior (Jan/2026, 8 dias)',
    },
    cidRecorrente: { cid: 'I63.9', count: 3, descricao: 'AVC isquêmico, não especificado' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00380',
        procedimento: 'Home Care 12h Enfermagem — período 1',
        codigo: '50000619',
        cid: 'I63.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Alta hospitalar pós-AVC — cuidados domiciliares de continuidade',
        destaque: true,
      },
      {
        id: 'HIS-2026-00121',
        procedimento: 'Fisioterapia Neurológica Domiciliar',
        codigo: '20100152',
        cid: 'I63.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Reabilitação motora pós-AVC — domiciliar',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care: cobertura condicionada a avaliação multidisciplinar e plano de cuidados aprovado. Elegibilidade confirmada por internação recente e laudo de alta dependência funcional.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — pós-AVC e reabilitação neurológica domiciliar',
      ],
    },
  },

  // ── Home Care: Tarcísio — 77a M, F03 demência, 6h enfermagem, CRM inválido (REQ-2026-HC-004) ──
  hc_tarcisio: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário de 77 anos (M) com demência (F03) em estágio moderado, recebendo Home Care recorrente de 6h de enfermagem para supervisão e cuidados básicos de higiene e medicação. Solicitação atual com sinal de atenção crítico: CRM do médico solicitante não localizado no CFM — possível registro inválido ou desatualizado. Histórico de renovações mensais regulares sem intercorrências clínicas.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Geriatria', 'Neurologia'],
    },
    procedimentosRelacionados:
      'HC 6h enfermagem — renovações mensais desde Out/2025. Consultas geriátricas bimestrais. Avaliação neuropsicológica (Set/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F03', count: 6, descricao: 'Demência não especificada' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00421',
        procedimento: 'Home Care 6h Enfermagem — renovação',
        codigo: '50000600',
        cid: 'F03',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Renovação mensal — demência moderada, dependência funcional parcial',
        destaque: true,
      },
      {
        id: 'HIS-2026-00258',
        procedimento: 'Home Care 6h Enfermagem',
        codigo: '50000600',
        cid: 'F03',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Cuidado domiciliar contínuo — demência',
      },
      {
        id: 'HIS-2025-02144',
        procedimento: 'Home Care 6h Enfermagem',
        codigo: '50000600',
        cid: 'F03',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro período de HC aprovado',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-tarcisio-1',
        mensagem: 'CRM do médico solicitante inválido ou não localizado no CFM',
        detalhes:
          'Verificação automatizada do CFM não localizou o CRM informado. Pode indicar erro de digitação, CRM cancelado ou médico não habilitado. Autorização bloqueada até validação.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care: cobertura condicionada a avaliação multidisciplinar, plano de cuidados e CRM válido do solicitante. CRM inválido bloqueia autorização.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — demências e cuidados geriátricos domiciliares',
      ],
    },
  },

  // ── Home Care: Alfredo — 65a M, I63.9 AVC sequela, fisioterapia 5x/semana, pendência (REQ-2026-HC-005) ──
  hc_alfredo: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário de 65 anos (M) com sequela de AVC isquêmico (I63.9) após internação hospitalar em Fev/2026. Primeira solicitação de Home Care de fisioterapia neurológica domiciliar (5x/semana). Solicitação em pendência por ausência do plano de cuidados estruturado — documento obrigatório para autorização de Home Care conforme protocolo da operadora. Internação de 12 dias documentada e indicação clínica pertinente.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 3 meses',
      especialidades: ['Neurologia', 'Fisioterapia'],
    },
    procedimentosRelacionados:
      'Internação hospitalar por AVC (Fev/2026 — 12 dias). Fisioterapia hospitalar durante internação. Consulta neurológica de alta.',
    internacoes: {
      count: 1,
      periodo: 'últimos 6 meses',
      detalhes: 'AVC isquêmico — Fev/2026 (12 dias)',
    },
    cidRecorrente: { cid: 'I63.9', count: 1, descricao: 'AVC isquêmico — sequela motora' },
    autorizacoesAnteriores: [],
    sinaisAtencao: [
      {
        id: 'sa-alfredo-1',
        mensagem: 'Pendência: plano de cuidados domiciliares não anexado',
        detalhes:
          'Protocolo operacional de Home Care exige plano de cuidados estruturado, assinado por equipe multidisciplinar, para autorização da primeira solicitação.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care: cobertura condicionada a plano de cuidados multidisciplinar aprovado. Internação recente confirma elegibilidade clínica.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — reabilitação pós-AVC domiciliar',
      ],
    },
  },

  // ── Home Care: Lucinda — 80a F, F03 demência avançada, 24h enfermagem, devolutiva (REQ-2026-HC-006) ──
  hc_lucinda: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 80 anos (F) com demência avançada (F03) e alto grau de dependência funcional. Recebe Home Care 24h de enfermagem de forma recorrente desde Nov/2025. Solicitação atual retornou de devolutiva já com documentação complementar recebida e processo retomado. Histórico de renovações mensais regulares — sem intercorrências clínicas ou sinais de alerta ativos.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Geriatria', 'Neuropsiquiatria'],
    },
    procedimentosRelacionados:
      'HC 24h enfermagem — renovações mensais desde Nov/2025. Avaliação geriátrica bimestral. Avaliação neuropsiquiátrica (Dez/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F03', count: 5, descricao: 'Demência avançada — alta dependência' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00489',
        procedimento: 'Home Care 24h Enfermagem — renovação',
        codigo: '50000627',
        cid: 'F03',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Renovação mensal — demência avançada, dependência total',
        destaque: true,
      },
      {
        id: 'HIS-2026-00311',
        procedimento: 'Home Care 24h Enfermagem',
        codigo: '50000627',
        cid: 'F03',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Cuidado contínuo 24h — demência em estágio avançado',
      },
      {
        id: 'HIS-2025-02289',
        procedimento: 'Home Care 24h Enfermagem',
        codigo: '50000627',
        cid: 'F03',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Primeira autorização — avaliação multidisciplinar concluída',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care 24h: cobertura garantida por avaliação multidisciplinar ativa e laudo de alta dependência funcional. Renovação mensal regular.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — demências avançadas e cuidados paliativos geriátricos',
      ],
    },
  },

  // ── Home Care: Gertrudes — 89a F, C61 câncer próstata metastático, 24h multidisciplinar, junta (REQ-2026-HC-008) ──
  hc_gertrudes: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária de 89 anos (F) com câncer de próstata metastático (C61) em cuidados paliativos domiciliares. Internação hospitalar em Abr/2026 por descompensação clínica. Alta com indicação de escalada para Home Care 24h multidisciplinar (enfermagem + fisioterapia + cuidados paliativos). Solicitação encaminhada para Junta Médica em razão da complexidade da escala 24h e do perfil oncológico avançado.',
    consultasRecentes: {
      count: 7,
      periodo: 'últimos 3 meses',
      especialidades: ['Oncologia', 'Geriatria', 'Cuidados Paliativos'],
    },
    procedimentosRelacionados:
      'Internação hospitalar (Abr/2026 — 10 dias, descompensação oncológica). HC 12h anterior (Mar/2026). Consultas oncológicas mensais. Avaliação geriátrica trimestral.',
    internacoes: {
      count: 1,
      periodo: 'últimos 3 meses',
      detalhes: 'Descompensação oncológica — Abr/2026 (10 dias)',
    },
    cidRecorrente: {
      cid: 'C61',
      count: 5,
      descricao: 'Neoplasia maligna de próstata — metastática',
    },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-00558',
        procedimento: 'Home Care 12h Enfermagem — cuidados paliativos',
        codigo: '50000619',
        cid: 'C61',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Cuidados paliativos domiciliares — oncologia avançada',
        destaque: true,
      },
      {
        id: 'HIS-2026-00399',
        procedimento: 'Home Care 12h Enfermagem',
        codigo: '50000619',
        cid: 'C61',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Início dos cuidados paliativos domiciliares',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-gertrudes-1',
        mensagem: 'Junta Médica: escala 24h multidisciplinar em paciente oncológico avançado',
        detalhes:
          'Escalada de HC 12h para 24h multidisciplinar em paciente com câncer metastático requer validação por Junta Médica conforme protocolo operacional.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care 24h multidisciplinar: cobertura condicionada a avaliação por Junta Médica para escaladas em perfis oncológicos avançados.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Cuidados Paliativos Domiciliares — neoplasias avançadas',
        'RN 566/2022 — cobertura obrigatória para tratamentos oncológicos',
      ],
    },
  },
};

/** Maps a request ID to the corresponding history mock data key. */
export function getHistoryKey(requestId: string): string {
  const map: Record<string, string> = {
    // TEA
    'REQ-2026-04895': 'tea_arthur',
    'REQ-2026-M1-PEND-001': 'tea_sofia',
    'REQ-2026-M1-JUNTA-001': 'high_use',
    'REQ-2026-M1-JUNTA-002': 'tea_isabela',
    'REQ-2026-M1-LOCK-001': 'tea_daniel',
    // SADT
    'REQ-2026-SADT-002': 'sadt_roberto',
    'REQ-2026-SADT-004': 'sadt_marcos',
    'REQ-2026-SADT-005': 'sadt_patricia',
    'REQ-2026-SADT-006': 'sadt_eduardo',
    'REQ-2026-SADT-009': 'sadt_gisele',
    // Exames Alta Complexidade
    'REQ-2026-EXAM-001': 'exam_fernanda',
    'REQ-2026-EXAM-004': 'exam_joao',
    'REQ-2026-EXAM-005': 'exam_leticia',
    'REQ-2026-EXAM-007': 'exam_cristina',
    'REQ-2026-EXAM-008': 'exam_andre',
    // Home Care
    'REQ-2026-HC-001': 'hc_adelina',
    'REQ-2026-HC-004': 'hc_tarcisio',
    'REQ-2026-HC-005': 'hc_alfredo',
    'REQ-2026-HC-006': 'hc_lucinda',
    'REQ-2026-HC-008': 'hc_gertrudes',
    // Legacy TEA mocks
    'REQ-2026-04797': 'high_use',
    'REQ-2026-04818': 'high_use',
    'REQ-2026-04801': 'primeira_vez',
  };
  return map[requestId] ?? 'default';
}
