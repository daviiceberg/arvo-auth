# Reestruturação e Componentização — NEW-780

> **Task:** [NEW-780](https://linear.app/arvosaude/issue/NEW-780)
> **Objetivo:** Decompor pages monolíticas (~9.100 linhas) em módulos MVVM seguindo o AGENTS.md.
> **Princípio:** Não negociamos qualidade.

---

## Decisões Arquiteturais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Nomes dos módulos | Inglês (`queue/`, `analysis/`, `history/`, `new-request/`) | Código em inglês (AGENTS.md). Rotas permanecem em PT-BR (são URLs) |
| Padrão | MVVM: hooks (ViewModel), components (View), constants, types | Definido no AGENTS.md |
| Hook composition | Múltiplos hooks pequenos por módulo (SRP) | Analysis tem 37+ useState — 1 hook seria 300+ linhas |
| Extração | Mecânica — JSX verbatim, lógica nos hooks | Zero mudança visual |
| Color maps | Shared constants canônicos (valores da página /docs) | 5+ maps duplicados com valores inconsistentes |
| Commit | Único para toda a reestruturação | Menos fricção com lint-staged |

---

## Estrutura Final dos Módulos

### Queue (`/fila` → `src/modules/queue/`)
```
queue/
  components/
    QueuePage.tsx, QueueMetricsRow.tsx, QueueTabBar.tsx,
    QueueFilterBar.tsx, QueueTable.tsx, QueueTableRow.tsx,
    QueuePagination.tsx, QueueSkeleton.tsx
  hooks/
    useQueueFilters.ts, useQueueData.ts, useScrollRestoration.ts
  constants/
    request-type-map.ts
  index.ts
```
**Hooks:** `useQueueFilters` (10 filter states + URL sync), `useQueueData` (filtering + pagination + aggregations), `useScrollRestoration` (sessionStorage scroll save/restore)

### Dashboard (`/dashboard` → `src/modules/dashboard/`)
```
dashboard/
  components/
    DashboardPage.tsx, DashboardKpiRow.tsx, DashboardAlerts.tsx,
    ProcessingQueueTable.tsx, ProcessingStatusChip.tsx,
    CategoryBarChart.tsx, TrendChart.tsx, DonutChart.tsx,
    SlaWidget.tsx, RecentRequestsTable.tsx, TopDenialReasons.tsx,
    CategorySummary.tsx, DashboardSkeleton.tsx
  hooks/
    useDashboardData.ts, useProcessingQueue.ts
  types/
    index.ts
  index.ts
```
**Charts:** Custom CSS bars, SVG donut, stacked trend — module-specific (especializados demais pra shared)

### History (`/historico` → `src/modules/history/`)
```
history/
  components/
    HistoryListPage.tsx, HistoryListFilterBar.tsx,
    HistoryListTable.tsx, HistoryListTableRow.tsx,
    HistoryDetailPage.tsx, HistoryDetailHeader.tsx,
    BeneficiarySection.tsx, ProceduresSection.tsx,
    ConsolidatedHistorySection.tsx, DocumentsSection.tsx,
    ObservationsSection.tsx, AppealDialog.tsx,
    DecisionOriginChip.tsx,
    HistoryListSkeleton.tsx, HistoryDetailSkeleton.tsx
  hooks/
    useHistoryList.ts, useHistoryDetail.ts
  types/
    index.ts
  index.ts
```
**DecisionOriginChip:** Module-specific (IA Automática / Analista) — diferente do shared OriginChip

### Analysis (`/analise` → `src/modules/analysis/`)
```
analysis/
  components/
    AnalysisPage.tsx, PageHeader.tsx, PendencyBanner.tsx,
    AlertsBanner.tsx, InjunctionBanner.tsx,
    SimultaneousGuidesAlert.tsx, BeneficiarySection.tsx,
    ConsolidatedHistorySection.tsx, AdjustmentDrawer.tsx,
    ProceduresSection.tsx, RegisteredAdjustmentsSection.tsx,
    ObservationsSection.tsx, DocumentsSection.tsx,
    AssistantSidebar.tsx, AnalysisSkeleton.tsx
    dialogs/
      ApprovalDialog.tsx, DenialDialog.tsx,
      PendencyDialog.tsx, MedicalBoardDialog.tsx,
      DivergenceDialog.tsx, PartialApprovalDialog.tsx,
      AdjustmentApprovalDialog.tsx, ShortcutsHelpDialog.tsx
  hooks/
    useAnalysis.ts, useDecisionState.ts,
    useAdjustmentState.ts, useDocumentViewer.ts,
    useKeyboardNavigation.ts
  constants/
    approval-reasons.ts, denial-reasons.ts,
    pendency-reasons.ts, medical-board-reasons.ts,
    adjustment-reasons.ts, document-types.ts
  types/
    index.ts
  index.ts
```
**5 hooks por responsabilidade:**
- `useAnalysis` — pedido selecionado, navegação, snackbar
- `useDecisionState` — 8 dialogs + form states + decision handlers
- `useAdjustmentState` — drawer + adjustments array
- `useDocumentViewer` — 14 useState de documentos
- `useKeyboardNavigation` — keyboard shortcuts

### New Request (`/nova-solicitacao` → `src/modules/new-request/`)
```
new-request/
  components/
    NewRequestPage.tsx, StepUpload.tsx, StepBeneficiary.tsx,
    StepClinical.tsx, StepDynamic.tsx, StepDocuments.tsx,
    StepReview.tsx, TissDocPreview.tsx, SuccessDialog.tsx
    steps/
      StepHospitalization.tsx, StepUrgency.tsx,
      StepOncology.tsx, StepTherapies.tsx, StepOpme.tsx,
      StepExams.tsx, StepSurgeries.tsx, StepHomeCare.tsx
  hooks/
    useNewRequestForm.ts, useStepNavigation.ts,
    useDocumentUpload.ts, useUploadStep.ts
  constants/
    module-labels.ts, tuss-therapy-codes.ts,
    mandatory-documents.ts
  types/
    index.ts
  index.ts
```
**ThemeProvider:** Mantido no NewRequestPage (rota fora do layout `(main)`)

---

## Shared Components Criados

### Constantes (`src/shared/constants/`)
| Arquivo | Conteúdo | Usado por |
|---------|----------|-----------|
| `status-colors.ts` | `statusColorMap` (StatusGuia → {bg, color}) | analysis, dashboard, history |
| `category-colors.ts` | `categoryColorMap` (Categoria → {bg, color}) | queue, dashboard, history, shell |
| `sla-colors.ts` | `slaColorMap` (SLAStatus → {bg, color}) | queue, analysis |
| `ia-suggestion-colors.ts` | `iaSuggestionColorMap` | queue, analysis |
| `guide-type-colors.ts` | `guideTypeColorMap` | queue, analysis |
| `origin-config.ts` | `originConfigMap` (label + bg + color) | queue, analysis |
| `sub-status-config.ts` | `subStatusConfigMap` (label + color + pulsing) | queue |
| `decision-action-colors.ts` | `decisionActionConfigMap` | history |

### Chips (`src/shared/components/chips/`)
| Componente | Props | Usado por |
|------------|-------|-----------|
| `StatusChip` | `status: StatusGuia` | dashboard, history |
| `CategoryChip` | `category: Categoria` | queue, history |
| `SLAChip` | `status: SLAStatus, label: string` | queue |
| `IASuggestionChip` | `suggestion: IASugestao` | queue |
| `GuideTypeChip` | `type: TipoGuia` | queue |
| `OriginChip` | `origin: OrigemPedido` | queue |
| `PrioDot` | `prioridade: 'alta' \| 'media' \| 'baixa'` | queue |
| `RequestTypeChip` | `type: 'continuidade' \| 'primeira'` | queue |
| `SubStatusLabel` | `subStatus: SubStatus` | queue |
| `DecisionActionChip` | `action: DecisaoAcao` | history |

### Cards (`src/shared/components/cards/`)
| Componente | Props | Usado por |
|------------|-------|-----------|
| `KpiCard` | `icon, iconBg, value, label, sublabel?, trend?, onClick?` | dashboard |
| `MetricCard` | `value, label, sublabel?, linkLabel, onLinkClick, icon, iconBg` | queue |

---

## Números

| Métrica | Antes | Depois |
|---------|-------|--------|
| Pages monolíticas | 5 arquivos (~9.100 linhas) | 6 wrappers (~50 linhas) |
| Maior arquivo | 3.650 linhas (analise) | ~300 linhas (DocumentsSection) |
| Módulos | 1 (shell) | 6 (shell + 5 novos) |
| Arquivos em modules/ | 7 | 118 |
| Shared components | 12 | 15 |
| Shared constants | 7 | 9 |

---

## Cores Canônicas (fonte: página /docs)

Todas as inconsistências entre pages foram resolvidas usando os valores da página `/docs` (design system do Davi):

| Status | Background | Text Color |
|--------|-----------|------------|
| Em Análise | `rgba(245,158,11,0.18)` | `#92400e` |
| Aprovado | `rgba(22,163,74,0.1)` | `#16a34a` |
| Negado | `rgba(212,24,61,0.1)` | `#d4183d` |
| Devolutiva | `rgba(245,158,11,0.18)` | `#92400e` |
| Pendente | `rgba(245,158,11,0.18)` | `#92400e` |

| SLA | Background | Text Color |
|-----|-----------|------------|
| ok | `rgba(22,163,74,0.1)` | `#16a34a` |
| warning | `rgba(245,158,11,0.12)` | `#b45309` |
| violated | `rgba(212,24,61,0.1)` | `#d4183d` |
