@AGENTS.md

# Code Quality Standards

## Language

- ALL code must be written in English — variables, functions, comments, logs, types, everything
- ALL log messages must be in English
- Git artifacts: commits and branches in English. PR titles and descriptions in Portuguese-BR (team communication)

## Logging

- NEVER use `console.log`, `console.warn`, `console.error` — ESLint blocks it (`no-console: error`)
- Use `logger` from `@/shared/utils/logger.ts` (loglevel)
- NEVER log sensitive data: tokens, passwords, CPF, patient data, PII
- NEVER log full API responses — filter only relevant non-sensitive fields
- Use only IDs when logging user context — never names, emails, or documents
- Use appropriate log levels: `debug` (dev only), `info` (events), `warn` (attention), `error` (failures)

## TypeScript

- Strict mode — no `any`, no unhandled promises, no misused promises
- Use `type` imports: `import { type Foo } from './types'`
- Prefer `interface` for public APIs

## Imports

- Use path aliases: `@/core/`, `@/shared/`, `@/modules/`, `@/types/`, `@/mocks/`
- NEVER use deep relative imports (`../../`) — ESLint blocks it
- Import order (enforced automatically): react → next → external libs → @/core → @/shared → @/modules → @/types → @/mocks → relative

## Git Conventions

### Commits — Conventional Commits

Format: `type(scope): description`

Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`, `ci`, `perf`
Scopes: `analise`, `fila`, `dashboard`, `historico`, `usuarios`, `nova-solicitacao`, `auth`, `shared`, `core`, `ci`, `deps`

Rules:

- English, lowercase, no period at end
- Max 72 characters in header
- Scope recommended always — warning if missing, not blocking

### Branches

Format: `type/TICKET-short-description`
Prefixes: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `ci/`
Example: `feat/NEW-779-setup-code-quality-guardrails`

### Pull Requests

- Title: short (max 70 chars), Portuguese-BR, starts with type
- Description: bullet points in Portuguese-BR — direct and objective, no checkboxes
- Sections order: Resumo, Mudanças, Screenshots (se aplicável), Ticket (always last)
- Description is about what the PR changes — not about the development process
- Template at `.github/PULL_REQUEST_TEMPLATE.md`

---

# Design System — Padrões Visuais

## Tema MUI (`src/theme/index.ts`)

O projeto possui um tema MUI central que define os padrões visuais globais. **Nunca sobrescrever esses valores via `sx` sem motivo justificado.**

| Componente           | Padrão                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| `MuiButton`          | `borderRadius: 6`, `boxShadow: none`                                        |
| `MuiCard`            | `borderRadius: 16`, `boxShadow: none`, `border: 1px solid rgba(0,0,0,0.07)` |
| `MuiOutlinedInput`   | `borderRadius: 6`                                                           |
| `MuiChip`            | `borderRadius: 4`, `fontWeight: 600`                                        |
| `shape.borderRadius` | `8` (base do tema)                                                          |

### Regras obrigatórias

- **Botões (`Button`)**: nunca adicionar `borderRadius` no `sx`. O tema já aplica `6px`. Usar apenas `fontWeight`, `px`, `color`, etc.
- **Cards**: usar as propriedades padrão do tema. Não duplicar `border` ou `borderRadius` no `sx` a menos que seja uma exceção visual específica.
- **Inputs/Selects**: não sobrescrever `borderRadius`. O tema aplica `6px` globalmente via `MuiOutlinedInput`.
- **Cores primárias**: `#902B29` (vermelho Arvo). Usar `primary.main` via tema sempre que possível.
- **Consistência**: toda nova página ou componente deve seguir os padrões acima. Ao replicar funcionalidades de outros projetos, adaptar os estilos ao tema deste sistema.
