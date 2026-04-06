# Arvo Auth Frontend

Frontend do sistema de autorização de pedidos médicos para operadoras de planos de saúde. Permite analisar, aprovar, negar e acompanhar solicitações de procedimentos médicos com suporte a sugestões de IA.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **MUI 7** (Material UI) + Emotion
- **Fonte:** Space Grotesk

## Pré-requisitos

- Node.js 20+
- npm (ou yarn / pnpm)

## Início Rápido

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A aplicação redireciona para `/dashboard`.

## Scripts

| Comando         | Descrição                  |
| --------------- | -------------------------- |
| `npm run dev`   | Servidor de desenvolvimento |
| `npm run build` | Build de produção          |
| `npm start`     | Servir build de produção   |

## Estrutura do Projeto

```
src/
├── app/
│   ├── login/                 # Tela de login
│   ├── nova-solicitacao/      # Formulário multi-step de nova solicitação
│   ├── docs/                  # Documentação do produto e design system
│   └── (main)/                # Layout autenticado (AppShell)
│       ├── dashboard/         # KPIs, gráficos e métricas
│       ├── fila/              # Fila operacional de pedidos pendentes
│       ├── analise/           # Análise detalhada de pedido
│       ├── historico/         # Histórico de decisões (audit trail)
│       │   └── [id]/          # Detalhe de decisão individual
│       ├── usuarios/          # Gestão de usuários (admin)
│       ├── meu-perfil/        # Perfil do usuário
│       ├── notificacoes/      # Lista de notificações
│       └── ajuda/             # Ajuda e atalhos de teclado
├── components/
│   ├── AppShell.tsx           # Layout principal (sidebar + topbar)
│   └── Providers.tsx          # ThemeProvider + Emotion
├── theme/
│   ├── index.ts               # Tema MUI (cores, tipografia, overrides)
│   └── EmotionRegistry.tsx    # Cache Emotion para SSR
├── data/
│   ├── pedidos.ts             # Dados mock de pedidos e métricas
│   └── usuarios.ts            # Dados mock de usuários
└── lib/
    └── urgencia.ts            # Classificação de urgência
```

## Funcionalidades

- **Fila Operacional** -- Filtragem por categoria, status, tipo (1a solicitação vs continuidade) e SLA
- **Análise com IA** -- Sugestões automáticas (Aprovar/Negar/Junta Médica) com checklist de validação
- **Decisões** -- Aprovação total, parcial, negativa, pendência e encaminhamento para junta médica
- **Dashboard** -- KPIs, taxa de detecção por IA, tendências mensais, motivos de negativa
- **Histórico** -- Audit trail completo com rastreamento de divergência entre IA e analista
- **Gestão de Usuários** -- CRUD com papéis (Gestor, Autorizador, Auditor) e permissões
- **Multi-regional** -- Seletor de regional (Sul, Sudeste, Nordeste)
- **Atalhos de Teclado** -- `A` Aprovar, `N` Negar, `P` Pendente, `?` Ajuda

## Categorias de Procedimentos

| Categoria               | Cor       |
| ----------------------- | --------- |
| Internação              | `#902B29` |
| Urgência/Emergência     | `#d4183d` |
| Oncologia               | `#7c3aed` |
| Terapias Especiais      | `#2563eb` |
| OPME                    | `#b45309` |
| Exames Alta Complexidade| `#0891b2` |
| Cirurgias Eletivas      | `#059669` |
| Home Care               | `#16a34a` |

## Papéis de Usuário

| Papel         | Acesso                                         |
| ------------- | ---------------------------------------------- |
| **Gestor**    | Acesso total (relatórios, config, usuários)     |
| **Autorizador** | Análise e decisão na fila operacional         |
| **Auditor**   | Somente leitura (histórico e relatórios)        |

## Documentação Interna

A rota [`/docs`](src/app/docs/page.tsx) serve como documentação viva do projeto, acessível em `http://localhost:3000/docs`. Contém duas abas:

- **Produto** -- Visão geral do sistema, perfis de acesso, funcionalidades organizadas por prioridade (Primária, Secundária, Terciária), mapa de rotas e stack técnica.
- **Design System** -- Paleta de cores, tipografia (Space Grotesk), espaçamento, overrides de componentes MUI (Button, Card, Input, Chip, Table), regras de uso (Fazer/Evitar) e exemplos de código.

## Status Atual

O frontend opera com **dados mock** (`src/data/`). Para produção, será necessário:

- Integração com API backend (autenticação, CRUD de pedidos, upload de documentos)
- Provedor de autenticação (NextAuth.js, Auth0, etc.)
- Variáveis de ambiente (`NEXT_PUBLIC_API_URL`, credenciais de auth)
- Setup de testes (unitários e E2E)
- Linting e formatação (ESLint, Prettier)
