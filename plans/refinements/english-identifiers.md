# Renomear identificadores portugueses para inglês

## Contexto

A auditoria técnica encontrou ~40 identificadores em português no código (variáveis, parâmetros, properties de hooks). Enquanto termos de domínio nos tipos (`Pedido`, `Ajuste`, `Beneficiario`) são aceitáveis por serem termos técnicos brasileiros (TISS/ANS), os nomes de variáveis, filtros e estados devem ser em inglês.

## Escopo

### Hooks — renomear estados e parâmetros

**`src/modules/queue/hooks/useQueueFilters.ts`:**
- `categoriaFilter` → `categoryFilter`
- `setCategoriaFilter` → `setCategoryFilter`
- `slaFilter` → já ok
- `alertaFilter` → `alertFilter`
- `setAlertaFilter` → `setAlertFilter`
- `prestadorFilter` → `providerFilter`
- `setPrestadorFilter` → `setProviderFilter`
- `iaFilter` → `iaSuggestionFilter`
- `devolutivasSubFilter` → `returnSubFilter`
- `initialCategoria` → `initialCategory`

**`src/modules/analysis/hooks/useDecisionState.ts`:**
- `aprovacaoMotivo` → `approvalReason`
- `aprovacaoJustificativa` → `approvalJustification`
- `negacaoMotivoIdx` → `denialReasonIdx`
- `negacaoJustificativa` → `denialJustification`
- `pendenciarItens` → `pendencyItems`
- `pendenciarJustificativa` → `pendencyJustification`
- `juntaMotivo` → `boardReason`
- `juntaObs` → `boardObservations`
- `divergenciaMotivo` → `divergenceReason`
- `parcialNegMotivoMap` → `partialDenialReasonMap`
- `parcialNegJustMap` → `partialDenialJustificationMap`

**`src/modules/analysis/hooks/useAdjustmentState.ts`:**
- `ajusteDrawerOpen` → `drawerOpen` (já pode estar)
- `localAjustes` → `localAdjustments`

### Components — renomear props e variáveis locais

- `pedido` como prop name → `request` (em todos os componentes do analysis)
- `ajustes` como prop name → `adjustments`
- `beneficiario` como variable → `beneficiary`

### Funções

- `getHistoricoKey()` → `getHistoryKey()`
- `classificarUrgencia()` → `classifyUrgency()` (no `src/shared/utils/urgencia.ts`)

## Impacto

- ~48 arquivos afetados
- Mudança 100% mecânica (find and replace)
- Build deve passar sem mudanças de lógica

## Regra

Termos de DOMÍNIO nos **tipos** podem permanecer em português quando são termos técnicos brasileiros (Pedido, Ajuste, StatusGuia, TipoGuia, etc.) — são vocabulário do sistema de saúde brasileiro.

Termos em **variáveis, funções, parâmetros, estados e props** devem ser em inglês — são código, não domínio.
