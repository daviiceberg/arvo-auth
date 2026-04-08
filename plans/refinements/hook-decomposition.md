# Decompor hooks com estado excessivo

## Contexto

A auditoria técnica identificou 3 hooks que violam o princípio de responsabilidade única (SRP) e excedem a complexidade cognitiva recomendada. Hooks com 10+ useState são suspeitos — indicam múltiplas responsabilidades misturadas.

## Hooks a decompor

### 1. `useDecisionState.ts` (222 linhas, 11 useState) — CRÍTICO

**Problema:** Mistura 3 responsabilidades distintas:
- Estado de visibilidade dos 8 dialogs
- Estados de formulário (motivo aprovação, motivo negação, itens pendência, etc.)
- Lógica de fluxo de decisão (divergência, aprovação parcial, confirmações)

**Solução:** Dividir em 3 hooks:

```
useDialogVisibility.ts (~30 linhas)
  - 8 booleans de dialog + closeAll
  - Retorna: { showApprovalDialog, openApprovalDialog, closeApprovalDialog, ... }

useDecisionFormFields.ts (~40 linhas)
  - Estados de formulário agrupados por dialog
  - approvalReason, denialReasonIdx, pendencyItems, boardReason, divergenceReason
  - resetters por dialog

useDecisionFlow.ts (~100 linhas)
  - Lógica de negócio: handleApproveClick, doApprove, handleDenyClick
  - Fluxo de divergência (quando analista diverge da IA)
  - Fluxo de aprovação parcial (decisão por procedimento)
  - Confirmações com snackbar
  - Compõe useDialogVisibility + useDecisionFormFields internamente
```

### 2. `useDocumentViewer.ts` (113 linhas, 15 useState) — MODERADO

**Problema:** Modal state explosion — cada campo de cada modal é um useState separado.

**Solução:** Dividir em 2 hooks:

```
useDocumentViewer.ts (~40 linhas)
  - localDocs, viewDoc, zoom, expandedIA
  - Lógica de visualização pura

useDocumentModals.ts (~50 linhas)
  - showAddModal + campos do formulário (addTipo, addDescricao, addFile, etc.)
  - showRequestModal + campos (solicitarDocs, solicitarMensagem, solicitarPrazo)
  - Handlers de confirm/cancel
```

**Alternativa:** Usar `useReducer` pra agrupar os estados dos modais num único state object.

### 3. `useQueueFilters.ts` (105 linhas, 9 useState) — LEVE

**Problema:** Cada filtro é um useState individual. Deveria ser um objeto.

**Solução:**

```typescript
interface QueueFilters {
  search: string;
  category: string;
  sla: string;
  alert: string;
  provider: string;
  iaSuggestion: string;
  status: string;
  tab: number;
  returnSubFilter: 'all' | 'aguardando' | 'retorno';
}

const [filters, setFilters] = useState<QueueFilters>(initialFilters);
const updateFilter = <K extends keyof QueueFilters>(key: K, value: QueueFilters[K]) => {
  setFilters(prev => ({ ...prev, [key]: value }));
  setPage(0);
};
```

## Impacto

- ~10 arquivos afetados
- Os componentes que consomem esses hooks precisam atualizar as props
- Zero mudança visual
- Build deve passar

## Princípio

Um hook deve ter UMA responsabilidade clara. Se o return object tem 20+ properties, o hook está fazendo coisas demais. Se tem 10+ useState, provavelmente mistura responsabilidades.
