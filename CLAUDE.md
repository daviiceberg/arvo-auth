@AGENTS.md
@PRODUCT.md

# Code Quality Standards

## Language

- ALL code in English — variables, functions, comments, logs, types, everything
- ALL log messages in English
- Git: commits and branches in English. PR titles and descriptions in Portuguese-BR (team communication)

## Logging

- NEVER use `console.log/warn/error` — ESLint blocks it (`no-console: error`)
- Use `logger` from `@/shared/utils/logger.ts` (loglevel)
- NEVER log sensitive data: tokens, passwords, CPF, patient data, PII
- NEVER log full API responses — filter relevant non-sensitive fields only
- Use IDs only when logging user context — never names, emails, or documents
- Log levels: `debug` (dev), `info` (events), `warn` (attention), `error` (failures)

## TypeScript

- Strict mode + `noUncheckedIndexedAccess` — no `any`, no unhandled promises
- Use `type` imports: `import { type Foo } from './types'`
- Prefer `interface` for public APIs
- Record fallbacks must use extracted constants (not index access on fallback)

## Imports

- Path aliases: `@/core/`, `@/shared/`, `@/modules/`, `@/types/`, `@/mocks/`
- NEVER use deep relative imports (`../../`) — ESLint blocks it
- Order (enforced): react → next → external → @/core → @/shared → @/modules → @/types → @/mocks → relative

## Git Conventions

### Commits — Conventional Commits

Format: `type(scope): description` — English, lowercase, no period, max 72 chars.

Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `test`, `ci`, `perf`
Scopes: `analise`, `fila`, `dashboard`, `historico`, `usuarios`, `nova-solicitacao`, `auth`, `shared`, `core`, `ci`, `deps`

### Branches

Format: `type/TICKET-short-description` (e.g. `feat/NEW-779-setup-guardrails`)

### Pull Requests

- Title: max 70 chars, Portuguese-BR
- Body: bullet points in Portuguese-BR, no checkboxes
- Sections: Resumo → Mudanças → Screenshots (if applicable) → Ticket (always last)
- Template at `.github/PULL_REQUEST_TEMPLATE.md`

---

# Design System

## MUI Theme (`src/core/theme/index.ts`)

Central MUI theme defines all global visual defaults. **Never override via `sx` without justification.**

| Component            | Default                                                                     |
| -------------------- | --------------------------------------------------------------------------- |
| `MuiButton`          | `borderRadius: 6`, `boxShadow: none`                                        |
| `MuiCard`            | `borderRadius: 16`, `boxShadow: none`, `border: 1px solid rgba(0,0,0,0.07)` |
| `MuiOutlinedInput`   | `borderRadius: 6`                                                           |
| `MuiChip`            | `borderRadius: 4`, `fontWeight: 600`                                        |
| `shape.borderRadius` | `8` (base)                                                                  |

### Rules

- **Buttons**: never add `borderRadius` in `sx` — theme applies `6px`
- **Cards**: use theme defaults. Don't duplicate `border` or `borderRadius` unless visually justified
- **Inputs/Selects**: don't override `borderRadius` — theme applies `6px` globally
- **Primary color**: `#902B29` (Arvo red). Use `primary.main` via theme
- **MUI v7 slots**: use `slotProps.paper` (not `PaperProps`), `slotProps.input` (not `InputProps`), `slots.stepIcon` (not `StepIconComponent`)

---

# Vibecoding Workflow

This project is structured for **vibecoding**: the design team proposes visual changes (Figma, screenshots, or verbal description) and the AI implements them following strict code standards.

## Before implementing ANY change

1. **Identify the module** — use the route table below to find the correct `src/modules/`
2. **Identify the component** — read the Page orchestrator to find the exact file
3. **Identify the hook** — each component has a ViewModel hook. State and logic go in the hook, NEVER in the component
4. **Check shared/constants** — colors, status labels, domain values MUST come from `@/shared/constants/`
5. **Check shared/components** — chips, cards, common UI lives in `@/shared/components/`

## Mandatory rules

- NEVER inline colors that belong in shared/constants
- NEVER add business logic to a View component — extract to the ViewModel hook
- NEVER increase cyclomatic complexity above 15 — extract helpers or sub-components
- NEVER merge components that were intentionally separated
- If a new component exceeds 80 lines, decompose immediately
- When adding a new domain value (status, category), update shared/constants FIRST
- Changes must touch the SMALLEST scope possible — typically one component + its hook

## Composition pattern

```
Page (orchestrator) → Sections (feature blocks) → Sub-components (UI pieces)
Hooks manage state and logic for their parent component
Constants hold all domain mappings (colors, labels, options)
Types define all interfaces for the module
```

---

# Component Map

## Routes → Modules → Pages → Hooks

| Route               | Module        | Page                | Key hooks                                                                       |
| ------------------- | ------------- | ------------------- | ------------------------------------------------------------------------------- |
| `/fila`             | `queue`       | `QueuePage`         | `useQueueData`, `useQueueFilters`, `useScrollRestoration`                       |
| `/analise`          | `analysis`    | `AnalysisPage`      | `useAnalysis`, `useAdjustmentState`, `useDecisionFlow`, `useKeyboardNavigation` |
| `/dashboard`        | `dashboard`   | `DashboardPage`     | `useDashboardData`, `useProcessingQueue`                                        |
| `/historico`        | `history`     | `HistoryListPage`   | `useHistoryList`                                                                |
| `/historico/[id]`   | `history`     | `HistoryDetailPage` | `useHistoryDetail`                                                              |
| `/nova-solicitacao` | `new-request` | `NewRequestPage`    | `useNewRequestForm`, `useStepNavigation`, `useDocumentUpload`                   |
| `/usuarios`         | (inline)      | `usuarios/page.tsx` | —                                                                               |
| `/login`            | (inline)      | `login/page.tsx`    | —                                                                               |

## Module: analysis

```
AnalysisPage (orchestrator)
├── PageHeader
├── PendencyBanner / AlertsBanner / InjunctionBanner / SimultaneousGuidesAlert
├── BeneficiarySection
├── ProceduresSection
│   └── ProcedureRow → ProcedureActionCell
├── RegisteredAdjustmentsSection
├── ObservationsSection
├── ConsolidatedHistorySection
│   └── HistoryCompleteness, HistoryTimeline, HistoryConsultations
│   └── HistoryAuthorizations, HistoryWarnings, HistoryEligibility
├── DocumentsSection
│   └── DocumentList, DocumentViewer, DocumentUploadModal, DocumentRequestModal, IAExtractionPanel
├── AssistantSidebar
│   └── SuggestionSection, ChecklistSection, SpecialAlertsSection
│   └── AnalystDecisionSection → ProcedureDecisionCard, DecisionButtons
├── AdjustmentDrawer
│   └── AdjustmentFormBody → AdjustmentFieldQuantity/Provider/Code
└── Dialogs: Approval, Denial, Pendency, MedicalBoard, Divergence, PartialApproval, ShortcutsHelp
```

## Module: queue

```
QueuePage (orchestrator)
├── QueueMetricsRow
├── QueueTabBar
├── QueueFilterBar
├── QueueTable
│   └── QueueTableRow → ProceduresCell, ActionCell, SubStatusLabel
└── QueuePagination
```

## Module: history

```
HistoryListPage
├── HistoryListFilterBar
├── HistoryListTable → HistoryListTableRow

HistoryDetailPage
├── HistoryDetailHeader
├── IADecisionSection / AnalystDecisionSection
├── IAChecklistSection
├── BeneficiarySection, ProceduresSection, ObservationsSection
├── ConsolidatedHistorySection
│   └── AuthorizationsSection, AttentionSignalsSection, EligibilitySection
├── DocumentsSection
└── AppealDialog
```

## Module: new-request

```
NewRequestPage (orchestrator, step-based)
├── StepUpload (step 0)
├── StepBeneficiary (step 1)
├── StepClinical (step 2)
├── StepDynamic (step 3) → StepTherapies (única modalidade suportada no MVP)
├── StepDocuments (step 4)
├── StepReview (step 5) → DocumentsReviewSection
├── TissDocPreview (sidebar)
└── SuccessDialog
```

## Shared components

```
src/shared/components/
├── chips/ → DecisionActionChip, GuideTypeChip, IASuggestionChip
│           OriginChip, PrioDot, RequestTypeChip, SLAChip, StatusChip
└── cards/ → KpiCard, MetricCard
```

## Shared constants (centralized color maps)

```
src/shared/constants/
├── status-colors.ts         → statusColorMap (GuideStatus → color)
├── category-colors.ts       → categoryColorMap (Category → color)
├── sla-colors.ts            → slaColorMap (SLAStatus → color)
├── ia-suggestion-colors.ts  → iaSuggestionColorMap (IASuggestion → color)
├── origin-config.ts         → originConfigMap (RequestOrigin → label + icon)
├── guide-type-colors.ts     → guideTypeColorMap (GuideType → color)
├── priority-colors.ts       → priorityColorMap (Priority → color)
├── decision-action-colors.ts → decisionActionConfigMap
└── index.ts                 → barrel export
```
