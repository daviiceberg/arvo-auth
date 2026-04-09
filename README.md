# Arvo Auth Frontend

Frontend module of the **Arvo Authorizator** system — a medical procedure authorization platform for health plan operators. Integrates with the `arvo-auth-api` backend via a contract-driven REST API.

## Tech Stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Framework   | Next.js 16 (App Router)                  |
| UI          | React 19 + MUI 7 (Material UI) + Emotion |
| Language    | TypeScript 5 (strict mode)               |
| State       | Redux Toolkit                            |
| HTTP Client | Axios                                    |
| Logging     | loglevel (`@/shared/utils/logger.ts`)    |
| Font        | Space Grotesk                            |

## Prerequisites

- Node.js 20+
- npm

## Quick Start

```bash
npm install
npm run dev
```

Access [http://localhost:3000](http://localhost:3000). The app redirects to `/dashboard`.

## Scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Development server                    |
| `npm run build`        | Production build                      |
| `npm start`            | Serve production build                |
| `npm run lint`         | Run ESLint                            |
| `npm run lint:fix`     | Run ESLint with auto-fix              |
| `npm run format`       | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing      |
| `npm run typecheck`    | TypeScript type check (no emit)       |
| `npm run validate`     | Run typecheck + lint + format:check   |

## Architecture

This project follows **MVVM** (Model–View–ViewModel) layered over a **feature-based module structure**:

- **Model** — API layer + Redux store (server state + global state)
- **View** — React components (presentational, MUI-based, no business logic)
- **ViewModel** — Custom hooks (orchestrate state, validation, side effects)

### Project Structure

```
src/
├── app/                     # Next.js App Router — routing and layout only
│   ├── login/
│   ├── nova-solicitacao/
│   └── (main)/              # Authenticated layout (AppShell)
│       ├── dashboard/
│       ├── fila/
│       ├── analise/
│       ├── historico/
│       │   └── [id]/
│       ├── usuarios/
│       ├── meu-perfil/
│       ├── notificacoes/
│       └── ajuda/
├── core/                    # Store (Redux), Theme (MUI), API client (Axios)
├── shared/                  # Reusable UI components, global hooks, utilities
├── modules/                 # Feature-based modules
│   └── {feature}/
│       ├── api/             # API calls (axios, typed contracts)
│       ├── hooks/           # ViewModel — business logic, state orchestration
│       ├── components/      # View — presentational components
│       ├── store/           # Redux slice (if needed)
│       └── types/           # TypeScript types for the module
└── services/                # Service layer (used in Prototyping Mode)
    └── {domain}/
        ├── {domain}.service.ts    # Single entry point for consumers
        ├── {domain}.types.ts      # Shared request/response types
        ├── {domain}.api.ts        # Real API implementation
        ├── {domain}.fake.ts       # Fake implementation (prototype only)
        └── {domain}.fake-data.ts  # Seed data (prototype only)
```

## Operating Modes

This project supports two distinct development modes. The correct mode is determined by whether the required backend endpoint exists in the [Swagger](https://authz-api.sandbox.arvohealth.com/docs).

### Implementation Mode (default)

Used when the backend endpoint already exists in the Swagger.

- All API calls derive types and payloads directly from the Swagger contract.
- No mocks, stubs, or fake data in production/development runtime code.
- MSW mock handlers are allowed only within unit/integration test files.
- If a required endpoint is missing or incomplete: stop, notify, and open a GitHub Issue on `arvo-health/arvo-auth` before proceeding.

**API references:**

- Swagger UI: https://authz-api.sandbox.arvohealth.com/docs
- General docs: https://authz-api.sandbox.arvohealth.com/api/docs/
- Module docs: https://authz-api.sandbox.arvohealth.com/api/docs/{module}/{file}

### Prototyping Mode

Used when a feature or screen does not yet have a corresponding backend endpoint.

Fake services follow the **same interface** as real API modules, making the swap to a real implementation trivial and contained:

1. The `.service.ts` barrel is the **only** import consumers use — they never reference `.fake.ts` or `.api.ts` directly.
2. The active implementation is controlled by an environment variable (`VITE_USE_FAKE_SERVICES` or a domain-specific flag).
3. Every fake file must carry a `@prototype` JSDoc marker with `@status`, `@planned-endpoint`, and `@tracking-issue`.

When a prototype is approved and the backend endpoint is available:

1. Create `{domain}.api.ts` following the real Swagger contract.
2. Flip the env var — `.service.ts` switches automatically.
3. Delete `.fake.ts` and `.fake-data.ts`.
4. No changes needed in any consuming component, hook, or page.

## Code Quality

The repository enforces quality at multiple stages:

| Gate           | Tool                 | Trigger             |
| -------------- | -------------------- | ------------------- |
| Type safety    | TypeScript (strict)  | `npm run typecheck` |
| Linting        | ESLint (flat config) | `npm run lint`      |
| Formatting     | Prettier             | `npm run format`    |
| Pre-commit     | Husky + lint-staged  | `git commit`        |
| Commit message | commitlint           | `git commit`        |

### Key ESLint Rules

- `no-console: error` — use `logger` from `@/shared/utils/logger.ts`
- No deep relative imports (`../../`) — use path aliases (`@/core/`, `@/shared/`, `@/modules/`)
- Unused imports are flagged and auto-removed

## Conventions

### Naming

| Artifact   | Convention     |
| ---------- | -------------- |
| Components | `PascalCase`   |
| Hooks      | `useCamelCase` |
| Files      | `kebab-case`   |

### Commits

Format: `type(scope): description` (max 72 chars)

Types: `feat` `fix` `refactor` `style` `chore` `docs` `test` `ci` `perf`

Scopes: `analise` `fila` `dashboard` `historico` `usuarios` `nova-solicitacao` `auth` `shared` `core` `ci` `deps`

### Branches

Format: `type/TICKET-short-description`

Example: `feat/NEW-779-setup-code-quality-guardrails`

## User Roles

| Role            | Access                                         |
| --------------- | ---------------------------------------------- |
| **Gestor**      | Full access (reports, config, user management) |
| **Autorizador** | Queue analysis and decision                    |
| **Auditor**     | Read-only (history and reports)                |

## Testing

- **Unit / Integration:** Vitest + Testing Library. Files follow `*.test.ts` / `*.test.tsx`. MSW for API mocking (test scope only).
- **E2E:** Playwright. Core flows: login, queue listing, new request submission.
