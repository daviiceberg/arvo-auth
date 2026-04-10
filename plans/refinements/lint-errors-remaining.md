# Resolver lint errors restantes

> **Princípio:** Não negociamos qualidade. Zero errors, zero warnings.

## Estado atual

**121 problemas (103 erros, 18 warnings)** em `npm run lint:strict`

---

## Fase 1 — Mecânicos (62 erros, 0 warnings) — Zero risco

### 1A. Non-null assertions → null checks (34 erros)

Regra: `@typescript-eslint/no-non-null-assertion`

Substituir `x!` por `x ?? fallback` ou null check com early return.

| Arquivo                                                      | Linhas       | Qtd | Estratégia                                       |
| ------------------------------------------------------------ | ------------ | --- | ------------------------------------------------ |
| `app/(main)/usuarios/page.tsx`                               | 250-255      | 5   | Guard clause `if (!user) return` antes do bloco  |
| `modules/analysis/components/AssistantSidebar.tsx`           | 42-43        | 2   | `?? ''` para iaSugestao/iaJustificativa          |
| `modules/analysis/components/ConsolidatedHistorySection.tsx` | 26           | 1   | `mockHistorico[key] ?? mockHistorico['default']` |
| `modules/analysis/hooks/useAnalysis.ts`                      | 15, 20, 24   | 3   | `?? undefined` com tipo ajustado ou early return |
| `modules/history/components/ConsolidatedHistorySection.tsx`  | 157          | 1   | Mesmo padrão da analysis version                 |
| `modules/history/hooks/useHistoryDetail.ts`                  | 42, 48       | 2   | `?? undefined` com check                         |
| `modules/new-request/components/steps/StepExams.tsx`         | 43-46        | 4   | `?? ''` para fields do formulário                |
| `modules/new-request/components/steps/StepOpme.tsx`          | 61-65, 93-94 | 7   | `?? ''` para fields do formulário                |
| `modules/new-request/components/steps/StepSurgeries.tsx`     | 43-45, 72-76 | 8   | `?? ''` para fields do formulário                |
| `modules/new-request/hooks/useStepNavigation.ts`             | 44           | 1   | `?? fallback`                                    |

### 1B. MUI deprecated props (18 erros)

Regra: `@typescript-eslint/no-deprecated`

Migração MUI v6 → v7. Consultar [guia oficial](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/).

| Deprecated                  | Novo                                  | Arquivos                                                                                                                             |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `PaperProps={{ ... }}`      | `slotProps={{ paper: { ... } }}`      | `AdjustmentDrawer`, `DocumentUploadModal`, `DocumentViewer`, `AppealDialog` (history), `DocumentsSection` (history), `SuccessDialog` |
| `inputProps={{ ... }}`      | `slotProps={{ htmlInput: { ... } }}`  | `AdjustmentDrawer` (×2)                                                                                                              |
| `InputProps={{ ... }}`      | `slotProps={{ input: { ... } }}`      | `AdjustmentDrawer`, `HistoryListFilterBar`, `StepTherapies`                                                                          |
| `InputLabelProps={{ ... }}` | `slotProps={{ inputLabel: { ... } }}` | `StepBeneficiary` (×2), `StepHospitalization`, `StepTherapies` (×2)                                                                  |
| `StepIconComponent={X}`     | `slots={{ stepIcon: X }}`             | `NewRequestPage`                                                                                                                     |
| `FormEvent` (tipo TS)       | `React.FormEvent<HTMLFormElement>`    | `login/page.tsx`                                                                                                                     |

**Nota:** Quando um componente já tem `slotProps`, merge os objetos em vez de sobrescrever.

### 1C. Deep relative imports → path aliases (14 erros)

Regra: `no-restricted-imports`

`../../constants/X` → `@/modules/{module}/constants/X`

| Arquivo                                                 | Import atual                            | Import correto                                       |
| ------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| `analysis/components/dialogs/ApprovalDialog.tsx`        | `../../constants/approval-reasons`      | `@/modules/analysis/constants/approval-reasons`      |
| `analysis/components/dialogs/DenialDialog.tsx`          | `../../constants/denial-reasons`        | `@/modules/analysis/constants/denial-reasons`        |
| `analysis/components/dialogs/MedicalBoardDialog.tsx`    | `../../constants/medical-board-reasons` | `@/modules/analysis/constants/medical-board-reasons` |
| `analysis/components/dialogs/PartialApprovalDialog.tsx` | `../../constants/denial-reasons`        | `@/modules/analysis/constants/denial-reasons`        |
| `analysis/components/dialogs/PartialApprovalDialog.tsx` | `../../types`                           | `@/modules/analysis/types`                           |
| `analysis/components/dialogs/PendencyDialog.tsx`        | `../../constants/pendency-reasons`      | `@/modules/analysis/constants/pendency-reasons`      |
| `new-request/components/steps/StepExams.tsx`            | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepHomeCare.tsx`         | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepHospitalization.tsx`  | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepOncology.tsx`         | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepOpme.tsx`             | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepSurgeries.tsx`        | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepTherapies.tsx`        | deep relative                           | `@/modules/new-request/constants/...`                |
| `new-request/components/steps/StepUrgency.tsx`          | deep relative                           | `@/modules/new-request/constants/...`                |

### 1D. Import ordering (6 erros)

Regra: `import-x/order`

| Arquivo                                          | Fix                                                           |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `app/(main)/usuarios/page.tsx`                   | Reordenar InputAdornment, IconButton, Grid alfabeticamente    |
| `modules/analysis/components/DocumentViewer.tsx` | Mover Button antes de Dialog                                  |
| `modules/queue/components/QueueTableRow.tsx`     | Adicionar linha vazia entre grupos + reordenar SubStatusLabel |

### 1E. Unnecessary String() (6 erros)

Regra: `@typescript-eslint/no-unnecessary-type-conversion`

| Arquivo                                                | Fix                            |
| ------------------------------------------------------ | ------------------------------ |
| `app/docs/page.tsx:30`                                 | Remover `String()` wrapper     |
| `modules/analysis/components/DocumentList.tsx:119`     | Remover 2× `String()` wrappers |
| `modules/analysis/hooks/useDocumentModals.ts:48`       | Remover `String()` wrapper     |
| `modules/new-request/hooks/useDocumentUpload.ts:50,68` | Remover 2× `String()` wrappers |

### 1F. Unnecessary conditions/optional chains (6 erros)

Regra: `@typescript-eslint/no-unnecessary-condition`

| Arquivo                                              | Linha | Fix                                                        |
| ---------------------------------------------------- | ----- | ---------------------------------------------------------- |
| `modules/analysis/components/AssistantSidebar.tsx`   | 130   | Remover `?.` desnecessário                                 |
| `modules/analysis/components/HistoryWarnings.tsx`    | 31    | Remover `?.` desnecessário                                 |
| `modules/history/components/HistoryDetailHeader.tsx` | 36    | Remover `??` desnecessário                                 |
| `modules/history/hooks/useHistoryList.ts`            | 51    | Remover condição always-true (`"divergiu" === "divergiu"`) |
| `modules/new-request/components/StepDocuments.tsx`   | 69    | Remover condição desnecessária                             |
| `modules/new-request/hooks/useDocumentUpload.ts`     | 30    | Remover condição desnecessária                             |

### 1G. Outros erros pontuais (9 erros)

| Regra                           | Arquivo                                                                                         | Qtd | Fix                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------- | --- | --------------------------------------------------- |
| `restrict-template-expressions` | `CategoryBarChart:32`, `DashboardKpiRow:132`, `HistoryListTableRow:130`, `useStepNavigation:45` | 4   | `${String(num)}` ou `${val ?? ''}`                  |
| `prefer-nullish-coalescing`     | `QueueTableRow:118,121`, `useQueueData:66`                                                      | 3   | `\|\|` → `??`                                       |
| `no-empty-function`             | `DenialDialog:90`, `ProcessingStatusChip:50`                                                    | 2   | `() => {}` → `() => undefined` ou noop handler real |
| `no-unsafe-argument`            | `docs/page.tsx:711`, `QueueTabBar:41`                                                           | 2   | Tipar o argumento corretamente                      |
| `no-autofocus`                  | `AdjustmentDrawer:101`                                                                          | 1   | Remover `autoFocus`                                 |

---

## Fase 2 — Arquiteturais: React Hooks (6 erros) — Médio risco

### 2A. setState em useEffect (5 erros)

Regra: `react-hooks/set-state-in-effect`

| Arquivo                                             | Contexto                                     | Solução                                                                                                                                                                         |
| --------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/(main)/usuarios/page.tsx:107`                  | Reset form fields quando dialog abre         | Adicionar `key={user?.id ?? 'new'}` no Dialog para forçar remount. Remover useEffect e inicializar useState com valores do `user` prop                                          |
| `modules/analysis/hooks/useAdjustmentForm.ts:71`    | Pré-popular form com último ajuste existente | Substituir useEffect por `useMemo` para valores iniciais + `useState(() => computeInitial())` com lazy initializer                                                              |
| `modules/queue/hooks/useQueueFilters.ts:81`         | Sincronizar filtros com URL params           | Derivar estado inicial dos searchParams com `useState(() => ...)`. Se necessário atualizar no mount, usar `useSyncExternalStore` ou mover para `useEffect` com callback pattern |
| `modules/queue/hooks/useScrollRestoration.ts:16`    | Restaurar posição de scroll no mount         | Mover restauração para `useLayoutEffect` com `window.scrollTo()` direto (sem setState intermediário). Se precisa do valor, usar `useRef`                                        |
| `modules/new-request/hooks/useDocumentUpload.ts:32` | Inicializar docs mandatórios                 | `useState(() => computeMandatoryDocs(category))` com lazy initializer                                                                                                           |

### 2B. Mutação pós-render (1 erro)

Regra: `react-hooks/immutability`

| Arquivo                                          | Fix                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `modules/dashboard/components/DonutChart.tsx:29` | Substituir `cumulative += pct` por `Array.reduce()` acumulativo ou `Array.map()` com scan pattern |

**Exemplo do fix:**

```typescript
// Antes (mutação):
let cumulative = 0;
const arcs = data.map((d) => {
  const offset = circumference * (1 - cumulative);
  const dashLen = circumference * pct;
  cumulative += pct; // ❌ mutação
  return { ...d, dashLen, offset };
});

// Depois (imutável):
const arcs = data.reduce<ArcData[]>((acc, d, i) => {
  const cumulative = data.slice(0, i).reduce((sum, prev) => sum + prev.pct, 0);
  const offset = circumference * (1 - cumulative);
  const dashLen = circumference * d.pct;
  return [...acc, { ...d, dashLen, offset }];
}, []);
```

---

## Fase 3 — Complexidade (15 warnings) — Alto esforço

Regra: `complexity` (limite 15)

Cada arquivo precisa de uma estratégia específica para reduzir a complexidade cognitiva da função principal.

### Tier A — Complexidade alta (>= 20) — Requerem extração de sub-componentes ou helpers

| Arquivo                                  | Complexidade | Estratégia                                                                                                                                                                                                   |
| ---------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AdjustmentDrawer.tsx`                   | 38           | Extrair 3 sub-componentes do render: `AdjustmentCurrentValues`, `AdjustmentFormFields`, `AdjustmentExistingList`. Cada seção do drawer vira componente próprio                                               |
| `AssistantSidebar.tsx`                   | 36           | Extrair seções: `IAAnalysisDisplay` (seção de análise IA), `DecisionButtonBar` (botões de decisão), `ProcedureDecisionList` (lista de decisões por procedimento). Mover helpers inline para funções nomeadas |
| `useQueueData.ts`                        | 29           | Extrair predicados de filtro para `filterPredicates.ts`: um predicate por filtro (category, sla, alert, provider, ia). O hook compõe com `filters.every(fn => fn(item))`                                     |
| `useKeyboardNavigation.ts`               | 23           | Substituir switch/case por keymap object: `Record<string, () => void>`. Reduz complexidade de N cases para 1 lookup                                                                                          |
| `QueueTableRow.tsx`                      | 21           | Extrair lógica de "computed values" para helper function. Chips condicionais podem virar sub-componentes ou early-return patterns                                                                            |
| `useAdjustmentForm.ts`                   | 21           | Extrair `validateAdjustment()` e `buildAdjustmentPayload()` como funções puras separadas. `handleConfirm` fica linear                                                                                        |
| `history/ConsolidatedHistorySection.tsx` | 20           | Decompor como feito no analysis: extrair sub-componentes para cada seção (é o mesmo padrão, módulo diferente)                                                                                                |
| `ProceduresSection.tsx`                  | 19           | Extrair `ProcedureRow` como sub-componente. A arrow function na linha 53 tem 19 — o map body é complexo demais                                                                                               |

### Tier B — Complexidade moderada (16-17) — Reduzíveis com early returns e helpers

| Arquivo                                | Complexidade | Estratégia                                                                                                           |
| -------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `HistoryDetailPage.tsx`                | 17           | Extrair guards (`if (!entry)`) como early return. Mover computed values para `useMemo`                               |
| `ia-extraction.ts`                     | 17           | Substituir cadeia de if/else por config map: `Record<string, IAExtractionField[]>`                                   |
| `StepReview.tsx`                       | 17           | Extrair seções de review em sub-componentes: `ReviewBeneficiary`, `ReviewProcedures`, `ReviewDocuments`              |
| `UserDialog` (usuarios/page.tsx)       | 17           | Extrair `UserDialog` para componente próprio em `src/app/(main)/usuarios/UserDialog.tsx`. Reduz complexidade da page |
| `NewRequestInner` (NewRequestPage.tsx) | 16           | Extrair `StepRenderer` que recebe step index e retorna o componente. Switch de steps vira lookup map                 |
| `StepDocuments.tsx`                    | 16           | Extrair helper `getDocumentValidation()` como função pura                                                            |
| `useStepNavigation.ts`                 | 16           | Extrair `getStepValidation()` como função pura. Reduz branching no handler                                           |

### 3A. `<img>` → `<Image>` (3 warnings)

Regra: `@next/next/no-img-element`

| Arquivo                                             | Linha | Contexto                                                  |
| --------------------------------------------------- | ----- | --------------------------------------------------------- |
| `modules/analysis/components/DocumentViewer.tsx`    | 132   | Viewer de documento (precisa de `width/height` ou `fill`) |
| `modules/history/components/DocumentsSection.tsx`   | 256   | Viewer de documento (mesmo padrão)                        |
| `modules/new-request/components/NewRequestPage.tsx` | 133   | Preview de upload                                         |

**Nota:** Em viewers com zoom dinâmico, usar `<Image>` com `fill` + `object-fit: contain` no container. Para upload preview, usar `unoptimized` se for blob URL.

---

## Ordem de execução

| Fase                        | Erros | Warnings | Risco | Paralelizável                        |
| --------------------------- | ----- | -------- | ----- | ------------------------------------ |
| **1. Mecânicos**            | 62    | 0        | Zero  | Sim — 7 sub-batches independentes    |
| **2. React Hooks**          | 6     | 0        | Médio | Sim — 5 arquivos independentes       |
| **3A. `<img>` → `<Image>`** | 0     | 3        | Baixo | Sim                                  |
| **3B. Complexity Tier A**   | 0     | 8        | Médio | Parcialmente — módulos independentes |
| **3C. Complexity Tier B**   | 0     | 7        | Baixo | Sim — mudanças isoladas              |

**Validação entre fases:** `npm run lint:strict` após cada fase para confirmar redução progressiva.

## Meta

Zero errors + zero warnings no `npm run lint:strict`.

## Arquivos impactados (total)

~45 arquivos em 6 módulos + 3 pages não componentizadas + 1 page de docs.
