> **STATUS: DONE** — Resolvido na sessão de 08/04/2026

# Eliminar duplicações de color config

## Contexto

A auditoria identificou 2 lugares onde color configs são definidos inline nos módulos em vez de usar os shared constants. Toda definição de cor para valores de domínio deve vir de `src/shared/constants/`.

## Duplicações encontradas

### 1. `PageHeader.tsx` — inline `origemConfig`

**Arquivo:** `src/modules/analysis/components/PageHeader.tsx` (linhas 25-31)

**Problema:** Define `origemConfig` inline com label, color e icon por OrigemPedido. Deveria usar `originConfigMap` de `@/shared/constants`.

**Diferença:** O inline não tem `bg` (background) — usa só text color + icon. O shared `originConfigMap` tem bg + color + label mas não tem icon (icons estão no `OriginChip`).

**Solução:**

1. Importar `originConfigMap` de `@/shared/constants`
2. Importar icons do `OriginChip` (ou extrair icon map pra shared constants)
3. Compor: `const config = originConfigMap[origem]` + icon do map local

### 2. `ConsolidatedHistorySection.tsx` — inline decision colors

**Arquivo:** `src/modules/analysis/components/ConsolidatedHistorySection.tsx` (linhas 152-175) e `src/modules/history/components/ConsolidatedHistorySection.tsx`

**Problema:** Funções `getDecisaoStyle()` definem cores inline pra decisões (aprovado verde, negado vermelho, ajustado âmbar). Deveria usar `decisionActionConfigMap` de `@/shared/constants`.

**Solução:**

1. Importar `decisionActionConfigMap` de `@/shared/constants`
2. Mapear os valores lowercase (`'aprovado'` → `'Aprovado'`) pro formato do config map
3. Substituir a função inline pelo lookup no map

## Regra

Toda cor que representa um valor de domínio (status, categoria, SLA, origem, decisão, tipo guia) DEVE vir de `src/shared/constants/`. Se a cor não existe no shared, adicione lá primeiro.

Cores de UI (hover, border, background de layout) podem ser inline — são concerns de apresentação, não de domínio.
