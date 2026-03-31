import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// ── Helpers ───────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 5, fontSize: 17 }}>
      {children}
    </Typography>
  )
}

function SimpleTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <Box
      component="table"
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14,
        mt: 1.5,
        mb: 1,
      }}
    >
      <Box component="thead">
        <Box component="tr">
          {headers.map((h) => (
            <Box
              key={h}
              component="th"
              sx={{
                textAlign: 'left',
                fontWeight: 700,
                py: 1,
                px: 1.5,
                backgroundColor: '#F0F0F0',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                color: '#1a1a1a',
              }}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {rows.map((row, ri) => (
          <Box
            key={ri}
            component="tr"
            sx={{
              backgroundColor: ri % 2 === 0 ? '#fff' : '#F7F7F7',
              '&:hover': { backgroundColor: '#F0F0F0' },
            }}
          >
            {row.map((cell, ci) => (
              <Box
                key={ci}
                component="td"
                sx={{
                  py: 0.9,
                  px: 1.5,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  color: ci === 0 ? '#1a1a1a' : '#5a6070',
                  fontFamily: ci === 0 ? 'inherit' : 'inherit',
                  fontWeight: ci === 0 ? 500 : 400,
                }}
              >
                {ci === 0 && cell.startsWith('/') ? (
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 13, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.7, py: 0.2, borderRadius: 1 }}>
                    {cell}
                  </Box>
                ) : (
                  cell
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

interface FeatureItemProps {
  name: string
  route?: string
  children: React.ReactNode
}

function FeatureItem({ name, route, children }: FeatureItemProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{name}</Typography>
        {route && (
          <Box
            component="code"
            sx={{
              fontSize: 12,
              color: '#5a6070',
              backgroundColor: '#F0F0F0',
              px: 0.8,
              py: 0.25,
              borderRadius: 1,
              fontFamily: 'monospace',
            }}
          >
            {route}
          </Box>
        )}
      </Box>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65 }}>
        {children}
      </Typography>
    </Box>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <Box
      sx={{
        backgroundColor: '#FAFAFA',
        minHeight: '100vh',
        py: '48px',
        px: '32px',
      }}
    >
      <Box sx={{ maxWidth: 860, mx: 'auto' }}>

        {/* ── Cabeçalho ── */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 0.5 }}>
            Arvo Auth
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#5a6070', fontWeight: 500, mb: 0.5 }}>
            Documentação Técnica de Produto
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Athena Saúde · v1.0 · Março 2026
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* ── Seção 1 — Visão Geral ── */}
        <SectionTitle>O que é o Arvo Auth</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75 }}>
          Plataforma de autorização de procedimentos médicos para operadoras de saúde. Centraliza a entrada de
          pedidos, aplica análise assistida por IA para detectar irregularidades e apoia o operador na decisão
          de aprovar, negar ou escalar cada solicitação. O valor econômico está em{' '}
          <Box component="strong" sx={{ color: '#1a1a1a' }}>evitar aprovações indevidas</Box> — cada negativa
          bem fundamentada representa economia direta para a operadora.
        </Typography>

        {/* ── Seção 2 — Perfis ── */}
        <SectionTitle>Perfis de acesso</SectionTitle>
        <SimpleTable
          headers={['Perfil', 'Acesso', 'Descrição']}
          rows={[
            ['Autorizador', 'Fila, Análise, Nova Solicitação', 'Analisa e decide pedidos'],
            ['Gestor', 'Todas as telas + Usuários', 'Supervisiona operação e equipe'],
            ['Auditor', 'Histórico (somente leitura)', 'Consulta registros de decisões'],
          ]}
        />

        {/* ── Seção 3 — Funcionalidades ── */}
        <SectionTitle>Funcionalidades do sistema</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 4 }}>
          As funcionalidades estão ordenadas por prioridade de desenvolvimento:{' '}
          <Box component="strong" sx={{ color: '#1a1a1a' }}>Primárias</Box> são o núcleo do produto e devem
          estar 100% funcionais antes de qualquer outra coisa.{' '}
          <Box component="strong" sx={{ color: '#1a1a1a' }}>Secundárias</Box> complementam a operação.{' '}
          <Box component="strong" sx={{ color: '#1a1a1a' }}>Terciárias</Box> agregam valor mas não são bloqueantes.
        </Typography>

        {/* 3.1 Primárias */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Chip
            label="Primária"
            size="small"
            sx={{ backgroundColor: '#7B1C1C', color: '#fff', fontWeight: 700, fontSize: 11 }}
          />
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>
            Núcleo do produto — deve estar 100% funcional antes das demais
          </Typography>
        </Box>

        <FeatureItem name="Fila Operacional" route="/fila">
          Central de trabalho do autorizador. Lista todos os pedidos ativos com prioridade, SLA, origem e
          sugestão da IA. Filtros por categoria, SLA e sugestão. Tabs de triagem: Geral, U/E, Devolutivas,
          SLA em Risco.
        </FeatureItem>

        <FeatureItem name="Tela de Análise" route="/analise?id=">
          Tela principal de decisão. Exibe dados do beneficiário, procedimentos, histórico assistencial,
          documentos anexados e o Assistente de Decisão (IA) com recomendação, checklist e alertas. Ações:
          Aprovar, Negar, Pendenciar, Junta Médica.
        </FeatureItem>

        <FeatureItem name="Nova Solicitação" route="/nova-solicitacao">
          Fluxo de 6 etapas para entrada de pedidos: Upload do pedido médico (extração automática via IA) →
          Beneficiário → Clínico → Procedimentos → Documentos → Revisão. Suporta preenchimento manual sem upload.
        </FeatureItem>

        <FeatureItem name="Assistente de Decisão (IA)" route="(componente da tela de análise)">
          Painel lateral em <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.6, py: 0.15, borderRadius: 1 }}>/analise</Box>.
          {' '}Gera recomendação (Aprovar / Negar / Junta Médica), checklist de conformidade e alertas
          contextuais (Liminar Judicial, NIP Ativa, Fora do Rol, High-User, Prestador Não Credenciado).
          Base para todas as decisões assistidas.
        </FeatureItem>

        <Divider sx={{ my: 3 }} />

        {/* 3.2 Secundárias */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Chip
            label="Secundária"
            size="small"
            sx={{ backgroundColor: '#1A3A5C', color: '#fff', fontWeight: 700, fontSize: 11 }}
          />
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>
            Complementam a operação
          </Typography>
        </Box>

        <FeatureItem name="Dashboard" route="/dashboard">
          Visão gerencial da operação. Bignumbers: pedidos aguardando decisão, irregularidades detectadas,
          economia gerada, efetividade da IA, valor em risco. Blocos: alertas que requerem atenção, sugestão
          da IA, status geral por urgência, negativas fundamentadas, volume mensal, motivos de negativa,
          tabela de pedidos urgentes.
        </FeatureItem>

        <FeatureItem name="Histórico" route="/historico">
          Registro auditável de todas as decisões tomadas. Filtrável por origem (IA automática / analista),
          decisão, categoria e divergência IA×analista. Exibe divergências entre recomendação da IA e decisão
          humana — insumo para calibração do modelo.
        </FeatureItem>

        <FeatureItem name="Sub-estados de Pendência e Junta Médica" route="(componente da fila e análise)">
          Diferencia pedidos <em>aguardando</em> retorno de pedidos com <em>retorno já recebido</em>, tanto
          em devolutivas documentais quanto em junta médica. Estados:{' '}
          {[
            'PENDENTE_AGUARDANDO',
            'PENDENTE_RETORNO_RECEBIDO',
            'JUNTA_AGUARDANDO',
            'JUNTA_PARECER_RECEBIDO',
          ].map((s) => (
            <Box
              key={s}
              component="code"
              sx={{ fontFamily: 'monospace', fontSize: 12, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.6, py: 0.15, borderRadius: 1, mr: 0.5 }}
            >
              {s}
            </Box>
          ))}
        </FeatureItem>

        <FeatureItem name="Modal pós-submissão" route="(componente de /nova-solicitacao)">
          Exibido após "Enviar Solicitação". Dois cenários: decisão automática pela IA (SADT simples, sem
          alertas) com link para histórico; ou requer avaliação humana com link direto para a tela de análise
          do pedido criado.
        </FeatureItem>

        <Divider sx={{ my: 3 }} />

        {/* 3.3 Terciárias */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Chip
            label="Terciária"
            size="small"
            sx={{ backgroundColor: '#4A4A4A', color: '#fff', fontWeight: 700, fontSize: 11 }}
          />
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>
            Agregam valor mas não são bloqueantes
          </Typography>
        </Box>

        <FeatureItem name="Usuários" route="/usuarios">
          Gestão de equipe: criar, editar, ativar/inativar usuários. Perfis: Autorizador, Gestor, Auditor.
          Filtro por perfil e status.
        </FeatureItem>

        <FeatureItem name="Seletor de Regional" route="(header global)">
          Troca o contexto regional da operação. Afeta os dados exibidos em todas as telas.
        </FeatureItem>

        <FeatureItem name="Links Úteis" route="(sidebar)">
          Atalhos para recursos externos: Rol da ANS, Consulta ANVISA, Árvore de Códigos TUSS, Padrão TISS 2026.
        </FeatureItem>

        <FeatureItem name="Notificações" route="(header global)">
          Sino com badge de contagem. Alertas do sistema para o usuário logado. Interface a ser detalhada.
        </FeatureItem>

        <FeatureItem name="Ajuda" route="(sidebar, rodapé)">
          Ponto de entrada para suporte. Interface a ser detalhada.
        </FeatureItem>

        {/* ── Seção 4 — Mapa de rotas ── */}
        <SectionTitle>Mapa de rotas</SectionTitle>
        <SimpleTable
          headers={['Rota', 'Tela', 'Perfil mínimo']}
          rows={[
            ['/dashboard', 'Dashboard', 'Autorizador'],
            ['/fila', 'Fila Operacional', 'Autorizador'],
            ['/analise?id=', 'Tela de Análise', 'Autorizador'],
            ['/nova-solicitacao', 'Nova Solicitação', 'Autorizador'],
            ['/historico', 'Histórico', 'Auditor'],
            ['/usuarios', 'Usuários', 'Gestor'],
            ['/docs', 'Esta página', 'Público'],
          ]}
        />

        {/* ── Seção 5 — Stack ── */}
        <SectionTitle>Stack</SectionTitle>
        <SimpleTable
          headers={['', '']}
          rows={[
            ['Framework', 'Next.js (App Router)'],
            ['UI', 'MUI (Material UI) com sx props + emotion'],
            ['Ícones', '@mui/icons-material'],
            ['Deploy', 'Vercel'],
            ['Estilização', 'Sem Tailwind, sem Lucide, sem D3, sem Recharts'],
          ]}
        />

        {/* ── Rodapé ── */}
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: '#9ca3af', mt: 6 }}
        >
          Arvo Auth · Documentação interna · Não distribuir externamente
        </Typography>

      </Box>
    </Box>
  )
}
