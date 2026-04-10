# Arvo Auth Frontend

Intelligent medical authorization system for health insurance operators. Receives procedure requests, runs intelligence checks, and presents structured analysis to support human decision-making. Integrates with `arvo-auth-api` via a contract-driven REST API.

**Stack:** Next.js 16 · React 19 · TypeScript 5 (strict) · MUI v7 · Emotion · Space Grotesk

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Development server (Turbopack)                          |
| `npm run build`        | Production build (TypeScript check + static generation) |
| `npm start`            | Serve production build                                  |
| `npm run lint`         | ESLint check                                            |
| `npm run lint:fix`     | ESLint with auto-fix                                    |
| `npm run lint:strict`  | ESLint with `--max-warnings 0` (CI gate)                |
| `npm run format`       | Format all files with Prettier                          |
| `npm run format:check` | Check formatting without writing                        |
| `npm run typecheck`    | TypeScript type check (no emit)                         |
| `npm run validate`     | Run typecheck + lint:strict + format:check              |
| `npm run clean`        | Remove `.next` and `out` build artifacts                |

## Project Structure

```
src/
├── app/                    → Next.js App Router (routing only, no business logic)
│   ├── login/              → Login page
│   ├── nova-solicitacao/   → Multi-step new request form
│   ├── docs/               → Product docs & design system
│   └── (main)/             → Authenticated layout (AppShell)
│       ├── dashboard/      → KPIs, charts, metrics
│       ├── fila/           → Operational queue (pending requests)
│       ├── analise/        → Request analysis (IA + analyst decision)
│       ├── historico/      → Decision history (audit trail)
│       │   └── [id]/       → Individual decision detail
│       ├── usuarios/       → User management (admin)
│       ├── meu-perfil/     → User profile
│       ├── notificacoes/   → Notifications
│       └── ajuda/          → Help & keyboard shortcuts
├── core/                   → Theme (MUI), Providers, API client (Axios)
├── shared/
│   ├── components/         → Reusable chips (Category, SLA, Status...) + cards (KPI, Metric)
│   ├── constants/          → Centralized color maps (9 domain mappings)
│   └── utils/              → Logger (loglevel), urgency helpers
├── modules/
│   ├── analysis/           → Request analysis module (largest — 40+ components)
│   ├── queue/              → Operational queue with filters and tabs
│   ├── history/            → Decision history and audit trail
│   ├── new-request/        → Multi-step request form (8 event types)
│   ├── dashboard/          → KPI dashboard and charts
│   └── shell/              → AppShell layout (sidebar + topbar)
├── services/               → Service layer (Implementation & Prototyping modes)
│   └── {domain}/           → .service.ts, .types.ts, .api.ts, .fake.ts, .fake-data.ts
├── types/                  → Domain types (pedido, usuario, notificacao)
└── data/                   → Mock data (will be replaced by API integration)
```

## Architecture

**Pattern:** MVVM — Hooks (ViewModel) · Components (View) · Constants · Types

Each module follows the same structure:

- `components/` — React components (View layer, no business logic)
- `hooks/` — Custom hooks (ViewModel layer, all state and logic)
- `types/` — Module-specific type definitions
- `constants/` — Module-specific constants and mappings

### Operating Modes

This project supports two development modes, determined by backend endpoint availability:

- **Implementation Mode** — endpoint exists in [Swagger](https://authz-api.sandbox.arvohealth.com/docs) → full API integration, no mocks
- **Prototyping Mode** — endpoint missing → Fake Service Layer with same interface, swappable when real API is ready

See [AGENTS.md](AGENTS.md) for domain context, decision tree, and mode details.
See [CLAUDE.md](CLAUDE.md) for code standards and component map.

## Event Types (Authorization Categories)

| Category              | Color     | Description                            |
| --------------------- | --------- | -------------------------------------- |
| Hospitalization       | `#902B29` | Clinical and surgical admissions       |
| Urgency/Emergency     | `#d4183d` | Time-sensitive regulatory flow         |
| Oncology              | `#7c3aed` | Chemotherapy, immunotherapy, radiation |
| Special Therapies     | `#2563eb` | ABA, physiotherapy, speech therapy     |
| OPME                  | `#b45309` | Prosthetics and special materials      |
| High Complexity Exams | `#0891b2` | Advanced diagnostic imaging            |
| Elective Surgeries    | `#059669` | Scheduled surgical procedures          |
| Home Care             | `#16a34a` | Home-based care services               |

## User Roles

| Role                         | Access                                     |
| ---------------------------- | ------------------------------------------ |
| **Manager** (Gestor)         | Full access (reports, config, users)       |
| **Authorizer** (Autorizador) | Analysis and decision in operational queue |
| **Auditor**                  | Read-only (history and reports)            |

## Code Quality

| Gate           | Tool                                           | Trigger                |
| -------------- | ---------------------------------------------- | ---------------------- |
| Type safety    | TypeScript (strict + noUncheckedIndexedAccess) | `npm run typecheck`    |
| Linting        | ESLint strictTypeChecked, `--max-warnings 0`   | `npm run lint:strict`  |
| Formatting     | Prettier (printWidth: 100)                     | `npm run format:check` |
| Pre-commit     | Husky + lint-staged                            | `git commit`           |
| Commit message | commitlint (Conventional Commits)              | `git commit`           |
| CI             | GitHub Actions (4 parallel gates)              | Pull request           |

All code in English. PRs in Portuguese-BR.

## Testing

- **Unit/Integration:** Vitest + Testing Library. Files `*.test.ts` / `*.test.tsx`. MSW for API mocking (test scope only).
- **E2E:** Playwright. Core flows: login, queue listing, new request submission.
