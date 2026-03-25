# PRD — Athena Autorizador
### Sistema de Autorização de Planos de Saúde
**Versão:** 1.0 · **Destino:** Figma Make / AI UI Generator
**Idioma do sistema:** Português Brasileiro
**Stack de referência:** Next.js 16 + MUI v6

---

## 1. VISÃO GERAL DO PRODUTO

**Nome:** Athena Autorizador
**Tipo:** SaaS B2B — Sistema interno para operadoras de planos de saúde
**Função:** Plataforma de análise e autorização de guias médicas (SADT, internações, cirurgias, OPME, terapias, oncologia). Analistas humanos revisam pedidos de cobertura, auxiliados por sugestões de IA, e tomam decisões de Aprovação, Negação ou encaminhamento para Junta Médica.

**Usuários:**
- **Autorizador** — analisa e decide pedidos na fila operacional
- **Gestor** — acesso total, incluindo relatórios e configurações
- **Auditor** — somente leitura de histórico e relatórios

---

## 2. DESIGN SYSTEM

### 2.1 Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `primary.main` | `#902B29` | Cor institucional Athena, botões primários, estados ativos, ícones de destaque |
| `primary.dark` | `#6e1f1d` | Hover do primary |
| `primary.contrastText` | `#ffffff` | Texto sobre primary |
| `error.main` | `#d4183d` | Erros, negações, SLA violado |
| `background.default` | `#FAF6F2` | Fundo geral das páginas |
| `background.paper` | `#ffffff` | Cards, modais, sidebar |
| `text.primary` | `#1a1a1a` | Texto principal |
| `text.secondary` | `#5a6070` | Texto de suporte, labels, captions |
| `divider` | `rgba(0,0,0,0.08)` | Linhas divisórias |

**Cores semânticas de uso frequente (não são tokens do tema — usadas diretamente via sx):**

| Contexto | Cor | Fundo chip |
|---|---|---|
| Aprovado / OK | `#16a34a` | `rgba(22,163,74,0.1)` |
| Negado / Violado SLA | `#d4183d` | `rgba(212,24,61,0.1)` |
| Atenção / Devolutiva / Âmbar | `#b45309` | `rgba(245,158,11,0.12)` |
| Junta Médica / Oncologia | `#7c3aed` | `rgba(124,58,237,0.1)` |
| IA / App | `#2563eb` | `rgba(37,99,235,0.1)` |
| Internação | `#902B29` | `rgba(144,43,41,0.1)` |
| Exames / Teal | `#0891b2` | `rgba(8,145,178,0.1)` |
| Cirurgias / Verde escuro | `#059669` | `rgba(5,150,105,0.1)` |
| OPME / Ocre | `#b45309` | `rgba(245,158,11,0.12)` |
| WhatsApp | `#16a34a` | `rgba(22,163,74,0.1)` |

### 2.2 Tipografia

| Elemento | Fonte | Peso | Tamanho |
|---|---|---|---|
| Família base | Space Grotesk | — | — |
| h4 (títulos de página) | Space Grotesk | 700 | 28–32px |
| h5 | Space Grotesk | 700 | 24px |
| h6 | Space Grotesk | 700 | 20px |
| Título de card/seção | Space Grotesk | 700 | 14px, uppercase, letter-spacing 0.5 |
| Body 1 | Space Grotesk | 400 | 16px |
| Body 2 | Space Grotesk | 400/600 | 14px |
| Caption / labels | Space Grotesk | 400–600 | 12px (mínimo absoluto) |
| Botões | Space Grotesk | 600 | 13–14px, textTransform: none, letterSpacing 0.2 |
| ID de pedido (monospace) | monospace | 700 | 12px, cor primary |
| Números big (KPI) | Space Grotesk | 800 | 26–32px |

### 2.3 Bordas e Raios

| Componente | Border Radius |
|---|---|
| Button | 6px |
| Card | 16px |
| Input / Select | 6px |
| Chip / Badge | 4px |
| Dialog / Modal | 16px |
| Avatar | circular (50%) |
| Ícone em badge quadrado | 8px |
| Barra de progresso | 4px |

**REGRA CRÍTICA:** Nunca sobrescrever border-radius dos componentes acima. O tema aplica globalmente.

### 2.4 Sombras e Bordas de Card

- Cards: **sem sombra** (`boxShadow: none`)
- Cards: borda `1px solid rgba(0,0,0,0.07)`
- Cards interativos (hover): `boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: translateY(-1px)` ao hover
- Sidebar / Drawer: sem sombra, borda direita `1px solid rgba(0,0,0,0.07)` (apenas abaixo da logo)

### 2.5 Espaçamento

- Padding padrão de CardContent: `p: 3` (24px)
- Gap entre cards numa página: `gap: 2.5` (20px)
- Padding horizontal de página: `px: 3` (24px)
- Padding vertical de página: `py: 3` (24px)
- Padding de header de página: `px: 3, py: 1.75`
- Gap entre seções de formulário: `gap: 2` (16px)

### 2.6 Interações e Animações

- Hover em linhas de tabela: `backgroundColor: rgba(144,43,41,0.03)` + `transition: background-color 0.15s ease`
- Hover em cards clicáveis: `boxShadow + translateY(-1px)` + `transition: all 0.15s ease`
- Hover em botões de sidebar: `rgba(144,43,41,0.06)`
- Cursor pointer: obrigatório em qualquer elemento clicável que não seja Button/Link nativo
- Transitions: sempre `0.15s ease` para micro-interações

---

## 3. ESTRUTURA DE LAYOUT (SHELL)

### 3.1 AppShell — Layout Principal

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR (AppBar) — height: 60px, fundo #fff, z-index 1201   │
│  [espaço do sidebar 240px] | [título página] | [notif][user]│
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  SIDEBAR     │   CONTEÚDO PRINCIPAL                        │
│  240px       │   background: #FAF6F2                       │
│  fundo #fff  │   overflow-y: auto (por página)             │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Topbar (AppBar):**
- `height: 60px`, `minHeight: 60px`, fundo branco, sem sombra, `borderBottom: 1px solid rgba(0,0,0,0.07)`
- À esquerda: espaço reservado de 240px (alinhado com sidebar)
- Centro: vazio (ou título dinâmico da página)
- À direita: ícone de notificações com badge de contagem → abre popover com lista de notificações; avatar do usuário logado → abre menu dropdown (Meu Perfil, Sair)

**Sidebar (Drawer permanente):**
- `width: 240px`, fundo branco, posição fixed
- **Área da logo** (60px altura, sem borda direita): logo "Arvo Auth" (`/logo-arvo.svg`, 110×28px), `borderBottom: 1px solid rgba(0,0,0,0.07)`
- **Área de conteúdo** (flex: 1, `borderRight: 1px solid rgba(0,0,0,0.07)`):
  - Nav principal: Dashboard, Fila Operacional (badge com contagem), Histórico
  - Divider
  - Nav admin: Usuários
  - Divider
  - **Categorias** (collapsible, aberto por padrão): lista de 8 categorias com ícone colorido e contador. Clicar navega para `/fila?categoria=X`
  - **Links Úteis** (collapsible): 4 links externos (Rol ANS, ANVISA, Árvore de Códigos, TISS 2026)
  - Rodapé: botão "Ajuda e Suporte" com ícone HelpOutline

**Estado ativo na sidebar:**
- Item ativo: `backgroundColor: #902B29`, cor de texto/ícone branco
- Item inativo: texto `text.secondary`, hover `rgba(144,43,41,0.06)`
- Badge do item ativo: fundo `rgba(255,255,255,0.22)`, texto branco

**Popover de Notificações:**
- Abre abaixo do ícone, largura 360px
- Header: "Notificações" + chip com contagem não-lida
- Lista de notificações: ícone colorido por tipo (devolutiva=âmbar, sla=vermelho, urgência=vermelho), título em bold, mensagem em body2, tempo em caption
- Itens não lidos: fundo `rgba(144,43,41,0.03)`
- Rodapé: link "Ver todas as notificações" → `/notificacoes`

---

## 4. PÁGINAS

---

### 4.1 DASHBOARD (`/dashboard`)

**Layout:** página com scroll, `p: 3`, conteúdo em Grid MUI

#### Seção 1 — KPI Cards (Row 1)
5 cards em linha, `flex: 1, minWidth: 140`:

| Card | Valor | Cor | Ícone |
|---|---|---|---|
| Na Fila | contagem total | primary | FormatListBulleted |
| Aprovados (mês) | 7 | #16a34a | CheckCircle |
| Negados (mês) | 3 | #d4183d | Cancel |
| Em Análise | 8 | #2563eb | AccessTime |
| Devolutivas | 3 | #b45309 | Replay |

Cada card tem: ícone em box 36×36px com fundo colorido translúcido, label em 12px secondary, valor em `fontSize: 32, fontWeight: 800`, sublabel em caption.
Cards clicáveis → link de texto "Ver..." em primary abaixo do valor.

#### Seção 1.5 — Banner de Alerta SLA (condicional)
`Alert severity="error"` com ícone TimerOff.
- Título: "N pedidos com SLA violado" (bold)
- Subtexto: detalhamento de liminares e NIPs
- Action: botão `variant="contained"`, fundo branco, texto #d4183d, borda `1px solid #d4183d` → navega para `/fila?sla=Violado`
- `alignItems: center` no Alert e na action

#### Seção 2 — Row de Gráficos (3 colunas)

**Col 1 (5/12) — Distribuição por Categoria:**
Card com título 14px bold, `mb: 2` entre título e gráfico.
Gráfico de barras horizontais customizado:
- 8 categorias (Internação, U/E, Oncologia, Terapias, OPME, Exames, Cirurgias, Home Care)
- Cada linha: label 68px largura, alinhado à direita; barra dupla (aprovados + pendentes) height 14px, borderRadius 4px, fundo `rgba(0,0,0,0.04)`
- Tooltip ao hover mostrando total/aprovados/pendentes
- Opacity 0.5 nas não-hovered

**Col 2 (3/12) — Status Geral:**
Donut chart customizado SVG, raio 52px, stroke 12px.
Segmentos: Aprovado (#16a34a), Negado (#d4183d), Devolutiva (#f59e0b), Em Análise (#2563eb), Cancelado (#9ca3af).
Centro: número total em bold 20px.
Legenda abaixo: dot colorido + label + contagem, empilhados.

**Col 3 (4/12) — SLA Status + Sugestões IA:**
Card com duas seções verticais separadas por Divider.
*SLA:* barra segmentada 3 cores (verde/âmbar/vermelho), legenda com contagens.
*IA:* lista de 3 linhas (Aprovar=verde, Negar=vermelho, Junta Médica=âmbar) com dot e contagem à direita.
Rodapé: caption sobre pedidos aguardando revisão.

#### Seção 3 — Tendência Mensal
Card full-width. Gráfico de barras agrupadas (6 meses), barras Aprovados (#16a34a 70% opacidade) + Negados (#d4183d 70% opacidade), altura proporcional ao valor máximo. Eixo X: nomes dos meses. Eixo Y implícito (grid lines horizontais `rgba(0,0,0,0.06)`).

#### Seção 4 — Row dupla (7/12 + 5/12)

**Col 1 (7/12) — Últimas Solicitações:**
Tabela `size="small"` com colunas: ID (monospace primary), Beneficiário (nome bold + carteirinha caption), Categoria (chip colorido), Tipo (chip), Sugestão IA (chip), SLA (chip), Data.
Header: 12px uppercase #5a6070.
Rodapé: link "Ver fila completa →".

**Col 2 (5/12) — Principais Motivos de Negativa:**
Lista de 5 motivos com barra de progresso relativa ao maior valor.
Cada item: rank em circle (1–5), label em body2, barra `height: 6px` com cor própria, contagem à direita.

#### Seção 5 — Row triple (1/3 cada)

**Alertas Ativos:** lista de tipos de alerta com ícone, label e contagem badge.
**Cobertura Financeira:** valores de aprovado/negado/total com barras de progresso e percentuais.
**Tempo Médio de Análise:** KPI central em 32px bold + unidade, comparativo "+X% vs. mês anterior" em caption.

---

### 4.2 FILA OPERACIONAL (`/fila`)

**Layout:** altura total `100vh - 60px` NÃO — esta página tem scroll normal.
`p: 3`, header com título + botão "Nova Solicitação" (primary, `minHeight: 44px`).

#### KPI Cards (condicional: só na fila geral)
4 cards em linha:

| Card | Filtro ao clicar |
|---|---|
| Na Fila de Análise | Tab 0 (Fila Geral) |
| Urgência / Emergência | Tab 1 |
| Devolutivas | Tab 2 |
| Parados há mais de 12h | Tab 3 (SLA em Risco) |

"Parados há mais de 12h": cor #ea580c, ícone TimerOff.

#### Tabs de Filtro
4 tabs: **Fila Geral** (badge total), **Urgência/Emergência** (badge vermelho), **Devolutivas** (badge âmbar), **SLA em Risco** (badge laranja).
Indicador ativo: cor primary.

#### Barra de Filtros
CSS Grid, `gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto'`:
1. TextField busca (ID, beneficiário, carteirinha, procedimento)
2. Select Categoria
3. Select Situação SLA (Todas / No prazo / Atenção / Violado)
4. Select Prestador
5. Select Sugestão IA (Todas / Aprovar / Negar / Junta Médica)
6. Botão "Limpar" (outlined, só visível quando há filtros ativos)

#### Tabela de Pedidos
`size="small"`, header 12px uppercase #5a6070.

Colunas: Prioridade · ID · Beneficiário · Categoria · Tipo · Origem · IA · SLA · Tempo · Ações

**Coluna Prioridade:** dot colorido (alta=#d4183d, media=#f59e0b, baixa=#16a34a).
**Coluna ID:** monospace, bold, primary, `fontSize: 12`.
**Coluna Beneficiário:** nome em bold 13px + carteirinha em caption secondary.
**Coluna Categoria:** `CategoriaChip` (chip colorido por categoria).
**Coluna Tipo:** chip (Emergência=vermelho, Urgente=âmbar, Eleitiva=azul).
**Coluna Origem:** chip com ícone (App Athena=#2563eb + PhoneAndroid, WhatsApp=#16a34a + WhatsApp, E-mail=#0891b2 + Email, Prestador=#902B29 + LocalHospital).
**Coluna IA:** `IASugestaoChip` (Aprovar=verde, Negar=vermelho, Junta Médica=âmbar).
**Coluna SLA:** chip com ícone AccessTime (ok=verde, warning=âmbar, violated=vermelho+texto "VIOLADO").
**Coluna Ações:** botão "Analisar" outlined size small → `/analise?id=X`.

**Linhas Devolutiva:** `borderLeft: '3px solid #f59e0b'` para distinção visual imediata.
**Hover:** `rgba(144,43,41,0.03)` com `transition: 0.15s ease`.
**Empty state:** célula colspan com "Nenhum pedido encontrado para os filtros selecionados." centralizado, `py: 6`.

**Paginação:** `TablePagination` com opções 10/25/50 por página.

---

### 4.3 ANÁLISE DE PEDIDO (`/analise?id=X`)

**Layout fixo:** `height: calc(100vh - 60px)`, `overflow: hidden`, flex column.

#### Header (PageHeader)
Fundo branco, `borderBottom: 1px solid rgba(0,0,0,0.07)`, `px: 3, py: 1.75`.

**Link de voltar:** "← Fila Operacional" em body2 secondary, sem fundo, hover primary.

**Row 1:** ID grande (h5, fontWeight 800) + chips de status + navegador no canto direito.

**Chips de status:**
- AcaoChip (status atual): Aprovado=verde, Negado=vermelho, Devolutiva=âmbar, Pendente=azul
- TipoGuia chip
- Categoria chip
- Alertas chip (WarningAmber âmbar) — aparece quando há alertas

**Navegador (canto direito do header):**
Box com borda `1px solid rgba(0,0,0,0.13)`, borderRadius 8px, overflow hidden, sem gap.
`[←] [X de N] [→]`
- Botões: borderRadius 0, `px: 1, py: 0.75`, cor text.secondary; hover `rgba(144,43,41,0.06)` + cor primary; disabled opacity 0.35
- Centro: `fontSize: 12, fontWeight: 600`, texto " de N" em secondary fontWeight 400
- Bordas internas entre os 3 elementos: `1px solid rgba(0,0,0,0.1)`

**Row 2:** hospital (ícone LocalHospital + texto), data de entrada (ícone CalendarToday), OrigemLabel.

**OrigemLabel:** ícone colorido + texto, `fontSize: 12`.

#### Banner de Pendência (condicional)
`Alert severity="warning"` quando `status === 'Devolutiva'`:
- Título: "Pedido em pendência — aguardando documentação complementar"
- "Pendenciado por **[nome]** em [data]"
- Lista de motivos em `<ul>`

#### Banner de Alertas (condicional)
`Alert severity="error"` quando há alertas: lista os alertas separados por ·

#### Body (dois painéis)
`flex: 1, overflow: hidden`, flex row, `gap: 2.5, px: 3, pt: 2`.

**Painel esquerdo** (`flex: 1, overflowY: auto, pb: 4`):
Coluna de cards com `gap: 2.5`:
1. Beneficiário
2. Procedimentos
3. Histórico Consolidado
4. Observações
5. Documentos

**Painel direito** (`width: 400px, flexShrink: 0, overflowY: auto, pb: 2`):
Card "Assistente de Decisão" — sempre visível, rola independentemente.

---

#### Cards do Painel Esquerdo

**Card Beneficiário:**
- Título seção: 14px uppercase secondary bold, `mb: 2`
- 2 colunas: dados pessoais (nome H5 bold, plano caption) | avatares/badges
- Grid de dados: nome, CPF, Carteirinha, Data Nasc., Idade, Sexo (ícone M/F), Plano, Carência (chip âmbar se true)
- Ícone de sexo: MaleIcon (#2563eb) ou FemaleIcon (#d4183d)

**Card Procedimentos:**
- Tabela com colunas: Código TUSS, Descrição, CID, Qtd. Solicitada, Qtd. Autorizada, Período, Auditoria (chip)
- Nível auditoria: AMBULATORIAL=azul, HOSPITALAR=vermelho, UTI=roxo

**Card Histórico Consolidado:**
- 3 abas internas (Pills/Tabs customizadas): Perfil Clínico, Histórico de Uso, Análise de Risco
- *Perfil Clínico:* linha do tempo (timeline vertical) de eventos clínicos com ícone colorido, data e descrição
- *Histórico de Uso:* lista de utilizações anteriores com chip de categoria e valor
- *Análise de Risco:* score em círculo grande + fatores de risco listados

**Card Observações:**
- TextField multiline readonly com o texto de observações do médico/analista

**Card Documentos:**
- Lista de documentos com ícone por tipo (PDF=vermelho, imagem=azul, jurídico=roxo)
- Nome, tipo e data; botão "Visualizar"
- Lightbox ao visualizar: modal dark `#101828`, toolbar com zoom in/out e download, área de preview

---

#### Card "Assistente de Decisão" (painel direito)

Seções empilhadas verticalmente:

**1. Header do card:**
- Label "ASSISTENTE DE DECISÃO" 12px uppercase primary
- Chip de sugestão IA (Aprovar=verde/Negar=vermelho/Junta Médica=âmbar)
- Chip "Concorda com IA" vs "Divergência"

**2. Justificativa da IA:**
Box com fundo colorido translúcido, ícone SmartToy, texto da justificativa em 12px, lineHeight 1.6.

**3. Checklist IA:**
Lista de itens com ícone Check (ok=verde), Warning (warning=âmbar), X (error=vermelho) + texto 12px.

**4. Divergência (condicional):**
Alert warning quando decisão diverge da IA.

**5. Botões de Ação:**
4 botões fullWidth empilhados, `minHeight: 36, fontSize: 12`:
- **Autorizar** — `variant="contained"` primary
- **Negar** — `variant="outlined"` cor error (#d4183d)
- **Pendenciar** — `variant="outlined"` cor âmbar (#b45309) → abre dialog
- **Junta Médica** — `variant="outlined"` cor roxa (#7c3aed) → abre dialog

---

#### Diálogos de Ação

**Dialog Autorizar / Negar:**
- Título, campo de justificativa (TextField multiline obrigatório)
- Alert info/warning sobre consequências
- Botões: Cancelar + Confirmar (primary)

**Dialog Pendenciar:**
- Alert warning: "Pendenciar NÃO interrompe o contador de SLA"
- CheckboxGroup com lista de motivos (6–8 opções): documento ausente, laudo incompleto, etc.
- TextField justificativa adicional
- Confirmação redireciona para `/fila?tab=devolutivas`

**Dialog Junta Médica:**
- Select de motivo para junta
- TextField com observações adicionais

**Dialog Divergência:**
- Alert warning explicando que a decisão diverge da IA
- TextField obrigatório para justificativa da divergência
- Continuar → abre o dialog da ação escolhida

---

### 4.4 HISTÓRICO (`/historico`)

**Layout:** página com scroll, `p: 3`.

#### KPI Cards (linha de 5)
Total de Decisões · Processadas por IA · Decididas por Analista · Taxa de Aprovação · Divergências IA/Analista
Cada card: ícone 18px em box 32×32 com fundo colorido, label 12px, valor em typography bold.

#### Barra de Filtros
Flex wrap, `gap: 2`:
- TextField busca (ID, beneficiário, procedimento, analista)
- Select Categoria
- Select Decisão (Todas / Aprovado / Negado / Devolutiva)
- Select Origem (IA Automática / Analista)
- Select Sugestão IA (Todas / Aprovar / Negar / Junta Médica)
- Botão "Limpar"

#### Tabela do Histórico
Colunas: ID · Beneficiário · Categoria · Procedimento · Decisão · Origem/Responsável · Sugestão IA · Divergência · Data Decisão (sortável) · Ações

**Coluna Decisão:** `AcaoChip` (Aprovado=verde, Negado=vermelho, Devolutiva=âmbar), cada um com ícone.
**Coluna Origem/Responsável:** chip "IA Automática" (azul, ícone SmartToy) ou "Analista" (cinza, ícone Person) + nome do analista.
**Coluna Sugestão IA:** chip colorido (Aprovar/Negar/Junta Médica).
**Coluna Divergência:** ícone Warning âmbar se divergiu, traço se não.
**Coluna Data:** sortável, ícones de seta up/down.
**Linhas Devolutiva:** `borderLeft: 3px solid #f59e0b`.
**Clique na linha / botão "Detalhes":** navega para `/historico/[id]`.

---

### 4.5 DETALHE DO HISTÓRICO (`/historico/[id]`)

**Layout idêntico à tela de Análise:** `height: calc(100vh - 60px)`, overflow hidden, flex column.

#### Header
Estrutura igual ao header da tela de análise, com:
- "← Histórico" como link de voltar
- Mesmos chips (AcaoChip, TipoGuia, Categoria, Alertas)
- Mesmo navegador [← X de N →]
- Row 2: hospital, data de decisão, OrigemLabel

#### Painel Esquerdo
Mesmos 5 cards da análise: Beneficiário, Procedimentos, Histórico Consolidado, Observações, Documentos.

#### Painel Direito — Card "Decisão Registrada"
`width: 400px, overflowY: auto` — sempre visível.

**Seções:**
1. **Header:** "DECISÃO REGISTRADA" uppercase primary + AcaoChip + chip "IA Automática" ou "Analista"
2. **Bloco IA Automática (condicional):** box azul com SmartToy icon + texto da decisão automática + Alert info "decisão automática para fins de auditoria"
3. **Bloco Analista (condicional):** dados do analista (avatar, nome, data, horário) + motivo/justificativa
4. **Checklist IA:** mesmo padrão da tela de análise
5. **Sugestão IA:** chip + justificativa
6. **Divergência (condicional):** Alert warning se IA divergiu da decisão
7. **Junta Médica (condicional):** seção com dados da reunião (data, nº ata, membros com CRM, parecer)
8. **Ações:**
   - Botão outlined "Baixar PDF da Autorização" (ícone Download, `justifyContent: flex-start`)
   - Botão contained "Informar Decisão ao Beneficiário" (ícone Send) → abre modal de canal

**Modal "Informar Decisão ao Beneficiário":**
Select canal: App Athena / WhatsApp / E-mail.
Botão Confirmar → snackbar de confirmação.

---

### 4.6 NOTIFICAÇÕES (`/notificacoes`)

**Layout:** `p: 3, maxWidth: 680, mx: auto`.

Card único com lista de notificações:
- Ícone por tipo: devolutiva=âmbar (Replay), sla=vermelho (TimerOff), urgência=vermelho (Emergency), sistema=azul (Info)
- Título bold, mensagem body2, tempo caption secondary
- Não lidas: fundo `rgba(144,43,41,0.03)`, dot vermelho indicador
- Ação por tipo: "Ver pedido" → `/analise?id=X`, "Ver fila" → `/fila`
- Botão "Marcar todas como lidas"
- Empty state quando todas lidas

---

### 4.7 USUÁRIOS (`/usuarios`)

**Layout:** `p: 3`.

#### KPI Cards (5)
Total · Ativos · Gestores · Autorizadores · Auditores
Valores em `fontSize: 26, fontWeight: 800`, com cor por perfil.

#### Filtros + Botão Novo Usuário
TextField busca + Select perfil + Select status + botão "+ Novo Usuário" (primary, `minHeight: 44px`).

#### Tabela de Usuários
Colunas: Usuário (avatar+nome) · E-mail · Perfil · Status · Último Acesso · Criado em · Ações

**Avatar:** 32×32px, initials (2 letras), fundo/cor por papel.
**RoleChip:** Gestor=primary, Autorizador=azul, Auditor=cinza; `height: 22, fontSize: 12, fontWeight: 700`.
**StatusChip:** Ativo=verde, Inativo=cinza; mesmas dimensões.
**Ações:** botão editar (ícone) + botão toggle ativo/inativo.

**Dialog Usuário (criar/editar):**
- Seção "Informações Básicas": nome, e-mail, perfil (Select), status
- Seção "Permissões — [Perfil]": lista de toggles Switch para cada permissão
  - Pode aprovar solicitações
  - Pode negar solicitações
  - Pode visualizar relatórios
  - Pode visualizar histórico
  - Pode criar e gerenciar usuários
  - Pode configurar o sistema
- Switches na cor primary (#902B29)

---

### 4.8 MEU PERFIL (`/meu-perfil`)

**Layout:** `p: 3, maxWidth: 700, mx: auto`.

2 cards empilhados:

**Card 1 — Informações Pessoais:**
- Avatar grande (64×64) com initials, ícone de câmera para trocar
- Campos: Nome completo, E-mail (readonly), Telefone, CRM (se autorizador), Especialidade, Cargo
- Botões: "Salvar Alterações" (primary) + "Cancelar" (outlined)

**Card 2 — Segurança:**
- Campos: Senha atual, Nova senha, Confirmar nova senha
- Botão "Atualizar Senha" (primary)

---

### 4.9 AJUDA (`/ajuda`)

**Layout:** `p: 3, maxWidth: 820, mx: auto`.

Header da página com box de ícone (HelpOutline, 40×40, fundo `rgba(144,43,41,0.08)`), título e subtítulo.

**Card 1 — Perguntas Frequentes:**
Accordion MUI com expansão por item. 8–10 FAQs sobre SLA, IA, fluxo de autorização, devolutivas, TISS, etc.

**Card 2 — Relatar Problema ou Sugestão:**
Formulário com: Select tipo (Bug / Sugestão / Dúvida / Outro), campo e-mail de contato (pré-preenchido), campo assunto, campo descrição (multiline, mínimo 3 linhas). Botão "Enviar". Estado de sucesso: ícone CheckCircle verde + mensagem de confirmação.

---

## 5. COMPONENTES REUTILIZÁVEIS

### 5.1 Chips de Status

Todos os chips usam `size="small"`, `height: 22`, `fontSize: 12`, `fontWeight: 700`, `borderRadius: 4` (via tema).

| Chip | Cor texto | Fundo |
|---|---|---|
| Aprovado | #16a34a | rgba(22,163,74,0.1) |
| Negado | #d4183d | rgba(212,24,61,0.1) |
| Devolutiva | #b45309 | rgba(245,158,11,0.12) |
| Em Análise | #2563eb | rgba(37,99,235,0.1) |
| Pendente | #2563eb | rgba(37,99,235,0.08) |
| Urgente | #b45309 | rgba(245,158,11,0.12) |
| Emergência | #d4183d | rgba(212,24,61,0.1) |
| Eleitiva | #2563eb | rgba(37,99,235,0.1) |
| SLA ok | #16a34a | rgba(22,163,74,0.1) |
| SLA warning | #b45309 | rgba(245,158,11,0.12) |
| SLA VIOLADO | #d4183d | rgba(212,24,61,0.1) |
| IA Automática | #2563eb | rgba(37,99,235,0.08) |
| Analista | #374151 | rgba(0,0,0,0.06) |

Chips com ícone: `icon` prop com `fontSize: 13`, `ml: '4px !important'`.

### 5.2 Chip de Origem do Pedido

| Origem | Cor | Ícone |
|---|---|---|
| App Athena | #2563eb | PhoneAndroid |
| WhatsApp | #16a34a | WhatsApp |
| E-mail | #0891b2 | EmailOutlined |
| Prestador | #902B29 | LocalHospitalOutlined |

### 5.3 Navegador Entre Pedidos

Componente presente no header das páginas Análise e Detalhe do Histórico:

```
┌──────────────────────────────────────┐
│  [←]  │  3 de 21  │  [→]           │
└──────────────────────────────────────┘
```

- Borda: `1px solid rgba(0,0,0,0.13)`, borderRadius 8px
- Botões: borderRadius 0, `px: 1, py: 0.75`, cor text.secondary
- Hover botão: `rgba(144,43,41,0.06)`, cor primary
- Disabled: opacity 0.35
- Centro: `fontSize: 12, fontWeight: 600`; " de N" em text.secondary fontWeight 400
- Separadores internos: `1px solid rgba(0,0,0,0.1)`

### 5.4 Títulos de Seção em Cards

```
BENEFICIÁRIO
```
`fontSize: 14, fontWeight: 700, textTransform: uppercase, letterSpacing: 0.5, color: text.secondary, mb: 2`

### 5.5 Snackbar de Feedback

Sempre `anchorOrigin: { vertical: bottom, horizontal: center }`, `autoHideDuration: 4000`.
Severidades usadas: success (aprovação), error (negação), warning (pendenciamento), info (junta médica).

---

## 6. DADOS E ENTIDADES

### 6.1 Pedido (Fila Operacional)

```
StatusGuia: 'Em Análise' | 'Aprovado' | 'Negado' | 'Pendente' | 'Devolutiva' | 'Cancelado'
TipoGuia: 'Eleitiva' | 'Urgente' | 'Emergência'
OrigemPedido: 'app' | 'whatsapp' | 'email' | 'prestador'
NivelAuditoria: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI'
SLAStatus: 'ok' | 'warning' | 'violated'
IASugestao: 'Aprovar' | 'Negar' | 'Junta Médica'
Categoria: 'Internação' | 'Urgência/Emergência' | 'Oncologia' | 'Terapias Especiais' |
           'OPME' | 'Exames Alta Complexidade' | 'Cirurgias Eletivas' | 'Home Care' | 'SADT'
```

Campos de um Pedido:
- id, status, tipoGuia, categoria, nivelAuditoria, prioridade (alta/media/baixa)
- dataProtocolo (DD/MM/YYYY HH:mm), tempoFila ("N horas")
- slaStatus, slaTexto ("VIOLADO" / "Xh restantes")
- beneficiario: { nome, carteirinha, cpf, dataNascimento, idade, sexo, plano, carencia }
- prestador: { hospital, medico, crm, especialidade }
- origem (OrigemPedido)
- procedimentos: [{ codigo, tuss, descricao, qty, qtyAutorizada, dataInicio, dataFim, cid, nivelAud }]
- alertas: string[] (ex: "NIP Ativa", "Liminar Judicial", "High-User")
- iaSugestao, iaJustificativa
- iaChecklist: [{ texto, status: 'ok' | 'warning' | 'error' }]
- observacoes, documentos: [{ nome, tipo, data }]
- pendenciaMotivos?: string[], pendenciaResponsavel?: string, pendenciaData?: string

### 6.2 Entrada de Histórico

```
DecisaoAcao: 'Aprovado' | 'Negado' | 'Devolutiva'
OrigemDecisao: 'ia_automatica' | 'analista'
```

Campos adicionais vs. Pedido:
- acao (DecisaoAcao), dataDecisao, analista, motivoDecisao
- origem (OrigemDecisao — diferente do campo de pedido!)
- divergencia: boolean, divergenciaMotivo?: string
- juntaMedica?: { dataReuniao, numeroAta, parecer, membros: [{ nome, especialidade, crm }] }
- sexo, idade, cpf, dataNascimento, carencia, procedimentosDetalhados, alertas, iaChecklist, documentos

### 6.3 Usuário do Sistema

```
UserRole: 'gestor' | 'autorizador' | 'auditor'
UserStatus: 'ativo' | 'inativo'
```

Campos: id, nome, email, role, status, ultimoAcesso, criadoEm
Permissões: podeAprovar, podeNegar, podeVisualizarRelatorios, podeCriarUsuarios, podeVisualizarHistorico, podeConfigurarSistema

---

## 7. NAVEGAÇÃO E FLUXOS

### 7.1 Mapa de Rotas

```
/dashboard              → Dashboard principal
/fila                   → Fila operacional
/fila?categoria=X       → Fila filtrada por categoria (link da sidebar)
/fila?sla=Violado       → Fila filtrada por SLA violado (link do banner)
/analise?id=X           → Análise de pedido específico
/historico              → Listagem de histórico
/historico/[id]         → Detalhe de decisão histórica
/notificacoes           → Central de notificações
/usuarios               → Gestão de usuários
/meu-perfil             → Perfil do usuário logado
/ajuda                  → Central de ajuda e suporte
```

### 7.2 Fluxo Principal de Autorização

```
Dashboard
  ↓ (clica card "Na Fila")
Fila Operacional
  ↓ (clica "Analisar" em um pedido)
Análise do Pedido
  ↓ (escolhe ação: Autorizar / Negar / Pendenciar / Junta Médica)
  ├─ Autorizar → Dialog justificativa → Snackbar success → navega para próximo pedido
  ├─ Negar → Dialog justificativa → Snackbar error → navega para próximo pedido
  ├─ Pendenciar → Dialog motivos → Redireciona para /fila (aba Devolutivas)
  └─ Junta Médica → Dialog motivo → Snackbar info → navega para próximo pedido
```

### 7.3 Divergência com IA

Quando o analista toma decisão diferente da sugestão da IA:
1. Sistema detecta divergência automaticamente
2. Abre Dialog de Divergência (Alert warning + TextField justificativa obrigatória)
3. Após justificar → abre o Dialog da ação escolhida normalmente

### 7.4 Navegação por Pedidos

Nas páginas Análise e Detalhe do Histórico, o navegador [← X de N →] permite ir ao pedido anterior/próximo sem voltar à listagem. A ordenação é por data de protocolo (análise) ou data de decisão (histórico).

---

## 8. REGRAS DE NEGÓCIO E UX

1. **SLA não para com pendenciamento** — alerta explícito no dialog de pendenciar
2. **IA é consultiva** — a decisão final é sempre do autorizador humano
3. **Divergência requer justificativa** — obrigatório quando decisão ≠ sugestão IA
4. **Pedidos pendenciados** viram status "Devolutiva" e aparecem na aba dedicada da fila
5. **Pedidos em Devolutiva** têm borda esquerda âmbar (3px #f59e0b) em todas as tabelas
6. **Fila filtrada por categoria** mostra o título da página como nome da categoria
7. **Histórico imutável** — não há ações de edição no detalhe do histórico, apenas visualização e ações de comunicação
8. **Sugestão IA = "Negar"** — não usa o termo "Reprovar" em nenhuma instância do sistema
9. **Fontes mínimas de 12px** em todo o sistema (acessibilidade)
10. **Cards nunca têm sombra** — diferenciação visual é feita por borda `1px solid rgba(0,0,0,0.07)`

---

## 9. ESPECIFICAÇÕES TÉCNICAS (para referência)

- **Framework:** Next.js 16, App Router, `(main)` route group com layout AppShell
- **UI Library:** MUI v6 (Material UI)
- **Linguagem:** TypeScript
- **Font:** Space Grotesk (Google Fonts)
- **Ícones:** Material Icons (`@mui/icons-material`)
- **Estado:** React hooks locais (useState, useEffect)
- **Roteamento:** `useRouter`, `useSearchParams`, `useParams` do Next.js
- **Dados:** mock estático em `/src/data/pedidos.ts` e `/src/data/usuarios.ts`

---

## 10. MOCK DATA SUMMARY

### Fila Operacional: 14 pedidos
- 9 `iaSugestao: Aprovar`, 2 `Negar`, 1 `Junta Médica`
- 3 com `status: Devolutiva` (com `pendenciaMotivos`, `pendenciaResponsavel`, `pendenciaData`)
- 5 com `slaStatus: violated`
- Categorias representadas: todas as 9
- Origens: prestador, app, whatsapp, email
- Alertas exemplos: "NIP Ativa", "Liminar Judicial", "High-User", "Alta Complexidade"

### Histórico: 20 entradas
- Mix de IA automática e analista
- 4 com `divergencia: true`
- 2 com dados de `juntaMedica`
- Todas com `iaChecklist`, `documentos`, dados demográficos completos

### Usuários: 8
- 2 gestores, 4 autorizadores (2 inativos), 2 auditores
- Permissões diferenciadas por perfil

### Dashboard Metrics (hardcoded)
- 21 total, 8 em análise, 7 aprovados, 3 negados, 3 devolutivas
- slaViolados: 5, slaOk: 13, slaWarning: 4
- iaSugestaoAprovar: 9, iaSugestaoNegar: 2, iaSugestaoJunta: 1
- Tendência 6 meses, top 5 motivos de negativa, distribuição por categoria
