# Resolver lint errors restantes

> **Princípio:** Não negociamos qualidade.

## Contexto

Após o eslint --fix automático, restam ~140 erros que precisam de correção manual. São erros reais que impactam qualidade e manutenibilidade.

## Categorização

### Grupo 1 — Deprecated MUI Props (~25 erros) — MECÂNICO

Props do MUI v6 que foram deprecated no v7. Fix é direto:

| Deprecated | Novo | Arquivos |
|-----------|------|----------|
| `InputProps` | `slotProps.input` | login, ajuda, usuarios |
| `inputProps` | `slotProps.htmlInput` | AdjustmentDrawer |
| `InputLabelProps` | `slotProps.inputLabel` | nova-solicitacao steps |
| `FormHelperTextProps` | `slotProps.formHelperText` | ajuda |
| `PaperProps` | `slotProps.paper` | AdjustmentDrawer, dialogs |
| `primaryTypographyProps` | `slotProps.primary` | — (já resolvido no shell) |
| `StepIconComponent` | `slots.stepIcon` | nova-solicitacao |
| `FormEvent` | `SubmitEvent` | login |

### Grupo 2 — Complexity warnings (~32) — ARQUITETURAL

Funções que excedem complexidade 15. A maioria será resolvida pelo plano de hook-decomposition e component-decomposition:

| Arquivo | Complexity | Resolução |
|---------|-----------|-----------|
| AdjustmentDrawer | 51 | hook-decomposition |
| AssistantSidebar | 36 | component-decomposition |
| ConsolidatedHistorySection | 26 | component-decomposition |
| FilaInner (pages não componentizadas) | 23+ | componentizar usuarios/ajuda |
| UserDialog | 17 | componentizar usuarios |

### Grupo 3 — React Hooks rules (~28) — REQUER REFATORAÇÃO

| Regra | Qtd | Fix |
|-------|-----|-----|
| `react-hooks/set-state-in-effect` | 5 | Mover setState pra useMemo ou useCallback |
| `react-hooks/static-components` | 6 | Mover componente inline pra fora do render (usuarios PermRow) |
| `react-hooks/immutability` | 1 | Não reassignar variáveis após render |
| `react-hooks/exhaustive-deps` | ~5 | Adicionar deps faltantes |
| `react-hooks/refs` | ~5 | Corrigir uso de refs |

### Grupo 4 — Non-null assertions (~7) — PONTUAL

`@typescript-eslint/no-non-null-assertion` — substituir `!` por null checks.

### Grupo 5 — Next.js (~3) — PONTUAL

`@next/next/no-img-element` — substituir `<img>` por `<Image>` do Next.js.

### Grupo 6 — Acessibilidade (~1)

`jsx-a11y/no-autofocus` — remover autoFocus do AdjustmentDrawer.

## Ordem de execução

1. **Grupo 1** (deprecated MUI) — mecânico, zero risco, ~30min
2. **Grupo 5** (img → Image) — mecânico, zero risco, ~10min
3. **Grupo 6** (autofocus) — 1 linha, ~2min
4. **Grupo 4** (non-null) — pontual, baixo risco, ~15min
5. **Grupo 3** (react-hooks) — requer atenção, ~1h
6. **Grupo 2** (complexity) — resolvido pelos planos de decomposição

## Meta

Zero warnings no `npm run lint:strict`.
