'use client';

import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

import { type HistoricoConsolidado } from '../types';

import AttentionSignalsSection from './AttentionSignalsSection';
import AuthorizationsSection from './AuthorizationsSection';
import EligibilitySection from './EligibilitySection';

// -- Mock data & helpers (extracted verbatim from original) ----------------

const DEFAULT_HISTORY: HistoricoConsolidado = {
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

const mockHistorico: Record<string, HistoricoConsolidado> = {
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
};

function getHistoryProfile(entry: HistoryEntry): 'high_use' | 'primeira_vez' | 'default' {
  if (entry.divergence && (entry.category === 'Oncologia' || entry.category === 'Internação'))
    return 'high_use';
  if (entry.waitingPeriod) return 'primeira_vez';
  return 'default';
}

function completenessLabel(c: HistoricoConsolidado['completeness']): {
  label: string;
  color: string;
  bg: string;
} {
  switch (c) {
    case 'complete':
      return { label: 'Histórico Completo', color: 'success.main', bg: 'rgba(22,163,74,0.1)' };
    case 'partial':
      return { label: 'Histórico Parcial', color: 'warning.main', bg: 'rgba(245,158,11,0.1)' };
    case 'limited':
      return { label: 'Histórico Limitado', color: '#ea580c', bg: 'rgba(234,88,12,0.1)' };
  }
}

function patternLabel(p: HistoricoConsolidado['linhaDoTempo']['padrao']): string {
  switch (p) {
    case 'first_time':
      return 'Primeira solicitação';
    case 'recurrent':
      return 'Uso recorrente (regular)';
    case 'frequent':
      return 'Uso frequente (acima da média)';
  }
}

// -- Component -------------------------------------------------------------

interface ConsolidatedHistorySectionProps {
  entry: HistoryEntry;
}

export default function ConsolidatedHistorySection({ entry }: ConsolidatedHistorySectionProps) {
  const key = getHistoryProfile(entry);
  const h = mockHistorico[key] ?? DEFAULT_HISTORY;
  const cp = completenessLabel(h.completeness);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <HistoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'text.secondary',
            }}
          >
            Histórico Consolidado
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            label={cp.label}
            size="small"
            sx={{
              backgroundColor: cp.bg,
              color: cp.color,
              fontWeight: 700,
              height: 22,
              fontSize: 12,
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
          Resumo assistencial e regulatório para suporte à decisão
        </Typography>

        {/* Linha do Tempo */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(37,99,235,0.04)',
            border: '1px solid rgba(37,99,235,0.12)',
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: 0.5,
              display: 'block',
              mb: 0.75,
            }}
          >
            Linha do Tempo
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Última solicitação similar
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {h.linhaDoTempo.ultimaSolicitacaoSimilar ?? '— Nenhuma'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Padrão de uso
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {patternLabel(h.linhaDoTempo.padrao)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Leitura Assistida */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(14,165,233,0.06)',
            border: '1px solid rgba(14,165,233,0.15)',
            mb: 2.5,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: 0.5,
              display: 'block',
              mb: 0.5,
            }}
          >
            Leitura Assistida
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.6 }}>
            {h.leituraAssistida}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Resumo Assistencial */}
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{
            textTransform: 'uppercase',
            fontSize: 12,
            letterSpacing: 0.5,
            display: 'block',
            mb: 1.5,
          }}
        >
          Resumo Assistencial
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
          {/* Consultas recentes */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                display: 'block',
                mb: 0.5,
              }}
            >
              Consultas Recentes
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}
            >
              {h.consultasRecentes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.consultasRecentes.periodo}
            </Typography>
            {h.consultasRecentes.especialidades.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
              >
                {h.consultasRecentes.especialidades.join(', ')}
              </Typography>
            )}
          </Box>
          {/* Procedimentos relacionados */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                display: 'block',
                mb: 0.5,
              }}
            >
              Procedimentos Relacionados
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.5, color: '#374151' }}>
              {h.procedimentosRelacionados}
            </Typography>
          </Box>
          {/* Internacoes */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                display: 'block',
                mb: 0.5,
              }}
            >
              Internações
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}
            >
              {h.internacoes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.internacoes.periodo}
            </Typography>
            {h.internacoes.detalhes ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
              >
                {h.internacoes.detalhes}
              </Typography>
            ) : null}
          </Box>
          {/* CID recorrente */}
          <Box
            sx={{
              p: 1.5,
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              backgroundColor: h.cidRecorrente ? 'rgba(245,158,11,0.06)' : 'transparent',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                display: 'block',
                mb: 0.5,
              }}
            >
              CID Recorrente
            </Typography>
            {h.cidRecorrente ? (
              <>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ fontSize: 13, color: '#92400e' }}
                >
                  {h.cidRecorrente.cid} ({h.cidRecorrente.count}x)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {h.cidRecorrente.descricao}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                Primeira ocorrência
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Autorizacoes Anteriores */}
        <AuthorizationsSection autorizacoesAnteriores={h.autorizacoesAnteriores} />

        {/* Sinais de Atencao */}
        {h.sinaisAtencao.length > 0 && (
          <>
            <Divider sx={{ mb: 2.5 }} />
            <AttentionSignalsSection sinaisAtencao={h.sinaisAtencao} />
          </>
        )}

        <Divider sx={{ mb: 2.5 }} />

        {/* Elegibilidade e Regras */}
        <EligibilitySection elegibilidade={h.elegibilidade} />
      </CardContent>
    </Card>
  );
}
