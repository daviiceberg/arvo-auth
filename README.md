# Arvo Auth Frontend

Intelligent medical authorization system for health insurance operators. Receives procedure requests, runs intelligence checks, and presents structured analysis to support human decision-making.

**Stack:** Next.js 16 · React 19 · TypeScript 5 (strict) · MUI v7 · Emotion · Space Grotesk

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command               | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `npm run dev`         | Development server (Turbopack)                          |
| `npm run build`       | Production build (TypeScript check + static generation) |
| `npm run lint`        | ESLint check                                            |
| `npm run lint:strict` | ESLint with `--max-warnings 0` (CI gate)                |
| `npm start`           | Serve production build                                  |

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
│       ├── usuarios/       → User management (admin)
│       └── ...
├── core/                   → Theme (MUI), Providers
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

See [AGENTS.md](AGENTS.md) for domain context and decision tree.
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

| Role           | Access                                     |
| -------------- | ------------------------------------------ |
| **Manager**    | Full access (reports, config, users)       |
| **Authorizer** | Analysis and decision in operational queue |
| **Auditor**    | Read-only (history and reports)            |

## Code Quality

- ESLint `strictTypeChecked` with `--max-warnings 0`
- `noUncheckedIndexedAccess: true`
- Husky + lint-staged on every commit
- Commitlint (Conventional Commits)
- Prettier (printWidth: 100)
- All code in English, PRs in Portuguese-BR

## Current Status

Frontend operates with **mock data** (`src/data/`). For production:

- API integration with Go backend (arvo-auth)
- Authentication provider
- Environment variables (`NEXT_PUBLIC_API_URL`)
- Unit and E2E test setup
