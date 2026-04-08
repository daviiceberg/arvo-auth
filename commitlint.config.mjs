export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'style', 'chore', 'docs', 'test', 'ci', 'perf'],
    ],
    // Scope: recommended but not required (warning level)
    'scope-enum': [
      1,
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
    'scope-empty': [1, 'never'],
    // Max 72 chars in header
    'header-max-length': [2, 'always', 72],
    // Description in lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // No period at end
    'subject-full-stop': [2, 'never', '.'],
  },
};
