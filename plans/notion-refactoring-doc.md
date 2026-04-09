# Refatoração do Frontend — arvo-auth-frontend

## Visão Geral

Reestruturação completa do projeto `arvo-auth-frontend` (protótipo do @Davi Rojtenberg) de pages monolíticas para uma arquitetura MVVM modular com guardrails de qualidade enforçados.

**Motivação:** O projeto foi construído inteiramente via vibe coding — o resultado visual ficou ótimo, mas a infraestrutura de código por trás não existia. Sem linter, sem testes, sem CI/CD, sem arquitetura modular. A intenção é criar guardrails para que o vibe coding funcione com qualidade.

**Responsável:** Willian Martinez
**Tasks:** NEW-779 (Guardrails) + NEW-780 (Reestruturação)
**PRs:** [#2](https://github.com/arvo-health/arvo-auth-frontend/pull/2) + [#3](https://github.com/arvo-health/arvo-auth-frontend/pull/3)

---

## O que foi feito

### 1. Guardrails de Qualidade (NEW-779)

Configuração completa da camada de qualidade para que todo código novo (inclusive via vibe coding) já siga padrões de engenharia.

| Ferramenta                         | O que faz                                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ESLint (flat config, type-checked) | 11 plugins, strict TypeScript, no-any, no-floating-promises, import sorting, path aliases, no-console, acessibilidade (jsx-a11y) |
| Prettier                           | Formatação automática (printWidth 100, single quotes, trailing commas)                                                           |
| Husky + lint-staged                | Pre-commit hook: lint + format nos arquivos staged                                                                               |
| Commitlint                         | Conventional Commits com scopes do projeto                                                                                       |
| EditorConfig                       | Consistência entre editores (UTF-8, LF, 2 espaços)                                                                               |
| Logger (loglevel)                  | Substitui console.log com níveis por ambiente                                                                                    |

**TypeScript strict:**

- `strict: true`
- `noUncheckedIndexedAccess: true` — acesso seguro a arrays/objetos
- `target: ES2022`

**Next.js:**

- `reactStrictMode: true` — detecção de side effects impuros
- `poweredByHeader: false` — segurança (não expor stack)

### 2. Reestruturação MVVM (NEW-780)

Decomposição de 5 pages monolíticas (~9.100 linhas) em 6 módulos seguindo o padrão MVVM definido no AGENTS.md.

**Antes → Depois:**

| Rota                             | Antes                    | Depois                                |
| -------------------------------- | ------------------------ | ------------------------------------- |
| `/fila`                          | 939 linhas, 1 arquivo    | 14 arquivos em `modules/queue/`       |
| `/dashboard`                     | 1.217 linhas, 1 arquivo  | 17 arquivos em `modules/dashboard/`   |
| `/historico` + `/historico/[id]` | 1.734 linhas, 2 arquivos | 19 arquivos em `modules/history/`     |
| `/analise`                       | 3.650 linhas, 1 arquivo  | 36 arquivos em `modules/analysis/`    |
| `/nova-solicitacao`              | 1.939 linhas, 1 arquivo  | 26 arquivos em `modules/new-request/` |
| AppShell                         | 705 linhas, 1 arquivo    | 7 arquivos em `modules/shell/`        |

### 3. Design System Centralizado

Color maps canônicos baseados na página `/docs` (design system do Davi):

| Constante                 | Conteúdo                                                  |
| ------------------------- | --------------------------------------------------------- |
| `statusColorMap`          | Cores de cada status (Em Análise, Aprovado, Negado, etc.) |
| `categoryColorMap`        | Cores das 9 categorias médicas                            |
| `slaColorMap`             | Cores do indicador SLA (ok/warning/violated)              |
| `iaSuggestionColorMap`    | Cores da sugestão da IA                                   |
| `guideTypeColorMap`       | Cores do tipo de guia                                     |
| `originConfigMap`         | Cores + labels das origens de pedido                      |
| `decisionActionConfigMap` | Cores das ações de decisão                                |

**Antes:** 5+ color maps duplicados com valores INCONSISTENTES entre pages (mesma informação aparecia com cores diferentes dependendo da tela).
**Depois:** Single source of truth — todas as cores vêm de `src/shared/constants/`.

### 4. Shared Components

11 componentes reutilizáveis que qualquer page pode importar:

| Componente         | Usado em           |
| ------------------ | ------------------ |
| StatusChip         | Dashboard, History |
| CategoryChip       | Queue, History     |
| SLAChip            | Queue, Dashboard   |
| IASuggestionChip   | Queue              |
| GuideTypeChip      | Queue              |
| OriginChip         | Queue, History     |
| PrioDot            | Queue              |
| RequestTypeChip    | Queue              |
| DecisionActionChip | History            |
| KpiCard            | Dashboard          |
| MetricCard         | Queue              |

---

## Estrutura Final do Projeto

```
src/
  app/              → Routing only (~10 linhas por page)
  core/
    theme/          → Tema MUI centralizado
    providers/      → ThemeProvider + CssBaseline
  shared/
    components/     → 11 chips + cards reutilizáveis
    constants/      → 7 color maps canônicos
    utils/          → Logger + urgência
  modules/
    shell/          → AppShell (Sidebar + Topbar + HelpDrawer)
    queue/          → Fila operacional
    dashboard/      → Dashboard com KPIs e gráficos
    history/        → Histórico (lista + detalhe)
    analysis/       → Análise (o mais complexo: 5 hooks, 8 dialogs)
    new-request/    → Nova solicitação (6 steps)
  types/            → Tipos globais (Pedido, SystemUser, etc.)
  mocks/            → Re-exports de dados mock
  data/             → Dados mock originais
```

---

## Números

| Métrica                  | Antes             | Depois                                         |
| ------------------------ | ----------------- | ---------------------------------------------- |
| Pages monolíticas        | 5 (~9.100 linhas) | 6 wrappers (~50 linhas)                        |
| Maior arquivo            | 3.650 linhas      | ~300 linhas                                    |
| Módulos MVVM             | 0                 | 6                                              |
| Shared components        | 0                 | 11                                             |
| Color maps centralizados | 0 (5+ duplicados) | 7 (single source of truth)                     |
| ESLint plugins           | 0                 | 11                                             |
| Pre-commit hooks         | 0                 | 2 (lint-staged + commitlint)                   |
| TypeScript strict flags  | 1 (strict)        | 3 (strict + noUncheckedIndexedAccess + ES2022) |

---

## Convenções Estabelecidas

### Código

- Todo código em inglês (variáveis, funções, comentários)
- Exceção: nomes de rotas Next.js em português (são URLs)
- Exceção: tipos de domínio médico brasileiro (Pedido, Ajuste, StatusGuia)
- Component files: PascalCase (convenção Next.js)
- Outros arquivos: kebab-case
- Path aliases obrigatórios (`@/modules/`, `@/shared/`, etc.)
- Sem console.log — usar logger
- Sem `any` — TypeScript strict

### Git

- Commits: Conventional Commits em inglês (`feat(scope): description`)
- Branches: `type/TICKET-description` em inglês
- PRs: Título e descrição em português (comunicação do time)
- Seções do PR: Resumo → Mudanças → Screenshots → Ticket (por último)

---

## Próximos Passos (documentados em `plans/refinements/`)

| Refinamento                                                     | Esforço |
| --------------------------------------------------------------- | ------- |
| Decompor 3 hooks grandes em 7 menores (SRP)                     | ~3h     |
| Extrair sub-componentes de 3 componentes >400 linhas            | ~4h     |
| Resolver 140 lint errors restantes (deprecated MUI, complexity) | ~3h     |

---

## Links

- **Repositório:** [arvo-health/arvo-auth-frontend](https://github.com/arvo-health/arvo-auth-frontend)
- **PR Guardrails:** [#2](https://github.com/arvo-health/arvo-auth-frontend/pull/2)
- **PR Reestruturação:** [#3](https://github.com/arvo-health/arvo-auth-frontend/pull/3)
- **Linear (Guardrails):** [NEW-779](https://linear.app/arvosaude/issue/NEW-779)
- **Linear (Reestruturação):** [NEW-780](https://linear.app/arvosaude/issue/NEW-780)
- **Comparativo original:** [Notion — Comparação de versões](https://www.notion.so/arvosaude/Compara-o-de-vers-es-33a8c52e53d78050b6fdeb416f42fe97)
