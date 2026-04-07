# Referência de Regras ESLint

> Guia rápido das regras configuradas e o motivo de cada uma.

## Regras TypeScript (type-checked)

| Regra | Nível | O que faz | Exemplo bloqueado |
|-------|-------|-----------|-------------------|
| `no-explicit-any` | error | Bloqueia `any` | `const data: any = ...` |
| `no-unused-vars` | error | Bloqueia variáveis não usadas | `const x = 1;` (sem uso) |
| `consistent-type-imports` | error | Força `import { type Foo }` | `import { Foo } from './types'` (quando Foo é só tipo) |
| `no-floating-promises` | error | Bloqueia promises sem await/catch | `fetchData();` (sem await) |
| `no-misused-promises` | error | Bloqueia promise onde void é esperado | `<button onClick={async () => ...}>` |

## Regras React

| Regra | Nível | O que faz | Exemplo bloqueado |
|-------|-------|-----------|-------------------|
| `react/jsx-no-leaked-render` | error | Previne render de 0/false | `{count && <Badge />}` (renderiza "0") |
| `react/react-in-jsx-scope` | off | React 19 não precisa import | — |
| `react/prop-types` | off | TypeScript cuida disso | — |
| `react-hooks/rules-of-hooks` | error | Hooks só no top level | `if (x) { useState() }` |
| `react-hooks/exhaustive-deps` | warn | Deps do useEffect completas | `useEffect(() => ..., [])` (faltando deps) |

## Regras de Import

| Regra | Nível | O que faz | Exemplo bloqueado |
|-------|-------|-----------|-------------------|
| `unused-imports/no-unused-imports` | error | Remove imports não usados | `import { Box } from '@mui/material'` (sem uso) |
| `import-x/order` | error | Ordena imports automaticamente | Imports fora da ordem padrão |
| `import-x/no-duplicates` | error | Merge imports do mesmo módulo | Dois `import` do mesmo path |
| `no-restricted-imports` (../../) | error | Bloqueia imports relativos profundos | `import { Foo } from '../../shared/...'` |

## Ordem de Imports Enforçada

```typescript
// 1. Built-in / React / Next
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. Libs externas
import { Box, Typography } from '@mui/material';

// 3. @/core
import { logger } from '@/shared/utils/logger';

// 4. @/shared
import { StatusChip } from '@/shared/components/StatusChip';

// 5. @/modules
import { useAnalise } from '@/modules/analise/hooks/useAnalise';

// 6. Relativos (apenas dentro do mesmo módulo)
import { AnalysisHeader } from './AnalysisHeader';
```

## Regras Gerais

| Regra | Nível | O que faz |
|-------|-------|-----------|
| `no-console` | error | Bloqueia console.log — usar `logger` de `@/shared/utils/logger.ts` |
| `max-depth` | error (4) | Máximo 4 níveis de aninhamento |
| `complexity` | warn (15) | Avisa quando complexidade ciclomática > 15 |

## Acessibilidade (jsx-a11y)

Regras recomendadas do `eslint-plugin-jsx-a11y` ativadas. Exemplos:
- `img` deve ter `alt`
- Elementos clicáveis devem ser focáveis
- `aria-*` atributos devem ser válidos
- Labels associados a inputs
