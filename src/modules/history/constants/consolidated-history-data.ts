import { type Category } from '@/types/pedido';

import { type HistoricoConsolidado } from '../types';

// ---- Default / fallback ----
export const DEFAULT_HISTORY: HistoricoConsolidado = {
  completeness: 'complete',
  linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
  leituraAssistida:
    'Beneficiário pediátrico com diagnóstico de TEA (F84.0) em acompanhamento multidisciplinar. Histórico consistente de sessões de Fonoaudiologia e Terapia Ocupacional. Evolução terapêutica documentada nos relatórios trimestrais. Sem intercorrências clínicas relevantes nos últimos 12 meses.',
  consultasRecentes: {
    count: 6,
    periodo: 'últimos 6 meses',
    especialidades: ['Neuropediatria', 'Psiquiatria Infantil', 'Pediatria'],
  },
  procedimentosRelacionados:
    'Acompanhamento neuropediátrico trimestral, sessões regulares de Fonoaudiologia e Terapia Ocupacional.',
  internacoes: { count: 0, periodo: 'últimos 12 meses' },
  cidRecorrente: { cid: 'F84.0', count: 12, descricao: 'Autismo infantil' },
  autorizacoesAnteriores: [
    {
      id: 'HIS-2026-00412',
      procedimento: 'Sessão de Fonoaudiologia (continuidade)',
      codigo: '50000370',
      cid: 'F84.0',
      data: 'Mar/2026',
      decisao: 'aprovado',
      motivo: 'Continuidade do plano terapêutico',
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

export const mockHistorico: Record<string, HistoricoConsolidado> = {
  // ── TEA: Lucas — 5a M, F84.0, ABA, aprovado, recorrente (HIS-2026-5001) ──
  tea_lucas: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário pediátrico de 5 anos (M) com TEA (F84.0) em protocolo ABA recorrente há 18 meses. Autorização aprovada com base em evolução terapêutica positiva documentada e laudo neuropsicológico vigente. Histórico regular sem intercorrências administrativas ou clínicas.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Psicologia', 'Terapia Ocupacional'],
    },
    procedimentosRelacionados:
      'Sessões mensais de ABA (16 sessões/mês). Terapia Ocupacional quinzenal. Acompanhamento neuropediátrico trimestral.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 18, descricao: 'Autismo infantil' },
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-05001',
        procedimento: 'Sessão ABA — renovação mensal',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — evolução terapêutica documentada, laudo vigente',
        destaque: true,
      },
      {
        id: 'REQ-2026-04901',
        procedimento: 'Sessão ABA — renovação mensal',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade do plano terapêutico',
      },
      {
        id: 'REQ-2025-09812',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.0',
        data: 'Set/2025',
        decisao: 'aprovado',
        motivo: 'Atualização anual obrigatória',
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

  // ── TEA: Laura — 7a F, F84.8, ABA, aprovado parcial, frequente (HIS-2026-5010) ──
  tea_laura: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiária pediátrica de 7 anos (F) com Transtorno do Espectro Autista (F84.8) em protocolo ABA de alta frequência. Solicitação aprovada parcialmente — quantidade ajustada de 24 para 20 sessões mensais conforme revisão clínica pelo analista. Padrão de uso frequente com solicitações mensais regulares. Histórico sem sinais de alerta relevantes.',
    consultasRecentes: {
      count: 8,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria', 'Psiquiatria Infantil', 'Fonoaudiologia'],
    },
    procedimentosRelacionados:
      'Protocolo ABA (20-24 sessões/mês). Fonoaudiologia (2x/semana). Acompanhamento neuropediátrico mensal.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: {
      cid: 'F84.8',
      count: 15,
      descricao: 'Outros transtornos globais do desenvolvimento',
    },
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-05010',
        procedimento: 'Sessão ABA — 20 sessões (ajustado de 24)',
        codigo: '50000470',
        cid: 'F84.8',
        data: 'Abr/2026',
        decisao: 'ajustado',
        motivo: 'Aprovado parcial — quantidade ajustada para 20 sessões conforme revisão clínica',
        destaque: true,
      },
      {
        id: 'REQ-2026-04920',
        procedimento: 'Sessão ABA — 22 sessões',
        codigo: '50000470',
        cid: 'F84.8',
        data: 'Mar/2026',
        decisao: 'aprovado',
        motivo: 'Plano terapêutico em vigência',
      },
      {
        id: 'REQ-2025-10188',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.8',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Atualização anual do laudo',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Ajuste de quantidade por revisão clínica — não configura restrição contratual.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Júlia — 5a F, F80.2, Fonoaudiologia, aprovado, divergência de CID (HIS-2026-5013) ──
  tea_julia: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária pediátrica de 5 anos (F) com Afasia (F80.2) em acompanhamento fonoaudiológico. Autorização aprovada com registro de divergência de CID: prestador informou F84.0 no pedido, porém laudo clínico documenta F80.2. Analista manteve aprovação com CID corrigido e anotação de divergência no histórico. Evolução terapêutica satisfatória documentada.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Fonoaudiologia', 'Neuropediatria', 'Pediatria'],
    },
    procedimentosRelacionados:
      'Fonoaudiologia (2x/semana). Avaliação de linguagem semestral. Acompanhamento neuropediátrico trimestral.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F80.2', count: 8, descricao: 'Afasia adquirida com epilepsia' },
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-05013',
        procedimento: 'Sessão de Fonoaudiologia — CID corrigido para F80.2',
        codigo: '50000370',
        cid: 'F80.2',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado com divergência de CID registrada — laudo confirma F80.2',
        destaque: true,
      },
      {
        id: 'REQ-2026-04931',
        procedimento: 'Sessão de Fonoaudiologia',
        codigo: '50000370',
        cid: 'F80.2',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade do plano terapêutico',
      },
      {
        id: 'REQ-2025-09540',
        procedimento: 'Avaliação Fonoaudiológica de Linguagem',
        codigo: '50000362',
        cid: 'F80.2',
        data: 'Ago/2025',
        decisao: 'aprovado',
        motivo: 'Avaliação semestral de evolução',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-julia-1',
        mensagem: 'Divergência de CID registrada — prestador informou F84.0, laudo indica F80.2',
        detalhes:
          'CID corrigido pelo analista. Prestador deve ser notificado para ajuste nos próximos pedidos.',
        severidade: 'low',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Fonoaudiologia para F80.2 coberta conforme ANS. Sem restrições contratuais aplicáveis.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Fonoaudiologia — afasia e distúrbios da linguagem',
      ],
    },
  },

  // ── TEA: Davi — 8a M, F84.9, ABA, negado, primeira vez (HIS-2026-5015) ──
  tea_davi: {
    completeness: 'limited',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário pediátrico de 8 anos (M) com TEA (F84.9) — primeira solicitação de ABA na operadora. Autorização negada por ausência do laudo neuropsicológico obrigatório — documento não foi anexado à guia. Sem histórico assistencial prévio registrado. Prestador deve resubmeter com documentação completa.',
    consultasRecentes: {
      count: 1,
      periodo: 'últimos 6 meses',
      especialidades: ['Neuropediatria'],
    },
    procedimentosRelacionados: 'Consulta neuropediátrica inicial — diagnóstico de TEA (Mar/2026).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-05015',
        procedimento: 'Sessão ABA — 16 sessões',
        codigo: '50000470',
        cid: 'F84.9',
        data: 'Abr/2026',
        decisao: 'negado',
        motivo: 'Negado — laudo neuropsicológico obrigatório não anexado',
        destaque: true,
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-davi-5015-1',
        mensagem: 'Laudo neuropsicológico obrigatório ausente',
        detalhes:
          'Primeiro pedido de terapia para TEA requer laudo neuropsicológico vigente (máx. 12 meses). Documento não localizado na guia.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Cobertura condicionada a laudo neuropsicológico vigente.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── TEA: Isabela — 9a F, F84.0, ABA, aprovado parcial, junta (HIS-2026-5020) ──
  tea_isabela_his: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiária pediátrica de 9 anos (F) com TEA (F84.0) em protocolo ABA intensivo. Autorização aprovada parcialmente após Junta Médica — quantidade ajustada de 92 para 80 sessões mensais conforme parecer da Junta. Histórico de solicitações com volumes elevados, todas passando por Junta Médica nos últimos 4 meses.',
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
      'Protocolo ABA intensivo (20-23h/semana). Terapia Ocupacional (2x/semana). Acompanhamento neuropediátrico mensal.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'F84.0', count: 20, descricao: 'Autismo infantil' },
    autorizacoesAnteriores: [
      {
        id: 'REQ-2026-05020',
        procedimento: 'Sessão ABA — 80 sessões (ajustado de 92)',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Abr/2026',
        decisao: 'ajustado',
        motivo: 'Aprovado parcial após Junta Médica — 80 sessões validadas',
        destaque: true,
      },
      {
        id: 'REQ-2026-04955',
        procedimento: 'Sessão ABA — 80 sessões (ajustado de 88)',
        codigo: '50000470',
        cid: 'F84.0',
        data: 'Mar/2026',
        decisao: 'ajustado',
        motivo: 'Aprovado parcial após Junta Médica — protocolo EIBI validado',
      },
      {
        id: 'REQ-2026-01210',
        procedimento: 'Reavaliação Neuropsicológica',
        codigo: '50000387',
        cid: 'F84.0',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Atualização anual obrigatória',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 539/2022 — sessões ilimitadas para CID F84.x. Quantidades >80/mês → Junta Médica obrigatória por regra operacional.',
      dutRelevantes: [
        'RN 539/2022 — Terapias Especiais (sessões ilimitadas)',
        'DUT 6 — Terapias do Espectro Autista',
      ],
    },
  },

  // ── SADT: Antônio — M54.5, fisioterapia motora, aprovado, recorrente (HIS-2026-SADT-001) ──
  sadt_antonio: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com lombalgia (M54.5) em acompanhamento ortopédico e fisiátrico. Autorização de fisioterapia motora aprovada regularmente — terceiro ciclo consecutivo. Evolução clínica documentada com melhora funcional progressiva. Indicação técnica mantida pelo ortopedista com relatório de retorno atualizado.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Ortopedia', 'Fisiatria'],
    },
    procedimentosRelacionados:
      'Fisioterapia motora — 3 ciclos consecutivos. Rx coluna lombar (Dez/2025). Consultas ortopédicas trimestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M54.5', count: 6, descricao: 'Dor lombar' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-SADT-001',
        procedimento: 'Fisioterapia Motora — 10 sessões (ciclo 3)',
        codigo: '20100110',
        cid: 'M54.5',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — ciclo regular com evolução funcional favorável',
        destaque: true,
      },
      {
        id: 'REQ-2026-SADT-A01',
        procedimento: 'Fisioterapia Motora — 10 sessões (ciclo 2)',
        codigo: '20100110',
        cid: 'M54.5',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Segundo ciclo — relatório de evolução satisfatória',
      },
      {
        id: 'REQ-2025-SADT-B09',
        procedimento: 'Fisioterapia Motora — 10 sessões (ciclo 1)',
        codigo: '20100110',
        cid: 'M54.5',
        data: 'Set/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro ciclo — indicação ortopédica',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — fisioterapia motora: 12 sessões/ciclo de 30 dias. Terceiro ciclo dentro dos limites contratuais.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Fisioterapia Motora — lombalgia inespecífica',
      ],
    },
  },

  // ── SADT: Cláudia — I10, coleta laboratorial, aprovado, recorrente (HIS-2026-SADT-002) ──
  sadt_claudia: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Abr/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com hipertensão arterial sistêmica (I10) em acompanhamento cardiológico regular. Autorização de bateria laboratorial anual aprovada conforme protocolo de monitoramento cardiovascular. Exames de rotina sem alterações relevantes nas últimas 2 edições. Padrão de uso regular e previsível.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 12 meses',
      especialidades: ['Cardiologia', 'Clínica Médica'],
    },
    procedimentosRelacionados:
      'Bateria laboratorial anual — 2025 e 2024. Eletrocardiograma (Abr/2025). Consultas cardiológicas semestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'I10', count: 7, descricao: 'Hipertensão arterial essencial' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-SADT-002',
        procedimento: 'Bateria Laboratorial — Rotina Cardiovascular (2026)',
        codigo: '40302041',
        cid: 'I10',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — monitoramento anual de hipertensa em uso de medicação',
        destaque: true,
      },
      {
        id: 'REQ-2025-SADT-CL01',
        procedimento: 'Bateria Laboratorial — Rotina Cardiovascular (2025)',
        codigo: '40302041',
        cid: 'I10',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Acompanhamento anual regular',
      },
      {
        id: 'REQ-2025-SADT-CL02',
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
        'DUT 22 — exames laboratoriais de rotina: cobertura anual por indicação clínica documentada.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo de Monitoramento Cardiovascular — hipertensão',
      ],
    },
  },

  // ── SADT: Marcelo — M54.4, RPG, negado, quantidade além do protocolo (HIS-2026-SADT-003) ──
  sadt_marcelo: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'frequent' },
    leituraAssistida:
      'Beneficiário com ciatalgia (M54.4) e indicação de RPG pelo fisiatria. Autorização negada por quantidade solicitada (16 sessões) acima do protocolo contratual (8 sessões/ciclo). Histórico de solicitações com volumes crescentes nos últimos 3 meses — padrão de uso frequente sem embasamento técnico adicional para a escalada.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Fisiatria', 'Ortopedia'],
    },
    procedimentosRelacionados:
      'RPG — 2 ciclos aprovados (Out/2025, Jan/2026). Consultas fisiátricas mensais. Rx coluna lombossacra (Dez/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M54.4', count: 4, descricao: 'Lumbago com ciática' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-SADT-003',
        procedimento: 'RPG — 16 sessões (solicitado)',
        codigo: '20100129',
        cid: 'M54.4',
        data: 'Abr/2026',
        decisao: 'negado',
        motivo:
          'Negado — 16 sessões supera o limite de 8/ciclo sem justificativa técnica para Junta',
        destaque: true,
      },
      {
        id: 'REQ-2026-SADT-M01',
        procedimento: 'RPG — 8 sessões (ciclo 2)',
        codigo: '20100129',
        cid: 'M54.4',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Ciclo regular dentro do protocolo',
      },
      {
        id: 'REQ-2025-SADT-M02',
        procedimento: 'RPG — 8 sessões (ciclo 1)',
        codigo: '20100129',
        cid: 'M54.4',
        data: 'Out/2025',
        decisao: 'aprovado',
        motivo: 'Primeiro ciclo — ciatalgia com indicação fisiátrica',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-marcelo-sadt-1',
        mensagem: 'Quantidade solicitada (16 sessões) acima do protocolo contratual (8/ciclo)',
        detalhes:
          'Solicitações acima do limite padrão requerem justificativa técnica e parecer de Junta Médica. Nenhum desses documentos foi apresentado.',
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
        'Protocolo RPG — ciatalgia e lombalgia postural',
      ],
    },
  },

  // ── SADT: Renata — L20.9, imunoterapia, aprovado, pendência anterior, Dermatologia (HIS-2026-SADT-004) ──
  sadt_renata: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com dermatite atópica moderada-grave (L20.9) em tratamento de imunoterapia subcutânea. Autorização atual aprovada após devolutiva anterior por pendência de laudo atualizado do dermatologista — documentação recebida e processo retomado. Tratamento iniciado em 2025 com boa resposta clínica documentada. Acompanhamento conjunto por Dermatologia e Alergologia.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Dermatologia', 'Alergologia'],
    },
    procedimentosRelacionados:
      'Imunoterapia subcutânea — ciclos mensais desde Jun/2025. Consultas dermatológicas bimestrais. Patch test (Jun/2025).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'L20.9', count: 7, descricao: 'Dermatite atópica, não especificada' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-SADT-004',
        procedimento: 'Imunoterapia Subcutânea — ciclo mensal',
        codigo: '20100498',
        cid: 'L20.9',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado após devolutiva — laudo atualizado recebido e validado',
        destaque: true,
      },
      {
        id: 'REQ-2026-SADT-R01',
        procedimento: 'Imunoterapia Subcutânea — ciclo mensal',
        codigo: '20100498',
        cid: 'L20.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade do tratamento — resposta clínica positiva',
      },
      {
        id: 'REQ-2025-SADT-R02',
        procedimento: 'Imunoterapia Subcutânea — ciclo inicial',
        codigo: '20100498',
        cid: 'L20.9',
        data: 'Jun/2025',
        decisao: 'aprovado',
        motivo: 'Início do tratamento — indicação dermatológica com patch test',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — imunoterapia: cobertura por indicação clínica documentada com avaliação especializada. Sem limite de ciclos por protocolo de resposta terapêutica.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imunoterapia — dermatite atópica e alergias',
      ],
    },
  },

  // ── SADT: Sérgio — J44.9, fisioterapia respiratória, aprovado parcial, divergência (HIS-2026-SADT-005) ──
  sadt_sergio: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com DPOC (J44.9) em acompanhamento pneumológico. Autorização de fisioterapia respiratória aprovada parcialmente — código de procedimento divergente corrigido pelo analista (prestador informou código de fisioterapia motora; autorizado código correto de fisioterapia respiratória). Histórico de fisioterapia respiratória regular com boa resposta clínica documentada.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Pneumologia', 'Clínica Médica'],
    },
    procedimentosRelacionados:
      'Fisioterapia respiratória — ciclos mensais desde Out/2025. Espirometria (Jan/2026). Consultas pneumológicas bimestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'J44.9', count: 6, descricao: 'DPOC, não especificada' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-SADT-005',
        procedimento: 'Fisioterapia Respiratória — 10 sessões (código corrigido)',
        codigo: '20100064',
        cid: 'J44.9',
        data: 'Abr/2026',
        decisao: 'ajustado',
        motivo: 'Aprovado parcial — código corrigido de fisioterapia motora para respiratória',
        destaque: true,
      },
      {
        id: 'REQ-2026-SADT-S01',
        procedimento: 'Fisioterapia Respiratória — 10 sessões',
        codigo: '20100064',
        cid: 'J44.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Ciclo regular — DPOC com indicação pneumológica',
      },
      {
        id: 'REQ-2025-SADT-S02',
        procedimento: 'Espirometria',
        codigo: '40202810',
        cid: 'J44.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Avaliação de função pulmonar semestral',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-sergio-sadt-1',
        mensagem:
          'Divergência de código: prestador informou fisioterapia motora — corrigido para respiratória',
        detalhes:
          'Código de procedimento corrigido pelo analista conforme CID e indicação clínica. Prestador notificado para ajuste.',
        severidade: 'low',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — fisioterapia respiratória: 12 sessões/ciclo de 30 dias. Código de procedimento deve refletir a modalidade correta.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Fisioterapia Respiratória — DPOC e doenças pulmonares crônicas',
      ],
    },
  },

  // ── Exames AC: Yara — G44.0, RM crânio, aprovado, recorrente (HIS-2026-EXAM-001) ──
  exam_yara: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Abr/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com cefaleia em salvas (G44.0) em acompanhamento neurológico anual. RM crânio com contraste aprovada regularmente para monitoramento de longa data. Exame anterior sem alterações estruturais. Indicação clínica mantida pelo neurologista com justificativa técnica atualizada.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Neurologia', 'Cefaleiologia'],
    },
    procedimentosRelacionados:
      'RM crânio anual — 2025, 2024 sem alterações. Consultas neurológicas bimestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'G44.0', count: 5, descricao: 'Cefaleia em salvas' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-EXAM-001',
        procedimento: 'RM Crânio com Contraste',
        codigo: '40911250',
        cid: 'G44.0',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — monitoramento anual regular, justificativa técnica válida',
        destaque: true,
      },
      {
        id: 'REQ-2025-EXAM-Y01',
        procedimento: 'RM Crânio com Contraste',
        codigo: '40911250',
        cid: 'G44.0',
        data: 'Abr/2025',
        decisao: 'aprovado',
        motivo: 'Seguimento neurológico anual',
      },
      {
        id: 'REQ-2024-EXAM-Y02',
        procedimento: 'RM Crânio com Contraste',
        codigo: '40911250',
        cid: 'G44.0',
        data: 'Abr/2024',
        decisao: 'aprovado',
        motivo: 'Seguimento neurológico anual',
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

  // ── Exames AC: Thiago — C50.9, PET-CT oncológico, aprovado, staging (HIS-2026-EXAM-002) ──
  exam_thiago: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Nov/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com carcinoma de mama (C50.9) em estadiamento oncológico pós-cirúrgico. PET-CT aprovado conforme protocolo de estadiamento e monitoramento de resposta terapêutica. Cirurgia realizada em Out/2025; quimioterapia adjuvante em curso. Indicação plenamente justificada por protocolo oncológico vigente.',
    consultasRecentes: {
      count: 7,
      periodo: 'últimos 6 meses',
      especialidades: ['Oncologia', 'Cirurgia Geral'],
    },
    procedimentosRelacionados:
      'Cirurgia oncológica (Out/2025). QT adjuvante em curso (Nov/2025–). PET-CT de estadiamento inicial (Nov/2025).',
    internacoes: {
      count: 1,
      periodo: 'últimos 6 meses',
      detalhes: 'Internação para cirurgia oncológica — Out/2025 (5 dias)',
    },
    cidRecorrente: {
      cid: 'C50.9',
      count: 4,
      descricao: 'Neoplasia maligna da mama, não especificada',
    },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-EXAM-002',
        procedimento: 'PET-CT Oncológico — estadiamento pós-cirúrgico',
        codigo: '40901450',
        cid: 'C50.9',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — estadiamento de resposta terapêutica conforme protocolo oncológico',
        destaque: true,
      },
      {
        id: 'REQ-2025-EXAM-T01',
        procedimento: 'PET-CT Oncológico — estadiamento inicial',
        codigo: '40901450',
        cid: 'C50.9',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Estadiamento pré-operatório',
      },
      {
        id: 'REQ-2025-EXAM-T02',
        procedimento: 'Quimioterapia Adjuvante (ciclo)',
        codigo: '50000185',
        cid: 'C50.9',
        data: 'Nov/2025',
        decisao: 'aprovado',
        motivo: 'Protocolo QT adjuvante pós-cirúrgico',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — PET-CT oncológico: cobertura por protocolo de estadiamento e monitoramento de resposta terapêutica.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Oncológico — estadiamento e resposta terapêutica',
        'RN 566/2022 — cobertura obrigatória para tratamentos oncológicos',
      ],
    },
  },

  // ── Exames AC: Vanessa — M51.1, RM coluna lombar, negado, pendência timeout (HIS-2026-EXAM-003) ──
  exam_vanessa: {
    completeness: 'limited',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com lesão de disco intervertebral lombar (M51.1) e solicitação de RM de coluna lombar. Autorização negada por timeout de pendência — documentação complementar solicitada não foi entregue dentro do prazo estabelecido. Exame anterior aprovado em Fev/2025. Prestador deve resubmeter com documentação completa.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 6 meses',
      especialidades: ['Ortopedia', 'Neurologia'],
    },
    procedimentosRelacionados:
      'RM coluna lombar (Fev/2025). Fisioterapia motora — 1 ciclo (Abr/2025). Consultas ortopédicas semestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: {
      cid: 'M51.1',
      count: 2,
      descricao: 'Degeneração de disco intervertebral — lombar',
    },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-EXAM-003',
        procedimento: 'RM Coluna Lombar sem Contraste',
        codigo: '40911276',
        cid: 'M51.1',
        data: 'Abr/2026',
        decisao: 'negado',
        motivo: 'Negado — pendência expirada; documentação não recebida no prazo',
        destaque: true,
      },
      {
        id: 'REQ-2025-EXAM-V01',
        procedimento: 'RM Coluna Lombar sem Contraste',
        codigo: '40911276',
        cid: 'M51.1',
        data: 'Fev/2025',
        decisao: 'aprovado',
        motivo: 'Investigação de lombociatalgia — primeira RM aprovada',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-vanessa-exam-1',
        mensagem: 'Pendência expirada — documentação não recebida dentro do prazo',
        detalhes:
          'Prazo de devolutiva de 7 dias corridos encerrado sem recebimento do relatório clínico solicitado. Guia encerrada por timeout.',
        severidade: 'medium',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — RM coluna: 1 exame/6 meses por indicação clínica documentada. Guia pode ser resubmetida com documentação completa.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Musculoesquelética — coluna vertebral',
      ],
    },
  },

  // ── Exames AC: Otávio — I25.9, cintilografia, aprovado parcial, junta (HIS-2026-EXAM-004) ──
  exam_otavio: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Set/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com coronariopatia crônica (I25.9) em acompanhamento cardiológico. Cintilografia miocárdica aprovada parcialmente após Junta Médica — exame autorizado com protocolo simplificado em lugar do protocolo completo solicitado. Histórico de cintilografias semestrais regulares; Junta solicitada pela segunda vez em função de divergência de protocolo.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Cardiologia', 'Hemodinâmica'],
    },
    procedimentosRelacionados:
      'Cintilografia miocárdica — semestrais 2025. Ecocardiograma (Jan/2026). Consultas cardiológicas mensais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'I25.9', count: 8, descricao: 'Doença isquêmica crônica do coração' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-EXAM-004',
        procedimento: 'Cintilografia Miocárdica — protocolo simplificado (ajustado)',
        codigo: '40901167',
        cid: 'I25.9',
        data: 'Abr/2026',
        decisao: 'ajustado',
        motivo:
          'Aprovado parcial após Junta — protocolo simplificado autorizado em lugar do completo',
        destaque: true,
      },
      {
        id: 'REQ-2025-EXAM-O01',
        procedimento: 'Cintilografia Miocárdica de Perfusão',
        codigo: '40901167',
        cid: 'I25.9',
        data: 'Set/2025',
        decisao: 'aprovado',
        motivo: 'Seguimento semestral regular',
      },
      {
        id: 'REQ-2025-EXAM-O02',
        procedimento: 'Ecocardiograma Doppler',
        codigo: '40303667',
        cid: 'I25.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Avaliação de função ventricular',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — cintilografia miocárdica: 1 exame/6 meses por indicação clínica. Protocolo de execução sujeito a validação técnica.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Cardiológica — coronariopatias e avaliação de isquemia',
      ],
    },
  },

  // ── Exames AC: Larissa — E05.9, cintilografia tireoidiana, aprovado, Endocrinologia (HIS-2026-EXAM-005) ──
  exam_larissa: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com hipertireoidismo (E05.9) em acompanhamento endocrinológico. Cintilografia tireoidiana aprovada para avaliação de nódulos e função da tireoide. Exame indicado anualmente conforme protocolo de seguimento de tiroidopatias. Resultado anterior sem alterações nodulares relevantes.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Endocrinologia', 'Clínica Médica'],
    },
    procedimentosRelacionados:
      'Cintilografia tireoidiana anual — 2025. Ultrassonografia de tireoide (Fev/2026). Consultas endocrinológicas bimestrais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'E05.9', count: 5, descricao: 'Tireotoxicose, não especificada' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-EXAM-005',
        procedimento: 'Cintilografia Tireoidiana',
        codigo: '40901140',
        cid: 'E05.9',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — seguimento anual de hipertireoidismo com nódulos',
        destaque: true,
      },
      {
        id: 'REQ-2025-EXAM-L01',
        procedimento: 'Cintilografia Tireoidiana',
        codigo: '40901140',
        cid: 'E05.9',
        data: 'Mar/2025',
        decisao: 'aprovado',
        motivo: 'Avaliação anual de função e morfologia tireoidiana',
      },
      {
        id: 'REQ-2026-EXAM-L02',
        procedimento: 'Ultrassonografia de Tireoide',
        codigo: '40901028',
        cid: 'E05.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Rastreamento de nódulos — complementar à cintilografia',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'DUT 22 — cintilografia tireoidiana: 1 exame/12 meses por indicação endocrinológica documentada.',
      dutRelevantes: [
        'DUT 22 — Procedimentos, Terapias e Exames (Tabela TISS)',
        'Protocolo Imagem Endócrina — tiroidopatias e nódulos tireóideos',
      ],
    },
  },

  // ── Home Care: Joaquim — I63.9, HC 12h, aprovado (HIS-2026-HC-001) ──
  hc_joaquim: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com AVC isquêmico (I63.9) e sequelas neuromotoras em cuidados domiciliares. HC 12h de enfermagem aprovado como continuidade de cuidados pós-internação. Alta dependência funcional documentada por equipe multidisciplinar. Plano de cuidados estruturado e avaliação geriátrica e neurológica atualizadas.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Geriatria', 'Neurologia', 'Fisioterapia'],
    },
    procedimentosRelacionados:
      'HC 12h — renovações mensais desde Jan/2026. Internação por AVC (Dez/2025 — 12 dias). Fisioterapia neurológica domiciliar.',
    internacoes: {
      count: 1,
      periodo: 'últimos 6 meses',
      detalhes: 'AVC isquêmico — Dez/2025 (12 dias)',
    },
    cidRecorrente: { cid: 'I63.9', count: 3, descricao: 'AVC isquêmico, não especificado' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-HC-001',
        procedimento: 'Home Care 12h Enfermagem — renovação',
        codigo: '50000619',
        cid: 'I63.9',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — renovação mensal com dependência funcional documentada',
        destaque: true,
      },
      {
        id: 'REQ-2026-HC-J01',
        procedimento: 'Home Care 12h Enfermagem — período 2',
        codigo: '50000619',
        cid: 'I63.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade de cuidados pós-AVC',
      },
      {
        id: 'REQ-2026-HC-J02',
        procedimento: 'Home Care 12h Enfermagem — período 1',
        codigo: '50000619',
        cid: 'I63.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Início do HC — alta hospitalar pós-AVC',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care: cobertura garantida por avaliação multidisciplinar e plano de cuidados aprovado. Renovação mensal regular.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — pós-AVC e reabilitação neurológica domiciliar',
      ],
    },
  },

  // ── Home Care: Vera — C50.9, HC paliativos, aprovado (HIS-2026-HC-002) ──
  hc_vera: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com câncer de mama metastático (C50.9) em cuidados paliativos domiciliares. HC aprovado regularmente com escopo paliativo — enfermagem, controle de dor e suporte nutricional. Equipe oncológica acompanha mensalmente. Alta qualidade de vida domiciliar documentada com conforto e dignidade preservados.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 3 meses',
      especialidades: ['Oncologia', 'Cuidados Paliativos', 'Geriatria'],
    },
    procedimentosRelacionados:
      'HC paliativos — renovações mensais desde Set/2025. Consultas oncológicas mensais. Avaliação paliativa bimestral.',
    internacoes: { count: 0, periodo: 'últimos 6 meses' },
    cidRecorrente: { cid: 'C50.9', count: 5, descricao: 'Neoplasia maligna da mama — metastática' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-HC-002',
        procedimento: 'Home Care Paliativos — período mensal',
        codigo: '50000635',
        cid: 'C50.9',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado — cuidados paliativos domiciliares em oncologia avançada',
        destaque: true,
      },
      {
        id: 'REQ-2026-HC-V01',
        procedimento: 'Home Care Paliativos — período mensal',
        codigo: '50000635',
        cid: 'C50.9',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Continuidade dos cuidados paliativos',
      },
      {
        id: 'REQ-2025-HC-V02',
        procedimento: 'Home Care Paliativos — início',
        codigo: '50000635',
        cid: 'C50.9',
        data: 'Set/2025',
        decisao: 'aprovado',
        motivo: 'Início dos cuidados paliativos domiciliares',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care paliativo: cobertura garantida para pacientes oncológicos em estágio avançado com indicação de cuidados de conforto.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Cuidados Paliativos Domiciliares — neoplasias avançadas',
        'RN 566/2022 — cobertura obrigatória para tratamentos oncológicos',
      ],
    },
  },

  // ── Home Care: Hermínio — F03, HC 6h, negado, demência (HIS-2026-HC-003) ──
  hc_herminio: {
    completeness: 'limited',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário com demência (F03) e primeira solicitação de HC 6h de enfermagem. Autorização negada por ausência de avaliação multidisciplinar obrigatória para abertura de HC — documento não apresentado. Sem histórico anterior de HC. Prestador deve resubmeter com laudo multidisciplinar atualizado que documente grau de dependência funcional.',
    consultasRecentes: {
      count: 2,
      periodo: 'últimos 6 meses',
      especialidades: ['Geriatria', 'Neurologia'],
    },
    procedimentosRelacionados:
      'Consulta geriátrica diagnóstica (Fev/2026). Avaliação neurológica (Mar/2026).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-HC-003',
        procedimento: 'Home Care 6h Enfermagem',
        codigo: '50000600',
        cid: 'F03',
        data: 'Abr/2026',
        decisao: 'negado',
        motivo: 'Negado — avaliação multidisciplinar obrigatória não apresentada',
        destaque: true,
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-herminio-hc-1',
        mensagem: 'Avaliação multidisciplinar obrigatória não localizada na guia',
        detalhes:
          'Primeira solicitação de Home Care exige laudo multidisciplinar com Escala de Barthel ou equivalente documentando grau de dependência funcional.',
        severidade: 'high',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care: cobertura condicionada a avaliação multidisciplinar documentando dependência funcional. Resubmissão com documentação completa necessária.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — demências e cuidados geriátricos domiciliares',
      ],
    },
  },

  // ── Home Care: Conceição — I63.9, HC fisio, aprovado parcial, pendência, divergência (HIS-2026-HC-004) ──
  hc_conceicao: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiária com sequela de AVC isquêmico (I63.9) em fisioterapia neurológica domiciliar. Autorização aprovada parcialmente após pendência resolvida — prestador informou frequência de 7x/semana; aprovado 5x/semana conforme protocolo de reabilitação domiciliar. Plano de cuidados atualizado e avaliação multidisciplinar disponível. Divergência de frequência registrada no histórico.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Neurologia', 'Fisioterapia', 'Geriatria'],
    },
    procedimentosRelacionados:
      'HC fisioterapia neurológica 5x/semana — desde Jan/2026. Internação por AVC (Nov/2025 — 10 dias). Consultas neurológicas mensais.',
    internacoes: {
      count: 1,
      periodo: 'últimos 6 meses',
      detalhes: 'AVC isquêmico — Nov/2025 (10 dias)',
    },
    cidRecorrente: { cid: 'I63.9', count: 3, descricao: 'AVC isquêmico — sequela motora' },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-HC-004',
        procedimento: 'HC Fisioterapia Neurológica — 5x/semana (ajustado de 7x)',
        codigo: '20100152',
        cid: 'I63.9',
        data: 'Abr/2026',
        decisao: 'ajustado',
        motivo:
          'Aprovado parcial após pendência — frequência ajustada para 5x/semana conforme protocolo',
        destaque: true,
      },
      {
        id: 'REQ-2026-HC-C01',
        procedimento: 'HC Fisioterapia Neurológica — 5x/semana',
        codigo: '20100152',
        cid: 'I63.9',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Início da fisioterapia domiciliar — pós-AVC',
      },
    ],
    sinaisAtencao: [
      {
        id: 'sa-conceicao-hc-1',
        mensagem: 'Divergência de frequência: prestador solicitou 7x/semana — aprovado 5x/semana',
        detalhes:
          'Protocolo de reabilitação domiciliar pós-AVC prevê até 5 sessões semanais. Frequência maior requer justificativa técnica adicional e parecer de Junta Médica.',
        severidade: 'low',
      },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care fisioterapia: máximo 5 sessões/semana por protocolo de reabilitação domiciliar. Frequências superiores → Junta Médica.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Home Care — reabilitação neurológica domiciliar pós-AVC',
      ],
    },
  },

  // ── Home Care: Rolando — C61, HC 24h, aprovado, junta (HIS-2026-HC-005) ──
  hc_rolando: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com câncer de próstata metastático (C61) em cuidados paliativos domiciliares 24h. Autorização de escala 24h aprovada após Junta Médica que validou a complexidade do caso oncológico avançado e a necessidade de cuidado contínuo. Histórico de HC 12h previamente aprovado. Internação recente confirmou deterioração clínica justificando a escalada.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 3 meses',
      especialidades: ['Oncologia', 'Geriatria', 'Cuidados Paliativos'],
    },
    procedimentosRelacionados:
      'HC 24h — aprovado Abr/2026 após Junta. HC 12h — Jan–Mar/2026. Internação por descompensação (Mar/2026 — 8 dias). Consultas oncológicas mensais.',
    internacoes: {
      count: 1,
      periodo: 'últimos 3 meses',
      detalhes: 'Descompensação oncológica — Mar/2026 (8 dias)',
    },
    cidRecorrente: {
      cid: 'C61',
      count: 4,
      descricao: 'Neoplasia maligna de próstata — metastática',
    },
    autorizacoesAnteriores: [
      {
        id: 'HIS-2026-HC-005',
        procedimento: 'Home Care 24h Multidisciplinar — cuidados paliativos',
        codigo: '50000627',
        cid: 'C61',
        data: 'Abr/2026',
        decisao: 'aprovado',
        motivo: 'Aprovado após Junta Médica — escala 24h validada para oncologia avançada',
        destaque: true,
      },
      {
        id: 'REQ-2026-HC-R01',
        procedimento: 'Home Care 12h Enfermagem — cuidados paliativos',
        codigo: '50000619',
        cid: 'C61',
        data: 'Fev/2026',
        decisao: 'aprovado',
        motivo: 'Cuidados paliativos domiciliares — 12h',
      },
      {
        id: 'REQ-2026-HC-R02',
        procedimento: 'Home Care 12h Enfermagem — início',
        codigo: '50000619',
        cid: 'C61',
        data: 'Jan/2026',
        decisao: 'aprovado',
        motivo: 'Início dos cuidados paliativos domiciliares',
      },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Home Care 24h multidisciplinar: cobertura garantida após validação por Junta Médica para pacientes oncológicos em estágio avançado.',
      dutRelevantes: [
        'DUT 22 — Serviços de Home Care (Tabela TISS)',
        'Protocolo Cuidados Paliativos Domiciliares — neoplasias avançadas',
        'RN 566/2022 — cobertura obrigatória para tratamentos oncológicos',
      ],
    },
  },
};

// ---- Defaults por categoria (coerentes com perfil esperado) ----
const DEFAULT_BY_CATEGORY: Record<Category, HistoricoConsolidado> = {
  'Terapias Especiais': DEFAULT_HISTORY,
  SADT: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário adulto em acompanhamento ambulatorial. Histórico de procedimentos diagnóstico-terapêuticos pontuais. Sem internações nos últimos 12 meses. Carteirinha ativa, sem inadimplência.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Clínica Geral', 'Ortopedia'],
    },
    procedimentosRelacionados:
      'Coletas laboratoriais regulares, fisioterapia ambulatorial e exames de rotina nos últimos meses.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais aplicáveis para procedimentos SADT.',
      dutRelevantes: [],
    },
  },
  'Exames Alta Complexidade': {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário em investigação diagnóstica. Histórico de exames anteriores compatíveis com hipótese diagnóstica em curso. Sem repetição recente do mesmo exame solicitado.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 6 meses',
      especialidades: ['Clínica Geral', 'Especialista'],
    },
    procedimentosRelacionados:
      'Exames laboratoriais e de imagem prévios consistentes com a investigação clínica em curso.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Procedimentos de alta complexidade exigem justificativa técnica explícita.',
      dutRelevantes: [],
    },
  },
  'Home Care': {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Jan/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário idoso ou em condição clínica que requer suporte domiciliar contínuo. Histórico recente de internações com alta para programa de Home Care. Suporte familiar documentado.',
    consultasRecentes: {
      count: 8,
      periodo: 'últimos 6 meses',
      especialidades: ['Clínica Geral', 'Geriatria', 'Enfermagem domiciliar'],
    },
    procedimentosRelacionados:
      'Programa Home Care anterior, fisioterapia domiciliar regular e acompanhamento de enfermagem.',
    internacoes: { count: 1, periodo: 'últimos 12 meses', detalhes: 'Internação clínica recente' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Cobertura Home Care conforme contrato; renovação periódica obrigatória.',
      dutRelevantes: [],
    },
  },
  'Urgência/Emergência': {
    completeness: 'limited',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Atendimento de urgência/emergência. Histórico assistencial limitado para o quadro agudo apresentado. Beneficiário com elegibilidade ativa — RN 566/2022 garante atendimento imediato sem autorização prévia.',
    consultasRecentes: {
      count: 2,
      periodo: 'últimos 6 meses',
      especialidades: ['Clínica Geral'],
    },
    procedimentosRelacionados:
      'Sem procedimentos relacionados diretamente ao quadro agudo nos últimos meses.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'RN 566/2022 art. 3º — atendimento imediato para urgência/emergência. Carência reduzida a 24h conforme RN 195/2009.',
      dutRelevantes: ['RN 566/2022 — Urgência/Emergência'],
    },
  },
  Oncologia: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Fev/2026', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário em tratamento oncológico ativo. Histórico de ciclos prévios documentados. Estadiamento clínico atualizado. Protocolo terapêutico reconhecido pela SBOC. Sem intercorrências graves no último ciclo.',
    consultasRecentes: {
      count: 6,
      periodo: 'últimos 6 meses',
      especialidades: ['Oncologia clínica', 'Radioterapia'],
    },
    procedimentosRelacionados:
      'Ciclos quimioterápicos anteriores, exames de estadiamento e acompanhamento oncológico regular.',
    internacoes: { count: 1, periodo: 'últimos 12 meses', detalhes: 'Hospital-dia para ciclo QT' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Cobertura oncológica integral. Protocolos SBOC/NCCN como referência.',
      dutRelevantes: ['DUT 70 — Quimioterapia antineoplásica', 'RN 566/2022'],
    },
  },
  Internação: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Out/2025', padrao: 'recurrent' },
    leituraAssistida:
      'Beneficiário com histórico de internações eletivas prévias. Comorbidades documentadas. Plano de cuidados hospitalares apresentado, nível de auditoria coerente com indicação clínica.',
    consultasRecentes: {
      count: 5,
      periodo: 'últimos 6 meses',
      especialidades: ['Clínica Geral', 'Especialista'],
    },
    procedimentosRelacionados:
      'Internações eletivas anteriores, exames pré-internação e acompanhamento ambulatorial regular.',
    internacoes: {
      count: 2,
      periodo: 'últimos 12 meses',
      detalhes: 'Internações clínicas eletivas',
    },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Cobertura hospitalar conforme contrato. Tabela TISS 18 aplicável.',
      dutRelevantes: ['RN 566/2022'],
    },
  },
  'Cirurgias Eletivas': {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário com indicação cirúrgica eletiva. Pré-operatório em montagem ou completo. Avaliação pré-anestésica realizada. Plano cirúrgico detalhado com procedimento principal e acessórios. Sem cirurgias prévias relacionadas no histórico recente.',
    consultasRecentes: {
      count: 4,
      periodo: 'últimos 6 meses',
      especialidades: ['Especialista cirúrgico', 'Anestesiologia'],
    },
    procedimentosRelacionados:
      'Exames pré-operatórios completos (hemograma, coagulograma, ECG, RX) e avaliação anestésica recentes.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Cobertura cirúrgica eletiva conforme contrato. SLA regulatório RN 566/2022 — 21 dias úteis.',
      dutRelevantes: ['RN 566/2022'],
    },
  },
  OPME: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida:
      'Beneficiário com indicação cirúrgica que demanda materiais OPME. Lista de materiais com registros ANVISA apresentada. Cotações de fornecedores credenciados anexadas. Análise contempla validação regulatória, comparativo de cotações e adequação clínica.',
    consultasRecentes: {
      count: 3,
      periodo: 'últimos 6 meses',
      especialidades: ['Especialista cirúrgico'],
    },
    procedimentosRelacionados:
      'Exames pré-operatórios e avaliações especializadas compatíveis com a indicação cirúrgica que motivou o pedido de OPME.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: null,
    autorizacoesAnteriores: [],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais:
        'Cobertura OPME conforme tabela TISS 19. Exige registro ANVISA válido e cotações comparativas (mínimo 3 fornecedores).',
      dutRelevantes: ['RN 566/2022', 'TISS 19 — Materiais'],
    },
  },
};

export interface ConsolidatedHistoryRef {
  id: string;
  category: Category;
}

/**
 * Resolve histórico consolidado para qualquer entidade que carregue id + category
 * (HistoryEntry ou Request). Prioridade: mock específico por ID > default por
 * categoria > DEFAULT_HISTORY (TEA fallback).
 */
export function resolveConsolidatedHistory(ref: ConsolidatedHistoryRef): HistoricoConsolidado {
  const key = getHistoryKey(ref.id);
  const specific = mockHistorico[key];
  if (specific) return specific;
  return DEFAULT_BY_CATEGORY[ref.category];
}

/** Maps a HIS entry ID to the corresponding history mock data key. */
export function getHistoryKey(entryId: string): string {
  const map: Record<string, string> = {
    // TEA HIS entries
    'HIS-2026-5001': 'tea_lucas',
    'HIS-2026-5010': 'tea_laura',
    'HIS-2026-5013': 'tea_julia',
    'HIS-2026-5015': 'tea_davi',
    'HIS-2026-5020': 'tea_isabela_his',
    // SADT HIS entries
    'HIS-2026-SADT-001': 'sadt_antonio',
    'HIS-2026-SADT-002': 'sadt_claudia',
    'HIS-2026-SADT-003': 'sadt_marcelo',
    'HIS-2026-SADT-004': 'sadt_renata',
    'HIS-2026-SADT-005': 'sadt_sergio',
    // Exames AC HIS entries
    'HIS-2026-EXAM-001': 'exam_yara',
    'HIS-2026-EXAM-002': 'exam_thiago',
    'HIS-2026-EXAM-003': 'exam_vanessa',
    'HIS-2026-EXAM-004': 'exam_otavio',
    'HIS-2026-EXAM-005': 'exam_larissa',
    // Home Care HIS entries
    'HIS-2026-HC-001': 'hc_joaquim',
    'HIS-2026-HC-002': 'hc_vera',
    'HIS-2026-HC-003': 'hc_herminio',
    'HIS-2026-HC-004': 'hc_conceicao',
    'HIS-2026-HC-005': 'hc_rolando',
  };
  return map[entryId] ?? 'default';
}
