@AGENTS.md

# Design System — Padrões Visuais

## Tema MUI (`src/theme/index.ts`)

O projeto possui um tema MUI central que define os padrões visuais globais. **Nunca sobrescrever esses valores via `sx` sem motivo justificado.**

| Componente | Padrão |
|---|---|
| `MuiButton` | `borderRadius: 6`, `boxShadow: none` |
| `MuiCard` | `borderRadius: 16`, `boxShadow: none`, `border: 1px solid rgba(0,0,0,0.07)` |
| `MuiOutlinedInput` | `borderRadius: 6` |
| `MuiChip` | `borderRadius: 4`, `fontWeight: 600` |
| `shape.borderRadius` | `8` (base do tema) |

### Regras obrigatórias

- **Botões (`Button`)**: nunca adicionar `borderRadius` no `sx`. O tema já aplica `6px`. Usar apenas `fontWeight`, `px`, `color`, etc.
- **Cards**: usar as propriedades padrão do tema. Não duplicar `border` ou `borderRadius` no `sx` a menos que seja uma exceção visual específica.
- **Inputs/Selects**: não sobrescrever `borderRadius`. O tema aplica `6px` globalmente via `MuiOutlinedInput`.
- **Cores primárias**: `#902B29` (vermelho Arvo). Usar `primary.main` via tema sempre que possível.
- **Consistência**: toda nova página ou componente deve seguir os padrões acima. Ao replicar funcionalidades de outros projetos, adaptar os estilos ao tema deste sistema.
