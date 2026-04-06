'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// ── Helpers compartilhados ────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 5, fontSize: 17 }}>
      {children}
    </Typography>
  )
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, mt: 1.5, mb: 1 }}>
      <Box component="thead">
        <Box component="tr">
          {headers.map((h, hi) => (
            <Box key={`${h}-${hi}`} component="th" sx={{ textAlign: 'left', fontWeight: 700, py: 1, px: 1.5, backgroundColor: '#F0F0F0', borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#1a1a1a' }}>
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {rows.map((row, ri) => (
          <Box key={ri} component="tr" sx={{ backgroundColor: ri % 2 === 0 ? '#fff' : '#F7F7F7', '&:hover': { backgroundColor: '#F0F0F0' } }}>
            {row.map((cell, ci) => (
              <Box key={ci} component="td" sx={{ py: 0.9, px: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)', color: ci === 0 ? '#1a1a1a' : '#5a6070', fontWeight: ci === 0 ? 500 : 400 }}>
                {ci === 0 && cell.startsWith('/') ? (
                  <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 13, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.7, py: 0.2, borderRadius: 1 }}>
                    {cell}
                  </Box>
                ) : cell}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function FeatureItem({ name, route, children }: { name: string; route?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{name}</Typography>
        {route && (
          <Box component="code" sx={{ fontSize: 12, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.8, py: 0.25, borderRadius: 1, fontFamily: 'monospace' }}>
            {route}
          </Box>
        )}
      </Box>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.65 }}>{children}</Typography>
    </Box>
  )
}

// ── Design System helpers ─────────────────────────────────────────────────

function DSSection({ children }: { children: React.ReactNode }) {
  return <Box sx={{ mb: 5 }}>{children}</Box>
}

function DSSubTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.6, color: '#5a6070', mb: 2, mt: 4 }}>
      {children}
    </Typography>
  )
}

function Code({ children }: { children: string }) {
  return (
    <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12, backgroundColor: '#F0F0F0', color: '#5a6070', px: 0.7, py: 0.2, borderRadius: 1 }}>
      {children}
    </Box>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <Box component="pre" sx={{ backgroundColor: '#1a1a1a', color: '#e5e7eb', p: 2, borderRadius: 2, fontSize: 12, fontFamily: 'monospace', overflow: 'auto', mt: 1, mb: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {children}
    </Box>
  )
}

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, p: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#fff', mb: 1 }}>
      {children}
    </Box>
  )
}

function ColorSwatch({ hex, name, usage, textColor = '#fff' }: { hex: string; name: string; usage: string; textColor?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.75 }}>
      <Box sx={{ width: 52, height: 52, borderRadius: 2, backgroundColor: hex, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 9, fontWeight: 700, color: textColor, fontFamily: 'monospace', letterSpacing: 0.3 }}>
          {hex}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{name}</Typography>
        <Typography sx={{ fontSize: 12, color: '#5a6070' }}>{usage}</Typography>
      </Box>
    </Box>
  )
}

function RuleBox({ type, children }: { type: 'do' | 'dont'; children: React.ReactNode }) {
  const isDo = type === 'do'
  return (
    <Box sx={{ border: `1.5px solid ${isDo ? 'rgba(22,163,74,0.4)' : 'rgba(212,24,61,0.4)'}`, borderRadius: 2, p: 2, flex: 1, minWidth: 200 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: isDo ? '#16a34a' : '#d4183d', mb: 1 }}>
        {isDo ? '✓ Fazer' : '✗ Evitar'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#5a6070', fontSize: 13, lineHeight: 1.6 }}>{children}</Typography>
    </Box>
  )
}

// ── Conteúdo — Produto ────────────────────────────────────────────────────

function ProductContent() {
  return (
    <>
      <SectionTitle>O que é o Arvo Auth</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75 }}>
        Plataforma de autorização de procedimentos médicos para operadoras de saúde. Centraliza a entrada de
        pedidos, aplica análise assistida por IA para detectar irregularidades e apoia o operador na decisão
        de aprovar, negar ou escalar cada solicitação. O valor econômico está em{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>evitar aprovações indevidas</Box> — cada negativa
        bem fundamentada representa economia direta para a operadora.
      </Typography>

      <SectionTitle>Perfis de acesso</SectionTitle>
      <SimpleTable
        headers={['Perfil', 'Acesso', 'Descrição']}
        rows={[
          ['Autorizador', 'Fila, Análise, Nova Solicitação', 'Analisa e decide pedidos'],
          ['Gestor', 'Todas as telas + Usuários', 'Supervisiona operação e equipe'],
          ['Auditor', 'Histórico (somente leitura)', 'Consulta registros de decisões'],
        ]}
      />

      <SectionTitle>Funcionalidades do sistema</SectionTitle>
      <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 4 }}>
        As funcionalidades estão ordenadas por prioridade de desenvolvimento:{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>Primárias</Box> são o núcleo do produto e devem
        estar 100% funcionais antes de qualquer outra coisa.{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>Secundárias</Box> complementam a operação.{' '}
        <Box component="strong" sx={{ color: '#1a1a1a' }}>Terciárias</Box> agregam valor mas não são bloqueantes.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Chip label="Primária" size="small" sx={{ backgroundColor: '#7B1C1C', color: '#fff', fontWeight: 700, fontSize: 11 }} />
        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>Núcleo do produto — deve estar 100% funcional antes das demais</Typography>
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
        Painel lateral em <Code>/analise</Code>. Gera recomendação (Aprovar / Negar / Junta Médica), checklist
        de conformidade e alertas contextuais (Liminar Judicial, NIP Ativa, Fora do Rol, High-User, Prestador
        Não Credenciado). Base para todas as decisões assistidas.
      </FeatureItem>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Chip label="Secundária" size="small" sx={{ backgroundColor: '#1A3A5C', color: '#fff', fontWeight: 700, fontSize: 11 }} />
        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>Complementam a operação</Typography>
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
        {['PENDENTE_AGUARDANDO', 'PENDENTE_RETORNO_RECEBIDO', 'JUNTA_AGUARDANDO', 'JUNTA_PARECER_RECEBIDO'].map((s) => (
          <Box key={s} component="code" sx={{ fontFamily: 'monospace', fontSize: 12, color: '#5a6070', backgroundColor: '#F0F0F0', px: 0.6, py: 0.15, borderRadius: 1, mr: 0.5 }}>
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Chip label="Terciária" size="small" sx={{ backgroundColor: '#4A4A4A', color: '#fff', fontWeight: 700, fontSize: 11 }} />
        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: 12 }}>Agregam valor mas não são bloqueantes</Typography>
      </Box>

      <FeatureItem name="Usuários" route="/usuarios">
        Gestão de equipe: criar, editar, ativar/inativar usuários. Perfis: Autorizador, Gestor, Auditor. Filtro por perfil e status.
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
    </>
  )
}

// ── Conteúdo — Design System ──────────────────────────────────────────────

function DesignSystemContent() {
  return (
    <>

      {/* ── 1. Paleta de Cores ── */}
      <DSSection>
        <SectionTitle>Paleta de Cores</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          O sistema usa duas categorias de cor: <strong>identidade visual</strong> (vermelho Arvo — ações, botões,
          links interativos) e <strong>semântica de status</strong> (âmbar, verde, vermelho-alerta, azul, roxo —
          cada um com significado operacional fixo). Nunca trocar as cores semânticas por identidade visual.
        </Typography>

        <DSSubTitle>Identidade Visual</DSSubTitle>
        <ColorSwatch hex="#902B29" name="Primary Main" usage="Botões de ação, links ativos, foco, bordas interativas" />
        <ColorSwatch hex="#6e1f1d" name="Primary Dark" usage="Hover de botões contained primary" />
        <ColorSwatch hex="#FAF6F2" name="Background Default" usage="Fundo global de todas as telas" textColor="#1a1a1a" />
        <ColorSwatch hex="#ffffff" name="Background Paper" usage="Cards, modais, drawers, superfícies elevadas" textColor="#1a1a1a" />

        <DSSubTitle>Semântica de Status</DSSubTitle>
        <ColorSwatch hex="#16a34a" name="Verde — Aprovado / OK" usage="SLA ok, decisão aprovada, campos válidos, credenciado" textColor="#fff" />
        <ColorSwatch hex="#d4183d" name="Vermelho — Negado / Erro" usage="Negativas, bloqueios críticos, SLA violado, não credenciado" textColor="#fff" />
        <ColorSwatch hex="#f59e0b" name="Âmbar 500 — Atenção visual" usage="Ícones WarningAmberIcon, borders de alertas documentais" textColor="#1a1a1a" />
        <ColorSwatch hex="#b45309" name="Âmbar 700 — Texto de atenção" usage="Texto em alertas, chips de status pendente/OPME/Urgente/Junta Médica" textColor="#fff" />
        <ColorSwatch hex="#2563eb" name="Azul — Informativo / Junta" usage="Junta Médica, sub-status de junta, origem App, chips Eleitiva" textColor="#fff" />
        <ColorSwatch hex="#7c3aed" name="Roxo — Liminar Judicial" usage="Exclusivo para alertas de liminar judicial" textColor="#fff" />
        <ColorSwatch hex="#0891b2" name="Ciano — Exames Alta Complexidade" usage="Categoria Exames Alta Complexidade, origem E-mail" textColor="#fff" />
        <ColorSwatch hex="#059669" name="Verde escuro — Cirurgias" usage="Categoria Cirurgias Eletivas" textColor="#fff" />

        <DSSubTitle>Texto</DSSubTitle>
        <ColorSwatch hex="#1a1a1a" name="Text Primary" usage="Títulos, labels, valores principais" textColor="#fff" />
        <ColorSwatch hex="#5a6070" name="Text Secondary" usage="Descrições, captions, metadados" textColor="#fff" />
        <ColorSwatch hex="#9ca3af" name="Text Disabled" usage="Campos desabilitados, placeholders" textColor="#1a1a1a" />

        <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
          <strong>Regra crítica:</strong> nunca usar <Code>#902B29</Code> para status semântico (alertas, SLA, categorias).
          Nunca usar cores semânticas âmbar em botões ou links de ação — isso quebra a legibilidade operacional do sistema.
        </Alert>
      </DSSection>

      <Divider />

      {/* ── 2. Tipografia ── */}
      <DSSection>
        <SectionTitle>Tipografia</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          Fonte exclusiva: <Code>Space Grotesk</Code> — carregada via Google Fonts. Não usar outras fontes.
          Botões têm <Code>fontWeight: 600</Code> e <Code>textTransform: none</Code> globalmente via tema.
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
          Três variantes. Nunca adicionar <Code>borderRadius</Code> via <Code>sx</Code> — o tema já aplica <Code>6px</Code> globalmente.
        </Typography>

        <Preview>
          <Button variant="contained">Confirmar Decisão</Button>
          <Button variant="outlined">Cancelar</Button>
          <Button variant="text" sx={{ color: 'primary.main', fontWeight: 600 }}>+ Adicionar Procedimento</Button>
          <Button variant="contained" disabled>Desabilitado</Button>
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
          <RuleBox type="do">Usar <Code>color=&quot;primary&quot;</Code> para ações de identidade visual. Deixar o tema controlar <Code>borderRadius</Code>, <Code>boxShadow</Code> e <Code>textTransform</Code>.</RuleBox>
          <RuleBox type="dont">Usar <Code>color=&quot;warning&quot;</Code> em botões de ação. Não adicionar <Code>borderRadius</Code> ou <Code>boxShadow</Code> via <Code>sx</Code> em botões.</RuleBox>
        </Box>

        {/* Cards */}
        <DSSubTitle>Cards</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', mb: 2 }}>
          O tema aplica automaticamente: <Code>borderRadius: 16px</Code>, <Code>boxShadow: none</Code>, <Code>border: 1px solid rgba(0,0,0,0.07)</Code>.
          Usar <Code>{'<Card>'}</Code> + <Code>{'<CardContent sx={{ p: 3 }}>'}</Code> como padrão.
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

// Card de alerta (ajustes registrados, devolutiva)
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
          O tema aplica <Code>borderRadius: 6px</Code> globalmente via <Code>MuiOutlinedInput</Code>. Nunca sobrescrever via <Code>sx</Code>.
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
            <Alert severity="warning" sx={{ borderRadius: 2 }}>Pendenciar NÃO interrompe o contador de SLA</Alert>
            <Alert severity="error" sx={{ borderRadius: 2 }}>2 alertas identificados neste pedido</Alert>
            <Alert severity="info" sx={{ borderRadius: 2 }}>Documento com validade de 6 meses</Alert>
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
          Todos os chips usam <Code>size=&quot;small&quot;</Code> e <Code>fontWeight: 700</Code>. Altura padrão:{' '}
          <Code>height: 22</Code> na fila, <Code>height: 20</Code> em contextos mais compactos.
          Nunca usar <Code>color=&quot;warning&quot;</Code> — sempre hardcoded via <Code>sx</Code>.
        </Typography>

        <DSSubTitle>Status da Guia</DSSubTitle>
        <Preview>
          <Chip label="Em Análise" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.18)', color: '#92400e', fontWeight: 700, height: 22 }} />
          <Chip label="Aprovado" size="small" sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 700, height: 22 }} />
          <Chip label="Negado" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontWeight: 700, height: 22 }} />
          <Chip label="Devolutiva" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.18)', color: '#92400e', fontWeight: 700, height: 22 }} />
        </Preview>
        <CodeBlock>{`const statusColor = {
  'Em Análise': { bg: 'rgba(245,158,11,0.18)', color: '#92400e' },
  'Aprovado':   { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'Negado':     { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
  'Devolutiva': { bg: 'rgba(245,158,11,0.18)', color: '#92400e' },
}`}</CodeBlock>

        <DSSubTitle>SLA</DSSubTitle>
        <Preview>
          <Chip label="8h restantes" size="small" sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: 12, fontWeight: 700, height: 22 }} />
          <Chip label="2h restantes" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontSize: 12, fontWeight: 700, height: 22 }} />
          <Chip label="VIOLADO" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontSize: 12, fontWeight: 700, height: 22 }} />
        </Preview>
        <CodeBlock>{`const slaColorMap = {
  ok:      { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
  violated: { bg: 'rgba(212,24,61,0.1)', color: '#d4183d' },
}`}</CodeBlock>

        <DSSubTitle>IA Sugestão</DSSubTitle>
        <Preview>
          <Chip label="Aprovar" size="small" sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: 12, fontWeight: 700, height: 22 }} />
          <Chip label="Negar" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontSize: 12, fontWeight: 700, height: 22 }} />
          <Chip label="Junta Médica" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontSize: 12, fontWeight: 700, height: 22 }} />
        </Preview>
        <CodeBlock>{`const iaSugestaoColorMap = {
  'Aprovar':      { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  'Negar':        { bg: 'rgba(212,24,61,0.1)',   color: '#d4183d' },
  'Junta Médica': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
}`}</CodeBlock>

        <DSSubTitle>Categorias de Procedimento</DSSubTitle>
        <Preview>
          <Chip label="Internação" size="small" sx={{ backgroundColor: 'rgba(144,43,41,0.1)', color: '#902B29', fontWeight: 600, height: 22 }} />
          <Chip label="Urgência/Emergência" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontWeight: 600, height: 22 }} />
          <Chip label="Oncologia" size="small" sx={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontWeight: 600, height: 22 }} />
          <Chip label="Terapias Especiais" size="small" sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 600, height: 22 }} />
          <Chip label="OPME" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontWeight: 600, height: 22 }} />
          <Chip label="Exames Alta Complexidade" size="small" sx={{ backgroundColor: 'rgba(8,145,178,0.1)', color: '#0891b2', fontWeight: 600, height: 22 }} />
          <Chip label="Cirurgias Eletivas" size="small" sx={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669', fontWeight: 600, height: 22 }} />
          <Chip label="SADT" size="small" sx={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16a34a', fontWeight: 600, height: 22 }} />
        </Preview>
        <CodeBlock>{`const catColorMap = {
  'Internação':              { bg: 'rgba(144,43,41,0.1)',  color: '#902B29' },
  'Urgência/Emergência':     { bg: 'rgba(212,24,61,0.1)',  color: '#d4183d' },
  'Oncologia':               { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
  'Terapias Especiais':      { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  'OPME':                    { bg: 'rgba(245,158,11,0.12)',color: '#b45309' },
  'Exames Alta Complexidade':{ bg: 'rgba(8,145,178,0.1)',  color: '#0891b2' },
  'Cirurgias Eletivas':      { bg: 'rgba(5,150,105,0.1)',  color: '#059669' },
  'Home Care':               { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a' },
  'SADT':                    { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a' },
}`}</CodeBlock>

        <DSSubTitle>Tipo de Guia</DSSubTitle>
        <Preview>
          <Chip label="Eleitiva" size="small" sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: 700, height: 20 }} />
          <Chip label="Urgente" size="small" sx={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#b45309', fontWeight: 700, height: 20 }} />
          <Chip label="Emergência" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontWeight: 700, height: 20 }} />
        </Preview>

        <DSSubTitle>Alertas Especiais</DSSubTitle>
        <Preview>
          <Chip label="Liminar Judicial" size="small" sx={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed', fontWeight: 700, height: 22 }} />
          <Chip label="SLA Violado" size="small" sx={{ backgroundColor: 'rgba(212,24,61,0.1)', color: '#d4183d', fontWeight: 700, height: 22 }} />
          <Chip label="OPME" size="small" sx={{ backgroundColor: 'rgba(144,43,41,0.1)', color: 'primary.main', fontWeight: 700, height: 18 }} />
          <Chip label="Ajustado" size="small" sx={{ backgroundColor: 'rgba(144,43,41,0.1)', color: 'primary.main', fontWeight: 700, height: 20 }} />
          <Chip label="Prestador ajustado" size="small" sx={{ fontSize: 10, height: 18, backgroundColor: 'rgba(144,43,41,0.08)', color: 'primary.main' }} />
        </Preview>
      </DSSection>

      <Divider />

      {/* ── 5. Regras Obrigatórias ── */}
      <DSSection>
        <SectionTitle>Regras Obrigatórias</SectionTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 3 }}>
          Estas regras refletem decisões de design já tomadas e codificadas no tema. Violá-las gera inconsistência visual
          e pode quebrar o comportamento esperado pelo MUI.
        </Typography>

        <SimpleTable
          headers={['Componente', 'Regra', 'Motivo']}
          rows={[
            ['Button', 'Nunca adicionar borderRadius via sx', 'Tema já aplica 6px globalmente'],
            ['Button', 'Nunca adicionar boxShadow via sx', 'Tema aplica none globalmente'],
            ['Card', 'Não duplicar border ou borderRadius no sx', 'Tema já aplica 16px e border padrão'],
            ['OutlinedInput / Select', 'Não sobrescrever borderRadius', 'Tema aplica 6px globalmente'],
            ['Chip', 'Não usar color="warning" — usar sx hardcoded', 'A paleta warning aponta para primary'],
            ['Ícones', 'Usar apenas @mui/icons-material', 'Sem Lucide, Heroicons ou SVGs externos'],
            ['Cores de ação', 'Usar primary.main (#902B29) para identidade', 'Nunca âmbar em elementos interativos'],
            ['Cores de status', 'Manter âmbar para status semântico', 'Nunca primary.main em alertas/badges de status'],
          ]}
        />

        <DSSubTitle>Distinção: identidade visual vs status semântico</DSSubTitle>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
          <RuleBox type="do">
            Usar <Code>#902B29</Code> (primary) em: botões de ação, links clicáveis, badges de tipo operacional (OPME, Ajustado, Prestador ajustado), bordas de hover em elementos interativos.
          </RuleBox>
          <RuleBox type="dont">
            Usar <Code>#902B29</Code> em: chips de SLA em risco, badges de categoria OPME/Urgente, ícones WarningAmberIcon, painéis de alerta documental — esses mantêm o âmbar semântico.
          </RuleBox>
        </Box>

        <DSSubTitle>Espaçamento</DSSubTitle>
        <Typography variant="body2" sx={{ color: '#5a6070', lineHeight: 1.75, mb: 1 }}>
          MUI usa base de <strong>8px</strong>. Valores de <Code>p</Code>, <Code>m</Code>, <Code>gap</Code> em unidades MUI (1 = 8px).
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
          Localizado em <Code>src/theme/index.ts</Code>. Este é o único lugar onde tokens globais de design são definidos.
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
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [tab, setTab] = useState(0)

  return (
    <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh', py: '48px', px: '32px' }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>

        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 0.5 }}>
            Arvo Auth
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#5a6070', fontWeight: 500, mb: 0.5 }}>
            Documentação Técnica de Produto
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            v1.0 · Março 2026
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', mb: 4 }}
        >
          <Tab label="Produto" sx={{ fontWeight: 600, fontSize: 14, textTransform: 'none' }} />
          <Tab label="Design System" sx={{ fontWeight: 600, fontSize: 14, textTransform: 'none' }} />
        </Tabs>

        {tab === 0 && <ProductContent />}
        {tab === 1 && <DesignSystemContent />}

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#9ca3af', mt: 6 }}>
          Arvo Auth · Documentação interna · Não distribuir externamente
        </Typography>
      </Box>
    </Box>
  )
}
