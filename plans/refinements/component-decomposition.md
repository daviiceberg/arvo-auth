> **STATUS: DONE** — Resolvido na sessão de 09/04/2026

# Decompor componentes grandes (SRP)

## Contexto

A auditoria técnica identificou 3 componentes que excedem 400 linhas e violam o princípio de responsabilidade única. Componentes desse tamanho são difíceis de manter, testar e evoluir.

## Componentes a decompor

### 1. `DocumentsSection.tsx` (624 linhas) — CRÍTICO

**Problema:** Um componente que faz 5 coisas:

1. Renderiza lista de documentos
2. Renderiza extração IA por documento
3. Renderiza viewer com zoom
4. Gerencia modal de upload
5. Gerencia modal de solicitação de docs

**Solução:**

```
DocumentsSection.tsx (~80 linhas) — orquestrador
  ├── DocumentList.tsx (~100 linhas) — lista de documentos com expansão
  ├── IAExtractionPanel.tsx (~80 linhas) — painel de extração IA por doc
  ├── DocumentViewer.tsx (~60 linhas) — viewer com zoom controls
  ├── DocumentUploadModal.tsx (~80 linhas) — modal de upload
  └── DocumentRequestModal.tsx (~60 linhas) — modal de solicitar docs
```

**Utilitários a extrair:**

- `getIAExtractionFields()` (67 linhas) → `src/modules/analysis/utils/ia-extraction.ts`
- `docIcon()` → `src/modules/analysis/utils/document-icons.tsx`

### 2. `ConsolidatedHistorySection.tsx` (544 linhas) — CRÍTICO

**Problema:** Mock data inline (140 linhas) + 5 seções distintas renderizadas num componente só.

**Solução:**

```
ConsolidatedHistorySection.tsx (~60 linhas) — orquestrador
  ├── HistoryCompleteness.tsx (~30 linhas) — badge de completude
  ├── HistoryTimeline.tsx (~40 linhas) — timeline
  ├── HistoryConsultations.tsx (~40 linhas) — resumo de consultas
  ├── HistoryAuthorizations.tsx (~80 linhas) — tabela de autorizações anteriores
  ├── HistoryWarnings.tsx (~40 linhas) — sinais de atenção
  └── HistoryEligibility.tsx (~40 linhas) — elegibilidade

Mock data → src/mocks/consolidated-history.ts
```

**Nota:** Existem DOIS `ConsolidatedHistorySection.tsx` (analysis + history) com ~95% de código idêntico. Devem ser unificados num shared component ou num componente em `src/modules/analysis/` que o history também importa.

### 3. `AdjustmentDrawer.tsx` (415 linhas) — MODERADO

**Problema:** 12 useState que deveriam estar num hook.

**Solução:**

```
AdjustmentDrawer.tsx (~200 linhas) — renderização pura
useAdjustmentForm.ts (~80 linhas) — hook com os 12 estados + validação + computed values
```

O componente recebe tudo do hook via props. O drawer vira presentation-only.

## Impacto

- ~15 arquivos novos
- ~3 arquivos refatorados
- Zero mudança visual
- Melhora testabilidade (cada sub-componente pode ser testado isoladamente)

## Princípio

Se um componente tem mais de 200 linhas, pergunte: "este componente faz UMA coisa?" Se a resposta for "faz X, Y e Z", extraia Y e Z pra componentes próprios. O componente original vira um orquestrador que compõe os sub-componentes.
