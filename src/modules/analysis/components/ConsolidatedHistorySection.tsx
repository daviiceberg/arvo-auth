'use client'

import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HistoryIcon from '@mui/icons-material/History'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import { type Pedido } from '@/data/pedidos'

// ---- Types ----
interface HistoricoConsolidado {
  completeness: 'complete' | 'partial' | 'limited'
  linhaDoTempo: { ultimaSolicitacaoSimilar: string | null; padrao: 'first_time' | 'recurrent' | 'frequent' }
  leituraAssistida: string
  consultasRecentes: { count: number; periodo: string; especialidades: string[] }
  procedimentosRelacionados: string
  internacoes: { count: number; periodo: string; detalhes?: string }
  cidRecorrente: { cid: string; count: number; descricao: string } | null
  sessoesDoMes?: { utilizadas: number; autorizadas: number; tipo: string; cidF84?: boolean; dut?: string }[]
  autorizacoesAnteriores: Array<{
    id: string; procedimento: string; codigo: string; cid: string
    data: string; decisao: 'aprovado' | 'negado' | 'ajustado'; motivo: string; destaque?: boolean
  }>
  sinaisAtencao: Array<{ id: string; mensagem: string; detalhes?: string; severidade: 'low' | 'medium' | 'high' }>
  elegibilidade: {
    status: 'ativo' | 'suspenso' | 'carencia'
    carencias: boolean; detalhesCarencia?: string
    limitesContratuais: string
    dutRelevantes: string[]
  }
}

// ---- Mock data ----
const mockHistorico: Record<string, HistoricoConsolidado> = {
  default: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Dez/2025', padrao: 'recurrent' },
    leituraAssistida: 'Beneficiário com histórico regular de uso assistencial. Padrão de consultas dentro da média esperada para o perfil. Sem intercorrências relevantes nos últimos 12 meses.',
    consultasRecentes: { count: 4, periodo: 'últimos 6 meses', especialidades: ['Cardiologia', 'Clínica Geral'] },
    procedimentosRelacionados: 'Exames laboratoriais de rotina e consultas ambulatoriais.',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'Z00.0', count: 2, descricao: 'Exame geral de rotina' },
    autorizacoesAnteriores: [
      { id: 'REQ-2025-09821', procedimento: 'Consulta Cardiologista', codigo: '10101012', cid: 'Z00.0', data: 'Dez/2025', decisao: 'aprovado', motivo: 'Indicação clínica adequada' },
      { id: 'REQ-2025-07634', procedimento: 'Hemograma Completo', codigo: '40302605', cid: 'Z00.0', data: 'Set/2025', decisao: 'aprovado', motivo: 'Exame de rotina' },
      { id: 'REQ-2025-05112', procedimento: 'Eletrocardiograma', codigo: '20101010', cid: 'I10', data: 'Jun/2025', decisao: 'negado', motivo: 'Ausência de pedido médico' },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais identificadas.',
      dutRelevantes: ['DUT 1 — Exames de rotina', 'DUT 12 — Consultas ambulatoriais'],
    },
  },
  high_use: {
    completeness: 'partial',
    linhaDoTempo: { ultimaSolicitacaoSimilar: 'Mar/2026', padrao: 'frequent' },
    leituraAssistida: 'Beneficiário com padrão de uso elevado e frequente. Volume de consultas e procedimentos significativamente acima da média. Múltiplas especialidades envolvidas nos últimos 6 meses. Recomenda-se avaliação cuidadosa da pertinência clínica.',
    consultasRecentes: { count: 12, periodo: 'últimos 6 meses', especialidades: ['Reumatologia', 'Ortopedia', 'Clínica Geral', 'Fisioterapia', 'Psicologia'] },
    procedimentosRelacionados: 'Múltiplos procedimentos de reabilitação, exames de imagem e consultas especializadas recorrentes.',
    internacoes: { count: 2, periodo: 'últimos 12 meses', detalhes: 'Jan/2026 — Clínica Médica (3 dias); Out/2025 — Ortopedia (2 dias)' },
    cidRecorrente: { cid: 'M79.3', count: 4, descricao: 'Fibromialgia' },
    sessoesDoMes: [
      { utilizadas: 20, autorizadas: 20, tipo: 'ABA / Análise do Comportamento', cidF84: true, dut: 'DUT 6 — Terapias do Espectro Autista' },
      { utilizadas: 8, autorizadas: 8, tipo: 'Fonoaudiologia', cidF84: true, dut: 'DUT 6 — Terapias do Espectro Autista' },
    ],
    autorizacoesAnteriores: [
      { id: 'REQ-2026-03801', procedimento: 'Sessão de Fisioterapia', codigo: '50000470', cid: 'M79.3', data: 'Mar/2026', decisao: 'aprovado', motivo: 'Indicação clínica adequada', destaque: true },
      { id: 'REQ-2026-02654', procedimento: 'RNM de Coluna Lombar', codigo: '40901010', cid: 'M51.1', data: 'Fev/2026', decisao: 'aprovado', motivo: 'Solicitação médica com justificativa' },
      { id: 'REQ-2026-01423', procedimento: 'Consulta Reumatologia', codigo: '10101012', cid: 'M79.3', data: 'Jan/2026', decisao: 'ajustado', motivo: 'Quantidade reduzida conforme protocolo' },
      { id: 'REQ-2025-11209', procedimento: 'Internação Clínica', codigo: '40301010', cid: 'M79.3', data: 'Jan/2026', decisao: 'aprovado', motivo: 'Agudização com indicação clínica' },
      { id: 'REQ-2025-09876', procedimento: 'Exames Laboratoriais Múltiplos', codigo: '40302605', cid: 'M79.3', data: 'Nov/2025', decisao: 'aprovado', motivo: 'Protocolo de investigação' },
    ],
    sinaisAtencao: [
      { id: 'sa1', mensagem: 'Alto volume de uso — beneficiário entre os top 5% de utilizadores', detalhes: '12 consultas e 2 internações nos últimos 6 meses.', severidade: 'high' },
      { id: 'sa2', mensagem: 'Múltiplas especialidades simultâneas — possível fragmentação do cuidado', severidade: 'medium' },
      { id: 'sa3', mensagem: 'CID M79.3 recorrente em 4 autorizações — avaliar adesão ao tratamento', severidade: 'low' },
    ],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Limite de sessões de fisioterapia atingido (24/24). Internações dentro do limite contratual.',
      dutRelevantes: ['DUT 30 — Fisioterapia', 'DUT 33 — Internação clínica', 'DUT 18 — Exames de imagem'],
    },
  },
  primeira_vez: {
    completeness: 'complete',
    linhaDoTempo: { ultimaSolicitacaoSimilar: null, padrao: 'first_time' },
    leituraAssistida: 'Beneficiário sem histórico anterior de solicitações similares. Esta é a primeira autorização registrada para este tipo de procedimento. Histórico assistencial limpo e sem ocorrências relevantes.',
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
    leituraAssistida: 'Beneficiário com histórico ortopédico documentado. Consultas de acompanhamento em Ortopedia nos últimos 18 meses com progressão da coxartrose bilateral. Radiografias seriadas confirmam piora gradual. Indicação cirúrgica compatível com o quadro clínico registrado.',
    consultasRecentes: { count: 6, periodo: 'últimos 12 meses', especialidades: ['Ortopedia', 'Clínica Geral', 'Anestesiologia'] },
    procedimentosRelacionados: 'Consultas ortopédicas de acompanhamento, radiografias de quadril bilateral, sessões de fisioterapia (encerradas por falha de resposta).',
    internacoes: { count: 0, periodo: 'últimos 12 meses' },
    cidRecorrente: { cid: 'M16.1', count: 4, descricao: 'Coxartrose primária unilateral' },
    autorizacoesAnteriores: [
      { id: 'REQ-2026-02310', procedimento: 'Fisioterapia Ortopédica', codigo: '50000470', cid: 'M16.1', data: 'Fev/2026', decisao: 'aprovado', motivo: 'Indicação clínica documentada' },
      { id: 'REQ-2025-11847', procedimento: 'Radiografia Quadril Bilateral', codigo: '40901060', cid: 'M16.1', data: 'Nov/2025', decisao: 'aprovado', motivo: 'Acompanhamento evolutivo' },
      { id: 'REQ-2025-08934', procedimento: 'Consulta Ortopedia', codigo: '10101012', cid: 'M16.1', data: 'Ago/2025', decisao: 'aprovado', motivo: 'Solicitação médica com indicação' },
    ],
    sinaisAtencao: [],
    elegibilidade: {
      status: 'ativo',
      carencias: false,
      limitesContratuais: 'Sem restrições contratuais identificadas. Cobertura OPME ativa conforme contrato Premium.',
      dutRelevantes: [
        'DUT 45 — Artroplastia total de quadril',
        'DUT 63 — Próteses, órteses e materiais especiais (OPME)',
      ],
    },
  },
}

function getHistoricoKey(pedidoId: string): string {
  if (pedidoId === 'REQ-2026-04797') return 'high_use'
  if (pedidoId === 'REQ-2026-04801') return 'primeira_vez'
  if (pedidoId === 'REQ-2026-04905') return 'opme_quadril'
  return 'default'
}

// ---- Helper functions ----
function completenessLabel(c: HistoricoConsolidado['completeness']): { label: string; color: string; bg: string } {
  switch (c) {
    case 'complete': return { label: 'Histórico Completo', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' }
    case 'partial': return { label: 'Histórico Parcial', color: '#b45309', bg: 'rgba(245,158,11,0.1)' }
    case 'limited': return { label: 'Histórico Limitado', color: '#ea580c', bg: 'rgba(234,88,12,0.1)' }
  }
}

function padraoLabel(p: HistoricoConsolidado['linhaDoTempo']['padrao']): string {
  switch (p) {
    case 'first_time': return 'Primeira solicitação'
    case 'recurrent': return 'Uso recorrente (regular)'
    case 'frequent': return 'Uso frequente (acima da média)'
  }
}

function decisaoIcon(d: 'aprovado' | 'negado' | 'ajustado') {
  if (d === 'aprovado') return <CheckIcon sx={{ fontSize: 14, color: '#16a34a' }} />
  if (d === 'negado') return <CloseIcon sx={{ fontSize: 14, color: '#d4183d' }} />
  return <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
}

function decisaoChipColor(d: 'aprovado' | 'negado' | 'ajustado') {
  if (d === 'aprovado') return { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' }
  if (d === 'negado') return { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' }
  return { bg: 'rgba(245,158,11,0.1)', color: '#b45309' }
}

function sinaisAtencaoColor(s: 'low' | 'medium' | 'high'): 'info' | 'warning' | 'error' {
  if (s === 'low') return 'info'
  if (s === 'medium') return 'warning'
  return 'error'
}

// ---- Component ----
interface ConsolidatedHistorySectionProps {
  pedido: Pedido
}

export default function ConsolidatedHistorySection({ pedido }: ConsolidatedHistorySectionProps) {
  const key = getHistoricoKey(pedido.id)
  const h = mockHistorico[key]
  const cp = completenessLabel(h.completeness)
  const [showAllAuth, setShowAllAuth] = useState(false)
  const visibleAuth = showAllAuth ? h.autorizacoesAnteriores : h.autorizacoesAnteriores.slice(0, 3)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <HistoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
            Histórico Consolidado
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            label={cp.label}
            size="small"
            sx={{ backgroundColor: cp.bg, color: cp.color, fontWeight: 700, height: 22, fontSize: 12 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
          Resumo assistencial e regulatório para suporte à decisão
        </Typography>

        {/* Linha do Tempo */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', mb: 2 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 0.75 }}>
            Linha do Tempo
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Última solicitação similar</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {h.linhaDoTempo.ultimaSolicitacaoSimilar ?? '— Nenhuma'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>Padrão de uso</Typography>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {padraoLabel(h.linhaDoTempo.padrao)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Leitura Assistida */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', mb: 2.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
            Leitura Assistida
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.6 }}>
            {h.leituraAssistida}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Resumo Assistencial */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Resumo Assistencial
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
          {/* Consultas recentes */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Consultas Recentes
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}>
              {h.consultasRecentes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.consultasRecentes.periodo}
            </Typography>
            {h.consultasRecentes.especialidades.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
                {h.consultasRecentes.especialidades.join(', ')}
              </Typography>
            )}
          </Box>
          {/* Procedimentos relacionados */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Procedimentos Relacionados
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.5, color: '#374151' }}>
              {h.procedimentosRelacionados}
            </Typography>
          </Box>
          {/* Internações */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Internações
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 18, color: '#1e293b', lineHeight: 1 }}>
              {h.internacoes.count}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {h.internacoes.periodo}
            </Typography>
            {h.internacoes.detalhes && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
                {h.internacoes.detalhes}
              </Typography>
            )}
          </Box>
          {/* CID recorrente */}
          <Box sx={{
            p: 1.5,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 2,
            backgroundColor: h.cidRecorrente ? 'rgba(245,158,11,0.06)' : 'transparent',
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              CID Recorrente
            </Typography>
            {h.cidRecorrente ? (
              <>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#92400e' }}>
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

        {/* Sessões do Mês */}
        {h.sessoesDoMes && h.sessoesDoMes.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1 }}>
              Sessões Mensais
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {h.sessoesDoMes.map((s) => {
                if (s.cidF84) {
                  return (
                    <Box key={s.tipo} sx={{ p: 1.5, border: '1px solid rgba(37,99,235,0.25)', borderRadius: 2, backgroundColor: 'rgba(37,99,235,0.04)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: 12 }}>{s.tipo}</Typography>
                          {s.dut && (
                            <Chip label={s.dut} size="small" sx={{ fontSize: 10, height: 18, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 600, '& .MuiChip-label': { px: 0.75 } }} />
                          )}
                        </Box>
                        <Chip label="Ilimitado (RN 539)" size="small" sx={{ fontSize: 10, height: 18, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 700, '& .MuiChip-label': { px: 0.75 } }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 11, color: '#2563eb', fontWeight: 500 }}>
                        {s.utilizadas} sessões utilizadas · Sem limite contratual — RN 539/2022
                      </Typography>
                      <Box sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(37,99,235,0.15)', mt: 0.75 }}>
                        <Box sx={{ height: '100%', width: '100%', borderRadius: 3, backgroundColor: '#2563eb', opacity: 0.5 }} />
                      </Box>
                    </Box>
                  )
                }
                const pct = Math.min((s.utilizadas / s.autorizadas) * 100, 100)
                const barColor = pct >= 100 ? '#d4183d' : pct >= 80 ? '#f59e0b' : '#16a34a'
                return (
                  <Box key={s.tipo} sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography variant="caption" fontWeight={600} sx={{ fontSize: 12 }}>{s.tipo}</Typography>
                        {s.dut && (
                          <Chip label={s.dut} size="small" sx={{ fontSize: 10, height: 18, backgroundColor: 'rgba(0,0,0,0.06)', color: 'text.secondary', fontWeight: 600, '& .MuiChip-label': { px: 0.75 } }} />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: barColor }}>
                        {s.utilizadas}/{s.autorizadas} sessões
                      </Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.08)' }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, borderRadius: 3, backgroundColor: barColor, transition: 'width 400ms ease' }} />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 2.5 }} />

        {/* Autorizações Anteriores */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Autorizações Anteriores
        </Typography>
        {h.autorizacoesAnteriores.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 2 }}>
            Nenhuma autorização anterior registrada.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
            {visibleAuth.map((auth) => {
              const dc = decisaoChipColor(auth.decisao)
              return (
                <Box
                  key={auth.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.25,
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 1.5,
                    backgroundColor: auth.destaque ? 'rgba(245,158,11,0.04)' : 'transparent',
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>{decisaoIcon(auth.decisao)}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, mb: 0.25 }}>
                      {auth.procedimento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      {auth.data} · CID {auth.cid} · {auth.motivo}
                    </Typography>
                  </Box>
                  <Chip
                    label={auth.decisao}
                    size="small"
                    sx={{ backgroundColor: dc.bg, color: dc.color, fontWeight: 700, height: 20, fontSize: 12 }}
                  />
                </Box>
              )
            })}
          </Box>
        )}
        {h.autorizacoesAnteriores.length > 3 && (
          <Button
            size="small"
            onClick={() => setShowAllAuth(!showAllAuth)}
            endIcon={<ExpandMoreIcon sx={{ transform: showAllAuth ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: 16 }} />}
            sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'none', mb: 1.5 }}
          >
            {showAllAuth ? 'Mostrar menos' : `Ver mais ${h.autorizacoesAnteriores.length - 3} registros`}
          </Button>
        )}

        {/* Sinais de Atenção */}
        {(() => {
          const isF84 = pedido.procedimentos.some(p => p.cid?.startsWith('F84'))
          const isTerapias = pedido.categoria === 'Terapias Especiais'
          const SUPRIMIDOS_F84 = ['alto volume', 'limite de sessões', 'quantidade acima', 'alta utilização']
          const filteredSinais = (isTerapias && isF84)
            ? h.sinaisAtencao.filter(s => !SUPRIMIDOS_F84.some(k => s.mensagem.toLowerCase().includes(k)))
            : h.sinaisAtencao
          const hasHighUseF84 = isTerapias && isF84 && h.sinaisAtencao.some(s => SUPRIMIDOS_F84.some(k => s.mensagem.toLowerCase().includes(k)))
          if (filteredSinais.length === 0 && !hasHighUseF84) return null
          return (
            <>
              <Divider sx={{ mb: 2.5 }} />
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
                Sinais de Atenção
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                {hasHighUseF84 && (
                  <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ borderRadius: 1.5, py: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} display="block">
                      Alta frequência de sessões identificada
                    </Typography>
                    <Typography variant="caption">
                      Para CID F84, RN 539/2022 garante cobertura ilimitada — volume elevado não é fundamento para negativa.
                    </Typography>
                  </Alert>
                )}
                {filteredSinais.map((sinal) => (
                  <Alert key={sinal.id} severity={sinaisAtencaoColor(sinal.severidade)} sx={{ borderRadius: 1.5, py: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} display="block">
                      {sinal.mensagem}
                    </Typography>
                    {sinal.detalhes && (
                      <Typography variant="caption">{sinal.detalhes}</Typography>
                    )}
                  </Alert>
                ))}
              </Box>
            </>
          )
        })()}

        <Divider sx={{ mb: 2.5 }} />

        {/* Elegibilidade e Regras */}
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
          Elegibilidade e Regras
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {/* Etapa da Autorização -- only for Terapias Especiais */}
          {pedido.categoria === 'Terapias Especiais' && pedido.etapaAutorizacao && (
            <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, gridColumn: '1 / -1' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.75 }}>
                Etapa da Autorização
              </Typography>
              <Chip
                label={pedido.etapaAutorizacao === 'primeira_solicitacao' ? 'Primeira Solicitação' : 'Continuidade'}
                size="small"
                sx={{
                  backgroundColor: pedido.etapaAutorizacao === 'primeira_solicitacao' ? 'rgba(22,163,74,0.1)' : 'rgba(37,99,235,0.1)',
                  color: pedido.etapaAutorizacao === 'primeira_solicitacao' ? '#16a34a' : '#2563eb',
                  fontWeight: 700,
                  height: 22,
                  fontSize: 12,
                }}
              />
            </Box>
          )}
          {/* Status elegibilidade */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.75 }}>
              Status Elegibilidade
            </Typography>
            <Chip
              label={h.elegibilidade.status === 'ativo' ? 'Ativo' : h.elegibilidade.status === 'suspenso' ? 'Suspenso' : 'Em carência'}
              size="small"
              sx={{
                backgroundColor: h.elegibilidade.status === 'ativo' ? 'rgba(22,163,74,0.1)' : h.elegibilidade.status === 'suspenso' ? 'rgba(212,24,61,0.1)' : 'rgba(245,158,11,0.1)',
                color: h.elegibilidade.status === 'ativo' ? '#16a34a' : h.elegibilidade.status === 'suspenso' ? '#d4183d' : '#b45309',
                fontWeight: 700,
                height: 22,
                fontSize: 12,
              }}
            />
          </Box>
          {/* Carências */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Carências
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
              {h.elegibilidade.carencias ? 'Sim' : 'Não'}
            </Typography>
            {h.elegibilidade.detalhesCarencia && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {h.elegibilidade.detalhesCarencia}
              </Typography>
            )}
          </Box>
          {/* Limites contratuais */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              Limites Contratuais
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
              {h.elegibilidade.limitesContratuais}
            </Typography>
          </Box>
          {/* DUTs */}
          <Box sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4, display: 'block', mb: 0.5 }}>
              DUTs Relevantes
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {h.elegibilidade.dutRelevantes.map((dut) => (
                <Typography component="li" key={dut} variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {dut}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
