'use client';

import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// ── Helpers compartilhados ────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 5, fontSize: 17 }}>
      {children}
    </Typography>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Box
      component="table"
      sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, mt: 1.5, mb: 1 }}
    >
      <Box component="thead">
        <Box component="tr">
          {headers.map((h, hi) => (
            <Box
              key={`${h}-${String(hi)}`}
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
                  fontWeight: ci === 0 ? 500 : 400,
                }}
              >
                {ci === 0 && cell.startsWith('/') ? (
                  <Box
                    component="code"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: 13,
                      color: '#5a6070',
                      backgroundColor: '#F0F0F0',
                      px: 0.7,
                      py: 0.2,
                      borderRadius: 1,
                    }}
                  >
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
  );
}

function FeatureItem({
  name,
  route,
  children,
}: {
  name: string;
  route?: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{name}</Typography>
        {route ? (
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
        ) : null}
      </Box>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65 }}>
        {children}
      </Typography>
    </Box>
  );
}

// ── Design System helpers ─────────────────────────────────────────────────

function DSSection({ children }: { children: React.ReactNode }) {
  return <Box sx={{ mb: 5 }}>{children}</Box>;
}

function DSSubTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: '#5a6070',
        mb: 2,
        mt: 4,
      }}
    >
      {children}
    </Typography>
  );
}

function Code({ children }: { children: string }) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily: 'monospace',
        fontSize: 12,
        backgroundColor: '#F0F0F0',
        color: '#5a6070',
        px: 0.7,
        py: 0.2,
        borderRadius: 1,
      }}
    >
      {children}
    </Box>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <Box
      component="pre"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#e5e7eb',
        p: 2,
        borderRadius: 2,
        fontSize: 12,
        fontFamily: 'monospace',
        overflow: 'auto',
        mt: 1,
        mb: 0,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </Box>
  );
}

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        gap: 1.5,
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: '#fff',
        mb: 1,
      }}
    >
      {children}
    </Box>
  );
}

function ColorSwatch({
  hex,
  name,
  usage,
  textColor = '#fff',
}: {
  hex: string;
  name: string;
  usage: string;
  textColor?: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.75 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          backgroundColor: hex,
          border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 700,
            color: textColor,
            fontFamily: 'monospace',
            letterSpacing: 0.3,
          }}
        >
          {hex}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{name}</Typography>
        <Typography sx={{ fontSize: 12, color: '#5a6070' }}>{usage}</Typography>
      </Box>
    </Box>
  );
}

function RuleBox({ type, children }: { type: 'do' | 'dont'; children: React.ReactNode }) {
  const isDo = type === 'do';
  return (
    <Box
      sx={{
        border: `1.5px solid ${isDo ? 'rgba(22,163,74,0.4)' : 'rgba(212,24,61,0.4)'}`,
        borderRadius: 2,
        p: 2,
        flex: 1,
        minWidth: 200,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: isDo ? '#16a34a' : '#d4183d',
          mb: 1,
        }}
      >
        {isDo ? '✓ Fazer' : '✗ Evitar'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#5a6070', fontSize: 13, lineHeight: 1.6 }}>
        {children}
      </Typography>
    </Box>
  );
}

// ── Conteúdo — Produto ────────────────────────────────────────────────────

function ProductContent() {
  return (
    <>
      <SectionTitle>O que é o Arvo Auth</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75 }}>
        Plataforma <strong>white-label</strong> de infraestrutura de autorização para operadoras de
        saúde suplementar brasileiras. Cobre o espectro completo de pedidos — de terapias
        ambulatoriais a procedimentos hospitalares críticos e OPME. Centraliza entrada de pedidos,
        aplica análise assistida por IA para detectar irregularidades e apoia o operador na decisão
        de aprovar, negar, pendenciar ou escalar cada solicitação.
      </Typography>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mt: 2 }}>
        Analistas de autorização gastam 80%+ do tempo em cross-referencing mecânico (elegibilidade,
        carência, credenciamento, histórico, prazos SLA) entre sistemas desconectados. O Arvo Auth
        consolida tudo em um workspace único — IA pré-processa e triagem; cognição humana fica
        reservada ao juízo clínico.
      </Typography>

      <SectionTitle>Princípio: Análise vs Consequência</SectionTitle>
      <Box
        sx={{
          border: '1px solid rgba(144,43,41,0.2)',
          borderRadius: 2,
          p: 2,
          backgroundColor: 'rgba(144,43,41,0.03)',
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: '#1a1a1a', lineHeight: 1.7, fontStyle: 'italic' }}>
          &ldquo;A Arvo gera a análise (ponto de vista) — a operadora decide a consequência (decisão
          / automação).&rdquo;
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75 }}>
        Princípio load-bearing do produto. Arvo produz análise (flags, alertas, scores, checklists)
        — esse é o domínio da Arvo. A operadora configura a consequência (aprovar, negar,
        pendenciar, encaminhar à junta médica) — esse é o domínio do cliente. O sistema{' '}
        <strong>nunca</strong> &ldquo;aprova&rdquo; ou &ldquo;nega&rdquo; clinicamente; ele{' '}
        <strong>analisa e classifica</strong>. A camada de consequência é cliente-configurável.
      </Typography>

      <SectionTitle>Modos operacionais</SectionTitle>
      <SimpleTable
        headers={['Modo', 'Quando', 'Comportamento']}
        rows={[
          [
            'Automação',
            'SADT N1, negativas administrativas, U/E Manchester vermelho/laranja',
            'Sistema decide sem intervenção humana segundo regras do cliente',
          ],
          [
            'Assistência ao analista',
            'Casos clínicos complexos',
            'Sistema consolida info + destaca atenções + checklist + sugere. Analista é soberano — sua decisão prevalece',
          ],
        ]}
      />

      <SectionTitle>Perfis de acesso</SectionTitle>
      <SimpleTable
        headers={['Perfil', 'Acesso', 'Descrição']}
        rows={[
          [
            'Autorizador',
            'Dashboard, Fila, Análise, Nova Solicitação, Histórico, Notificações',
            'Analisa e decide pedidos do dia-a-dia',
          ],
          [
            'Gestor',
            'Tudo de Autorizador + Usuários + SLA Predictive + Configurações',
            'Supervisiona operação, gere equipe e configura regras white-label',
          ],
          [
            'Auditor',
            'Histórico (read-only) + auditoria de decisões',
            'Consulta trilha imutável de decisões para auditoria pós-fato',
          ],
        ]}
      />
      <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12, mt: 1, lineHeight: 1.6 }}>
        Toggle de perfil de runtime via <Code>useUserPermissions()</Code> — hoje hardcoded como{' '}
        <Code>&apos;gestor&apos;</Code>. JWT real virá em M10+.
      </Typography>

      <SectionTitle>Fluxo operacional</SectionTitle>
      <SimpleTable
        headers={['Etapa', 'Módulo', 'O que acontece']}
        rows={[
          [
            '1. Entrada',
            '/nova-solicitacao',
            'Pedido chega (portal prestador, app, WhatsApp, email, call center). OCR extrai dados. Validação TISS. Verificações administrativas.',
          ],
          [
            '2. Triagem',
            '/dashboard (ProcessingQueue)',
            'IA classifica complexidade. Tier 1 elegível → auto-aprovação. Tier 2 → fila operacional após análise IA completa.',
          ],
          [
            '3. Workspace',
            '/fila',
            'Fila priorizada: U/E primeiro, Devolutivas (SLA correndo), Geral por complexidade × risco × proximidade SLA.',
          ],
          [
            '4. Análise',
            '/analise?id=',
            'Visão consolidada: beneficiário, histórico, procedimentos, documentos, sidebar IA (sugestão + confiança + justificativa + checklist).',
          ],
          [
            '5. Decisão',
            '/analise',
            'Analista aprova, nega, pendencia ou escala à Junta Médica. Divergência da IA exige justificativa obrigatória. Tudo gera registro imutável.',
          ],
          [
            '6. Histórico',
            '/historico',
            'Apenas decisões finalizadas. Searchable, filterable, auditável.',
          ],
        ]}
      />

      <SectionTitle>Funcionalidades do sistema</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 4 }}>
        Funcionalidades ordenadas por prioridade.{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>
          Primárias
        </Box>{' '}
        são o núcleo do produto.{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>
          Secundárias
        </Box>{' '}
        complementam a operação.{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>
          Terciárias
        </Box>{' '}
        agregam valor mas não bloqueiam.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Chip
          label="Primária"
          size="small"
          sx={{ backgroundColor: '#7B1C1C', color: '#fff', fontWeight: 700, fontSize: 11 }}
        />
        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>
          Núcleo do produto — 100% funcional antes das demais
        </Typography>
      </Box>

      <FeatureItem name="Fila Operacional" route="/fila">
        Central de trabalho do autorizador. Lista pedidos ativos com prioridade, SLA, origem, tipo
        de guia, categoria e sugestão IA. Tabs de triagem: Geral, Devolutivas, Liminares, NIPs, Tem
        OPME, SLA em Risco, SLA Violado. Filtros por prestador, SLA, sugestão IA e categoria.
        Priorização automática: U/E + liminar + NIP sobem; Devolutivas têm clock contínuo.
      </FeatureItem>
      <FeatureItem name="Tela de Análise" route="/analise?id=">
        Tela principal de decisão. Cinco respostas em uma tela: Quem é o paciente? O que pede? Já
        fez antes? Faz sentido? O que faço agora? Sections: Beneficiário, Procedimentos, Histórico
        Consolidado, Documentos. Sidebar IA: Sugestão + Confiança + Checklist + Alertas Especiais +
        Decisão. Banners persistentes: Pendência, Liminar, NIP, Alertas, Guias Simultâneas. Ações:
        Aprovar, Negar, Pendenciar, Junta Médica, Aprovação Parcial (per-procedure).
      </FeatureItem>
      <FeatureItem name="Nova Solicitação" route="/nova-solicitacao">
        Wizard de 6 etapas: Upload (extração OCR via IA) → Beneficiário → Clínico → Dinâmica
        (categoria-específica) → Documentos → Revisão. Step Documentos é{' '}
        <strong>opcional sempre</strong> — pedido sem docs entra com status Pendência. Step Revisão
        executa full-form validation com quick-jump para steps anteriores.
      </FeatureItem>
      <FeatureItem
        name="Assistente de Decisão (IA — Glosildo)"
        route="(componente AssistantSidebar)"
      >
        Painel lateral em <Code>/analise</Code>. Gera <strong>Sugestão</strong> (nunca
        &ldquo;Decisão&rdquo;) + Confiança + Justificativa Técnica + Checklist verificado + Alertas
        contextuais (NIP Ativa, Liminar, Fora do Rol, High-User, Prestador Não Credenciado,
        Co-responsabilidade). Confidence ≥ 90% habilita automação Tier 1 (administrativa). Clínica
        sempre humana (RN 566/2022).
      </FeatureItem>

      <Divider sx={{ my: 3 }} />

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
        Visão gerencial. KPIs: Total na Fila, SLA Violado, SLA em Risco, Devolutivas, Liminares,
        NIPs Abertas. ProcessingQueueTable: pedidos entrando no sistema. RecentRequestsTable: top 6
        urgentes. CategoryBreakdownCard: pizza por categoria. SLA Predictive (gestor-only): previsão
        de violações nas próximas horas.
      </FeatureItem>
      <FeatureItem name="Histórico" route="/historico, /historico/[id]">
        Registro imutável e auditável. Append-only. Filtrável por origem (IA automática / analista),
        decisão, categoria, divergência IA×analista, beneficiário (carteirinha), prestador.
        HistoryDetailPage replica visão completa da Análise com decisão final + IA snapshot
        operacional + AppealDialog para reabrir contestação.
      </FeatureItem>
      <FeatureItem name="Pendência / Devolutiva" route="(banner + dialog na Análise)">
        Pendenciar pedido retorna ao prestador com motivos estruturados + texto livre + prazo
        (3/7/15 dias úteis). <strong>SLA NÃO pausa</strong> (RN 259/2011) — pedido sobe na fila como
        Devolutiva. Quando prestador responde, pedido reentra com docs novos para nova análise IA.
      </FeatureItem>
      <FeatureItem name="Junta Médica" route="(banner + dialog na Análise)">
        Encaminhamento para desempate clínico. Sub-status: aguardando / parecer recebido / suspenso
        (exame complementar / ausência beneficiário). Parecer da junta volta como input para IA
        re-processar e gerar nova sugestão. Auditor decide informado pelo parecer.
      </FeatureItem>
      <FeatureItem name="Liminar Judicial" route="(InjunctionBanner na Análise + chip na Fila)">
        Decisão judicial sobrepõe critérios contratuais. A partir de M7 (ADR-028), liminar carrega{' '}
        <strong>avaliação jurídica</strong> first-class (recomendação + escopo_cobertura +
        risco_negar). Botão Negar gateado pela recomendação. SubsídiosTécnicos bidirecional (auditor
        → jurídico). Fallback &ldquo;Aguardando avaliação jurídica&rdquo; quando ausente.
      </FeatureItem>
      <FeatureItem
        name="NIP — Notificação de Intermediação Preliminar"
        route="(NipBanner + KPI Dashboard)"
      >
        Reclamação do beneficiário à ANS gera NIP (RN 483/2022). Prazo curto, multa pesada se
        descumprida. Pedido com NIP sobe na fila. NIP-órfã (Q4): operadora é co-responsável pelo
        prestador credenciado mesmo sem ter recebido o pedido (Bete 2026-05-20).
      </FeatureItem>
      <FeatureItem name="Aprovação Parcial (per-procedure)" route="(PartialApprovalDialog)">
        Em pedido multi-procedure, analista pode aprovar uns e negar outros. Cada negado exige razão
        estruturada + justificativa ≥ 10 chars. Divergência da sugestão IA dispara DivergenceDialog
        obrigatório.
      </FeatureItem>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Chip
          label="Terciária"
          size="small"
          sx={{ backgroundColor: '#4A4A4A', color: '#fff', fontWeight: 700, fontSize: 11 }}
        />
        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>
          Agregam valor, não bloqueantes
        </Typography>
      </Box>

      <FeatureItem name="Usuários" route="/usuarios">
        Gestão de equipe (gestor-only): criar, editar, ativar/inativar. Perfis Autorizador / Gestor
        / Auditor. Filtro por perfil + status.
      </FeatureItem>
      <FeatureItem name="Notificações" route="(topbar global)">
        Sino com badge de contagem. 15 tipos de notificação: pendência respondida, junta com
        parecer, liminar recebida, NIP aberta, NIP prazo próximo, SLA crítico, devolutiva recebida,
        decisão revisada, etc.
      </FeatureItem>
      <FeatureItem name="Meu Perfil" route="/meu-perfil">
        Dados do usuário logado + preferências + troca de senha.
      </FeatureItem>
      <FeatureItem name="Ajuda" route="/ajuda, /ajuda/manual">
        Manual operacional + atalhos de teclado (<Code>?</Code> abre help drawer na Análise).
      </FeatureItem>

      <SectionTitle>Vocabulário controlado</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mb: 2 }}>
        Termos canônicos do domínio. Usar exatamente assim em código, UI labels e logs — nunca
        sinônimos.
      </Typography>
      <SimpleTable
        headers={['Termo', 'Significado']}
        rows={[
          ['Guia', 'Pedido de autorização (entidade central)'],
          ['Beneficiário', 'Paciente segurado'],
          ['Operadora', 'Cliente (plano de saúde)'],
          ['Prestador', 'Hospital, clínica, médico que executa'],
          ['Solicitante', 'Médico que pede'],
          ['Executante', 'Prestador que executa'],
          ['Carência', 'Prazo contratual antes da cobertura ativar'],
          ['Inadimplência', 'Atraso de pagamento do beneficiário'],
          ['Elegibilidade', 'Se o beneficiário qualifica para o procedimento'],
          ['Devolutiva', 'Pedido retornado ao prestador por falta de info'],
          ['Pendência', 'Estado de hold — aguarda info adicional'],
          ['Junta Médica', 'Escalação para desempate clínico complexo'],
          ['Divergência', 'Analista discorda da sugestão IA'],
          ['Laudo', 'Justificativa clínica do médico solicitante'],
          ['OPME', 'Órteses, Próteses e Materiais Especiais'],
          ['SADT', 'Serviço Auxiliar de Diagnóstico e Terapia'],
          ['NIP', 'Notificação de Intermediação Preliminar (ANS)'],
          ['Liminar', 'Decisão judicial obrigando autorização'],
          ['High-User', 'Beneficiário com padrão de uso atípico (fraude/desperdício)'],
          ['Bypass Automático', 'Decisão IA sem revisão humana'],
          [
            'Código de Pacote',
            'Código próprio da operadora agrupando N códigos TUSS (inicia com 9)',
          ],
          [
            'Tabela TISS',
            '18 (diárias/taxas), 19 (materiais), 20 (medicamentos), 22 (procedimentos)',
          ],
          ['CBHPM', 'Classificação Brasileira Hierarquizada de Procedimentos Médicos'],
        ]}
      />

      <SectionTitle>Contexto regulatório</SectionTitle>
      <SimpleTable
        headers={['Norma', 'O que define']}
        rows={[
          [
            'RN 566/2022',
            'Proíbe IA de negar autonomamente em bases clínicas. Negativa administrativa OK. Define prazos de realização.',
          ],
          [
            'RN 623/2024',
            'Substitui RN 395/2016 (01/07/2025). Prazos de resposta ao beneficiário + IGR (Índice de Garantia de Atendimento).',
          ],
          [
            'RN 539/2022',
            'Terapias Especiais CID F84.x — sessões ilimitadas para TEA e afins. Sistema nunca bloqueia por quantidade.',
          ],
          [
            'RN 483/2022',
            'NIP — beneficiário reclama à ANS, dispara prazo curto. Pedido sobe na fila.',
          ],
          [
            'Lei 9.656/98 art. 35-C',
            'Cobertura obrigatória de U/E. Carência máxima 24h. Manchester vermelho/laranja → auto-aprovação com registro retroativo.',
          ],
        ]}
      />

      <SectionTitle>Regras de comportamento da IA</SectionTitle>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
        <RuleBox type="do">
          IA gera <strong>Sugestão da IA</strong> / <strong>Ponto de Vista</strong> — sempre rotular
          como advisória. Confidence ≥ 90% habilita automação Tier 1 administrativa.
        </RuleBox>
        <RuleBox type="dont">
          Nunca rotular output da IA como &ldquo;Decisão da IA&rdquo;. Nunca permitir IA negar
          clinicamente. Nunca aplicar limite de sessões para CID F84.x.
        </RuleBox>
      </Box>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mt: 2 }}>
        <strong>OPME como atributo transversal:</strong> pedidos com OPME podem ter{' '}
        <Code>category: &apos;OPME&apos;</Code> (standalone) ou OPME embutido em Cirurgias Eletivas
        / Oncologia (<Code>surgery.hasOpme === true</Code> ou{' '}
        <Code>opmeMaterials.length &gt; 0</Code>). Aba &ldquo;Tem OPME&rdquo; na fila unifica visão.
      </Typography>

      <SectionTitle>Mapa de rotas</SectionTitle>
      <SimpleTable
        headers={['Rota', 'Tela', 'Perfil mínimo']}
        rows={[
          ['/dashboard', 'Dashboard', 'Autorizador'],
          ['/fila', 'Fila Operacional', 'Autorizador'],
          ['/analise?id=', 'Tela de Análise', 'Autorizador'],
          ['/nova-solicitacao', 'Nova Solicitação', 'Autorizador'],
          ['/historico', 'Histórico (lista)', 'Auditor'],
          ['/historico/[id]', 'Histórico (detalhe)', 'Auditor'],
          ['/usuarios', 'Usuários', 'Gestor'],
          ['/meu-perfil', 'Meu Perfil', 'Autorizador'],
          ['/notificacoes', 'Notificações', 'Autorizador'],
          ['/ajuda', 'Ajuda', 'Público'],
          ['/ajuda/manual', 'Manual', 'Público'],
          ['/docs', 'Esta página', 'Público'],
        ]}
      />

      <SectionTitle>Categorias clínicas (9)</SectionTitle>
      <SimpleTable
        headers={['Categoria', 'Particularidade']}
        rows={[
          [
            'Terapias Especiais',
            'CID F84.x (TEA + afins) — RN 539/2022, sessões ilimitadas. ABA, Fono, TO, Psicopedagogia, Fisioterapia.',
          ],
          ['SADT', 'Ambulatorial. Maior parte automação Tier 1 (negativas administrativas).'],
          ['Exames Alta Complexidade', 'RM, TC, PET-CT — DUTs específicas por procedimento.'],
          ['Home Care', 'Atendimento domiciliar — frequência + duração + equipamentos.'],
          [
            'Urgência/Emergência',
            'Manchester vermelho/laranja → auto-aprovação por Lei 9.656/98 art. 35-C.',
          ],
          [
            'Oncologia',
            'Estadiamento TNM + protocolo + ciclo + linha. Quimio limitada a 30 dias por ciclo (risco óbito + custo).',
          ],
          [
            'Internação',
            'Eletiva / Semi-eletiva / Domiciliar AC. Diárias + taxas + justificativa UTI.',
          ],
          [
            'Cirurgias Eletivas',
            'Procedimento principal + acessórios + pré-operatório + hospitalização. Pode ter OPME embutido.',
          ],
          [
            'OPME',
            'Standalone ou embutido. ANVISA registro vigente obrigatório + ≥ 3 cotações + justificativa estruturada se não escolher a mais barata.',
          ],
        ]}
      />

      <SectionTitle>Capacidades transversais (20+)</SectionTitle>
      <SimpleTable
        headers={['Capacidade', 'Milestone', 'O que faz']}
        rows={[
          ['Pendência / Devolutiva', 'M1', 'Pedido volta ao prestador com prazo. SLA não pausa.'],
          ['Junta Médica', 'M1', 'Desempate clínico. Parecer realimenta IA.'],
          ['Notificações', 'M1+', '15 tipos. Sino global + badge.'],
          ['Permissionamento', 'M1', '3 perfis. JWT real virá M10+.'],
          ['DUT — Diretriz de Utilização', 'M3', 'Critérios ANS para procedimentos específicos.'],
          ['Código de Pacote', 'M3', 'Operadora agrupa N códigos TUSS em um. Atômico.'],
          [
            'Liminar Judicial',
            'M3 + M7',
            'Banner persistente. M7: avaliação jurídica first-class (ADR-028).',
          ],
          ['NIP', 'M3', 'Chip + banner + priorização + KPI Dashboard.'],
          ['SLA Crítico', 'M3', 'Pedidos próximos do limite sobem; KPI dedicado.'],
          ['Diárias / Taxas', 'M4', 'TISS Tabela 18 — preço diária + taxas hospitalares.'],
          ['Nível de Auditoria', 'M4', 'AMBULATORIAL / HOSPITALAR / UTI por procedimento.'],
          ['Pré-Operatório', 'M4', 'Checklist itens obrigatórios + opcionais.'],
          ['ANVISA', 'M5', 'Consulta de registro vigente para OPME (Tabela 1920).'],
          [
            'Cotações OPME',
            'M5',
            'Mín. 3 fornecedores + motivos estruturados se não escolher a mais barata.',
          ],
          ['Pacote OPME (TISS-19)', 'M5', 'Materiais como pacote consolidado.'],
          ['Pedidos Complementares', 'M6', 'Vincular novo pedido a histórico do beneficiário.'],
          ['SLA Predictive', 'M6', 'Gestor-only. Previsão de violações nas próximas horas.'],
          ['Histórico Clicável', 'M6', 'Drill-down de cada entrada para detalhe.'],
          [
            'Avaliação Jurídica Acoplada',
            'M7',
            'Liminar carrega recomendação + escopo + risco assinada pelo jurídico ou gestor autorizado.',
          ],
          [
            'Subsídios Técnicos',
            'M7',
            'Auditor anexa info técnica para o jurídico (bidirecional).',
          ],
          ['operatorLock', 'M1', 'Lock de pedido por operador para evitar concorrência.'],
        ]}
      />

      <SectionTitle>Stack</SectionTitle>
      <SimpleTable
        headers={['', '']}
        rows={[
          ['Framework', 'Next.js 16 (App Router) + Turbopack'],
          ['UI', 'MUI v7 com sx props + emotion'],
          ['Ícones', '@mui/icons-material'],
          ['Tipagem', 'TypeScript strict + noUncheckedIndexedAccess'],
          ['Service layer', 'Prototyping Mode (fakes em src/data/pedidos.ts + src/mocks/)'],
          ['Backend', 'arvo-auth-api (Go, multi-tenant) — Swagger autoritativo'],
          ['Auth', 'Auth0 SPA (em planejamento — hoje mock)'],
          ['Deploy', 'Vercel (1 projeto por milestone)'],
          ['Logging', 'loglevel via src/shared/utils/logger.ts'],
          ['Validação', 'npm run validate = typecheck + lint:strict + format:check'],
        ]}
      />
    </>
  );
}

// ── Conteúdo — Design System ──────────────────────────────────────────────

function DesignSystemContent() {
  return (
    <>
      {/* ── 1. Paleta de Cores ── */}
      <DSSection>
        <SectionTitle>Paleta de Cores</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          O sistema usa duas categorias de cor: <strong>identidade visual</strong> (vermelho Arvo —
          ações, botões, links interativos) e <strong>semântica de status</strong> (âmbar, verde,
          vermelho-alerta, azul, roxo — cada um com significado operacional fixo). Nunca trocar as
          cores semânticas por identidade visual.
        </Typography>

        <DSSubTitle>Identidade Visual</DSSubTitle>
        <ColorSwatch
          hex="#902B29"
          name="Primary Main"
          usage="Botões de ação, links ativos, foco, bordas interativas"
        />
        <ColorSwatch hex="#6e1f1d" name="Primary Dark" usage="Hover de botões contained primary" />
        <ColorSwatch
          hex="#FAF6F2"
          name="Background Default"
          usage="Fundo global de todas as telas"
          textColor="#1a1a1a"
        />
        <ColorSwatch
          hex="#ffffff"
          name="Background Paper"
          usage="Cards, modais, drawers, superfícies elevadas"
          textColor="#1a1a1a"
        />

        <DSSubTitle>Semântica de Status</DSSubTitle>
        <ColorSwatch
          hex="#16a34a"
          name="Verde — Aprovado / OK"
          usage="SLA ok, decisão aprovada, campos válidos, credenciado"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#d4183d"
          name="Vermelho — Negado / Erro"
          usage="Negativas, bloqueios críticos, SLA violado, não credenciado"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#f59e0b"
          name="Âmbar 500 — Atenção visual"
          usage="Ícones WarningAmberIcon, borders de alertas documentais"
          textColor="#1a1a1a"
        />
        <ColorSwatch
          hex="#b45309"
          name="Âmbar 700 — Texto de atenção"
          usage="Texto em alertas, chips de status pendente/OPME/Urgente/Junta Médica"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#2563eb"
          name="Azul — Informativo / Junta"
          usage="Junta Médica, sub-status de junta, origem App, chips Eleitiva"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#7c3aed"
          name="Roxo — Liminar Judicial"
          usage="Exclusivo para alertas de liminar judicial"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#0891b2"
          name="Ciano — Exames Alta Complexidade"
          usage="Categoria Exames Alta Complexidade, origem E-mail"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#059669"
          name="Verde escuro — Cirurgias"
          usage="Categoria Cirurgias Eletivas"
          textColor="#fff"
        />

        <DSSubTitle>Texto</DSSubTitle>
        <ColorSwatch
          hex="#1a1a1a"
          name="Text Primary"
          usage="Títulos, labels, valores principais"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#5a6070"
          name="Text Secondary"
          usage="Descrições, captions, metadados"
          textColor="#fff"
        />
        <ColorSwatch
          hex="#9ca3af"
          name="Text Disabled"
          usage="Campos desabilitados, placeholders"
          textColor="#1a1a1a"
        />

        <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
          <strong>Regra crítica:</strong> nunca usar <Code>#902B29</Code> para status semântico
          (alertas, SLA, categorias). Nunca usar cores semânticas âmbar em botões ou links de ação —
          isso quebra a legibilidade operacional do sistema.
        </Alert>
      </DSSection>

      <Divider />

      {/* ── 2. Tipografia ── */}
      <DSSection>
        <SectionTitle>Tipografia</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          Fonte exclusiva: <Code>Space Grotesk</Code> — carregada via Google Fonts. Não usar outras
          fontes. Botões têm <Code>fontWeight: 600</Code> e <Code>textTransform: none</Code>{' '}
          globalmente via tema.
        </Typography>

        <SimpleTable
          headers={['Variante MUI', 'Tamanho', 'Peso', 'Uso típico']}
          rows={[
            ['h4', '34px', '700', 'Título principal de página (ex: Dashboard)'],
            ['h5', '24px', '700', 'Títulos de seção grandes'],
            ['h6', '20px', '700', 'Títulos de card e seção'],
            ['subtitle1', '16px', '400', 'Subtítulos e descrições de página'],
            ['body2', '14px', '400', 'Conteúdo padrão, textos de card'],
            ['caption', '12px', '400', 'Metadados, labels de campo, rodapés'],
          ]}
        />

        <DSSubTitle>Padrão para labels de seção dentro de cards</DSSubTitle>
        <CodeBlock>{`<Typography variant="caption" color="text.secondary" sx={{
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  mb: 0.5,
}}>
  Nome do Campo
</Typography>`}</CodeBlock>

        <DSSubTitle>Padrão para títulos de card (uppercase)</DSSubTitle>
        <CodeBlock>{`<Typography variant="h6" fontWeight={700} sx={{
  fontSize: 15,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  color: 'text.secondary',
  mb: 2,
}}>
  Seção do Card
</Typography>`}</CodeBlock>
      </DSSection>

      <Divider />

      {/* ── 3. Componentes ── */}
      <DSSection>
        <SectionTitle>Componentes</SectionTitle>

        {/* Buttons */}
        <DSSubTitle>Botões</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', mb: 2 }}>
          Três variantes. Nunca adicionar <Code>borderRadius</Code> via <Code>sx</Code> — o tema já
          aplica <Code>6px</Code> globalmente.
        </Typography>

        <Preview>
          <Button variant="contained">Confirmar Decisão</Button>
          <Button variant="outlined">Cancelar</Button>
          <Button variant="text" sx={{ color: 'primary.main', fontWeight: 600 }}>
            + Adicionar Procedimento
          </Button>
          <Button variant="contained" disabled>
            Desabilitado
          </Button>
        </Preview>
        <CodeBlock>{`// Ação principal
<Button variant="contained">Confirmar Decisão</Button>

// Ação secundária
<Button variant="outlined">Cancelar</Button>

// Link de ação (ex: adicionar item)
<Button variant="text" sx={{ color: 'primary.main', fontWeight: 600 }}>
  + Adicionar Procedimento
</Button>

// Tamanho reduzido (tabelas, cards)
<Button size="small" variant="outlined" sx={{ fontSize: 11, py: 0.25, px: 1 }}>
  Ajustar
</Button>`}</CodeBlock>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <RuleBox type="do">
            Usar <Code>color=&quot;primary&quot;</Code> para ações de identidade visual. Deixar o
            tema controlar <Code>borderRadius</Code>, <Code>boxShadow</Code> e{' '}
            <Code>textTransform</Code>.
          </RuleBox>
          <RuleBox type="dont">
            Usar <Code>color=&quot;warning&quot;</Code> em botões de ação. Não adicionar{' '}
            <Code>borderRadius</Code> ou <Code>boxShadow</Code> via <Code>sx</Code> em botões.
          </RuleBox>
        </Box>

        {/* Cards */}
        <DSSubTitle>Cards</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', mb: 2 }}>
          O tema aplica automaticamente: <Code>borderRadius: 16px</Code>,{' '}
          <Code>boxShadow: none</Code>, <Code>border: 1px solid rgba(0,0,0,0.07)</Code>. Usar{' '}
          <Code>{'<Card>'}</Code> + <Code>{'<CardContent sx={{ p: 3 }}>'}</Code> como padrão.
        </Typography>
        <CodeBlock>{`// Card padrão
<Card>
  <CardContent sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={700} sx={{
      mb: 2, fontSize: 15, textTransform: 'uppercase',
      letterSpacing: 0.5, color: 'text.secondary',
    }}>
      Título da Seção
    </Typography>
    {/* conteúdo */}
  </CardContent>
</Card>

// Card de alerta (ajustes registrados, documento obrigatório)
<Card sx={{ border: '1px solid rgba(245,158,11,0.35) !important', backgroundColor: 'rgba(255,251,235,0.6)' }}>

// Card de liminar judicial
<Box sx={{ border: '1px solid rgba(124,58,237,0.35)', borderRadius: 2, backgroundColor: 'rgba(124,58,237,0.04)', p: 2 }}>

// Bloco de procedimento dentro de card (nova solicitação)
<Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', mb: 2 }}>`}</CodeBlock>

        {/* Tabelas */}
        <DSSubTitle>Tabelas</DSSubTitle>
        <CodeBlock>{`<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell sx={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 0.5, color: 'text.secondary',
      }}>
        Coluna
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow sx={{
      cursor: 'pointer',
      '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' },
    }}>
      <TableCell>conteúdo</TableCell>
    </TableRow>
  </TableBody>
</Table>`}</CodeBlock>

        {/* Inputs */}
        <DSSubTitle>Inputs e Selects</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', mb: 2 }}>
          O tema aplica <Code>borderRadius: 6px</Code> globalmente via <Code>MuiOutlinedInput</Code>
          . Nunca sobrescrever via <Code>sx</Code>.
        </Typography>
        <CodeBlock>{`// Input padrão
<TextField
  label="Campo"
  size="small"
  fullWidth
/>

// Input com prefixo monetário (OPME)
<TextField
  label="Valor unitário"
  type="number"
  size="small"
  InputProps={{
    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
  }}
  inputProps={{ min: 0.01, step: 0.01 }}
/>

// Select
<Select value={value} onChange={onChange} size="small" fullWidth>
  <MenuItem value="opcao">Opção</MenuItem>
</Select>`}</CodeBlock>

        {/* Alerts */}
        <DSSubTitle>Alertas</DSSubTitle>
        <Preview>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Pendenciar NÃO interrompe o contador de SLA
            </Alert>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              2 alertas identificados neste pedido
            </Alert>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Documento com validade de 6 meses
            </Alert>
          </Box>
        </Preview>
        <CodeBlock>{`// Alerta de atenção operacional
<Alert severity="warning" sx={{ borderRadius: 2 }}>
  Pendenciar NÃO interrompe o contador de SLA
</Alert>

// Alerta de bloqueio
<Alert severity="error" sx={{ borderRadius: 2 }}>
  {pedido.alertas.length} alerta(s) identificado(s)
</Alert>`}</CodeBlock>
      </DSSection>

      <Divider />

      {/* ── 4. Chips de Status ── */}
      <DSSection>
        <SectionTitle>Chips de Status do Sistema</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          Todos os chips usam <Code>size=&quot;small&quot;</Code> e <Code>fontWeight: 700</Code>.
          Altura padrão: <Code>height: 22</Code> na fila, <Code>height: 20</Code> em contextos mais
          compactos. Nunca usar <Code>color=&quot;warning&quot;</Code> — sempre hardcoded via{' '}
          <Code>sx</Code>.
        </Typography>

        <DSSubTitle>Status da Guia</DSSubTitle>
        <Preview>
          <Chip
            label="Em Análise"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.18)',
              color: '#92400e',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Aprovado"
            size="small"
            sx={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Negado"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontWeight: 700,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`const statusColor = {
  'Em Análise': { bg: 'rgba(245,158,11,0.18)', color: '#92400e' },
  'Aprovado':   { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'Negado':     { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
}`}</CodeBlock>

        <DSSubTitle>SLA</DSSubTitle>
        <Preview>
          <Chip
            label="8h restantes"
            size="small"
            sx={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="2h restantes"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.12)',
              color: '#b45309',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="VIOLADO"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`const slaColorMap = {
  ok:      { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  violated: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
}`}</CodeBlock>

        <DSSubTitle>IA Sugestão</DSSubTitle>
        <Preview>
          <Chip
            label="Aprovar"
            size="small"
            sx={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Negar"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Junta Médica"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.12)',
              color: '#b45309',
              fontSize: 12,
              fontWeight: 700,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`const iaSugestaoColorMap = {
  'Aprovar':      { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'Negar':        { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
  'Junta Médica': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
}`}</CodeBlock>

        <DSSubTitle>Categorias de Procedimento (9)</DSSubTitle>
        <Preview>
          <Chip
            label="Urgência/Emergência"
            size="small"
            sx={{
              backgroundColor: 'rgba(220,38,38,0.1)',
              color: '#dc2626',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Internação"
            size="small"
            sx={{
              backgroundColor: 'rgba(79,70,229,0.1)',
              color: '#4f46e5',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Oncologia"
            size="small"
            sx={{
              backgroundColor: 'rgba(147,51,234,0.1)',
              color: '#9333ea',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Terapias Especiais"
            size="small"
            sx={{
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="OPME"
            size="small"
            sx={{
              backgroundColor: 'rgba(180,83,9,0.12)',
              color: '#b45309',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Exames Alta Complexidade"
            size="small"
            sx={{
              backgroundColor: 'rgba(8,145,178,0.1)',
              color: '#0891b2',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Cirurgias Eletivas"
            size="small"
            sx={{
              backgroundColor: 'rgba(234,88,12,0.1)',
              color: '#ea580c',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="SADT"
            size="small"
            sx={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Home Care"
            size="small"
            sx={{
              backgroundColor: 'rgba(13,148,136,0.1)',
              color: '#0d9488',
              fontWeight: 600,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`// src/shared/constants/category-colors.ts
const categoryColorMap = {
  'Urgência/Emergência':     { bg: 'rgba(220,38,38,0.1)',  color: '#dc2626' },
  'Internação':              { bg: 'rgba(79,70,229,0.1)',  color: '#4f46e5' },
  'Oncologia':               { bg: 'rgba(147,51,234,0.1)', color: '#9333ea' },
  'Terapias Especiais':      { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'OPME':                    { bg: 'rgba(180,83,9,0.12)',  color: '#b45309' },
  'Exames Alta Complexidade':{ bg: 'rgba(8,145,178,0.1)',  color: '#0891b2' },
  'Cirurgias Eletivas':      { bg: 'rgba(234,88,12,0.1)',  color: '#ea580c' },
  'SADT':                    { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a' },
  'Home Care':               { bg: 'rgba(13,148,136,0.1)', color: '#0d9488' },
}`}</CodeBlock>

        <DSSubTitle>Avaliação Jurídica (M7 — ADR-028)</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', mb: 1.5, fontSize: 13 }}>
          Chips no InjunctionBanner refletem a recomendação do jurídico para o pedido com liminar
          ativa. Texto e cor são inequívocos: o jurídico decidiu, não há margem para confusão com
          estado de espera.
        </Typography>
        <Preview>
          <Chip
            label="Cumprimento determinado — sem brecha"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Cumprir + recorrer em paralelo"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.12)',
              color: '#b45309',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Avaliar caso a caso"
            size="small"
            sx={{
              backgroundColor: 'rgba(234,88,12,0.12)',
              color: '#ea580c',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Jurídico recorreu — não cumprir"
            size="small"
            sx={{
              backgroundColor: 'rgba(90,96,112,0.12)',
              color: '#374151',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Aguardando avaliação jurídica"
            size="small"
            sx={{
              backgroundColor: 'rgba(156,163,175,0.18)',
              color: '#5a6070',
              fontWeight: 700,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`// src/types/pedido.ts (M7 — ADR-028)
type AvaliacaoJuridicaRecomendacao =
  | 'cumprir_obrigatorio'         // vermelho — sem brecha
  | 'cumprir_recorrer_paralelo'   // âmbar — escopo restrito
  | 'avaliar_caso_a_caso'         // laranja — humano sovereign
  | 'recorrer_sem_cumprir';       // cinza escuro — denial liberado

// Fallback (campo ausente) → cinza claro "Aguardando avaliação jurídica"
// Botão Negar travado quando ausente OU recomendacao === 'cumprir_obrigatorio'.`}</CodeBlock>

        <DSSubTitle>Regulatório — Liminar / NIP / Devolutiva</DSSubTitle>
        <Preview>
          <Chip
            label="Liminar Judicial"
            size="small"
            sx={{
              backgroundColor: 'rgba(91,33,182,0.12)',
              color: '#5b21b6',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="NIP Ativa"
            size="small"
            sx={{
              backgroundColor: 'rgba(194,65,12,0.12)',
              color: '#c2410c',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Devolutiva"
            size="small"
            sx={{
              backgroundColor: 'rgba(217,119,6,0.12)',
              color: '#d97706',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Pendente"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.18)',
              color: '#92400e',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="Junta Médica"
            size="small"
            sx={{
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              fontWeight: 700,
              height: 22,
            }}
          />
        </Preview>
        <CodeBlock>{`// src/shared/constants/regulatory-colors.ts (M6)
const regulatoryAlertColorMap = {
  liminares:   { bg: 'rgba(91,33,182,0.12)',  color: '#5b21b6' },
  nips:        { bg: 'rgba(194,65,12,0.12)',  color: '#c2410c' },
  devolutivas: { bg: 'rgba(217,119,6,0.12)',  color: '#d97706' },
}`}</CodeBlock>

        <DSSubTitle>Origem do Pedido</DSSubTitle>
        <Preview>
          <Chip
            label="App"
            size="small"
            sx={{
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="WhatsApp"
            size="small"
            sx={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="E-mail"
            size="small"
            sx={{
              backgroundColor: 'rgba(8,145,178,0.1)',
              color: '#0891b2',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Prestador"
            size="small"
            sx={{
              backgroundColor: 'rgba(144,43,41,0.1)',
              color: '#902B29',
              fontWeight: 600,
              height: 22,
            }}
          />
          <Chip
            label="Call Center"
            size="small"
            sx={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: '#7c3aed',
              fontWeight: 600,
              height: 22,
            }}
          />
        </Preview>

        <DSSubTitle>Tipo de Guia</DSSubTitle>
        <Preview>
          <Chip
            label="Eleitiva"
            size="small"
            sx={{
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: '#2563eb',
              fontWeight: 700,
              height: 20,
            }}
          />
          <Chip
            label="Urgente"
            size="small"
            sx={{
              backgroundColor: 'rgba(245,158,11,0.12)',
              color: '#b45309',
              fontWeight: 700,
              height: 20,
            }}
          />
          <Chip
            label="Emergência"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontWeight: 700,
              height: 20,
            }}
          />
        </Preview>

        <DSSubTitle>Alertas Especiais</DSSubTitle>
        <Preview>
          <Chip
            label="Liminar Judicial"
            size="small"
            sx={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: '#7c3aed',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="SLA Violado"
            size="small"
            sx={{
              backgroundColor: 'rgba(212,24,61,0.1)',
              color: '#d4183d',
              fontWeight: 700,
              height: 22,
            }}
          />
          <Chip
            label="OPME"
            size="small"
            sx={{
              backgroundColor: 'rgba(144,43,41,0.1)',
              color: 'primary.main',
              fontWeight: 700,
              height: 18,
            }}
          />
          <Chip
            label="Ajustado"
            size="small"
            sx={{
              backgroundColor: 'rgba(144,43,41,0.1)',
              color: 'primary.main',
              fontWeight: 700,
              height: 20,
            }}
          />
          <Chip
            label="Prestador ajustado"
            size="small"
            sx={{
              fontSize: 10,
              height: 18,
              backgroundColor: 'rgba(144,43,41,0.08)',
              color: 'primary.main',
            }}
          />
        </Preview>
      </DSSection>

      <Divider />

      {/* ── 5. Regras Obrigatórias ── */}
      <DSSection>
        <SectionTitle>Regras Obrigatórias</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          Estas regras refletem decisões de design já tomadas e codificadas no tema. Violá-las gera
          inconsistência visual e pode quebrar o comportamento esperado pelo MUI.
        </Typography>

        <SimpleTable
          headers={['Componente', 'Regra', 'Motivo']}
          rows={[
            ['Button', 'Nunca adicionar borderRadius via sx', 'Tema já aplica 6px globalmente'],
            ['Button', 'Nunca adicionar boxShadow via sx', 'Tema aplica none globalmente'],
            [
              'Card',
              'Não duplicar border ou borderRadius no sx',
              'Tema já aplica 16px e border padrão',
            ],
            [
              'OutlinedInput / Select',
              'Não sobrescrever borderRadius',
              'Tema aplica 6px globalmente',
            ],
            [
              'Chip',
              'Não usar color="warning" — usar sx hardcoded',
              'A paleta warning aponta para primary',
            ],
            ['Ícones', 'Usar apenas @mui/icons-material', 'Sem Lucide, Heroicons ou SVGs externos'],
            [
              'Cores de ação',
              'Usar primary.main (#902B29) para identidade',
              'Nunca âmbar em elementos interativos',
            ],
            [
              'Cores de status',
              'Manter âmbar para status semântico',
              'Nunca primary.main em alertas/badges de status',
            ],
          ]}
        />

        <DSSubTitle>Distinção: identidade visual vs status semântico</DSSubTitle>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <RuleBox type="do">
            Usar <Code>#902B29</Code> (primary) em: botões de ação, links clicáveis, badges de tipo
            operacional (OPME, Ajustado, Prestador ajustado), bordas de hover em elementos
            interativos.
          </RuleBox>
          <RuleBox type="dont">
            Usar <Code>#902B29</Code> em: chips de SLA em risco, badges de categoria OPME/Urgente,
            ícones WarningAmberIcon, painéis de alerta documental — esses mantêm o âmbar semântico.
          </RuleBox>
        </Box>

        <DSSubTitle>Espaçamento</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 1 }}>
          MUI usa base de <strong>8px</strong>. Valores de <Code>p</Code>, <Code>m</Code>,{' '}
          <Code>gap</Code> em unidades MUI (1 = 8px).
        </Typography>
        <SimpleTable
          headers={['Valor sx', 'px equivalente', 'Uso típico']}
          rows={[
            ['0.5', '4px', 'Gap entre ícone e texto dentro de chip'],
            ['1', '8px', 'Padding interno mínimo, gap entre chips'],
            ['1.5', '12px', 'Padding de célula de tabela'],
            ['2', '16px', 'Padding interno de box de procedimento'],
            ['2.5', '20px', 'Espaçamento entre seções dentro de card'],
            ['3', '24px', 'Padding padrão de CardContent (p: 3)'],
          ]}
        />
      </DSSection>

      <Divider />

      {/* ── 6. Arquivo de tema ── */}
      <DSSection>
        <SectionTitle>Arquivo de Tema</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 2 }}>
          Localizado em <Code>src/theme/index.ts</Code>. Este é o único lugar onde tokens globais de
          design são definidos.
        </Typography>
        <CodeBlock>{`import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#902B29', dark: '#6e1f1d', contrastText: '#ffffff' },
    warning: { main: '#902B29', dark: '#6e1f1d', light: '#b03533', contrastText: '#ffffff' },
    error:   { main: '#d4183d' },
    background: { default: '#FAF6F2', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#5a6070' },
    divider: 'rgba(0,0,0,0.08)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0.2 },
  },
  components: {
    MuiButton:        { styleOverrides: { root: { borderRadius: 6, boxShadow: 'none' } } },
    MuiCard:          { styleOverrides: { root: { borderRadius: 16, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.07)' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 6 } } },
    MuiChip:          { styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } } },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' }, cursor: 'pointer' },
      },
    },
  },
})`}</CodeBlock>
      </DSSection>
    </>
  );
}

// ── Conteúdo — Arquitetura ────────────────────────────────────────────────

function ArchitectureContent() {
  return (
    <>
      <SectionTitle>Padrão arquitetural: MVVM</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 2 }}>
        Toda feature segue MVVM (Model-View-ViewModel):
      </Typography>
      <SimpleTable
        headers={['Camada', 'Onde mora', 'Responsabilidade']}
        rows={[
          ['Model', 'src/services/, src/data/, API', 'Origem dos dados (API ou mock)'],
          ['View', 'src/modules/{x}/components/*.tsx', 'Renderiza UI. ZERO lógica de negócio.'],
          [
            'ViewModel',
            'src/modules/{x}/hooks/use*.ts',
            'Estado + lógica + efeitos. Componente consome via destructuring.',
          ],
        ]}
      />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <RuleBox type="do">
          Toda regra de negócio vai no hook. Componente recebe valores prontos. Hooks têm sufixo{' '}
          <Code>use*</Code> e ficam em <Code>hooks/</Code> do módulo.
        </RuleBox>
        <RuleBox type="dont">
          Lógica condicional complexa no JSX. <Code>useState</Code> direto no componente quando
          afeta múltiplas seções. Side effects em componentes (usar <Code>useEffect</Code> em hook).
        </RuleBox>
      </Box>

      <SectionTitle>Estrutura de pastas</SectionTitle>
      <CodeBlock>{`src/
├── app/          → Next.js App Router. Routing + layout APENAS. Zero lógica.
├── core/         → Theme MUI, Providers, API client (Axios)
├── shared/       → Reusable components (chips, cards), constants (color maps), utils (logger)
├── modules/      → Feature-based modules. Cada um: components/ hooks/ types/ constants/
│   ├── analysis/        → Tela de Análise
│   ├── queue/           → Fila Operacional
│   ├── dashboard/       → Dashboard + ProcessingQueue
│   ├── history/         → Histórico (lista + detalhe)
│   ├── new-request/     → Wizard Nova Solicitação
│   └── shell/           → Sidebar, Topbar, navegação
├── types/        → Domain type definitions (pedido, usuario, notificacao)
├── data/         → Mock data (será substituído por API)
├── mocks/        → Mocks compartilhados (checklist catalogs, procedure codes)
└── services/     → Service layer (Implementation & Prototyping modes)
    └── {domain}/ → .service.ts (barrel), .types.ts, .api.ts, .fake.ts, .fake-data.ts`}</CodeBlock>

      <SectionTitle>Composição de componentes</SectionTitle>
      <CodeBlock>{`Page (orchestrator) → Sections (feature blocks) → Sub-components (UI pieces)

Hooks gerenciam state + logic do componente pai
Constants têm domain mappings (cores, labels, opções)
Types definem interfaces do módulo`}</CodeBlock>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5 }}>
        <RuleBox type="do">
          Components &lt; 200 linhas. Complexity ≤ 15. Conditional rendering via{' '}
          <Code>Record&lt;key, ReactNode&gt;</Code>, não cascading ternaries.
        </RuleBox>
        <RuleBox type="dont">
          Sub-component &gt; 80 linhas dentro do mesmo arquivo. Mais de 3 níveis de aninhamento JSX
          condicional. Decompor agora, não depois.
        </RuleBox>
      </Box>

      <SectionTitle>Component map por módulo</SectionTitle>
      <DSSubTitle>analysis</DSSubTitle>
      <CodeBlock>{`AnalysisPage (orchestrator)
├── PageHeader
├── PendencyBanner / AlertsBanner / InjunctionBanner / SimultaneousGuidesAlert
├── BeneficiarySection
├── ProceduresSection → ProcedureRow → ProcedureActionCell
├── RegisteredAdjustmentsSection
├── ObservationsSection
├── ConsolidatedHistorySection
│   └── HistoryCompleteness, HistoryTimeline, HistoryConsultations
│   └── HistoryAuthorizations, HistoryWarnings, HistoryEligibility
├── DocumentsSection
│   └── DocumentList, DocumentViewer, DocumentUploadModal,
│       DocumentRequestModal, IAExtractionPanel
├── AssistantSidebar
│   └── SuggestionSection, ChecklistSection, SpecialAlertsSection
│   └── AnalystDecisionSection → ProcedureDecisionCard, DecisionButtons
├── AdjustmentDrawer
│   └── AdjustmentFormBody → AdjustmentFieldQuantity/Provider/Code
└── Dialogs: Approval, Denial, Pendency, MedicalBoard, Divergence,
            PartialApproval, ShortcutsHelp, InjunctionAcknowledgment

Hooks: useAnalysis, useAdjustmentState, useDecisionFlow,
       useDecisionFormFields, useDialogVisibility, useKeyboardNavigation`}</CodeBlock>

      <DSSubTitle>queue / dashboard / new-request</DSSubTitle>
      <CodeBlock>{`QueuePage
├── QueueMetricsRow
├── QueueTabBar (Geral, Devolutivas, Liminares, NIPs, Tem OPME, SLA)
├── QueueFilterBar
├── QueueTable → QueueTableRow → ProceduresCell, ActionCell, SubStatusLabel
└── QueuePagination
Hooks: useQueueData, useQueueFilters, useScrollRestoration

DashboardPage
├── DashboardKpiStrip (6 KPIs)
├── SlaPredictiveCard (gestor-only)
├── ProcessingQueueTable (Entrando no sistema)
├── RecentRequestsTable
└── CategoryBreakdownCard
Hooks: useDashboardData, useProcessingQueue

NewRequestPage (wizard 6 steps)
├── StepUpload (0)
├── StepBeneficiary (1)
├── StepClinical (2)
├── StepDynamic (3) → StepTherapies / StepSadt / StepOncology / etc.
├── StepDocuments (4) — opcional
├── StepReview (5) → ValidationSummary, DocumentsReviewSection
├── TissDocPreview (sidebar)
└── SuccessDialog
Hooks: useNewRequestForm, useStepNavigation, useDocumentUpload, useUploadStep`}</CodeBlock>

      <SectionTitle>Decision tree — recebendo mudança</SectionTitle>
      <CodeBlock>{`1. Visual only (cor, espaçamento, texto)?
   → Identificar componente via Component Map
   → Se o valor vem de shared/constants → alterar lá
   → Senão: editar sx do componente. NUNCA sobrescrever defaults do tema.

2. New component?
   → Qual módulo é dono da rota?
   → Criar em src/modules/{x}/components/
   → Se tem state/lógica → criar hook em hooks/
   → Se compartilhável → src/shared/components/
   → Se > 80 linhas → decompor agora

3. New domain value (status, categoria, tipo)?
   → Adicionar no type em types/ ou no módulo
   → Atualizar shared/constants/ PRIMEIRO (cores, labels)
   → Só depois atualizar componentes consumidores
   → NUNCA inline color novo no componente

4. Logic change (validação, fluxo)?
   → Encontrar o ViewModel hook
   → Mudança vai no hook, não no componente
   → Validação → função pura extraída
   → Conditional → manter complexity ≤ 15

5. API integration?
   → Endpoint existe no Swagger?
   →   Sim → Implementation Mode
   →   Não → Prototyping Mode + criar issue no BE`}</CodeBlock>

      <SectionTitle>Modos: Prototyping vs Implementation</SectionTitle>
      <SimpleTable
        headers={['Critério', 'Prototyping (atual)', 'Implementation (futuro)']}
        rows={[
          ['Quando', 'Endpoint NÃO existe no Swagger', 'Endpoint existe e está documentado'],
          [
            'Origem dos dados',
            'src/data/pedidos.ts + src/mocks/ + .fake.ts',
            'API real via Axios em .api.ts',
          ],
          [
            'Service barrel',
            'USE_FAKE=true → resolve para fake',
            'USE_FAKE=false → resolve para api',
          ],
          [
            'Marcador obrigatório',
            'Header @prototype + @planned-endpoint',
            'Tipos derivados do Swagger, contratos via OpenAPI',
          ],
          ['Mocks fora de teste', 'Permitidos no service layer', 'PROIBIDOS — só em testes (MSW)'],
        ]}
      />
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mt: 2 }}>
        Service layer atual usa <Code>createPendingApiService</Code> (Proxy stub) em barrels onde{' '}
        <Code>USE_FAKE=false</Code> mas <Code>.api.ts</Code> ainda não existe — métodos rejeitam com
        erro descritivo apontando o que falta criar (P0.1 do plano M7).
      </Typography>

      <SectionTitle>Convenções de código</SectionTitle>
      <DSSubTitle>Linguagem</DSSubTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mb: 1 }}>
        <strong>TODO código em inglês</strong> — variáveis, funções, comentários, logs, types, tudo.
        Git: commits + branches em inglês. PR titles + descriptions em PT-BR (comunicação de time).
        UI em PT-BR para o usuário final.
      </Typography>

      <DSSubTitle>TypeScript</DSSubTitle>
      <CodeBlock>{`// Strict + noUncheckedIndexedAccess habilitados
// Type imports obrigatórios:
import { type Foo } from './types'

// Interface > type para APIs públicas
// Record fallbacks devem usar constants extraídas, não index access com fallback`}</CodeBlock>

      <DSSubTitle>Logging</DSSubTitle>
      <CodeBlock>{`// ESLint bloqueia console.log/warn/error (no-console: error)
import { logger } from '@/shared/utils/logger'

logger.debug('dev')
logger.info('event')
logger.warn('attention')
logger.error('failure', err)

// Proibido logar: tokens, senhas, CPF, dados de paciente, PII
// IDs apenas em contexto de usuário — nunca nomes/emails/documentos
// Nunca logar response API completo — filtrar campos relevantes`}</CodeBlock>

      <DSSubTitle>Imports — ordem enforçada</DSSubTitle>
      <CodeBlock>{`// 1. react
import { useState, useEffect } from 'react'

// 2. next
import { useRouter } from 'next/navigation'

// 3. external
import Box from '@mui/material/Box'

// 4. @/core
import { theme } from '@/core/theme'

// 5. @/shared
import { statusColorMap } from '@/shared/constants'

// 6. @/modules
import { useAnalysis } from '@/modules/analysis/hooks/useAnalysis'

// 7. @/types
import { type Request } from '@/types/pedido'

// 8. @/mocks
import { TUSS_CODES } from '@/mocks/procedure-codes'

// 9. relative
import { type LocalType } from './types'

// PROIBIDO: imports relativos profundos (../../) — ESLint bloqueia`}</CodeBlock>

      <DSSubTitle>Git — Conventional Commits</DSSubTitle>
      <CodeBlock>{`// Format: type(scope): description
// English, lowercase, no period, max 72 chars

// Types permitidos
feat, fix, refactor, style, chore, docs, test, ci, perf

// Scopes permitidos
analise, fila, dashboard, historico, usuarios, nova-solicitacao,
auth, shared, core, ci, deps

// Branches: type/TICKET-short-description
feat/NEW-779-setup-guardrails

// Regra ABSOLUTA: NUNCA commit/push automático
// Esperar instrução explícita do usuário`}</CodeBlock>

      <DSSubTitle>Pull Requests</DSSubTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mb: 1 }}>
        Title ≤ 70 chars em PT-BR. Body com bullets em PT-BR, sem checkboxes. Sections: Resumo →
        Mudanças → Screenshots (se aplicável) → Ticket (sempre último). Template em{' '}
        <Code>.github/PULL_REQUEST_TEMPLATE.md</Code>.
      </Typography>

      <SectionTitle>Workflow de evolução por milestone</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65, mb: 2 }}>
        Base ativa avança a cada milestone fechada. PR de cada milestone fica em estado{' '}
        <strong>open</strong> apontando para <Code>main</Code> mas <strong>NÃO merge</strong>. Merge
        final acontece depois que backend integrar. Cada milestone tem preview Vercel próprio (1
        projeto Vercel por milestone, scope <Code>davirojtenberg-labs-projects</Code>).
      </Typography>
      <SimpleTable
        headers={['Milestone', 'Branch', 'Escopo']}
        rows={[
          ['M0', 'TEA-MVP', 'TEA MVP (CID F84) — encerrado'],
          ['M1', 'TEA-M1', 'Maturidade Operacional TEA'],
          ['M2', 'Ambulatoriais-M2', 'SADT, Exames AC, Home Care'],
          ['M3', 'Hospitalares-Críticos-M3', 'U/E, Oncologia + capacidades transversais'],
          ['M4', 'Hospitalares-Core-M4', 'Internação, Cirurgias Eletivas'],
          ['M5', 'Materiais-M5', 'OPME (ANVISA, cotações, pacote TISS-19)'],
          ['M6', 'Ajustes-e-Refinamentos-M6', 'Pedidos Complementares, SLA Predictive'],
          [
            'M7',
            'Evolucao-M7 (ativa)',
            'Avaliação Jurídica acoplada (ADR-028) + cluster regulatório',
          ],
        ]}
      />

      <SectionTitle>Validação obrigatória pós-mudança</SectionTitle>
      <CodeBlock>{`npm run validate
# = npm run typecheck && npm run lint:strict && npm run format:check

# Rodar SEMPRE após qualquer mudança de código
# ESLint com --max-warnings 0
# Prettier com check (não write) por padrão`}</CodeBlock>

      <SectionTitle>Regras de produto load-bearing</SectionTitle>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <RuleBox type="do">
          <strong>White-label sempre.</strong> Operadora-specific via{' '}
          <Code>operatorConfig.&lt;param&gt;</Code> configurável. Mocks podem usar Athena como
          referência mas sinalizar como ilustrativo.
        </RuleBox>
        <RuleBox type="dont">
          Nunca hardcode &ldquo;Athena&rdquo; em copy, regras, valores. Nunca rotular IA como
          &ldquo;Decisão da IA&rdquo;. Nunca bloquear F84.x por quantidade de sessões.
        </RuleBox>
        <RuleBox type="do">
          <strong>Step Documentos NUNCA bloqueia submit.</strong> Pedido sem docs entra com status{' '}
          Pendência. Sistema gerencia via devolutiva, não barreira de UI.
        </RuleBox>
        <RuleBox type="dont">
          Nunca adicionar case <Code>currentStep === 4</Code> em <Code>validateStepTransition</Code>{' '}
          com validação de documentos obrigatórios. Lista de docs serve para recomendação visual +
          auto-pendência no submit.
        </RuleBox>
        <RuleBox type="do">
          <strong>Imutabilidade e rastreabilidade.</strong> Decisões geram registro append-only.
          Snapshot do contexto no momento da decisão (avaliação jurídica, sugestão IA, checklist).
          Divergência da IA exige justificativa estruturada.
        </RuleBox>
        <RuleBox type="dont">
          Editar histórico. Sobrescrever audit log. Permitir undo de decisão finalizada.
        </RuleBox>
      </Box>

      <SectionTitle>Atalhos de teclado (Análise)</SectionTitle>
      <SimpleTable
        headers={['Tecla', 'Ação']}
        rows={[
          ['?', 'Abre help drawer com lista de atalhos'],
          ['A', 'Aprovar pedido'],
          ['N', 'Negar pedido'],
          ['P', 'Pendenciar'],
          ['J', 'Encaminhar para Junta Médica'],
          ['Esc', 'Fecha dialog aberto'],
        ]}
      />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: '48px', px: '32px' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 0.5 }}>
            Arvo Auth
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#5a6070', fontWeight: 500, mb: 0.5 }}>
            Documentação Técnica de Produto, Design System e Arquitetura
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            v2.0 · Maio 2026 · M7 ativo (9 categorias, 20+ capacidades transversais, white-label)
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v as number);
          }}
          sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', mb: 4 }}
        >
          <Tab label="Produto" sx={{ fontWeight: 600, fontSize: 14, textTransform: 'none' }} />
          <Tab
            label="Design System"
            sx={{ fontWeight: 600, fontSize: 14, textTransform: 'none' }}
          />
          <Tab label="Arquitetura" sx={{ fontWeight: 600, fontSize: 14, textTransform: 'none' }} />
        </Tabs>

        {tab === 0 && <ProductContent />}
        {tab === 1 && <DesignSystemContent />}
        {tab === 2 && <ArchitectureContent />}

        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: '#9ca3af', mt: 6 }}
        >
          Arvo Auth · Documentação interna · Não distribuir externamente
        </Typography>
      </Box>
    </Box>
  );
}
