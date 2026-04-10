> **STATUS: DONE** — Resolvido na sessão de 08/04/2026

# Ativar noUncheckedIndexedAccess

## Contexto

`noUncheckedIndexedAccess` é uma das regras mais importantes do TypeScript strict. Faz com que `array[0]` retorne `T | undefined` em vez de `T`, prevenindo bugs onde se acessa um índice que pode não existir.

Tentamos ativar e encontramos 113 erros de tipo. A maioria em:

- Mock data computations (`src/data/pedidos.ts`)
- `ConsolidatedHistorySection.tsx` (acesso a mock data por key)
- Navigation hooks (acesso a `pedidos[index]`)
- Componentes que fazem `array.split()[0]`

## Tarefa

1. Descomentar `"noUncheckedIndexedAccess": true` no `tsconfig.json`
2. Corrigir os 113 erros com padrões seguros:
   - `array[index]` → extrair pra variável + null check
   - `string.split(x)[0]` → adicionar `?? ''`
   - `Record<string, T>[key]` → usar `??` ou optional chaining
   - `array.find() ?? array[0]` → `array.find() ?? array[0]!` (quando array é garantido não-vazio)
3. Rodar `npm run build` pra confirmar zero erros

## Esforço

~113 correções mecânicas em ~15 arquivos. Estimativa: 2-3h.
