# Convenções Git

> Guia rápido de commit, branch e PR para o projeto arvo-auth-frontend.

## Commit Messages

**Formato:** `type(scope): description`

### Types

| Type | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Mudança sem alterar comportamento |
| `style` | Formatação (não é CSS) |
| `chore` | Configs, dependências, build |
| `docs` | Documentação |
| `test` | Testes |
| `ci` | CI/CD |
| `perf` | Performance |

### Scopes

`analise` · `fila` · `dashboard` · `historico` · `usuarios` · `nova-solicitacao` · `auth` · `shared` · `core` · `ci` · `deps`

### Regras

- Em inglês, lowercase, sem ponto final
- Máximo 72 caracteres no header
- Scope recomendado sempre que possível
- Body opcional — explicar o "porquê", não o "o quê"

### Exemplos

```
feat(dashboard): add KPI trend chart
fix(fila): correct SLA indicator color for violated status
refactor(analise): extract DecisionModal into separate component
chore(core): configure ESLint flat config with type-checked rules
test(shared): add StatusChip unit tests for all status variants
ci: add GitHub Actions lint and build workflow
perf(fila): memoize filtered queue results
docs: update CLAUDE.md with git conventions
chore(deps): upgrade @mui/material to 7.4.0
```

---

## Branch Naming

**Formato:** `type/TICKET-short-description`

### Prefixes

`feat/` · `fix/` · `refactor/` · `chore/` · `docs/` · `test/` · `ci/`

### Regras

- Sempre em inglês
- Sempre com ticket do Linear quando houver
- Lowercase, palavras separadas por `-`
- Curto e descritivo

### Exemplos

```
feat/NEW-779-setup-code-quality-guardrails
fix/NEW-780-status-chip-color-mapping
refactor/NEW-780-extract-decision-modal
chore/NEW-779-configure-eslint
```

---

## Pull Requests

### Título

- Máximo 70 caracteres, em inglês
- Começar com type: `feat: ...`, `fix: ...`, `refactor: ...`

### Descrição

- Bullet points diretos — sem checkboxes
- Seções: Summary, Ticket, Changes, Screenshots (se visual)

### Exemplo

```markdown
## Summary
Set up ESLint, Prettier, Husky and Commitlint for the project.

## Ticket
[NEW-779](https://linear.app/arvosaude/issue/NEW-779)

## Changes
- Configured ESLint flat config with type-checked rules
- Added Prettier with printWidth 100
- Set up Husky pre-commit hook with lint-staged
- Added Commitlint with conventional commits validation
- Created logger utility to replace console.log
- Added EditorConfig for cross-editor consistency

## Screenshots
N/A — configuration only, no visual changes.
```
