# Guardrails de Qualidade de Código

> **Task:** [NEW-779](https://linear.app/arvosaude/issue/NEW-779)
> **Objetivo:** Configurar toda a camada de qualidade para que o vibe coding funcione com padrões de engenharia.
> **Princípio:** Não negociamos qualidade.

---

## 1. Decisões Técnicas

| Decisão              | Escolha                               | Justificativa                                                              |
| -------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| ESLint format        | Flat config (`eslint.config.mjs`)     | Formato novo (ESLint 9+), `.eslintrc` está deprecated                      |
| Type-checked linting | Sim (`typescript-eslint` type-aware)  | Detecta promises não tratadas, tipos inseguros, narrowing incorreto        |
| Prettier printWidth  | `100`                                 | MUI é verboso — 80 gera scroll excessivo                                   |
| Console policy       | `no-console: error` + logger dedicado | Sem console.log em produção. Logger com níveis e desligamento automático   |
| Logger lib           | `loglevel` (~1KB)                     | Leve, simples, suporta níveis (debug/info/warn/error), desabilita em prod  |
| Commit format        | Conventional Commits                  | Padrão universal, compatível com changelogs e semantic-release             |
| Commit scope         | Recomendado (não obrigatório)         | Sempre que possível usar scope, mas não bloquear se ausente                |
| Branch naming        | `type/TICKET-short-description`       | Alinhado com types do commit: `feat/`, `fix/`, `refactor/`, `chore/`, etc. |
| PR format            | Bullet points diretos                 | Sem checkboxes — objetivo e informativo                                    |
| Import sorting       | Automático via ESLint                 | Ordem fixa: react → libs → @/core → @/shared → @/modules → relativos       |
| Path aliases         | Enforced via ESLint                   | Proibir `../../../`, forçar `@/`                                           |
| EditorConfig         | Sim                                   | Padroniza indentação/charset/line endings entre editores                   |

---

## 2. Convenções Git

### 2.1 Commit Messages

Formato **Conventional Commits**:

```
type(scope): description

[body opcional — explica o "porquê"]

[footer opcional — breaking changes, ticket refs]
```

**Types permitidos:**

| Type       | Quando usar                       | Exemplo                                              |
| ---------- | --------------------------------- | ---------------------------------------------------- |
| `feat`     | Nova funcionalidade               | `feat(dashboard): add KPI trend chart`               |
| `fix`      | Correção de bug                   | `fix(fila): correct SLA color mapping`               |
| `refactor` | Mudança sem alterar comportamento | `refactor(analise): extract DecisionModal component` |
| `style`    | Formatação (não é CSS)            | `style: apply prettier formatting`                   |
| `chore`    | Configs, dependências, build      | `chore(core): configure ESLint and Prettier`         |
| `docs`     | Documentação                      | `docs: update CLAUDE.md with git conventions`        |
| `test`     | Testes                            | `test(shared): add StatusChip unit tests`            |
| `ci`       | CI/CD                             | `ci: add GitHub Actions lint workflow`               |
| `perf`     | Performance                       | `perf(fila): memoize filtered results`               |

**Scopes do projeto:**
`analise`, `fila`, `dashboard`, `historico`, `usuarios`, `nova-solicitacao`, `auth`, `shared`, `core`, `ci`, `deps`

**Regras:**

- Description em inglês, lowercase, sem ponto final
- Máximo 72 caracteres na primeira linha
- Body opcional: explicar o "porquê", não o "o quê"
- Scope recomendado sempre que possível

### 2.2 Branch Naming

```
type/TICKET-short-description
```

**Prefixes permitidos:** `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `ci/`

**Exemplos:**

```
feat/NEW-779-setup-code-quality-guardrails
fix/NEW-780-status-chip-color-mapping
refactor/NEW-780-extract-decision-modal
chore/NEW-779-configure-eslint
```

**Regras:**

- Sempre em inglês
- Sempre com ticket do Linear quando houver
- Lowercase, palavras separadas por `-`
- Curto e descritivo (max ~50 chars após o prefix)

### 2.3 Pull Requests

Template `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Summary

<!-- What this PR does and why -->

## Ticket

<!-- Linear link: NEW-XXX -->

## Changes

<!-- Bullet points — direct and objective -->

## Screenshots (if applicable)

<!-- Before/after for visual changes -->
```

**Regras:**

- Título curto (max 70 chars), em inglês
- Começar com o type: `feat: ...`, `fix: ...`, `refactor: ...`
- Descrição em bullet points — direto ao ponto
- Sem checkboxes — quem fez o PR sabe o que fez

---

## 3. ESLint — Configuração Completa

### 3.1 Dependências

```bash
npm install -D \
  eslint \
  @eslint/js \
  typescript-eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import-x \
  eslint-plugin-unused-imports \
  @next/eslint-plugin-next \
  globals
```

### 3.2 Arquivo: `eslint.config.mjs`

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['.next/', 'node_modules/', 'out/', 'public/', '*.config.*'],
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // TypeScript parser config
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // React
  {
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 19 doesn't need import
      'react/prop-types': 'off', // TypeScript handles this
      'react/jsx-no-leaked-render': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // React Hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Accessibility
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: jsxA11y.configs.recommended.rules,
  },

  // Next.js
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // Import sorting & organization
  {
    plugins: { 'import-x': importX, 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: 'next/**', group: 'builtin', position: 'before' },
            { pattern: '@/core/**', group: 'internal', position: 'before' },
            { pattern: '@/shared/**', group: 'internal' },
            { pattern: '@/modules/**', group: 'internal', position: 'after' },
            { pattern: '@/types/**', group: 'internal' },
            { pattern: '@/mocks/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
    },
    settings: {
      'import-x/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  },

  // Project-specific rules
  {
    rules: {
      // Console policy: use logger instead
      'no-console': 'error',

      // TypeScript strict
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Path aliases enforcement: block deep relative imports
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message:
                'Use path aliases (@/core, @/shared, @/modules, @/types, @/mocks) instead of deep relative imports.',
            },
          ],
        },
      ],

      // Complexity limits (aligned with AGENTS.md)
      'max-depth': ['error', 4],
      complexity: ['warn', 15],
    },
  },
);
```

### 3.3 Regras Importantes Explicadas

| Regra                     | O que faz                                   | Por quê                                                  |
| ------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| `no-console: error`       | Bloqueia `console.log/warn/error`           | Força uso do logger. Sem lixo em produção                |
| `no-explicit-any: error`  | Bloqueia `any`                              | TypeScript strict — types devem ser explícitos           |
| `consistent-type-imports` | Força `import { type Foo }`                 | Tree-shaking correto, imports de tipo não vão pro bundle |
| `no-floating-promises`    | Bloqueia promises sem `await` ou `.catch()` | Previne erros silenciosos (type-checked rule)            |
| `no-misused-promises`     | Bloqueia promise onde void é esperado       | Ex: `onClick={async () => ...}` sem handler correto      |
| `jsx-no-leaked-render`    | Bloqueia `{count && <Comp />}`              | Quando count=0, renderiza "0" na tela — bug comum        |
| `no-restricted-imports`   | Bloqueia `../../`                           | Força uso de `@/` path aliases                           |
| `import-x/order`          | Auto-ordena imports                         | Ordem consistente: react → libs → internal → relative    |

---

## 4. Prettier

### 4.1 Arquivo: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false
}
```

### 4.2 Arquivo: `.prettierignore`

```
.next/
node_modules/
out/
public/
package-lock.json
```

---

## 5. EditorConfig

### 5.1 Arquivo: `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

---

## 6. Husky + lint-staged

### 6.1 Dependências

```bash
npm install -D husky lint-staged
npx husky init
```

### 6.2 Arquivo: `.husky/pre-commit`

```bash
npx lint-staged
```

### 6.3 Config no `package.json`

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

## 7. Commitlint

### 7.1 Dependências

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

### 7.2 Arquivo: `commitlint.config.js`

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Types permitidos
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'style', 'chore', 'docs', 'test', 'ci', 'perf'],
    ],
    // Scope: recomendado mas não obrigatório
    'scope-enum': [
      1, // warning, não error
      'always',
      [
        'analise',
        'fila',
        'dashboard',
        'historico',
        'usuarios',
        'nova-solicitacao',
        'auth',
        'shared',
        'core',
        'ci',
        'deps',
      ],
    ],
    'scope-empty': [1, 'never'], // warning se não tiver scope
    // Max 72 chars no header
    'header-max-length': [2, 'always', 72],
    // Description em lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Sem ponto final
    'subject-full-stop': [2, 'never', '.'],
  },
};
```

### 7.3 Arquivo: `.husky/commit-msg`

```bash
npx --no -- commitlint --edit $1
```

---

## 8. Logger

### 8.1 Dependência

```bash
npm install loglevel
```

### 8.2 Arquivo: `src/shared/utils/logger.ts`

```typescript
import log from 'loglevel';

const logger = log.getLogger('arvo-auth');

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('warn'); // Only warn and error in production
} else {
  logger.setLevel('debug'); // Everything in development
}

export { logger };
```

### 8.3 Uso

```typescript
// Before (blocked by ESLint):
console.log('dados carregados', data);

// After:
import { logger } from '@/shared/utils/logger';
logger.debug('Request data loaded', { count: data.length });
logger.info('User authenticated successfully', { userId: user.id });
logger.warn('SLA approaching limit', { requestId, slaStatus });
logger.error('Failed to load queue data', { error: err.message });
```

### 8.4 Regras Críticas

- **Todos os logs devem ser em inglês** — sem exceção
- **Nunca logar dados sensíveis**: tokens, senhas, CPF, dados de pacientes, PII
- **Nunca logar objetos inteiros de API** — filtrar apenas campos relevantes e não-sensíveis
- **Usar apenas IDs** ao logar contexto de usuário — nunca nomes, emails ou documentos
- **Na dúvida, não logue** — é melhor não ter log do que vazar dado sensível
- **Usar nível apropriado**: debug (dev only), info (eventos), warn (atenção), error (falhas)

---

## 9. Scripts do `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,json,css,md}'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,json,css,md}'",
    "typecheck": "tsc --noEmit",
    "validate": "npm run typecheck && npm run lint && npm run format:check"
  }
}
```

O script `validate` roda tudo junto — útil pra CI e pra verificar antes de um push.

---

## 10. Atualizar CLAUDE.md

Adicionar seção de convenções Git ao `CLAUDE.md` do projeto para que qualquer AI (incluindo o Davi no vibe coding) siga os mesmos padrões.

---

## 11. Ordem de Implementação

1. **EditorConfig** — `.editorconfig`
2. **Prettier** — `.prettierrc`, `.prettierignore`
3. **ESLint** — instalar deps, criar `eslint.config.mjs`
4. **Logger** — instalar `loglevel`, criar `src/shared/utils/logger.ts`
5. **Husky + lint-staged** — instalar, configurar hooks
6. **Commitlint** — instalar, configurar, adicionar hook
7. **PR Template** — `.github/PULL_REQUEST_TEMPLATE.md`
8. **Scripts** — atualizar `package.json`
9. **CLAUDE.md** — adicionar convenções Git e regras de qualidade
10. **Validar** — rodar `npm run validate` e confirmar que tudo funciona

---

## 12. Critério de Aceite

- [ ] `npm run lint` executa sem erros de configuração (erros no código existente são esperados)
- [ ] `npm run format` formata todos os arquivos
- [ ] `npm run typecheck` passa
- [ ] `npm run validate` roda os 3 checks
- [ ] Commit com mensagem fora do padrão é bloqueado
- [ ] Commit com `console.log` novo é bloqueado pelo lint-staged
- [ ] PR template aparece ao criar novo PR no GitHub
- [ ] Imports são ordenados automaticamente no save/commit
- [ ] Path aliases `@/` são enforçados — `../../` é bloqueado
